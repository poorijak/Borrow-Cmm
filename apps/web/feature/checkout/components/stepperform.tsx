"use client";

import React, { useState } from "react";
import Stepper from "./stepper";
import { Button } from "@/components/ui/button";
import UserInformation from "./user-information";
import EquipmentInfomation from "./borrow-information";
import { useGetMyBag } from "@/feature/bag/hooks/useMyBag";
import { borrowRequest, User } from "@repo/types";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { borrowFormSchema, BorrowFormValues } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import BorrowInformation from "./borrow-information";
import { useMutateCheckout } from "../hooks/useCheckout";

interface StepperFormProps {
  user: User | null;
}

const StepperForm = ({ user }: StepperFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { data: borrowBag } = useGetMyBag(user?.id);
  const { mutate } = useMutateCheckout();

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

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      step1: initialStep1Values,
      equipment: initialStep2Values,
      lab: initialStep3Values,
    },
  });

  const handleNextState = async () => {
    let isStepValid = false;

    if (activeStep === 0) {
      isStepValid = await form.trigger("step1");
    } else if (activeStep === 1) {
      isStepValid = await form.trigger("equipment");
    } else if (activeStep === 2) {
      isStepValid = await form.trigger("lab");
    } else {
      isStepValid = true;
    }

    if (isStepValid) {
      if (activeStep === 0 && !hasEquipment) {
        setActiveStep(hasLab ? 2 : 3);
        return;
      }
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevState = () => {
    if (activeStep === 2 && !hasEquipment) {
      setActiveStep(0);
    }
    setActiveStep((prev) => prev - 1);
  };

  const lastStepIndex = hasLab ? 2 : hasEquipment ? 1 : 0;
  const isLastStep = activeStep === lastStepIndex;

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <UserInformation />;
      case 1:
        return hasEquipment ? (
          <BorrowInformation equipmentItem={borrowBag?.equipmentItems} />
        ) : null;
      case 2:
        return hasLab ? (
          <BorrowInformation labItem={borrowBag?.labItems} />
        ) : null;
      default:
        return null;
    }
  };

  const handleSubmit = (data: BorrowFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset({
          step1: initialStep1Values,
          equipment: initialStep2Values,
          lab: initialStep3Values,
        });
      },
    });
  };

  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <div className="space-y-5">
        <Stepper
          activeState={activeStep}
          setActiveState={setActiveStep}
          hasEquipment={hasEquipment}
          hasLab={hasLab}
        />

        <div className="h-auto w-full px-0 md:h-[500px] md:px-24">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {getStepContent(activeStep)}
            </form>
          </FormProvider>
        </div>
      </div>

      <div className="flex w-full justify-end gap-3">
        <Button disabled={activeStep === 0} size="lg" onClick={handlePrevState}>
          <ArrowLeft /> ย้อนกลับ
        </Button>
        {isLastStep ? (
          <Button
            type="submit"
            size="lg"
            onClick={form.handleSubmit(handleSubmit)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send />
            ยืนยันทำรายการ
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={handleNextState}>
            ถัดไป <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepperForm;
