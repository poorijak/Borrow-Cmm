import { Injectable } from '@nestjs/common';
import { renderToBuffer } from '@react-pdf/renderer';
import { PrismaService } from 'prisma/prisma.service';
import { Resend } from 'resend';
import { EquipmentRequestPdf, LabPdf } from '@repo/template';

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
                equipment: true,
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

    const attachments = [];

    if (request.equipmentDetail) {
      const element = React.createElement(EquipmentRequestPdf, {
        data: request,
      });

      const buffer = await renderToBuffer(element);
    }
  }
}
