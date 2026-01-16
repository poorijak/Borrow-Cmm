"use client";

import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useGetSubCategories } from "../hooks/useSubCate";
import { Categories, SubCategories } from "@repo/types";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/shared/data-table";
import EditSubCateModal from "./edit-sub-category-modal";
import Pagination from "@/components/shared/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface SubCategoryListProps {
  id: string;
  page: number;
}

const SubCategoryList = ({ id, page }: SubCategoryListProps) => {
  // state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubCateSelected, setIsSubCateSelected] = useState<
    SubCategories | undefined
  >();

  // hooks
  const router = useRouter();
  const sp = useSearchParams();
  const { data } = useGetSubCategories(id, page);

  const meta = data?.meta;
  const subCategores = data?.data ?? [];

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const columns: ColumnDef<SubCategories>[] = [
    {
      accessorKey: "title",
      header: "หมวดหมู่",
      size: 200,
    },
    {
      accessorKey: "equipmentCount",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            className="hover:cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            จำนวนอุปกรณ์
            <ChevronsUpDown className="text-sm" />
          </Button>
        </div>
      ),
      size: 50,
      cell: ({ row }) => {
        return <div className="text-center">{row.original.equipmentCout}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      size: 150,
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
      size: 20,
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
                  setIsEditOpen(true);
                  setIsSubCateSelected(row.original);
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
    <div>
      <div className="space-y-5">
        <DataTable
          data={subCategores}
          columns={columns}
          searchbar={false}
          className="min-h-auto"
        />
        <Pagination
          page={page}
          totalPages={meta?.totalPages ?? 1}
          total={meta?.totalCount}
          onPageChange={onPageChange}
        />
      </div>
      <EditSubCateModal
        mainCateId={id}
        data={isSubCateSelected}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
};

export default SubCategoryList;
