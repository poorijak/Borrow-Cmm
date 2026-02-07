import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MyBagService } from './my-bag.service';
import { AddToBagDto } from './dto/create-my-bag.dto';

@Controller('bag')
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
}
