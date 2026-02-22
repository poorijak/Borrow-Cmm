import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SelectedInputProps<T> {
  data?: T[];
  selected?: T;
  onSelected: (seleted: T) => void;
  placeholder?: string;
  renderLabel: (selected: T) => string;
  getUniqueKey: (selected: T) => string;
  label?: string;
  require?: boolean;
  error: FieldError | undefined;
}

export default function SelectedInput<T>({
  data,
  selected,
  onSelected,
  placeholder,
  renderLabel,
  getUniqueKey,
  require = false,
  label,
  error,
}: SelectedInputProps<T>) {
  const handleValueChange = (value: string) => {
    const foundItem = data?.find((item) => getUniqueKey(item) === value);

    if (foundItem) {
      onSelected(foundItem);
    }
  };

  const currentValue = selected ? getUniqueKey(selected) : undefined;

  return (
    <div className="w-full">
      {label && (
        <Label className={cn(
            "mb-2",
            error && "text-destructive",
          )}>
          {label}
          {require && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select onValueChange={handleValueChange} value={currentValue}>
        <SelectTrigger
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive",
          )}
        >
          <SelectValue placeholder={placeholder}>
            <span className="text-sm">{currentValue}</span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {data?.map((item, i) => (
            <SelectItem key={i} value={getUniqueKey(item)}>
              {renderLabel(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
