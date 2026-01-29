"use client";

import { useGetCategories } from "@/feature/admin/equipmentCategory/hooks/useCategory";
import { getPublicUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategorySelector = () => {
  const { data } = useGetCategories();
  const categories = data?.data ?? [];



  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/equipment/${category.id}`}
          className="group"
        >
          <div className="border-border relative h-40 overflow-hidden rounded-md border bg-[url('/images/auth/auth-bg-2.webp')] bg-cover bg-bottom transition-colors duration-300">
            <h2 className="absolute top-4 left-5 z-40 text-4xl font-bold whitespace-nowrap text-white group-hover:text-white md:text-5xl">
              {category.title}
            </h2>

            <div className="absolute top-3 right-10 size-36 transition-transform duration-200 group-hover:scale-110 md:top-0 md:size-40">
              <Image
                alt="Preview-category"
                src={getPublicUrl(category.mainImage)}
                fill
                unoptimized
                loading="lazy"
                className="object-contain object-right"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategorySelector;
