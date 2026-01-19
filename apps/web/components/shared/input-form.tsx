import React, { HTMLInputTypeAttribute } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface InputFormProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type?: "input" | "textArea";
  inputTypeValue?: HTMLInputTypeAttribute;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const InputForm = <T extends FieldValues>({
  control,
  name,
  label,
  type = "input",
  required,
  placeholder,
  className,
  inputTypeValue = "text",
}: InputFormProps<T>) => {
  return (
    <div className={cn(className)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              {type === "input" ? (
                <Input
                  className="placeholder:text-xs"
                  placeholder={placeholder}
                  {...field}
                  type={inputTypeValue}
                  min={1}
                  required={required}
                />
              ) : (
                <Textarea
                  className="placeholder:text-xs"
                  placeholder={placeholder}
                  {...field}
                  required={required}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InputForm;
