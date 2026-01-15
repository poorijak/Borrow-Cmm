import React from "react";

interface CategoryDetailPageProps {
  params: { id: string };
}
const page = ({ params }: CategoryDetailPageProps) => {
  const { id } = params;

  return (
    <div>
      <header className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">หมวดหมู่อุปกรณ์</h2>
      </header>
    </div>
  );
};

export default page;
