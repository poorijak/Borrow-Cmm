import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MyBagService } from './my-bag.service';
import { AddToBagDto } from './dto/create-my-bag.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/admin/role.enum';

@Controller('bag')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN, Role.INSTRUCTOR, Role.MODERATOR, Role.STUDENT)
export class MyBagController {
  constructor(private readonly myBagService: MyBagService) {}

  @Post('addToBag')
  addToCart(@Body() body: AddToBagDto) {
    return this.myBagService.addtoBag(body);
  }

  @Get(':userId')
  findBag(@Param('userId') userId: string) {
    return this.myBagService.getMyBag(userId);
  }

  @Patch(':itemId/increment')
  updateIncrementCount(@Param('itemId') itemId: string) {
    return this.myBagService.updateBagItem(itemId, 'inc');
  }
  @Patch(':itemId/decrement')
  updateDecrementCount(@Param('itemId') itemId: string) {
    return this.myBagService.updateBagItem(itemId, 'dec');
  }

  @Delete('/equipment/:itemId')
  deleteEquipmentItem(@Param('itemId') itemId: string) {
    return this.myBagService.deleteBagItem(itemId, 'equipment');
  }
  @Delete('/lab/:itemId')
  deleteLabItem(@Param('itemId') itemId: string) {
    return this.myBagService.deleteBagItem(itemId, 'lab');
  }

  @Patch(':type/:itemId/select')
  seletedEquipmentItem(
    @Param('itemId') itemId: string,
    @Param('type') type: 'equipment' | 'lab',
  ) {
    return this.myBagService.selectedBagItem(itemId, type);
  }

  @Patch(':type/:bagId/select-all')
  selectAll(
    @Param('bagId') bagId: string,
    @Param('type') type: 'equipment' | 'lab',
  ) {
    return this.myBagService.selectAllBagItem(bagId, type);
  }

  @Patch(':type/:bagId/select-all')
  unselectAll(
    @Param('bagId') bagId: string,
    @Param('type') type: 'equipment' | 'lab',
  ) {
    return this.myBagService.selectAllBagItem(bagId, type);
  }
}
