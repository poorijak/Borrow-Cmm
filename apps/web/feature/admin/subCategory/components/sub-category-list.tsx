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

interface SubCategoryListProps {
  id: string;
  page: number;
}

const SubCategoryList = ({ id, page }: SubCategoryListProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubCateSelected, setIsSubCateSelected] = useState<SubCategories>();

  const { data } = useGetSubCategories(id, page);

  const subCategores = data?.data ?? [];

  const columns: ColumnDef<SubCategories>[] = [
    {
      accessorKey: "title",
      header: "หมวดหมู่",
      size: 100,
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
      <DataTable
        data={subCategores}
        columns={columns}
        searchbar={false}
        className="min-h-auto"
      />
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
