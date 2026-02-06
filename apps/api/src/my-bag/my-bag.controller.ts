import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
