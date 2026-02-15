import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Hr,
  Row,
  Column,
} from "@react-email/components";

type BorrowRequestEmailProps = {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  educationLevel: string;
  equipmentCount: number;
  labCount: number;
};

export const BorrowRequestEmail = ({
  fullName,
  studentId,
  email,
  phone,
  educationLevel,
  equipmentCount,
  labCount,
}: BorrowRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Text style={badge}>การแจ้งเตือนระบบคำขอ</Text>
            <Text style={h1}>เรียน อาจารย์ผู้สอน/ผู้เกี่ยวข้อง</Text>

            <Text style={p}>
              มีคำร้องขอใช้งานใหม่จากนักศึกษาผ่านระบบออนไลน์
              โดยมีรายละเอียดส่วนบุคคลและสรุปจำนวนรายการดังนี้:
            </Text>

            <Hr style={hr} />

            {/* ส่วนข้อมูลนักศึกษา - ดึงจาก BorrowRequest โดยตรง */}
            <Section>
              <Text style={label}>ข้อมูลนักศึกษา</Text>
              <Text style={infoText}>
                <b>ชื่อ-นามสกุล:</b> {fullName} <br />
                <b>รหัสนักศึกษา:</b> {studentId} ({educationLevel}) <br />
                <b>ชั้นปี :</b> {educationLevel}
                <br />
                <b>เบอร์โทรศัพท์:</b> {phone} <br />
                <b>อีเมล:</b> {email}
              </Text>
            </Section>

            {/* ส่วนสรุปจำนวนรายการ (Summary Count) */}
            <Section style={{ ...contentBox, marginTop: "20px" }}>
              <Text style={label}>สรุปรายการคำขอ</Text>
              <Hr style={hrSummary} />
              <Row style={{ marginTop: "12px" }}>
                <Column align="center">
                  <Text style={countValue}>{equipmentCount}</Text>
                  <Text style={countLabel}>รายการอุปกรณ์</Text>
                </Column>
                <Column align="center">
                  <Text style={countValue}>{labCount}</Text>
                  <Text style={countLabel}>รายการจองห้องแล็บ</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={footer}>
                * รายละเอียดอุปกรณ์ที่ยืม, ห้องแล็บที่จอง, วัตถุประสงค์
                และวันเวลาทั้งหมด <br />
                <span style={{ fontWeight: 700, color: "#475569" }}>
                  ถูกระบุไว้ในเอกสาร PDF ที่แนบมาพร้อมกับอีเมลฉบับนี้
                </span>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- Styles ---
const main = {
  backgroundColor: "#f8fafc",
  fontFamily: 'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 16px",
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const badge = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#6366f1",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const h1 = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 16px",
};

const p = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#475569",
  margin: "0",
};

const label = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#64748b",
  textTransform: "uppercase" as const,
  marginBottom: "8px",
};

const infoText = {
  fontSize: "15px",
  color: "#1e293b",
  lineHeight: "1.6",
  margin: "0",
};

const contentBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "10px 20px",
  border: "1px solid #f1f5f9",
};

const countValue = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#6366f1",
  margin: "0",
};

const countLabel = {
  fontSize: "11px",
  color: "#64748b",
  margin: "0",
  textTransform: "uppercase" as const,
};

const hr = {
  borderColor: "#f1f5f9",
  margin: "32px 0",
};
const hrSummary = {
  borderColor: "#f1f5f9",
  margin: "10px 0",
};

const footer = {
  fontSize: "13px",
  color: "#94a3b8",
  textAlign: "center" as const,
  lineHeight: "1.6",
};
