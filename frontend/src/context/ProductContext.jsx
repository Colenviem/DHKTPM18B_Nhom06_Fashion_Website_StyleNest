import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
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
    return data; 
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


export const saveOrUpdateProduct = async (productData) => {
  const url = `${API_BASE_URL}/products/updatePRO`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    // 🧩 Nếu backend trả lỗi validation (HTTP 400)
    if (!response.ok) {
      if (data?.status === "error" && data?.errors) {
        // Trả lỗi chi tiết để frontend hiển thị theo từng trường
        return Promise.reject({
          type: "validation",
          message: data.message,
          errors: data.errors,
        });
      } else {
        // Lỗi khác (500, 404,...)
        return Promise.reject({
          type: "server",
          message: data?.message || "Lỗi không xác định từ server",
        });
      }
    }

    // ✅ Thành công
    return {
      type: "success",
      message: data.message || "Lưu sản phẩm thành công",
      product: data.data,
    };

  } catch (error) {
    console.error("❌ Lỗi khi lưu/cập nhật sản phẩm:", error);
    return Promise.reject({
      type: "network",
      message: "Không thể kết nối tới server hoặc thực hiện lưu/cập nhật dữ liệu.",
    });
  }
};


// --- 🏷️ Các hàm xử lý Danh mục (Categories) 🏷️ ---

export const getAllCategories = async () => {
  const url = `${API_BASE_URL}/categories`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Lỗi khi fetch danh mục:", error);
    throw new Error("Không thể tải danh sách danh mục.");
  }
};


export const addCategory = async (categoryData) => {
  const url = `${API_BASE_URL}/categories`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Lỗi khi thêm danh mục:", error);
    throw new Error("Không thể thêm danh mục mới.");
  }
};