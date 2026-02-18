import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Resend } from 'resend';
import {
  generateBorrowEmailHtml,
  generateEquipmentPdfBuffer,
  generateLabPdfBuffer,
} from '@repo/template';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {
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

    const { equipmentDetail, labBookingDetails } = request;
    const teacherEmails = new Map<
      string,
      { type: 'equipment' | 'lab' | 'both'; attachments: any[] }
    >();

    if (equipmentDetail?.teacherId) {
      const teacher = await this.prisma.user.findUnique({
        where: { id: equipmentDetail.teacherId },
      });

      if (teacher?.email) {
        const buffer = await generateEquipmentPdfBuffer(request);
        teacherEmails.set(teacher.email, {
          type: 'equipment',
          attachments: [{ filename: 'Equipment_Request.pdf', content: buffer }],
        });
      }
    }

    if (labBookingDetails?.teacherId) {
      const teacher = await this.prisma.user.findUnique({
        where: { id: labBookingDetails.teacherId },
      });

      if (teacher?.email) {
        const buffer = await generateLabPdfBuffer(request);

        if (teacherEmails.has(teacher.email)) {
          const existing = teacherEmails.get(teacher.email);
          existing?.attachments.push({
            filename: 'Lab_Request.pdf',
            content: buffer,
          });
        } else {
          teacherEmails.set(teacher.email, {
            type: 'lab',
            attachments: [{ filename: 'Lab_Request.pdf', content: buffer }],
          });
        }
      }
    }

    console.log('email is active now!');

    for (const [email, data] of teacherEmails.entries()) {
      try {
        const token = await this.generateApprovalToken(request.id, email);
        const approvalLink = `${process.env.FRONTEND_URL}/approve/${token}`;

        console.log(token);

        const emailHtml = (await generateBorrowEmailHtml({
          approvalLink,
          fullName: request.fullName,
          studentId: request.studentId,
          email: request.email,
          phone: request.phone,
          educationLevel: request.educationLevel,
          equipmentCount:
            data.type === 'lab'
              ? 0
              : (equipmentDetail?.equipmentRequestItems.length ?? 0),
          labCount:
            data.type === 'equipment'
              ? 0
              : (labBookingDetails?.labBookings.length ?? 0),
        })) as unknown as string;

        const response = await this.resend.emails.send({
          from: this.from,
          to: email,
          subject: 'มีคำขอใหม่รอการอนุมัติ - Review Required',
          html: emailHtml,
          attachments: data.attachments,
        });

        console.log('Resend Response:', response);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }
  }

  async generateApprovalToken(requestId: string, teacherEmail: string) {
    return this.jwt.signAsync(
      { requestId, teacherEmail },
      { secret: process.env.JWT_APPROVAL_SECRET, expiresIn: '1d' },
    );
  }
}
