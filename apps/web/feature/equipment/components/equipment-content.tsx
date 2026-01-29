import { CategoryDetailResponse } from "@repo/types";
import React from "react";
import EquipmentCard from "./equipment-card";
import SwiperWrapper from "@/components/shared/swiper-wrapper";

interface EquipmentContentProps {
  data: CategoryDetailResponse | undefined;
}

const EquipmentContent = ({ data }: EquipmentContentProps) => {
  const subCategory = data?.category?.subCategory ?? [];

  return (
    <div className="w-full">
      {subCategory?.map(
        (s) =>
          s.equipments.length > 1 && (
            <div key={s.id} className="mb-10 max-w-7xl space-y-5">
              <div className="bg-primary/90 w-fit rounded-md px-5 py-3">
                <h2 className="text-2xl font-bold text-white">{s.title}</h2>
              </div>
              <div className="w-full">
                <SwiperWrapper>
                  {s.equipments.map((e) => {
                    const availableQty =
                      e.totalStock - (e.borrowedQty - e.reservedQty);

                    return (
                      <div key={e.id} className="col-span-1 md:col-span-2">
                        <EquipmentCard
                          title={e.title}
                          totalStock={e.totalStock}
                          image={e.mainImage}
                          availableQty={availableQty}
                          description={e.description}
                          status={e.status}
                        />
                      </div>
                    );
                  })}
                </SwiperWrapper>
              </div>
            </div>
          ),
      )}
    </div>
  );
};

export default EquipmentContent;
