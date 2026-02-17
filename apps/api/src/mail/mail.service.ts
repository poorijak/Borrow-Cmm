import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Resend } from 'resend';
import {
  generateBorrowEmailHtml,
  generateEquipmentPdfBuffer,
  generateLabPdfBuffer,
} from '@repo/template';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM ?? 'noreply@example.com'; //
  }

  async sendBorrowRequest(requestId: string) {
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id: requestId },
      include: {
        equipmentDetail: {
          include: {
            equipmentRequestItems: {
              include: {
                equipment: {
                  select: {
                    id: true,
                    title: true,
                    mainImage: true,
                    description: true,
                    totalStock: true,
                    borrowedQty: true,
                    reservedQty: true,
                    status: true,
                    subCategoryId: true,
                  },
                },
              },
            },
          },
        },
        labBookingDetails: {
          include: { labBookings: { include: { laboratory: true } } },
        },
      },
    });

    if (!request) return;

    const {
      fullName,
      studentId,
      educationLevel,
      email,
      phone,
      equipmentDetail,
      labBookingDetails,
    } = request;

    const emailHtml = await generateBorrowEmailHtml({
      fullName: fullName,
      studentId: studentId,
      email: email,
      phone: phone,
      educationLevel: educationLevel,
      equipmentCount: equipmentDetail?.equipmentRequestItems.length ?? 0,
      labCount: labBookingDetails?.labBookings.length ?? 0,
    });

    const attachments: { filename: string; content: Buffer }[] = [];

    if (request.equipmentDetail) {
      const buffer = await generateEquipmentPdfBuffer(request);
      attachments.push({
        filename: 'Equipment_Request.pdf',
        content: buffer,
      });
    }

    if (request.labBookingDetails) {
      const buffer = await generateLabPdfBuffer(request);
      attachments.push({
        filename: 'Lab_Request.pdf',
        content: buffer,
      });
    }
    await this.resend.emails.send({
      from: this.from,
      to: 'poorijak35@gmail.com',
      subject: 'ยืนยันการจอง',
      html: emailHtml,
      attachments: attachments,
    });
  }
}
