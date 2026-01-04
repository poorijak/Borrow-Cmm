import { getUser } from "@/feature/users/server/user";
import { redirect } from "next/navigation";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {

    const user = await getUser()
    if (!user) redirect("/auth/signin")

  return <div>{children}</div>;
};

export default MainLayout;
