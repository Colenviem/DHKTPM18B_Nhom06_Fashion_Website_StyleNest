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
    // Sử dụng endpoint theo yêu cầu của bạn
    const url = `${API_BASE_URL}/products/updatePRO`; 

    try {
        const response = await fetch(url, {
            // Sử dụng POST method để gửi dữ liệu cập nhật/lưu
            method: 'POST', 
            // Báo cho server biết body là JSON
            headers: { 
                'Content-Type': 'application/json',
            },
            // Chuyển đối tượng productData thành chuỗi JSON để gửi đi
            body: JSON.stringify(productData), 
        });

        if (!response.ok) {
            // Xử lý các mã lỗi như 400 Bad Request, 500 Internal Server Error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Server sẽ trả về đối tượng Product đã được xử lý (lưu hoặc cập nhật)
        return data; 
    } catch (error) {
        console.error("❌ Lỗi khi lưu/cập nhật sản phẩm:", error);
        throw new Error("Không thể kết nối tới server hoặc thực hiện lưu/cập nhật dữ liệu.");
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