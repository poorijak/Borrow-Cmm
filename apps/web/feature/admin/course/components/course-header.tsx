"use client"

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import UpsertCourseModal from "./upsert-course-modal";

const CourseHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">จัดการรายวิชา</h1>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          <Plus />
          เพิ่มรายวิชา
        </Button>
      </div>
      <UpsertCourseModal onOpenChange={setIsModalOpen} open={isModalOpen} />
    </div>
  );
};

export default CourseHeader;
