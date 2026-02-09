import { BadRequestException, Injectable } from '@nestjs/common';
import { AddToBagDto } from './dto/create-my-bag.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma, TimeSlot } from '@prisma/client';
import { formatDateToYYYYMMDD } from 'src/common/libs/formater/format.date';
import { LaboratoryService } from 'src/laboratory/laboratory.service';

@Injectable()
export class MyBagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly labService: LaboratoryService,
  ) {}

  async getMyBag(userId: string) {
    const bag = await this.prisma.borrowBag.findFirst({
      where: { userId },
      include: {
        equipmentItems: { include: { equipment: true } },
        labItems: { include: { laboratory: true } },
      },
    });

    if (!bag) {
      return await this.prisma.borrowBag.create({
        data: { userId },
        include: {
          equipmentItems: { include: { equipment: true } },
          labItems: { include: { laboratory: true } },
        },
      });
    }

    return await this.syncBagTotals(bag.id);
  }

  async addtoBag(data: AddToBagDto) {
    const { userId, labId, equipmentId, date, slot } = data;
    const user = await this.userService.findOne({ id: userId });

    if (!user) {
      throw new BadRequestException('ไม่พบผู้ใช้');
    }
    const myBag = await this.getMyBag(user.id);

    if (equipmentId) {
      await this.upsertEquipmentItem(myBag!.id, equipmentId);
    }

    if (labId) {
      if (!slot || !date) {
        throw new BadRequestException(
          'กรุณาระบุวันที่และช่วงเวลาสำหรับจองห้องแล็บ',
        );
      }
      try {
        const conflic = await this.labService.checkBusyLab(labId, date, slot);

        if (conflic) {
          throw new BadRequestException('ห้องปฏิบัติการนี้ถูกจองไปแล้ว');
        }

        const utcDate = new Date(date);
        utcDate.setUTCHours(0, 0, 0, 0);

        await this.upsertLabItem(myBag!.id, labId, utcDate, slot);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new BadRequestException('ห้องปฏิบัติการนี้ถูกจองไปแล้ว');
        }

        throw error;
      }
    }

    return this.getMyBag(userId);
  }

  async syncBagTotals(bagId: string) {
    const bag = await this.prisma.borrowBag.findUnique({
      where: { id: bagId },
      include: {
        equipmentItems: true,
        labItems: true,
      },
    });

    if (!bag) return;

    const totalQtySum = bag.equipmentItems.reduce(
      (sum, item) => sum + item.itemCount,
      0,
    );

    const totalItemCount = bag.labItems.length + bag.equipmentItems.length;

    const updateBag = await this.prisma.borrowBag.update({
      where: { id: bagId },
      data: {
        totalQty: totalQtySum,
        itemCount: totalItemCount,
      },
      include: {
        equipmentItems: {
          select: {
            id: true,
            itemCount: true,
            bagId: true,
            equipmentId: true,
            isSelected: true,
            equipment: {
              select: {
                id: true,
                mainImage: true,
                title: true,
                totalStock: true,
                subCategoryId: true,
              },
            },
          },
        },
        labItems: {
          select: {
            id: true,
            bagId: true,
            labId: true,
            date: true,
            slot: true,
            isSelected: true,
            laboratory: {
              select: {
                id: true,
                name: true,
                labCode: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const formattedLabItems = await Promise.all(
      updateBag.labItems.map(async (item) => {
        const isBusy = await this.labService.checkBusyLab(
          item.labId,
          item.date,
          item.slot,
        );
        return {
          ...item,
          date: formatDateToYYYYMMDD(item.date),
          status: isBusy ? true : false,
        };
      }),
    );

    return {
      ...updateBag,
      equipmentCount: totalQtySum,
      labItems: formattedLabItems,
    };
  }

  async upsertEquipmentItem(bagId: string, equipmentId: string) {
    const totalEquipment = await this.prisma.equipment.findUnique({
      where: { id: equipmentId },
      select: { totalStock: true },
    });

    const currentItem = await this.prisma.bagEquipmentItem.findFirst({
      where: {
        bagId: bagId,
      },
      include: { equipment: true },
    });

    const currentCount = currentItem?.itemCount || 0;

    console.log(currentCount);

    if (currentCount + 1 > (totalEquipment?.totalStock || 0)) {
      throw new BadRequestException(
        `อุปกรณ์ในสต็อกไม่เพียงพอ (คงเหลือ ${totalEquipment?.totalStock})`,
      );
    }

    return await this.prisma.bagEquipmentItem.upsert({
      where: {
        bagId_equipmentId: {
          bagId,
          equipmentId,
        },
      },
      update: { itemCount: { increment: 1 } },
      create: {
        equipmentId,
        bagId,
        isSelected: false,
        itemCount: 1,
      },
    });
  }

  async upsertLabItem(
    bagId: string,
    labId: string,
    date: Date,
    slot: TimeSlot,
  ) {
    return await this.prisma.bagLabItem.upsert({
      where: {
        labId_bagId_date_slot: {
          bagId,
          labId,
          date,
          slot,
        },
      },
      update: {
        isSelected: false,
      },
      create: {
        labId,
        bagId,
        date,
        slot,
        isSelected: false,
      },
    });
  }

  async updateBagItem(equipmentItemId: string, action: 'inc' | 'dec') {
    const existingItem = await this.prisma.bagEquipmentItem.findUnique({
      where: {
        id: equipmentItemId,
      },
      include: { equipment: true },
    });

    if (!existingItem) {
      throw new Error('ไม่พบของในกระเป๋า');
    }

    if (action === 'inc') {
      const currentCount = existingItem.itemCount || 0;

      if (currentCount + 1 > (existingItem.equipment.totalStock || 0)) {
        throw new BadRequestException(
          `อุปกรณ์ในสต็อกไม่เพียงพอ (คงเหลือ ${existingItem.equipment?.totalStock})`,
        );
      }
    }

    if (action === 'dec' && existingItem.itemCount === 1) {
      return await this.deleteBagItem(equipmentItemId, 'equipment');
    }

    const newCountItem = await this.prisma.bagEquipmentItem.update({
      where: { id: existingItem.id },
      data: {
        itemCount: {
          [action === 'inc' ? 'increment' : 'decrement']: 1,
        },
      },
    });

    return { status: 'success', newCountItem };
  }

  async deleteBagItem(itemId: string, type: 'lab' | 'equipment') {
    if (type === 'lab') {
      return this.prisma.bagLabItem.delete({
        where: { id: itemId },
      });
    }

    return this.prisma.bagEquipmentItem.delete({
      where: { id: itemId },
    });
  }
}
