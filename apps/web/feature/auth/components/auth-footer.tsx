import { CardFooter } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const AuthFooter = () => {
  return (
    <CardFooter className="flex justify-end mt-3">
      <p className="text-muted-foreground text-sm">ติดต่อเจ้าหน้าที่ <Link className="text-primary underline" href={'#'}>ที่นี่</Link></p>
    </CardFooter>
  );
};

export default AuthFooter;
