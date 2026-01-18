import api from "@/lib/axios";
import { EquipmentFormValue, EquipmentRequest } from "@repo/schemas";
import { uploadImageResponse } from "@repo/types";

export const upsertEquipment = async (equipmentData: EquipmentFormValue) => {
  let imageKey = equipmentData.imageKey;

  if (equipmentData.imageFile) {
    const formData = new FormData();
    formData.append("file", equipmentData.imageFile);

    const { data: uploadRes } = await api.post<uploadImageResponse>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      },
    );

    imageKey = uploadRes.key;
  }

  if (!imageKey) {
    throw new Error("Image key is require");
  }

  const payload: EquipmentRequest = {
    title: equipmentData.title,
    description: equipmentData.description,
    subCategoryId: equipmentData.subCategoryId,
    totalStock: equipmentData.totalStock,
    imageKey,
    mainCategoryId: equipmentData.mainCategoryId,
  };

  const { data } = await api.post("equipment", payload);

  return data;
};
