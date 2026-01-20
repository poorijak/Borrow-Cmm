"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import React, { useState } from "react";
import { useGetCategories, useUpdateStatus } from "../hooks/useCategory";
import { ActiveStatus, Categories } from "@repo/types";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/shared/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/data-table";
import Link from "next/link";
import UpsertCategory from "./upsert-modal";
import DeleleCategoryModal from "./delete-modal";
import StatsuDropdown from "@/components/shared/dropdown-status";

interface CategoriesListProps {
  status: ActiveStatus;
  page: number;
}

const CategoriesList = ({ status, page }: CategoriesListProps) => {
  const { data } = useGetCategories(page, undefined, status);
  const [isModalUpsertOpen, setIsModalUpsertOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isSelected, setIsSelected] = useState<Categories | undefined>(
    undefined
  );
  const [isDeleteSelected, setIsDeleteSelected] = useState<{
    id: string;
    title: string;
  }>({
    id: "",
    title: "",
  });

  const { mutate } = useUpdateStatus();
  const sp = useSearchParams();
  const router = useRouter();

  const categories = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const tabs = [
    {
      name: "ทั้งหมด",
      key: "All",
      value: "all",
      defaultValue: true,
      href: "/admin/category",
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: "/admin/category?status=active",
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: "/admin/category?status=inactive",
    },
  ];

  const columns: ColumnDef<Categories>[] = [
    {
      accessorKey: "title",
      header: () => <div className="pl-10">หมวดหมู่</div>,
      size: 100,
      cell: ({ row }) => {
        const id = row.original.id;
        const title = row.original.title;
        return (
          <div className="flex items-center gap-3 ml-5 relative group">
            <div className="relative size-10 shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200">
              <Image
                className="rounded-sm border object-cover"
                alt="preview image"
                fill
                src={getPublicUrl(row.original.mainImage)}
              />
            </div>

            <Link
              href={`category/${id}/equipment`}
              className="font- hover:underline hover:text-primary group-hover:underline underline-offset-4 after:absolute after:inset-0 after:z-0 transition-colors duration-75 hover:underline-offset-4"
            >
              {title}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "equipmentCount",
      header: () => <div className="text-center">จำนวนอุปกรณ์</div>,
      size: 50,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.equipmentCount}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      size: 100,
      cell: ({ row }) => {
        const value = row.original.status;

        return (
          <StatsuDropdown
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
              <DropdownMenuItem>
                <Link
                  href={`category/${row.original.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye />
                  ดูเพิ่มเติม
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsModalUpsertOpen(true);
                  setIsSelected(row.original);
                }}
              >
                <Pencil />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setIsDeleteModal(true);
                  setIsDeleteSelected({
                    id: row.original.id,
                    title: row.original.title,
                  });
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

  return (
    <div className="space-y-5">
      <TabsMenu tabItems={tabs} />
      <DataTable columns={columns} data={categories} searchbar={false} />
      <Pagination
        page={page}
        total={meta?.total}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <UpsertCategory
        open={isModalUpsertOpen}
        onOpenChange={setIsModalUpsertOpen}
        data={isSelected}
      />

      <DeleleCategoryModal
        open={isDeleteModal}
        onOpenChange={setIsDeleteModal}
        data={isDeleteSelected}
      />
    </div>
  );
};

export default CategoriesList;
