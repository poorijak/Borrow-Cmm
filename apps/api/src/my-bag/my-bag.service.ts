import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddToBagDto } from './dto/create-my-bag.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Prisma, TimeSlot } from '@prisma/client';
import { formatDateToYYYYMMDD } from 'src/common/libs/formater/format.date';
import { LaboratoryService } from 'src/laboratory/laboratory.service';

type BagItemType = 'equipment' | 'lab';

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

      const existingLab = await this.prisma.borrowBag.findUnique({
        where: { id: myBag?.id },
        select: {
          labItems: { where: { labId } },
        },
      });

      if (existingLab?.labItems.length) {
        throw new BadRequestException('มีห้องนี้อยู่ในกระเป๋าแล้ว');
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
        equipmentId,
        bagId: bagId,
      },
      include: { equipment: true },
    });

    console.log(currentItem?.equipment.title);
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
      where: { id: equipmentItemId },
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
      await this.deleteBagItem(equipmentItemId, 'equipment');
    } else {
      await this.prisma.bagEquipmentItem.update({
        where: { id: existingItem.id },
        data: {
          itemCount: {
            [action === 'inc' ? 'increment' : 'decrement']: 1,
          },
        },
      });
    }

    const updatedBag = await this.syncBagTotals(existingItem.bagId);

    return { status: 'success', bag: updatedBag };
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

  async selectedBagItem(itemId: string, type: BagItemType) {
    if (type === 'equipment') {
      const item = await this.prisma.bagEquipmentItem.findUnique({
        where: { id: itemId },
        select: { id: true, isSelected: true },
      });

      if (!item) {
        throw new NotFoundException('ไม่พบรายการนี้ในกระเป๋า');
      }

      return this.prisma.bagEquipmentItem.update({
        where: { id: item.id },
        data: { isSelected: !item.isSelected },
      });
    }

    if (type === 'lab') {
      const item = await this.prisma.bagLabItem.findUnique({
        where: { id: itemId },
        select: { id: true, isSelected: true },
      });

      if (!item) {
        throw new NotFoundException('ไม่พบรายการนี้ในกระเป๋า');
      }

      return this.prisma.bagLabItem.update({
        where: { id: item.id },
        data: { isSelected: !item.isSelected },
      });
    }

    throw new BadRequestException('ประเภทไม่ถูกต้อง');
  }

  async selectAllBagItem(bagId: string, type: BagItemType) {
    const borrowBag = await this.prisma.borrowBag.findUnique({
      where: { id: bagId },
      include: { labItems: true, equipmentItems: true },
    });

    if (!borrowBag) {
      throw new NotFoundException('ไม่พบกระเป๋านี้');
    }

    if (type === 'equipment') {
      const items = await this.prisma.bagEquipmentItem.findMany({
        where: { bagId },
        select: { id: true, isSelected: true },
      });

      const allSelected = items.every((item) => item.isSelected);

      await this.prisma.bagEquipmentItem.updateMany({
        where: { bagId: borrowBag.id },
        data: {
          isSelected: !allSelected,
        },
      });

      return { message: 'equipment update success' };
    }
    if (type === 'lab') {
      const items = await this.prisma.bagLabItem.findMany({
        where: { bagId },
        select: { id: true, isSelected: true },
      });

      const allSelected = items.every((item) => item.isSelected);

      await this.prisma.bagLabItem.updateMany({
        where: { bagId: borrowBag.id },
        data: {
          isSelected: !allSelected,
        },
      });

      return { message: 'lab update success' };
    }
  }
}
