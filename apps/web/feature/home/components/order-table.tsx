"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { BorrowRequestTableItem } from "@repo/types";
import { useGetMyRequests } from "../hooks/useMyRequest";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import TabsMenu from "@/components/shared/tabsMenu";
import Pagination from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";

interface OrderTableProps {
  page: number;
  status?: string;
}

const OrderTable = ({ page, status }: OrderTableProps) => {
  const pathName = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useGetMyRequests({
    page,
    status: status === "all" ? undefined : status,
    limit: 5, // Home page show less
  });

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const columns: ColumnDef<BorrowRequestTableItem>[] = [
    {
      accessorKey: "requestType",
      header: "ประเภทคำขอ",
      cell: ({ row }) => <div className="ml-4">{row.original.requestType}</div>,
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      size: 100,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "subject",
      header: "วิชา",
      size: 100,

      cell: ({ row }) => (
        <div className="line-clamp-1">{row.original.subject.sujectCode}</div>
      ),
    },
    {
      accessorKey: "teacher",
      header: "อาจารย์",
      size: 100,

      cell: ({ row }) => <div>{row.original.teacher.teacherName}</div>,
    },
    {
      accessorKey: "purpose",
      header: "ใช้เพื่อ",
      size: 100,

      cell: ({ row }) => <div>{row.original.purpose}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "วันที่สร้าง",
      size: 120,
    },
  ];

  const tabItems = [
    { name: "ทั้งหมด", value: "all", key: "status", href: "?status=all" },
    {
      name: "รอดำเนินการ",
      value: "pending",
      key: "status",
      href: "?status=pending",
    },
    {
      name: "อนุมัติ",
      value: "approved",
      key: "status",
      href: "?status=approved",
    },
    {
      name: "ไม่อนุมัติ",
      value: "rejected",
      key: "status",
      href: "?status=rejected",
    },
    {
      name: "คืนเรียบร้อย",
      value: "returned",
      key: "status",
      href: "?status=returned",
    },
  ];

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">รายการคำขอของคุณ</h2>
        <p className="text-muted-foreground text-sm">
          ตรวจสอบสถานะการยืมอุปกรณ์และการจองห้องแล็บของคุณ
        </p>
      </div>

      <TabsMenu tabItems={tabItems} defaultValue={status || "all"} />

      <DataTable>
        <DataTableContent data={data?.data ?? []} columns={columns} />
      </DataTable>

      <Pagination
        page={page}
        totalPages={data?.meta.totalPage ?? 1}
        total={data?.meta.totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderTable;
