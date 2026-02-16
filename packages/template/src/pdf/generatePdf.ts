import { renderToBuffer } from "@react-pdf/renderer";
import { borrowRequest } from "@repo/types";
import React from "react";
import { EquipmentRequestPdf, LabPdf } from "./RequestPdf";

export const generateEquipmentPdfBuffer = async (
  data: borrowRequest,
): Promise<Buffer> => {
  return await renderToBuffer(
    React.createElement(EquipmentRequestPdf, { data }) as any,
  );
};

export const generateLabPdfBuffer = async (
  data: borrowRequest,
): Promise<Buffer> => {
  return await renderToBuffer(React.createElement(LabPdf, { data }) as any);
};
