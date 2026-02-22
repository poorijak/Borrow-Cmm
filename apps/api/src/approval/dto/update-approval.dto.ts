// approval.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApprovalAction {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum RequestType {
  EQUIPMENT = 'equipment',
  LABORATORY = 'laboratory',
}

export class UpdateApprovalDto {
  @IsEnum(ApprovalAction, {
    message: 'สถานะต้องเป็น approved หรือ rejected เท่านั้น',
  })
  status: ApprovalAction;

  @IsEnum(RequestType, {
    message: 'ประเภทต้องเป็น equipment หรือ laboratory เท่านั้น',
  })
  type: RequestType;

  @IsOptional() // ไม่บังคับส่งมา (กรณี approved)
  @IsString({ message: 'หมายเหตุต้องเป็นข้อความ' })
  remark?: string; // เก็บเหตุผลการปฏิเสธ
}
