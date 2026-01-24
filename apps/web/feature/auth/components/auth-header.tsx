import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type AuthHeaderType = {
  children: React.ReactNode;
};

const AuthHeader = ({ children }: AuthHeaderType) => {
  return (
    <div>
      <Card className="min-w-sm md:min-w-lg shadow-none">
        <CardHeader className="w-full ">
          <div className="text-center flex flex-col gap-3">
            <div className="relative size-14 w-full">
              <Image
                src="/images/cmm/CMM_Logo_main.webp"
                alt="cmm-image-logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl  font-bold">บริการยืม/คืนอุปกรณ์</h1>
            <p className="text-muted-foreground text-sm">
              ยืมและคืนอุปกรณ์ในภาควิชาได้อย่างง่ายดาย
            </p>
          </div>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};

export default AuthHeader;
