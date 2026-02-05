import BreadcrumLink from "@/components/shared/breadcrumb-link";
import React from "react";

const LabHeader = () => {
  const breadcrumb = [
    {
      label: "หน้าแรก",
      href: "/",
    },
  ];
  return (
    <div className="mb-10 h-44">
      <BreadcrumLink items={breadcrumb} page="จองห้องปฏิบัติการ" />
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-primary text-center text-5xl font-bold">
          จองห้องปฏิบัติการ
        </p>
      </div>
    </div>
  );
};

export default LabHeader;
