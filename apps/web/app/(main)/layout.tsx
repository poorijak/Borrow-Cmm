import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
};

export default MainLayout;
