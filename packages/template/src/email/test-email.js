"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const render_1 = require("@react-email/render");
const BorrowRequest_1 = require("./BorrowRequest");
const fs = __importStar(require("fs"));
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
    const html = await (0, render_1.render)((0, jsx_runtime_1.jsx)(BorrowRequest_1.BorrowRequestEmail, { fullName: "\u0E2A\u0E21\u0E0A\u0E32\u0E22 \u0E43\u0E08\u0E14\u0E35", studentId: "6501234567", email: "somchai@example.com", phone: "0812345678", educationLevel: "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35", equipmentCount: 5, labCount: 2 }));
    fs.writeFileSync("./preview.html", html);
}
preview();
