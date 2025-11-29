import React, { createContext } from "react";
import axiosClient from "../api/axiosClient";

export const CloudinaryContext = createContext();

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await axiosClient.post("/cloudinary/uploadImage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;

  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
    throw new Error("Không thể upload ảnh lên server.");
  }
};


export const addVariantImage = (product, variantIndex, imageUrl) => {
  const newVariants = [...product.variants];

  if (!newVariants[variantIndex].images) {
    newVariants[variantIndex].images = [];
  }
  newVariants[variantIndex].images.push(imageUrl);
  return { ...product, variants: newVariants };
};

export const removeVariantImage = (product, variantIndex, imageIndex) => {
  const newVariants = [...product.variants];
  if (newVariants[variantIndex]?.images) {
    newVariants[variantIndex].images.splice(imageIndex, 1);
  }
  return { ...product, variants: newVariants };
};

export const updateVariantImage = (product, variantIndex, imageIndex, newUrl) => {
  const newVariants = [...product.variants];
  if (newVariants[variantIndex]?.images) {
    newVariants[variantIndex].images[imageIndex] = newUrl;
  }
  return { ...product, variants: newVariants };
};