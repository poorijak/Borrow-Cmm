"use client";

import React from "react";
import { useGetStaff, useUpdateRole } from "../hooks/useUser";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import DataTableToolsBar from "@/components/shared/data-table-toolsbar";
import Pagination from "@/components/shared/pagination";
import { QuerySortType, Role, Staff } from "@repo/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import DropdownStatus from "@/components/shared/dropdown-status";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronsUpDown, FolderTree, User2 } from "lucide-react";

interface StaffListProps {
  page: number;
  search: string;
  createdAt: QuerySortType;
  updatedAt: QuerySortType;
  role?: string;
}

const StaffList = ({
  page,
  search,
  createdAt,
  updatedAt,
  role,
}: StaffListProps) => {
  const { data } = useGetStaff(
    undefined,
    page,
    search,
    createdAt,
    updatedAt,
    role,
  );

  const router = useRouter();
  const sp = useSearchParams();
  const pathName = usePathname();

  const staff = data?.data ?? [];
  const { mutate } = useUpdateRole();

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "profileImage",
      header: () => <div className="text-center">รูปโปรไฟล์</div>,
      size: 10,
      cell: ({ row }) => {
        return (
          <div className="group relative flex items-center justify-center gap-3">
            <div className="relative size-8 shrink-0">
              <Image
                className="rounded-full border object-cover"
                alt="preview image"
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
      header: () => <div className="ml-10">ชื่อ</div>,
      size: 10,
      cell: ({ row }) => {
        const title = row.original.name;
        return (
          <div className="group relative ml-5 flex items-center gap-3">
            <span>{title}</span>
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
          className="hover:cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่สร้างบัญชี
          <ChevronsUpDown className="text-sm" />
        </Button>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่แก้ไขล่าสุด
          <ChevronsUpDown className="text-sm" />
        </Button>
      ),
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
    { label: "น้อยไปมาก", value: "asc" },
    { label: "มากไปน้อย", value: "desc" },
  ];

  const RoleOpiton: { label: string; value: Role }[] = [
    { label: "แอดมิน", value: "administrater" },
    { label: "ผู้ดูแล", value: "moderater" },
    { label: "อาจารย์", value: "instructor" },
  ];

  const filterConfig = [
    {
      key: "role",
      title: "บทบาท",
      icon: <User2 />,
      option: RoleOpiton,
    },
    {
      key: "updatedAt",
      title: "วันที่อัพเดตล่าสุด",
      icon: <Calendar />,
      option: SortOptions,
      type: "radio" as const,
    },
    {
      key: "createdAt",
      title: "วันที่สร้างบัญชี",
      icon: <Calendar />,
      option: SortOptions,
      type: "radio" as const,
    },
  ];

  const handleClearAll = () => {
    router.push(pathName, { scroll: false });
  };

  return (
    <div>
      <DataTable>
        <DataTableToolsBar
          filterConfig={filterConfig}
          sp={sp}
          pageParams="page"
          handelFillter={handelFillter}
          handleClearAll={handleClearAll}
        />
        <DataTableContent data={staff} columns={columns} />
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

export default StaffList;
