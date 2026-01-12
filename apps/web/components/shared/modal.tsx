import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | undefined;
  desc?: string | null | undefined;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({
  open,
  onOpenChange,
  title,
  desc,
  children,
  className,
}: DialogProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
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
