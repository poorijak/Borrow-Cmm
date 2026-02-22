import { Button } from "@/components/ui/button";
import { getPublicUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFoundErrorPage = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="relative aspect-square size-72 md:size-96">
        <Image
          loading="lazy"
          src={getPublicUrl("Error_image/404.webp")}
          fill
          className="object-cover"
          alt="forbidden-error"
        />
      </div>
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-xl font-bold">ไม่พบข้อมูลดังกล่าว</h1>
        <Button variant="outline">
          <ArrowLeft />
          <Link href={"/"}>กลับไปหน้าหลัก</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundErrorPage;
