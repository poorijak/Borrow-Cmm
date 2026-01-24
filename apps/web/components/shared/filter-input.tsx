import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";

interface Options<T> {
  label: string;
  value: T;
}

interface FilterInputProps<T> {
  title: string;
  filterOptions: Options<T>[];
  seletedValue: T[];
  onFilterChange: (value: T) => void;
  icon?: React.ReactNode;
  type?: "checkbox" | "radio";
}

const FilterInput = <T extends string | number>({
  title,
  filterOptions,
  seletedValue,
  onFilterChange,
  icon,
  type = "checkbox",
}: FilterInputProps<T>) => {
  const selectedOptions = filterOptions.filter((v) =>
    seletedValue.includes(v.value),
  );

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className="flex items-center gap-2 rounded-md border-dashed border-slate-300 px-3 py-2 hover:cursor-pointer"
          >
            {icon}
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-foreground font-medium">{title}</span>
            </div>

            {selectedOptions.length > 0 && (
              <div className="ml-1 flex items-center gap-1 border-l pl-2">
                {selectedOptions.length <= 1 ? (
                  <Badge variant="secondary" className="px-1 font-normal">
                    {selectedOptions[0]?.label}
                  </Badge>
                ) : selectedOptions.length === 2 ? (
                  selectedOptions.map((item) => (
                    <Badge
                      key={item.value}
                      variant="secondary"
                      className="px-1 font-normal"
                    >
                      {item.label}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="px-1 font-normal">
                    เลือกแล้ว {selectedOptions.length} รายการ
                  </Badge>
                )}
              </div>
            )}
            <ChevronDown className="size-4 opacity-50" />
          </Badge>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          {type === "checkbox" ? (
            filterOptions.map((option, i) => (
              <DropdownMenuCheckboxItem
                key={i}
                checked={seletedValue.includes(option.value)}
                onCheckedChange={() => onFilterChange(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <DropdownMenuRadioGroup
              value={String(seletedValue[0])}
              onValueChange={(val) => onFilterChange(val as T)}
            >
              {filterOptions.map((option, i) => (
                <DropdownMenuRadioItem key={i} value={String(option.value)}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterInput;
