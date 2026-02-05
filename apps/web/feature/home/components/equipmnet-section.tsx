import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EquipmentSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="w-60 text-2xl font-bold">บริการสำหรับนักศึกษา</h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="group relative aspect-square h-48 w-full cursor-pointer overflow-hidden rounded-lg border md:w-[450px]">
          <Link href="/equipment" className="">
            <Image
              alt="Preview-category"
              src="/images/cmm/Equipment_cate.webp"
              fill
              unoptimized
              className="object-contain transition-transform duration-200 group-hover:scale-110" // ใช้ object-cover ถ้าอยากให้รูปเต็มพื้นที่โดยไม่สนสัดส่วน
            />
            <h2 className="absolute bottom-2 left-5 text-lg font-bold">
              ยืมอุปกรณ์
            </h2>
          </Link>
        </div>
        <div className="group relative aspect-square h-48 w-full cursor-pointer overflow-hidden rounded-lg border md:w-[450px]">
          <Link href="/laboratory">
            <div className="absolute inset-0 z-0 bg-[url('/images/cmm/Lab_borrow.webp')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />

            <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/40" />

            <h2 className="absolute bottom-2 left-5 z-20 text-lg font-bold text-white">
              จองห้องปฏิบัติการ
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EquipmentSection;
