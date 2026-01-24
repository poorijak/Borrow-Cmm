"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const DataTableSearch = ({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const sp = useSearchParams();

  const [value, setValue] = useState(sp.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(sp.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("eqPage", "1");
      router.push(`${pathName}?${params.toString()}`, { scroll: true });
    }, 10);
    return () => clearTimeout(timer);
  }, [value, pathName, router]);

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(className, "pl-9 placeholder:text-xs")}
      />
    </div>
  );
};

export default DataTableSearch;
