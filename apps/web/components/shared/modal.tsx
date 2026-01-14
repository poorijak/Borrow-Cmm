import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
  title?: string | undefined;
  desc?: string | null | undefined;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({
  open,
  onOpenChange,
  title,
  desc,
  size = "lg",
  children,
}: DialogProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            size === "sm" && "w-[445px]",
            size === "md" && "w-[500px]",
            size === "lg" && "w-[600px]"
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modal;
