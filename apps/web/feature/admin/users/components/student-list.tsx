"use client";

import React from "react";
// สมมติว่ามี Hook ชื่อ useGetStudents และ useUpdateRole อยู่ในไฟล์เดียวกัน
import { useGetStudent, useUpdateRole } from "../hooks/useUser";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import DataTableToolsBar from "@/components/shared/data-table-toolsbar";
import Pagination from "@/components/shared/pagination";
import { QuerySortType, User } from "@repo/types"; // เปลี่ยน Staff เป็น Student type
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronsUpDown } from "lucide-react";
import DropdownStatus from "@/components/shared/dropdown-status";

interface StudentListProps {
  page: number;
  search: string;
  createdAt: QuerySortType;
}

const StudentList = ({ page, search, createdAt }: StudentListProps) => {
  // เปลี่ยนมาใช้ Hook สำหรับ Student โดยล็อค role เป็น 'student'
  const { data } = useGetStudent(undefined, page, search, createdAt);

  const router = useRouter();
  const sp = useSearchParams();
  const pathName = usePathname();

  const students = data?.data ?? [];
  const { mutate } = useUpdateRole();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "profileImage",
      header: () => <div className="text-center">รูปโปรไฟล์</div>,
      size: 5,
      cell: ({ row }) => {
        return (
          <div className="group relative flex items-center justify-center gap-3">
            <div className="relative size-8 shrink-0">
              <Image
                className="rounded-full border object-cover"
                alt="profile"
                fill
                src={row.original.profileImage}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: () => <div className="ml-10">ชื่อนักเรียน</div>,
      size: 10,
      cell: ({ row }) => {
        return (
          <div className="group relative ml-5 flex items-center gap-3">
            <span>{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => <div>อีเมล</div>,
      size: 100,
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "status",
      header: "บทบาท",
      size: 100,
      cell: ({ row }) => {
        const value = row.original.role;

        return (
          <DropdownStatus
            value={value}
            onStatusChange={(setNewRole) => {
              mutate({ id: row.original.id, newRole: setNewRole });
            }}
            option={[
              {
                value: "administrater",
                label: "แอดมิน",
                style: {
                  bgColor: "#E8F2FC",
                  textColor: "#055EBD",
                },
              },
              {
                value: "moderater",
                label: "ผู้ดูแล",
                style: {
                  bgColor: "#EEE6FF",
                  textColor: "#5F16BC",
                },
              },
              {
                value: "student",
                label: "นักเรียน",
                style: {
                  bgColor: "#DCFAE9",
                  textColor: "#209A4A",
                },
              },
              {
                value: "instructor",
                label: "อาจารย์",
                style: {
                  bgColor: "#FFF4E3",
                  textColor: "#FFA100",
                },
              },
            ]}
          />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่ลงทะเบียน
          <ChevronsUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.createdAt}</div>,
    },
  ];

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

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const SortOptions: { label: string; value: QuerySortType }[] = [
    { label: "เก่าไปใหม่", value: "asc" },
    { label: "ใหม่ไปเก่า", value: "desc" },
  ];

  const filterConfig = [
    {
      key: "updatedAt",
      title: "วันที่อัพเดตล่าสุด",
      icon: <Calendar className="size-4" />,
      option: SortOptions,
      type: "radio" as const,
    },
    {
      key: "createdAt",
      title: "วันที่ลงทะเบียน",
      icon: <Calendar className="size-4" />,
      option: SortOptions,
      type: "radio" as const,
    },
  ];

  const handleClearAll = () => {
    router.push(pathName, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <DataTable>
        <DataTableToolsBar
          filterConfig={filterConfig}
          sp={sp}
          pageParams="page"
          handelFillter={handelFillter}
          handleClearAll={handleClearAll}
        />
        <DataTableContent data={students} columns={columns} />
        <Pagination
          page={page}
          totalPages={data?.meta.totalPage ?? 1}
          total={data?.meta.totalCount}
          onPageChange={handlePageChange}
        />
      </DataTable>
    </div>
  );
};

export default StudentList;
