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
      { hasEquipment: boolean; hasLab: boolean; attachments: any[] }
    >();

    if (equipmentDetail?.teacherId) {
      const teacher = await this.prisma.user.findUnique({
        where: { id: equipmentDetail.teacherId },
      });

      if (teacher?.email) {
        const buffer = await generateEquipmentPdfBuffer(request);
        teacherEmails.set(teacher.email, {
          hasEquipment: true,
          hasLab: false,
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
          if (existing) {
            existing.hasLab = true;
            existing.attachments.push({
              filename: 'Lab_Request.pdf',
              content: buffer,
            });
          }
        } else {
          teacherEmails.set(teacher.email, {
            hasEquipment: false,
            hasLab: true,
            attachments: [{ filename: 'Lab_Request.pdf', content: buffer }],
          });
        }
      }
    }

    for (const [email, data] of teacherEmails.entries()) {
      try {
        const teacher = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!teacher) continue;

        const token = await this.generateApprovalToken({
          requestId: request.id,
          teacherId: teacher.id,
          equipmentDetailId:
            equipmentDetail?.teacherId === teacher.id
              ? equipmentDetail.id
              : undefined,
          labDetailId:
            labBookingDetails?.teacherId === teacher.id
              ? labBookingDetails.id
              : undefined,
        });
        const approvalLink = `${process.env.FRONTEND_URL}/approve/${token}`;

        console.log(data.hasEquipment, data.hasLab);

        const emailHtml = (await generateBorrowEmailHtml({
          approvalLink,
          fullName: request.fullName,
          studentId: request.studentId,
          email: request.email,
          phone: request.phone,
          educationLevel: request.educationLevel,
          equipmentCount: data.hasEquipment
            ? (equipmentDetail?.equipmentRequestItems.length ?? 0)
            : 0,
          labCount: data.hasLab
            ? (labBookingDetails?.labBookings.length ?? 0)
            : 0,
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

  async generateApprovalToken(data: {
    requestId: string;
    teacherId: string;
    equipmentDetailId?: string;
    labDetailId?: string;
  }) {
    return this.jwt.signAsync(data, {
      secret: process.env.JWT_APPROVAL_SECRET,
      expiresIn: '1d',
    });
  }
}
