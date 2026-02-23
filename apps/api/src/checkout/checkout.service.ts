import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { BorrowValues } from '@repo/schemas';
import { AuthUser } from '@repo/types';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

type BorrowBagWithItems = Prisma.BorrowBagGetPayload<{
  include: {
    labItems: true;
    equipmentItems: true;
  };
}>;

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async checkout(data: BorrowValues, currentUser: AuthUser) {
    let requestId: string | null = null;
    await this.prisma.$transaction(async (tx) => {
      const userBag = await tx.borrowBag.findFirst({
        where: { userId: currentUser.userId },
        include: {
          labItems: true,
          equipmentItems: true,
        },
      });

      if (
        !userBag ||
        (userBag.labItems.length === 0 && userBag.equipmentItems.length === 0)
      ) {
        throw new BadRequestException('ไม่พบของในกระเป๋า');
      }

      const request = await this.createBorrowRequest(
        tx,
        data,
        userBag,
        currentUser.userId,
      );
      requestId = request.id;

      await this.deleteEquipmentItems(userBag.id, tx);
      await this.deleteLabItems(userBag.id, tx);
    });
    if (requestId) {
      this.mail.sendBorrowRequest(requestId).catch((err) => {
        console.error('Failed to send email:', err);
      });
    }
    return { success: true, requestId };
  }

  async createBorrowRequest(
    tx: Prisma.TransactionClient,
    data: BorrowValues,
    userBag: BorrowBagWithItems,
    userId: string,
  ) {
    const userInfo = data.step1;
    const equipment = data.equipment;
    const lab = data.lab;

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 2);

    const hasSelectedEquipment = userBag.equipmentItems.some(
      (item) => item.itemCount > 0,
    );

    return await tx.borrowRequest.create({
      data: {
        userId: userId,
        fullName: userInfo.fullName,
        email: userInfo.email,
        studentId: userInfo.studentId,
        phone: userInfo.studentId,
        educationLevel: userInfo.educationLevel,
        idCardImage: userInfo.idCardImageKey,
        ...(userBag.equipmentItems.length > 0 &&
          hasSelectedEquipment &&
          equipment && {
            equipmentDetail: {
              create: {
                subjectId: equipment?.subjectId,
                teacherId: equipment?.teacherId,
                purpose: equipment?.purpose,
                additionalItems: equipment?.additionalItems,
                borrowDate: new Date(equipment?.borrowRange.from),
                returnDate: new Date(equipment.borrowRange.to),
                equipmentRequestItems: {
                  createMany: {
                    data: userBag.equipmentItems
                      .filter(
                        (item) =>
                          item.isSelected === true && item.itemCount > 0,
                      )
                      .map((item) => ({
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
                    data: userBag.labItems
                      .filter((lab) => lab.isSelected)
                      .map((item) => ({
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

  async findRequest(userId: string) {
    return await this.prisma.borrowRequest.findMany({
      where: { userId },
    });
  }
}
