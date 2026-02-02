"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import UpsertLabModal from "./upsert-lab-modal";

const LabHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">จัดการห้องปฏิบัติการ</h1>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <Plus />
          เพิ่มรายวิชา
        </Button>
      </div>
      <UpsertLabModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default LabHeader;
