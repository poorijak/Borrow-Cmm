"use client";

import React from "react";
import ApprovalHeader from "./approval-header";
import ApprovalContent from "./approval-content";
import { useGetRequest } from "../hooks/useApproval";
import { AxiosError } from "axios";
import ForbiddenErrorPage from "@/components/error/components/403-error";
import NotFoundErrorPage from "@/components/error/components/404-error";
import Loading from "@/components/shared/loading";
import { Divide } from "lucide-react";

interface ApprovalWrapperProps {
  token: string;
}

// approval-wrapper.tsx
const ApprovalWrapper = ({ token }: ApprovalWrapperProps) => {
  // 1. ดึง isLoading ออกมาใช้
  const { data, isLoading, error } = useGetRequest(token);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;

    if (statusCode === 403)
      return (
        <div className="flex min-h-[80vh] w-full items-center justify-center">
          <ForbiddenErrorPage />
        </div>
      );
    if (statusCode === 404)
      return (
        <div>
          <div className="flex min-h-[80vh] w-full items-center justify-center"></div>
          <NotFoundErrorPage />;
        </div>
      );

    return (
      <div className="p-10 text-center text-red-500">
        Error: {axiosError.message}
      </div>
    );
  }

  if (!data?.request)
    return (
      <div>
        <div className="flex min-h-[80vh] w-full items-center justify-center"></div>
        <NotFoundErrorPage />;
      </div>
    );

  return (
    <div>
      <ApprovalHeader fullName={data.request.fullName} />
      <div className="flex flex-col gap-10 md:px-24">
        <ApprovalContent token={token} request={data} />
      </div>
    </div>
  );
};

export default ApprovalWrapper;
