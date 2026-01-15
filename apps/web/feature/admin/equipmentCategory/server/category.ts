import api from "@/lib/axios";
import type { CategoryFormValue, CategoryRequest } from "@repo/schemas";
import {
  ActiveStatus,
  CategoriesResponse,
  uploadImageResponse,
} from "@repo/types";

export const upsertCategory = async (categoryData: CategoryFormValue) => {
  let imageKey = categoryData.imageKey;

  if (categoryData.imageFile) {
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

    imageKey = uploadRes.key;
  }

  if (!imageKey) {
    throw new Error("Image key is require");
  }
  const payload: CategoryRequest = {
    title: categoryData.title,
    imageKey,
  };

  const { data } = categoryData.categoryId
    ? await api.patch(`/categories/${categoryData.categoryId}`, payload)
    : await api.post("categories", payload);

  return data;
};

export const getCategories = async (
  status?: ActiveStatus,
  page: number = 1
) => {
  try {
    const { data } = await api.get<CategoriesResponse>("/categories", {
      params: { status, page },
    });

    return data;
  } catch (error) {
    console.error("Error to fetch categories : ", error);
    throw error;
  }
};
