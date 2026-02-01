"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import React, { useState } from "react";
import { useCourse, useUpdateStatus } from "../hooks/useCourse";
import { ColumnDef } from "@tanstack/react-table";
import { ActiveStatus, Course } from "@repo/types";
import DropdownStatus from "@/components/shared/dropdown-status";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import Pagination from "@/components/shared/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UpsertCourseModal from "./upsert-course-modal";
import DataTableSearch from "@/components/shared/data-table-search";
import DeleteCourseModal from "./delete-equipment-modal";

interface CourseListProps {
  status: ActiveStatus;
  page: number;
  courseId?: string;
  search: string;
}

const CourseList = ({ search, status, page, courseId }: CourseListProps) => {
  const router = useRouter();
  const sp = useSearchParams();
  const pathName = usePathname();

  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<Course | undefined>(undefined);
  const { data } = useCourse(status, search, courseId, page, undefined);
  const { mutate } = useUpdateStatus();

  const courses = data?.data ?? [];

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const handleUpsert = (open: boolean) => {
    setIsUpsertOpen(open);
    if (!open) {
      setIsSelected(undefined);
    }
  };
  const handleDelete = (open: boolean) => {
    setIsDeleteOpen(open);
    if (!open) {
      setIsSelected(undefined);
    }
  };

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: () => <div className="text-center">รหัสวิชา</div>,
      size: 100,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.code}</div>;
      },
    },
    {
      accessorKey: "lable",
      header: () => <div className="pl-5">รายวิชา</div>,
      size: 100,
      cell: ({ row }) => {
        return <div className="pl-5">{row.original.label}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      size: 100,
      cell: ({ row }) => {
        const value = row.original.status;

        return (
          <DropdownStatus
            value={value}
            onStatusChange={(setNewStatus) => {
              mutate({ id: row.original.id, newStatus: setNewStatus });
            }}
            option={[
              {
                value: "active",
                label: "เปิดใช้งาน",
                icon: (
                  <Icon
                    icon="icon-park-solid:check-one"
                    className="text-green-600"
                  />
                ),
                style: {
                  bgColor: "#dcfae9",
                  textColor: "#1b8c42",
                },
              },
              {
                value: "inactive",
                label: "ปิดใช้งาน",
                icon: (
                  <Icon
                    icon="icon-park-solid:close-one"
                    className="text-destructive"
                  />
                ),
                style: {
                  bgColor: "#ffe9e6",
                  textColor: "#c72d22",
                },
              },
            ]}
          />
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่แก้ไข
          <ChevronsUpDown className="text-sm" />
        </Button>
      ),
    },
    {
      id: "actions",
      size: 30,
      cell: ({ row }) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Action Button">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsUpsertOpen(true);
                  setIsSelected(row.original);
                }}
              >
                <Pencil />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setIsDeleteOpen(true);
                  setIsSelected(row.original);
                }}
              >
                <Trash2 className="text-destructive" />
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];
  const tabs = [
    {
      name: "ทั้งหมด",
      key: "All",
      value: "all",
      defaultValue: true,
      href: "/admin/course",
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: "/admin/course?status=active",
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: "/admin/course?status=inactive",
    },
  ];

  console.log(isSelected);

  return (
    <div className="space-y-5">
      <TabsMenu tabItems={tabs} />
      <DataTable>
        <div className="w-80">
          <DataTableSearch placeholder="ค้นหารายวิชา เช่น Web Development, CMM123" />
        </div>
        <DataTableContent data={courses} columns={columns} />
        <Pagination
          totalPages={data?.meta.totalPage ?? 1}
          total={data?.meta.totalCount}
          onPageChange={handlePageChange}
          page={page}
        />
      </DataTable>
      <UpsertCourseModal
        open={isUpsertOpen}
        onOpenChange={handleUpsert}
        data={isSelected}
      />
      <DeleteCourseModal
        open={isDeleteOpen}
        onOpenChange={handleDelete}
        data={isSelected}
      />
    </div>
  );
};

export default CourseList;
