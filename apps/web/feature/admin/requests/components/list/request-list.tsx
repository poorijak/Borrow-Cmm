"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  BorrowRequestTableItem,
  EquipmentStatus,
  LabStatus,
  RequestQueryType,
} from "@repo/types";
import {
  useGetAllCourse,
  useGetInstructors,
  useGetRequests,
} from "../../hooks/useRequest";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import DataTableToolsBar from "@/components/shared/data-table-toolsbar";
import Pagination from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  LayoutList,
  Activity,
  BookOpen,
  GraduationCap,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RequestListProps {
  page: number;
  search?: string;
  type?: RequestQueryType;
  status?: string;
  limit?: number;
  subjectId?: string[];
  teacherId?: string[];
}

const RequestList = ({
  page,
  search,
  type,
  status,
  limit = 10,
  subjectId,
  teacherId,
}: RequestListProps) => {
  const pathName = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const { data, isLoading } = useGetRequests({
    page,
    limit,
    search,
    type,
    status: status as any,
    subjectId,
    teacherId,
    orderByDate: "desc",
  });

  const { data: allCourses } = useGetAllCourse();
  const { data: allTeachers } = useGetInstructors();

  console.log(allCourses);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const handelFillter = (
    key: string,
    val: string,
    isSingle: boolean = false,
  ) => {
    const params = new URLSearchParams(sp.toString());

    if (isSingle) {
      const currentValue = params.get(key);
      if (currentValue === val) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    } else {
      const currentValues = params.get(key)?.split(",") || [];
      let newValues;
      if (currentValues.includes(val)) {
        newValues = currentValues.filter((v) => v !== val);
      } else {
        newValues = [...currentValues, val];
      }

      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    }

    params.set("page", "1");
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathName, { scroll: false });
  };

  const columns: ColumnDef<BorrowRequestTableItem>[] = [
    {
      accessorKey: "requestType",
      header: "ประเภทคำขอ",
      cell: ({ row }) => <div className="ml-5">{row.original.requestType}</div>,
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      size: 120,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "borrower",
      header: "ผู้ยืม",
      size: 150,
    },
    {
      accessorKey: "subject",
      header: "วิชา",
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="line-clamp-1">{row.original.subject.sujectCode}</div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "วันที่สร้าง",
      size: 120,
    },
    {
      accessorKey: "teacher",
      header: "อาจารย์",
      size: 120,
      cell: ({ row }) => {
        return <div>{row.original.teacher.teacherName}</div>;
      },
    },
    {
      accessorKey: "purpose",
      header: "เหตุผล",
      size: 120,
      cell: ({ row }) => {
        return <div>{row.original.purpose}</div>;
      },
    },
    {
      id: "actions",
      size: 60,
      cell: ({ row }) => (
        <>
          <Button variant="link">
            <Link href={`/admin/requests/${row.original.id}`}>รายละเอียด</Link>
          </Button>
        </>
      ),
    },
  ];

  const filterConfig = [
    {
      key: "type",
      title: "ประเภท",
      icon: <LayoutList size={16} />,
      type: "radio" as const,
      option: [
        { label: "ยืมอุปกรณ์", value: "equipment" },
        { label: "จองห้องแล็บ", value: "lab" },
      ],
    },
    {
      key: "status",
      title: "สถานะ",
      icon: <Activity size={16} />,
      option: [
        { label: "รอดำเนินการ", value: "pending" },
        { label: "รออาจารย์อนุมัติ", value: "pending_teacher" },
        { label: "รอเจ้าหน้าที่อนุมัติ", value: "pending_staff" },
        { label: "อนุมัติ", value: "approved" },
        { label: "คืนเรียบร้อย", value: "returned" },
        { label: "ปฏิเสธ", value: "rejected" },
      ],
    },
    {
      key: "subjectId",
      title: "วิชา",
      icon: <BookOpen size={16} />,
      option:
        allCourses?.map((course) => ({
          label: course.code,
          value: course.id,
        })) || [],
    },
    {
      key: "teacherId",
      title: "อาจารย์",
      icon: <GraduationCap size={16} />,
      option:
        allTeachers?.map((teacher: any) => ({
          label: teacher.name,
          value: teacher.id,
        })) || [],
    },
    {
      key: "orderByDate",
      title: "วันที่",
      type: "radio" as const,
      icon: <ArrowUpDown size={16} />,
      option: [
        { label: "มากไปน้อย", value: "asc" },
        { label: "น้อยไปมาก", value: "desc" },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <DataTable>
        <DataTableToolsBar
          pageParams="page"
          filterConfig={filterConfig}
          sp={sp}
          handelFillter={handelFillter}
          handleClearAll={handleClearAll}
          searchbarPlacehodler="ค้นหาจากชื่อผู้ยืม หรือรหัสนักศึกษา"
        />
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

export default RequestList;
