"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useGetEquipments } from "../hooks/useEquipment";
import { ActiveStatus, Equipment } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { getPublicUrl } from "@/lib/utils";
import DataTable from "@/components/shared/data-table";
import DropdownStatus from "@/components/shared/dropdown-status";
import { Icon } from "@iconify/react";
import Pagination from "@/components/shared/pagination";
import { useUpdateStatus } from "../server/equipment";
import UpsetEquipmentModal from "./upsert-equipment-modal";

interface EquipmentListProps {
  categoryId?: string;
  status: ActiveStatus;
  page: number;
  type: "equipmentWithCate" | "equipmentPage";
}

const EquipmentList = ({
  categoryId,
  page,
  status,
  type,
}: EquipmentListProps) => {
  // hooks
  const pathName = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  // state
  const [isOpenUpsert, setIsOpenUpsert] = useState(false);
  const [isSelected, setIsSelected] = useState<Equipment>();

  const { data } = useGetEquipments(undefined, page, categoryId, status);
  const { mutate } = useUpdateStatus();

  // handle funciton
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("eqPage", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const equipments = data?.data ?? [];

  const tabs = [
    {
      name: "ทั้งหมด",
      key: "All",
      value: "all",
      defaultValue: true,
      href: `${pathName}`,
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: `${pathName}?status=active`,
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: `${pathName}?status=inactive`,
    },
  ];
  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "title",
      header: () => <div className="text-center">อุปกรณ์</div>,
      size: 100,
      cell: ({ row }) => {
        const title = row.original.title;
        return (
          <div className="group relative ml-5 flex items-center gap-3">
            <div className="relative size-10 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5">
              <Image
                className="rounded-sm border object-cover"
                alt="preview image"
                fill
                src={getPublicUrl(row.original.mainImage)}
              />
            </div>

            <span>{title}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "mainCategory",
      header: () => <div className="text-center">หมวดหมู่หลัก</div>,
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.mainCategory.title}</div>
        );
      },
    },
    {
      accessorKey: "subCategory",
      header: () => <div className="text-center">หมวดหมู่ย่อย</div>,
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.subCategory.title}</div>
        );
      },
    },
    {
      id: "availableQty",
      header: () => <div className="text-center">จำนวนคงเหลือให้ยืม</div>,
      size: 100,
      cell: ({ row }) => {
        const { borrowedQty, totalStock, reservedQty } = row.original;
        const availableQty = totalStock - (borrowedQty + reservedQty);

        return <div className="text-center">{availableQty}</div>;
      },
    },

    {
      accessorKey: "borrowedQty",
      header: () => <div className="text-center">จำนวนที่ถูกยืมทั้งหมด</div>,
      size: 100,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.borrowedQty}</div>;
      },
    },
    {
      accessorKey: "totalStock",
      header: () => <div className="text-center">สต๊อกทั้งหมด</div>,
      size: 100,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.totalStock}</div>;
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
                lable: "เปิดใช้งาน",
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
                lable: "ปิดใช้งาน",
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
      size: 60,
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
                  setIsOpenUpsert(true);
                  setIsSelected(row.original);
                }}
              >
                <Pencil />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                // onClick={() => {
                //   setIsDeleteModal(true);
                //   setIsDeleteSelected({
                //     id: row.original.id,
                //     title: row.original.title,
                //   });
                // }}
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

  return (
    <div className="space-y-7">
      <TabsMenu tabItems={tabs} />
      <DataTable data={equipments} columns={columns} />
      <Pagination
        page={page}
        totalPages={data?.meta.totalPage ?? 1}
        total={data?.meta.totalCount}
        onPageChange={handlePageChange}
      />
      <UpsetEquipmentModal
        open={isOpenUpsert}
        onOpenChange={setIsOpenUpsert}
        type={type}
        data={isSelected}
      />
    </div>
  );
};

export default EquipmentList;
