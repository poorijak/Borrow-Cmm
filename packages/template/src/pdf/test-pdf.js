"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const RequestPdf_1 = require("./RequestPdf"); // Path ไปที่ไฟล์ Template ของคุณ
const path_1 = __importDefault(require("path"));
// 1. จำลองข้อมูลจาก Database (Mock Data)
const mockData = {
    fullName: "สมชาย ใจดี",
    studentId: "6501234567",
    educationLevel: "ปริญญาตรี",
    equipmentDetail: {
        subjectId: "CMM-101",
        purpose: "ใช้ทำโปรเจกต์วิชา Multimedia System",
        equipmentRequestItems: [
            { equipment: { title: "Sony A7IV" }, quantity: 1 },
            { equipment: { title: "Lens 24-70mm" }, quantity: 1 },
        ],
    },
    labBookingDetails: {
        subjectId: "CMM-102",
        usageDetails: "ทดสอบระบบ Network ในห้องปฏิบัติการ",
        memberNames: "สมชาย, สมหญิง, สมมติ",
        labBookings: [
            {
                laboratory: { name: "ห้องปฏิบัติการคอมพิวเตอร์ 1" },
                bookingDate: new Date(),
                slot: "morning",
            },
        ],
    },
};
async function runTest() {
    try {
        // 2. สั่ง Render เป็นไฟล์ PDF แยกกัน 2 ฉบับ
        await (0, renderer_1.renderToFile)((0, jsx_runtime_1.jsx)(RequestPdf_1.EquipmentRequestPdf, { data: mockData }), path_1.default.join(__dirname, "test-equipment.pdf"));
        await (0, renderer_1.renderToFile)((0, jsx_runtime_1.jsx)(RequestPdf_1.LabPdf, { data: mockData }), path_1.default.join(__dirname, "test-lab.pdf"));
        console.log("✅ PDF Generated successfully!");
        console.log("📂 Check files at: src/pdf/test-equipment.pdf and src/pdf/test-lab.pdf");
    }
    catch (error) {
        console.error("❌ Error generating PDF:", error);
    }
}
runTest();
