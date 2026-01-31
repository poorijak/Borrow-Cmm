"use client";

import DropdownStatus from "@/components/shared/dropdown-status";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { ActiveStatus, Laboratory } from "@repo/types";
import { ChevronsUpDown, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useLaboratory, useUpdateStatus } from "../hooks/useLaboratory";
import TabsMenu from "@/components/shared/tabsMenu";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import DataTableSearch from "@/components/shared/data-table-search";
import Pagination from "@/components/shared/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import UpsertLabModal from "./upsert-lab-modal";
import DeleteLabModal from "./delete-lab-modal";

interface LaboratoryListProps {
  page: number;
  status: ActiveStatus;
  search: string;
}

const LaboratoryList = ({ page, status, search }: LaboratoryListProps) => {
  const { data } = useLaboratory(status, search, page, undefined);
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSelected, setIsSeleted] = useState<Laboratory | undefined>(
    undefined,
  );
  const { mutate } = useUpdateStatus();

  const router = useRouter();
  const sp = useSearchParams();

  const laboratory = data?.data ?? [];

  const handleUpsertModal = (open: boolean) => {
    setIsUpsertOpen(open);
    if (!open) {
      setIsSeleted(undefined);
    }
  };
  const handleDeleteModal = (open: boolean) => {
    setIsDeleteOpen(open);
    if (!open) {
      setIsSeleted(undefined);
    }
  };

  const columns: ColumnDef<Laboratory>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-center">ชื่อห้อง</div>,
      size: 100,
      cell: ({ row }) => {
        const name = row.original.name;
        return (
          <div className="group relative ml-5 flex items-center gap-3">
            <div className="relative size-10 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5">
              <Image
                className="rounded-sm border object-cover"
                alt="preview image"
                fill
                src={getPublicUrl(row.original.image)}
              />
            </div>

            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "code",
      header: () => <div className="text-center">รหัสห้อง</div>,
      size: 100,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.labCode}</div>;
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
                  setIsSeleted(row.original);
                }}
              >
                <Pencil />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setIsDeleteOpen(true);
                  setIsSeleted(row.original);
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
      href: "/admin/laboratory",
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: "/admin/laboratory?status=active",
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: "/admin/laboratory?status=inactive",
    },
  ];

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="space-y-5">
      <TabsMenu tabItems={tabs} />
      <DataTable>
        <DataTableSearch />
        <DataTableContent data={laboratory} columns={columns} />
        <Pagination
          page={page}
          total={data?.meta.totalCout}
          totalPages={data?.meta.totalCout ?? 1}
          onPageChange={handlePageChange}
        />
      </DataTable>
      <UpsertLabModal
        open={isUpsertOpen}
        onOpenChange={handleUpsertModal}
        lab={isSelected}
      />
      <DeleteLabModal
        onOpenChange={handleDeleteModal}
        open={isDeleteOpen}
        data={isSelected}
      />
    </div>
  );
};

export default LaboratoryList;
