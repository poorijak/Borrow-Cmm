"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowRequestEmail = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@react-email/components");
const BorrowRequestEmail = ({ fullName, studentId, email, phone, educationLevel, equipmentCount, labCount, }) => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Body, { style: main, children: (0, jsx_runtime_1.jsx)(components_1.Container, { style: container, children: (0, jsx_runtime_1.jsxs)(components_1.Section, { style: card, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: badge, children: "\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E04\u0E33\u0E02\u0E2D" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: h1, children: "\u0E40\u0E23\u0E35\u0E22\u0E19 \u0E2D\u0E32\u0E08\u0E32\u0E23\u0E22\u0E4C\u0E1C\u0E39\u0E49\u0E2A\u0E2D\u0E19/\u0E1C\u0E39\u0E49\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E02\u0E49\u0E2D\u0E07" }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: p, children: "\u0E21\u0E35\u0E04\u0E33\u0E23\u0E49\u0E2D\u0E07\u0E02\u0E2D\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E43\u0E2B\u0E21\u0E48\u0E08\u0E32\u0E01\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1C\u0E48\u0E32\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C \u0E42\u0E14\u0E22\u0E21\u0E35\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E48\u0E27\u0E19\u0E1A\u0E38\u0E04\u0E04\u0E25\u0E41\u0E25\u0E30\u0E2A\u0E23\u0E38\u0E1B\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E14\u0E31\u0E07\u0E19\u0E35\u0E49:" }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: hr }), (0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: label, children: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32" }), (0, jsx_runtime_1.jsxs)(components_1.Text, { style: infoText, children: [(0, jsx_runtime_1.jsx)("b", { children: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25:" }), " ", fullName, " ", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32:" }), " ", studentId, " (", educationLevel, ") ", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u0E0A\u0E31\u0E49\u0E19\u0E1B\u0E35 :" }), " ", educationLevel, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C:" }), " ", phone, " ", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u0E2D\u0E35\u0E40\u0E21\u0E25:" }), " ", email] })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { style: { ...contentBox, marginTop: "20px" }, children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: label, children: "\u0E2A\u0E23\u0E38\u0E1B\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E04\u0E33\u0E02\u0E2D" }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: hrSummary }), (0, jsx_runtime_1.jsxs)(components_1.Row, { style: { marginTop: "12px" }, children: [(0, jsx_runtime_1.jsxs)(components_1.Column, { align: "center", children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: countValue, children: equipmentCount }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: countLabel, children: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C" })] }), (0, jsx_runtime_1.jsxs)(components_1.Column, { align: "center", children: [(0, jsx_runtime_1.jsx)(components_1.Text, { style: countValue, children: labCount }), (0, jsx_runtime_1.jsx)(components_1.Text, { style: countLabel, children: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E47\u0E1A" })] })] })] }), (0, jsx_runtime_1.jsx)(components_1.Hr, { style: hr }), (0, jsx_runtime_1.jsx)(components_1.Section, { children: (0, jsx_runtime_1.jsxs)(components_1.Text, { style: footer, children: ["* \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E17\u0E35\u0E48\u0E22\u0E37\u0E21, \u0E2B\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E47\u0E1A\u0E17\u0E35\u0E48\u0E08\u0E2D\u0E07, \u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C \u0E41\u0E25\u0E30\u0E27\u0E31\u0E19\u0E40\u0E27\u0E25\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 700, color: "#475569" }, children: "\u0E16\u0E39\u0E01\u0E23\u0E30\u0E1A\u0E38\u0E44\u0E27\u0E49\u0E43\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23 PDF \u0E17\u0E35\u0E48\u0E41\u0E19\u0E1A\u0E21\u0E32\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E01\u0E31\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E09\u0E1A\u0E31\u0E1A\u0E19\u0E35\u0E49" })] }) })] }) }) })] }));
};
exports.BorrowRequestEmail = BorrowRequestEmail;
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
    textTransform: "uppercase",
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
    textTransform: "uppercase",
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
    textTransform: "uppercase",
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
    textAlign: "center",
    lineHeight: "1.6",
};
