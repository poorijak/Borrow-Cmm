import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const layout = async ({ children }: AuthLayoutProps) => {
  return (
    <main className="flex justify-center bg-[url('/images/auth/auth-bg.webp')] bg-cover bg-center items-center h-screen">
      {children}
    </main>
  );
};

export default layout;
