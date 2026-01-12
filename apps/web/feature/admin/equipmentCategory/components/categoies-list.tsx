"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useGetCategories } from "../hooks/useCategory";
import { useSearchParams } from "next/navigation";
import { ActiveStatus } from "@repo/types";
import Image from "next/image";
import { cn, getPublicUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleX,
  EllipsisVertical,
  FlipHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatsuDropdown from "@/components/shared/status-dropdown";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

const CategoriesList = () => {
  const status = useSearchParams().get("status") as ActiveStatus;

  console.log(status);

  const { data, isPending } = useGetCategories(status);

  console.log(data);

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

  return (
    <div className="space-y-5">
      <TabsMenu tabItems={tabs} />

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow className="border-0 ">
              <TableHead className="px-10 w-52 font-bold">Preview</TableHead>
              <TableHead className="font-bold w-40">หมวดหมู่</TableHead>
              <TableHead className="font-bold w-32">จำนวนอุปกรณ์</TableHead>
              <TableHead className="font-bold w-44 text-center">
                สถานะ
              </TableHead>
              <TableHead className="font-bold w-30">
                วันที่แก้ไขล่าสุด
              </TableHead>
              <TableHead className="font-bold w-20"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id} className="border-b">
                <TableCell className="px-10 py-4">
                  <div className="relative size-8  object-cover">
                    <Image
                      src={getPublicUrl(item.mainImage)}
                      alt="cateogory-main-image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell align="center">
                  <Badge className="py-1 " variant="outline">
                    {item.status === "active" ? (
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="icon-park-solid:check-one"
                          className="text-green-600"
                        />
                        <span>เปิดใช้งาน</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="icon-park-solid:close-one"
                          className="text-destructive"
                        />
                        <span>ปิดใช้งาน</span>
                      </div>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>{item.updatedAt}</TableCell>
                <TableCell align="center">
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoriesList;
