import { render } from "@react-email/render";
import { BorrowRequestEmail } from "./BorrowRequest";
import * as fs from "fs";

// จำลองข้อมูลที่ได้จากการ Query Prisma (ตาม JSON ที่คุณให้มา)
const mockRequest = {
  step1: {
    fullName: "สมชาย ใจดี",
    studentId: "6501234567",
    phone: "0812345678",
    email: "somchai@example.com",
  },
  equipment: {
    subjectId: "subject_001",
    purpose: "ใช้ทำโปรเจค",
    // ข้อมูลเหล่านี้ปกติจะมาจากการ include equipmentRequestItems
    items: [
      { name: "Arduino Uno R3", quantity: 1 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
      { name: "Solenoid Valve", quantity: 2 },
    ],
  },
  lab: {
    name: "ห้องปฏิบัติการคอมพิวเตอร์ 1", // จาก include laboratory
    date: "15/02/2026",
    slot: "morning",
  },
};

// test-email.tsx
async function preview() {
  const html = await render(
    <BorrowRequestEmail
      fullName="สมชาย ใจดี"
      studentId="6501234567"
      email="somchai@example.com"
      phone="0812345678"
      educationLevel="ปริญญาตรี"
      equipmentCount={5} // ตัวเลขสมมติ
      labCount={2} // ตัวเลขสมมติ
      approvalLink="fe"
    />,
  );

  fs.writeFileSync("./preview.html", html);
}

preview();
