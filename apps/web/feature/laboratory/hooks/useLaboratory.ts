import api from "@/lib/axios";
import { Laboratory, LaboratorySortType } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

export const useGetLaboratory = (
  bookingDate?: string,
  slot?: LaboratorySortType,
) => {
  return useQuery({
    queryKey: ["laboratory", bookingDate, slot],
    queryFn: async () => {
      console.log(bookingDate);
      console.log(slot);

      if (bookingDate && slot) {
        const { data } = await api.get<Laboratory[]>("/laboratory/available", {
          params: {
            bookingDate,
            slot,
          },
        });

        return data;
      } else {
        const { data } = await api.get<Laboratory[]>("/laboratory");
        return data;
      }
    },
  });
};
