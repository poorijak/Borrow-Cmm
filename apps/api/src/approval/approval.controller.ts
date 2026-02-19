import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get(':token')
  findAll(@Param('token') token: string) {
    return this.approvalService.findRequest(token);
  }

  @Patch(':token/status')
  async updateStatus(
    @Param('token') token: string,
    @Body() body: UpdateApprovalDto,
  ) {
    return this.approvalService.updateSubRequestStatus(token, body);
  }
}
