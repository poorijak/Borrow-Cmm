import api from "@/lib/axios";
import type { CategoryFormValue, CategoryRequest } from "@repo/schemas";
import { ActiveStatus, Categories, uploadImageResponse } from "@repo/types";

export const createCategory = async (categoryData: CategoryFormValue) => {
  const formData = new FormData();
  formData.append("file", categoryData.imageFile);

  const { data: uploadRes } = await api.post<uploadImageResponse>(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-type": "multipart/form-data",
      },
    }
  );

  const payload: CategoryRequest = {
    title: categoryData.title,
    imageKey: uploadRes.key,
  };

  const { data } = await api.post("/categories", payload);

  return data;
};

export const getCategories = async (status?: ActiveStatus) => {
  try {
    const { data } = await api.get<Categories[]>("/categories", {
      params: { status },
    });
    return data;
  } catch (error) {
    console.error("Error to fetch categories : ", error);
    throw error;
  }
};
