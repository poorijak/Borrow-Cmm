"use client";

import React, { useState } from "react";
import Stepper from "./stepper";
import { Button } from "@/components/ui/button";
import UserInformation from "./user-information";
import EquipmentInfomation from "./equipment-infomation";
import LabInfomation from "./lab-infomation";
import { useGetMyBag } from "@/feature/bag/hooks/useMyBag";
import { User } from "@repo/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { borrowFormSchema, BorrowFormValues } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface StepperFormProps {
  user: User | null;
}

const StepperForm = ({ user }: StepperFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { data: borrowBag } = useGetMyBag(user?.id);

  const hasEquipment = (borrowBag?.equipmentItems?.length ?? 0) > 0;
  const hasLab = (borrowBag?.labItems?.length ?? 0) > 0;

  const initialStep1Values = {
    fullName: "",
    studentId: "",
    phone: "",
    email: "",
    educationLevel: "",
    idCardImageFile: undefined,
  };

  const initialStep2Values = {
    subjectId: "",
    teacherId: "",
    purpose: "",
    additionalItems: "",
    borrowRange: {
      from: undefined,
      to: undefined,
    },
  };

  const initialStep3Values = {
    subjectId: "",
    teacherId: "",
    usageDetails: "",
    memberNames: "",
  };

  const handleNextState = () => {
    if (activeStep === 0 && !hasEquipment) {
      setActiveStep(hasLab ? 2 : 4);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handlePrevState = () => {
    if (activeStep === 2 && !hasEquipment) {
      setActiveStep(0);
    }
    setActiveStep((prev) => prev - 1);
  };

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      step1: initialStep1Values,
      equipment: initialStep2Values,
      lab: initialStep3Values,
    },
  });

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <UserInformation />;
      case 1:
        return hasEquipment ? <EquipmentInfomation /> : null;
      case 2:
        return hasLab ? <LabInfomation /> : null;
      case 3:
        return <div>หน้าสรุปการทำรายการ (Review)</div>;
      default:
        return null;
    }
  };

  const handleSubmit = () => {};

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-7">
        <Stepper
          activeState={activeStep}
          setActiveState={setActiveStep}
          hasEquipment={hasEquipment}
          hasLab={hasLab}
        />

        <div className="h-[500px] w-full">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {getStepContent(activeStep)}
            </form>
          </FormProvider>
        </div>
      </div>

      <div className="flex w-full justify-between gap-3">
        <Button disabled={activeStep === 0} size="lg" onClick={handlePrevState}>
          <ArrowLeft /> ย้อนกลับ
        </Button>
        <Button disabled={activeStep === 3} size="lg" onClick={handleNextState}>
          <ArrowRight /> ถัดไป
        </Button>
      </div>
    </div>
  );
};

export default StepperForm;
