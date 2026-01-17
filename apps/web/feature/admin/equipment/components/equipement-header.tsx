"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import UpsetEquipmentModal from "./upsert-equipment-modal";

interface EquipmentHeaderProps {
  type: "equipmentPage" | "equipmentWithCate";
  mainCateId?: string;
}

const EquipmentHeader = ({ type, mainCateId }: EquipmentHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <header>
        <div className="text-2xl font-bold">
          {type === "equipmentPage" ? (
            <h2>อุปกรณ์</h2>
          ) : (
            <h2>อุปกรณ์ทั้งหมด</h2>
          )}
        </div>
      </header>
      <Button onClick={() => setIsModalOpen(true)}>
        <span>
          <Plus />
        </span>
        เพิ่มอุปกรณ์ใหม่
      </Button>

      <UpsetEquipmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type={type}
        mainCateId={mainCateId}
      />
    </div>
  );
};

export default EquipmentHeader;
