import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { GetRequestsQueryDto } from './dto/requestDto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/guards/getUser';
import type { User } from '@repo/types';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('admin')
  findAll(@Query() query: GetRequestsQueryDto) {
    return this.requestService.getPaginatedRequests(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyRequests(@GetUser() user: User, @Query() query: GetRequestsQueryDto) {
    return this.requestService.getMyPaginatedRequests(user.id, query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.requestService.getRequestById(id);
  }
}
