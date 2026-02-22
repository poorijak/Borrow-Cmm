"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentRequestPdf = exports.LabPdf = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const path_1 = __importDefault(require("path"));
// ใช้ path.join และ __dirname เพื่อให้หาไฟล์เจอไม่ว่าจะรันจากโฟลเดอร์ไหน
const getFontPath = (name) => path_1.default.join(__dirname, "..", "font", name);
renderer_1.Font.register({
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
const styles = renderer_1.StyleSheet.create({
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
const LabPdf = ({ data }) => ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.header, children: "\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E04\u0E33\u0E02\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.infoSection, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.fullName })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.studentId })] })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { marginBottom: 15 }, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E23\u0E2B\u0E31\u0E2A\u0E27\u0E34\u0E0A\u0E32:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.labBookingDetails.subjectId })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.labBookingDetails.usageDetails })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E01\u0E25\u0E38\u0E48\u0E21:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.labBookingDetails.memberNames })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.table, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.tableHeader, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableCell, children: "\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E08\u0E2D\u0E07" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32" })] }), data.labBookingDetails.labBookings.map((booking, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.tableRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.tableCell, children: booking.laboratory.name }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: new Date(booking.bookingDate).toLocaleDateString("th-TH") }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: booking.slot === "morning" ? "09:00 - 12:00" : "13:00 - 16:00" })] }, i)))] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.footer, children: ["\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D: ", new Date().toLocaleString("th-TH")] })] }) }));
exports.LabPdf = LabPdf;
const EquipmentRequestPdf = ({ data }) => ((0, jsx_runtime_1.jsx)(renderer_1.Document, { children: (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.header, children: "\u0E43\u0E1A\u0E04\u0E33\u0E02\u0E2D\u0E22\u0E37\u0E21\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C (Equipment Request)" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E02\u0E2D\u0E22\u0E37\u0E21" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.infoSection, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.value, { fontWeight: "bold" }], children: data.fullName })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.studentId })] })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionTitle, children: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E04\u0E33\u0E02\u0E2D" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { marginBottom: 15 }, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E27\u0E34\u0E0A\u0E32:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.equipmentDetail.subjectId })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.row, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.label, children: "\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C:" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.value, children: data.equipmentDetail.purpose })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.table, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.tableHeader, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { flex: 2 }], children: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: "\u0E08\u0E33\u0E19\u0E27\u0E19" })] }), data.equipmentDetail.equipmentRequestItems.map((item, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.tableRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { flex: 2 }], children: item.equipment.title }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: [styles.tableCell, { textAlign: "center" }], children: item.quantity })] }, i)))] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.footer, children: ["\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E21\u0E37\u0E48\u0E2D: ", new Date().toLocaleString("th-TH")] })] }) }));
exports.EquipmentRequestPdf = EquipmentRequestPdf;
