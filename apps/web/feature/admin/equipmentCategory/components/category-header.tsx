"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddCategoryModal from "./upsert-modal";

const CategoryHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between pb-10  flex-col md:flex-row gap-4 md:items-center">
        <header className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">หมวดหมู่อุปกรณ์</h2>
        </header>
        <div>
          <Button
            size="lg"
            className="px-10 w-full"
            onClick={() => setIsOpen(true)}
          >
            <Plus />
            <span>เพิ่มหมวดหมู่</span>
          </Button>
        </div>
      </div>
      <AddCategoryModal onOpenChange={setIsOpen} open={isOpen} />
    </div>
  );
};

export default CategoryHeader;
