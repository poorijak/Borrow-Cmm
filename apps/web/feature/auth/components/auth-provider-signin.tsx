import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsGoogle } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const AuthProvider = () => {
  return (
    <div>
      <CardContent>
        <Separator className="my-4" />
        <Button
          className="w-full border  rounded-md flex justify-center items-center p-6"
          asChild
        >
          <Link
            href={`${process.env.API_URL}/auth/google`}
            className="flex gap-3 items-center text-sm"
          >
            {/* <FcGoogle size={20} /> */}
            <BsGoogle />
            เข้าสู่ระบบด้วย Google
          </Link>
        </Button>
      </CardContent>
    </div>
  );
};

export default AuthProvider;
