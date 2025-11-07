import React, { createContext, useState, useEffect } from "react";
export const CloudinaryContext = createContext();
const API_BASE_URL = "http://localhost:8080/api";

export const uploadImage = async (file) => {
  const url = `${API_BASE_URL}/cloudinary/uploadImage`; 

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageUrl = await response.text(); 
    return imageUrl;
  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
    throw new Error("Không thể upload ảnh lên server.");
  }
};

export const addVariantImage = (product, variantIndex, imageUrl) => {
  const newVariants = [...product.variants];
  newVariants[variantIndex].images = [
    ...(newVariants[variantIndex].images || []),
    imageUrl,
  ];
  return { ...product, variants: newVariants };
};

export const removeVariantImage = (product, variantIndex, imageIndex) => {
  const newVariants = [...product.variants];
  newVariants[variantIndex].images.splice(imageIndex, 1);
  return { ...product, variants: newVariants };
};

export const updateVariantImage = (product, variantIndex, imageIndex, newUrl) => {
  const newVariants = [...product.variants];
  newVariants[variantIndex].images[imageIndex] = newUrl;
  return { ...product, variants: newVariants };
};

