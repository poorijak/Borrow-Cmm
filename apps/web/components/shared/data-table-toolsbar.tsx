import React from "react";
import { Button } from "../ui/button";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import FilterInput from "./filter-input";
import { Input } from "../ui/input";
import DataTableSearch from "./data-table-search";

interface filterConfigType<T> {
  key: string;
  title: string;
  icon: React.ReactNode;
  option: { label: string; value: T }[];
  type?: "checkbox" | "radio";
}

interface DataTableToolsBarProps<T> {
  handelFillter: (key: string, val: string, isSingle: boolean) => void;
  sp: ReadonlyURLSearchParams;
  filterConfig: filterConfigType<T>[];
  handleClearAll: () => void;
  searchbarPlacehodler?: string;
}

const DataTableToolsBar = <T extends string | number>({
  handelFillter,
  sp,
  filterConfig,
  handleClearAll,
  searchbarPlacehodler,
}: DataTableToolsBarProps<T>) => {
  return (
    <div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">กรอง</p>
          <Button variant="link" onClick={handleClearAll}>
            <Icon icon="heroicons:arrow-path-20-solid" />
            รีเซ็ตตัวกรอง
          </Button>
        </div>
        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-3 overflow-auto pb-5">
            {filterConfig
              .sort((a, b) => {
                const aCount =
                  sp.get(a.key)?.split(",").filter(Boolean).length || 0;

                const bCount =
                  sp.get(b.key)?.split(",").filter(Boolean).length || 0;

                return bCount - aCount;
              })
              .map(({ key, title, icon, option, type }) => {
                const rawValue = sp.get(key) || "";
                const selectedValuesArray = rawValue ? rawValue.split(",") : [];

                return (
                  <FilterInput
                    key={key}
                    title={title}
                    icon={icon}
                    filterOptions={option}
                    seletedValue={selectedValuesArray as T[]}
                    onFilterChange={(val) =>
                      handelFillter(key, String(val), type === "radio")
                    }
                    type={type}
                  />
                );
              })}
          </div>
          <div>
            <DataTableSearch placeholder={searchbarPlacehodler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableToolsBar;
