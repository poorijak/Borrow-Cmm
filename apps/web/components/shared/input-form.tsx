import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface InputFormProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type?: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

const InputForm = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  required,
  placeholder,
}: InputFormProps<T>) => {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <Input
              className="placeholder:text-xs"
                placeholder={placeholder}
                type={type}
                {...field}
                required={required}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default InputForm;
