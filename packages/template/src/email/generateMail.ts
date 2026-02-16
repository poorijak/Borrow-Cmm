import { render } from "@react-email/render";
import { BorrowRequestEmail } from "./BorrowRequest";
import React from "react";

type generateBorrowEmailHtmlProps = {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  educationLevel: string;
  equipmentCount: number;
  labCount: number;
};

export const generateBorrowEmailHtml = async (
  props: generateBorrowEmailHtmlProps,
): Promise<string> => {
  return await render(React.createElement(BorrowRequestEmail, props));
};
