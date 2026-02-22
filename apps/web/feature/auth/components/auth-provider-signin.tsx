"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { BsGoogle } from "react-icons/bs";

const AuthProvider = () => {
  const searchParam = useSearchParams();

  const callBackUrl = searchParam.get("callBackUrl") || "/";

  return (
    <div>
      <CardContent>
        <Separator className="my-4" />
        <Button
          className="flex w-full items-center justify-center rounded-md border p-6"
          asChild
        >
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?callBackUrl=${callBackUrl}`}
            className="flex items-center gap-3 text-sm"
          >
            <BsGoogle />
            เข้าสู่ระบบด้วย Google
          </Link>
        </Button>
      </CardContent>
    </div>
  );
};

export default AuthProvider;
