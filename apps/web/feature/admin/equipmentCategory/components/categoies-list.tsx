"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import React from "react";
import { useGetCategories } from "../hooks/useCategory";
import { ActiveStatus, Categories } from "@repo/types";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface CategoriesListProps {
  status: ActiveStatus;
  page: number;
}

const CategoriesList = ({ status, page }: CategoriesListProps) => {
  const { data } = useGetCategories(status, page);

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
      href: "/admin/equipmentCategory",
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: "/admin/equipmentCategory?status=active",
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: "/admin/equipmentCategory?status=inactive",
    },
  ];

  const columns: ColumnDef<Categories>[] = [
    {
      accessorKey: "preview",
      header: "Preview",
      size: 250,
      minSize: 100,
      maxSize: 160,
      cell: ({ row }) => (
        <div className="relative size-10 ">
          <Image
            className="rounded-sm border object-cover"
            alt="preview image"
            fill
            src={getPublicUrl(row.original.mainImage)}
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "หมวดหมู่",
      size: 320,
      cell: ({ row }) => {
        const id = row.original.id;
        const title = row.original.title;
        return (
          <Link
            href={`equipmentCategory/${id}`}
            className="font- hover:underline hover:text-primary transition-colors duration-75 hover:underline-offset-4"
          >
            {title}
          </Link>
        );
      },
    },
    {
      accessorKey: "equipmentCount",
      header: "จำนวนอุปกรณ์",
      size: 140,
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      size: 170,
      cell: ({ row }) => (
        <Badge className="py-1 " variant="outline">
          {row.original.status === "active" ? (
            <div className="flex items-center gap-1">
              <Icon
                icon="icon-park-solid:check-one"
                className="text-green-600"
              />
              <span>เปิดใช้งาน</span>
              <ChevronDown className="size-3" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Icon
                icon="icon-park-solid:close-one"
                className="text-destructive"
              />
              <span>ปิดใช้งาน</span>
              <ChevronDown className="size-3" />
            </div>
          )}
        </Badge>
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
                  href={`equipmentCategory/${row.original.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye />
                  ดูเพิ่มเติม
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
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
    </div>
  );
};

export default CategoriesList;
