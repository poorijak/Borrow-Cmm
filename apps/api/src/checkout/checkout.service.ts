import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BagEquipmentItem,
  BagLabItem,
  BorrowBag,
  Prisma,
} from '@prisma/client';
import type { BorrowValues } from '@repo/schemas';
import { PrismaService } from 'prisma/prisma.service';

type BorrowBagWithItems = Prisma.BorrowBagGetPayload<{
  include: {
    labItems: true;
    equipmentItems: true;
  };
}>;

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(data: BorrowValues) {
    await this.prisma.$transaction(async (tx) => {
      const userBag = await tx.borrowBag.findFirst({
        where: { userId: data.step1.userId },
        include: {
          labItems: true,
          equipmentItems: true,
        },
      });

      if (
        !userBag ||
        (userBag.labItems.length === 0 && userBag.equipmentItems.length)
      ) {
        throw new BadRequestException('ไม่พบของในกระเป๋า');
      }

      await this.createBorrowRequest(tx, data, userBag);

      await this.deleteEquipmentItems(userBag.id, tx);
      await this.deleteLabItems(userBag.id, tx);
    });
  }

  async createBorrowRequest(
    tx: Prisma.TransactionClient,
    data: BorrowValues,
    userBag: BorrowBagWithItems,
  ) {
    const userInfo = data.step1;
    const equipment = data.equipment;
    const lab = data.lab;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 2);

    return await tx.borrowRequest.create({
      data: {
        userId: userInfo.userId,
        fullName: userInfo.fullName,
        email: userInfo.email,
        studentId: userInfo.studentId,
        phone: userInfo.studentId,
        educationLevel: userInfo.educationLevel,
        idCardImage: userInfo.idCardImageKey,
        ...(userBag.equipmentItems.length > 0 &&
          equipment && {
            equipmentDetail: {
              create: {
                subjectId: equipment?.subjectId,
                teacherId: equipment?.teacherId,
                purpose: equipment?.teacherId,
                additionalItems: equipment?.additionalItems,
                borrowDate: new Date(equipment?.borrowRange.from),
                returnDate: new Date(equipment.borrowRange.to),
                equipmentRequestItems: {
                  createMany: {
                    data: userBag.equipmentItems.map((item) => ({
                      equipmentId: item.equipmentId,
                      quantity: item.itemCount,
                    })),
                  },
                },
              },
            },
          }),

        ...(userBag.labItems.length > 0 &&
          lab && {
            labBookingDetails: {
              create: {
                subjectId: lab.subjectId,
                teacherId: lab.teacherId,
                usageDetails: lab.usageDetails,
                memberNames: lab.memberNames,
                labBookings: {
                  createMany: {
                    data: userBag.labItems.map((item) => ({
                      laboratoryId: item.labId,
                      bookingDate: item.date,
                      slot: item.slot,
                      expiresAt: expiresDate,
                    })),
                  },
                },
              },
            },
          }),
      },
    });
  }

  async deleteEquipmentItems(bagId: string, tx: Prisma.TransactionClient) {
    return await tx.bagEquipmentItem.deleteMany({
      where: { bagId },
    });
  }
  async deleteLabItems(bagId: string, tx: Prisma.TransactionClient) {
    return await tx.bagLabItem.deleteMany({
      where: { bagId },
    });
  }
}
