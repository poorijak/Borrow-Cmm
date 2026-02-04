"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useGetEquipments } from "../hooks/useEquipment";
import { ActiveStatus, Equipment, QuerySortType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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
  FolderTree,
  Pencil,
  Trash2,
} from "lucide-react";
import { getPublicUrl } from "@/lib/utils";
import DropdownStatus from "@/components/shared/dropdown-status";
import { Icon } from "@iconify/react";
import Pagination from "@/components/shared/pagination";
import { useUpdateStatus } from "../server/equipment";
import UpsetEquipmentModal from "./upsert-equipment-modal";
import DeleteEquipmentModal from "./delete-equipment-modal";
import { useGetCategories } from "../../equipmentCategory/hooks/useCategory";
import { useGetSubCategoryAll } from "../../subCategory/hooks/useSubCate";
import DataTableContent, { DataTable } from "@/components/shared/data-table";
import DataTableToolsBar from "@/components/shared/data-table-toolsbar";

interface EquipmentListProps {
  categoryId?: string;
  status: ActiveStatus;
  subCategoryId?: string;
  page: number;
  type: "equipmentWithCate" | "equipmentPage";
  totalStock?: QuerySortType;
  search?: string;
}

interface CategoriesOptions {
  label: string;
  value: string;
}

const EquipmentList = ({
  categoryId,
  page,
  status,
  subCategoryId,
  type,
  totalStock,
  search,
}: EquipmentListProps) => {
  // hooks
  const pathName = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  // state
  const [isOpenUpsert, setIsOpenUpsert] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isSelected, setIsSelected] = useState<Equipment>();

  // hooks
  const { data } = useGetEquipments(
    undefined,
    page,
    categoryId,
    subCategoryId,
    status,
    totalStock,
    search,
  );
  const { data: categories } = useGetCategories();
  const { data: subCategories } = useGetSubCategoryAll();

  const { mutate } = useUpdateStatus();

  // handle funciton
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(sp);
    newParams.set("eqPage", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  const handelCloseUpsert = (open: boolean) => {
    setIsOpenUpsert(open);
    if (!open) setIsSelected(undefined);
  };
  const handelCloseDelete = (open: boolean) => {
    setIsOpenDelete(open);
    if (!open) setIsSelected(undefined);
  };

  const categoryOptions: CategoriesOptions[] =
    categories?.data.map((c) => ({
      label: c.title,
      value: c.id,
    })) ?? [];

  const subCategoryOptions: CategoriesOptions[] =
    subCategories?.map((subCate) => ({
      label: subCate.title,
      value: subCate.id,
    })) ?? [];

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

    params.set("eqPage", "1");
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathName, { scroll: false });
  };

  //var
  const equipments = data?.data ?? [];

  const totalStockOptions: { label: string; value: QuerySortType }[] = [
    { label: "น้อยไปมาก", value: "asc" },
    { label: "มากไปน้อย", value: "desc" },
  ];

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
                onClick={() => {
                  setIsOpenDelete(true);
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

  const filterConfig = [
    {
      key: "mainCategory",
      title: "หมวดหมู่หลัก",
      icon: <FolderTree />,
      option: categoryOptions,
    },
    {
      key: "subCategory",
      title: "หมวดหมู่ย่อย",
      icon: <FolderTree />,
      option: subCategoryOptions,
    },
    {
      key: "totalStock",
      title: "สต๊อกทั้งหมด",
      icon: <FolderTree />,
      option: totalStockOptions,
      type: "radio" as const,
    },
  ];

  return (
    <div className="space-y-5">
      <TabsMenu tabItems={tabs} />
      <DataTable>
        <DataTableToolsBar
          pageParams="eqPage"
          filterConfig={filterConfig}
          sp={sp}
          handelFillter={handelFillter}
          handleClearAll={handleClearAll}
          searchbarPlacehodler="เช่น กล้อง sony R3"
        />
        <DataTableContent data={equipments} columns={columns} />
      </DataTable>
      <Pagination
        page={page}
        totalPages={data?.meta.totalPage ?? 1}
        total={data?.meta.totalCount}
        onPageChange={handlePageChange}
      />
      <UpsetEquipmentModal
        open={isOpenUpsert}
        onOpenChange={handelCloseUpsert}
        type={type}
        data={isSelected}
      />
      <DeleteEquipmentModal
        open={isOpenDelete}
        onOpenChange={handelCloseDelete}
        data={isSelected}
      />
    </div>
  );
};

export default EquipmentList;
