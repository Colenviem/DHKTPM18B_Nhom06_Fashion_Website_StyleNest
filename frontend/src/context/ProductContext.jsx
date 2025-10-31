import React, { createContext, useState, useEffect } from "react";

// ✅ Tạo Context
export const CategoriesContext = createContext();

const API_BASE_URL = "http://localhost:8080/api";

export const getAllProducts = async () => {
  const url = `${API_BASE_URL}/products`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về mảng sản phẩm
  } catch (error) {
    console.error("❌ Lỗi khi fetch dữ liệu sản phẩm:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu.");
  }
};

export const getProductById = async (id) => {
  const url = `${API_BASE_URL}/products/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về object chi tiết sản phẩm
  } catch (error) {
    console.error("❌ Lỗi khi fetch chi tiết sản phẩm:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu sản phẩm.");
  }
};

export const getProductsByCategoryId = async (categoryId) => {
  const url = `${API_BASE_URL}/products/category/${categoryId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về danh sách sản phẩm thuộc category đó
  } catch (error) {
    console.error("❌ Lỗi khi fetch sản phẩm theo danh mục:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu danh mục.");
  }
};
