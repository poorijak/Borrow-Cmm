import React from "react";
import { Button } from "../ui/button";
import { Icon, Loader2, LucideIcon } from "lucide-react";

interface SubmitBtnProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  pending?: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  icon?: LucideIcon;
}

const SubmitBtn = ({
  title,
  pending,
  variant,
  size,
  icon: Icon,
  ...props
}: SubmitBtnProp) => {
  return (
    <Button
      type="submit"
      {...props}
      size={size}
      variant={variant}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        <>
          {Icon ? <Icon className="size-4" /> : null}
          {title}
        </>
      )}
    </Button>
  );
};

export default SubmitBtn;
