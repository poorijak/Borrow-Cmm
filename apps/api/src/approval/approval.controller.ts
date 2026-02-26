import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/guards/getUser';
import type { AuthUser } from '@repo/types';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get(':token')
  @UseGuards(JwtAuthGuard)
  findAll(@Param('token') token: string, @GetUser() user: AuthUser) {
    return this.approvalService.findRequest(token, user);
  }

  @Patch(':token/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('token') token: string,
    @Body() body: UpdateApprovalDto,
    @GetUser() user: AuthUser,
  ) {
    return this.approvalService.updateSubRequestStatus(token, user, body);
  }
}
