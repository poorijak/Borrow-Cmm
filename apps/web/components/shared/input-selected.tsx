import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface SelectedInputProps<T> {
  data?: T[];
  selected?: T;
  onSelected: (seleted: T) => void;
  placeholder?: string;
  renderLabel: (selected: T) => string;
  getUniqueKey: (selted: T) => string;
  label?: string;
  require?: boolean;
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
}: SelectedInputProps<T>) {
  const handleValueChange = (value: string) => {
    const foundItem = data?.find((item) => getUniqueKey(item) === value);

    if (foundItem) {
      onSelected(foundItem);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <Label className="mb-2">
          {label}
          {require && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            <span className="text-sm">
              {selected ? renderLabel(selected) : placeholder}
            </span>
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
