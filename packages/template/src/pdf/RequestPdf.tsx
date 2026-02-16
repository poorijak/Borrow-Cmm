import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import { borrowRequest } from "@repo/types";

// ใช้ path.join และ __dirname เพื่อให้หาไฟล์เจอไม่ว่าจะรันจากโฟลเดอร์ไหน
const getFontPath = (name: string) => path.join(__dirname, "..", "font", name);

Font.register({
  family: "LINESeed",
  fonts: [
    {
      src: getFontPath("LINESeedSansTH_A_Rg.ttf"),
      fontWeight: "normal",
    },
    {
      src: getFontPath("LINESeedSansTH_A_Bd.ttf"),
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "LINESeed",
    padding: 50,
    fontSize: 12,
    color: "#334155",
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
    color: "#1e293b",
    textDecoration: "underline",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
  },
  infoSection: {
    marginBottom: 20,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  label: {
    fontWeight: "bold",
    width: 110,
    color: "#64748b",
  },
  value: {
    flex: 1,
    color: "#1e293b",
  },
  table: {
    marginTop: 15,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    fontWeight: "bold",
    borderBottom: "1px solid #e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #f1f5f9",
    minHeight: 30,
    alignItems: "center",
  },
  tableCell: {
    padding: 10,
    flex: 1,
    fontSize: 13,
  },
  footer: {
    marginTop: 40,
    textAlign: "right",
    fontSize: 12,
    color: "#94a3b8",
  },
});

export const LabPdf = ({ data }: { data: borrowRequest }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>แบบฟอร์มคำขอเข้าใช้ห้องปฏิบัติการ</Text>

      <Text style={styles.sectionTitle}>ข้อมูลผู้ใช้บริการ</Text>
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Text style={styles.label}>ชื่อ-นามสกุล:</Text>
          <Text style={styles.value}>{data.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>รหัสนักศึกษา:</Text>
          <Text style={styles.value}>{data.studentId}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>รายละเอียดการจอง</Text>
      <View style={{ marginBottom: 15 }}>
        <View style={styles.row}>
          <Text style={styles.label}>รหัสวิชา:</Text>
          <Text style={styles.value}>{data.labBookingDetails?.subjectId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วัตถุประสงค์:</Text>
          <Text style={styles.value}>
            {data.labBookingDetails?.usageDetails}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>สมาชิกกลุ่ม:</Text>
          <Text style={styles.value}>
            {data.labBookingDetails?.memberNames}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>ห้องปฏิบัติการ</Text>
          <Text style={[styles.tableCell, { textAlign: "center" }]}>
            วันที่จอง
          </Text>
          <Text style={[styles.tableCell, { textAlign: "center" }]}>
            ช่วงเวลา
          </Text>
        </View>
        {data.labBookingDetails?.labBookings.map((booking: any, i: number) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.tableCell}>{booking.laboratory.name}</Text>
            <Text style={[styles.tableCell, { textAlign: "center" }]}>
              {new Date(booking.bookingDate).toLocaleDateString("th-TH")}
            </Text>
            <Text style={[styles.tableCell, { textAlign: "center" }]}>
              {booking.slot === "morning" ? "09:00 - 12:00" : "13:00 - 16:00"}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        พิมพ์เมื่อ: {new Date().toLocaleString("th-TH")}
      </Text>
    </Page>
  </Document>
);

export const EquipmentRequestPdf = ({ data }: { data: borrowRequest }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>ใบคำขอยืมอุปกรณ์ (Equipment Request)</Text>

      <Text style={styles.sectionTitle}>ข้อมูลผู้ขอยืม</Text>
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Text style={styles.label}>ชื่อ-นามสกุล:</Text>
          <Text style={[styles.value, { fontWeight: "bold" }]}>
            {data.fullName}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>รหัสนักศึกษา:</Text>
          <Text style={styles.value}>{data.studentId}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>รายละเอียดคำขอ</Text>
      <View style={{ marginBottom: 15 }}>
        <View style={styles.row}>
          <Text style={styles.label}>วิชา:</Text>
          <Text style={styles.value}>{data.equipmentDetail?.subjectId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>วัตถุประสงค์:</Text>
          <Text style={styles.value}>{data.equipmentDetail?.purpose}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 2 }]}>รายการอุปกรณ์</Text>
          <Text style={[styles.tableCell, { textAlign: "center" }]}>จำนวน</Text>
        </View>
        {data.equipmentDetail?.equipmentRequestItems.map(
          (item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {item.equipment.title}
              </Text>
              <Text style={[styles.tableCell, { textAlign: "center" }]}>
                {item.quantity}
              </Text>
            </View>
          ),
        )}
      </View>

      <Text style={styles.footer}>
        พิมพ์เมื่อ: {new Date().toLocaleString("th-TH")}
      </Text>
    </Page>
  </Document>
);
