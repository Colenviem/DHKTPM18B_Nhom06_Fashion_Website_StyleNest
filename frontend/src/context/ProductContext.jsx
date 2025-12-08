import React, { createContext } from "react";
import axiosClient from "../api/axiosClient";

export const CategoriesContext = createContext();



export const getAllProducts = async () => {
  try {

    const response = await axiosClient.get("/products");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu.");
  }
};

export const getProductById = async (id) => {
  try {

    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi fetch chi tiết sản phẩm:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu sản phẩm.");
  }
};

export const getProductsByCategoryId = async (categoryId) => {
  try {

    const response = await axiosClient.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi fetch sản phẩm theo danh mục:", error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu danh mục.");
  }
};

export const saveOrUpdateProduct = async (productData) => {
  try {

    const response = await axiosClient.post("/products/updatePRO", productData);
    const data = response.data;

    return {
      type: "success",
      message: data.message || "Lưu sản phẩm thành công",
      product: data.data,
    };

  } catch (error) {
    console.error("❌ Lỗi khi lưu/cập nhật sản phẩm:", error);

    if (error.response && error.response.data) {
      const data = error.response.data;
      if (data.status === "error" && data.errors) {
        return Promise.reject({
          type: "validation",
          message: data.message,
          errors: data.errors,
        });
      } else {
        return Promise.reject({
          type: "server",
          message: data.message || "Lỗi không xác định từ server",
        });
      }
    }

    return Promise.reject({
      type: "network",
      message: "Không thể kết nối tới server hoặc thực hiện lưu/cập nhật dữ liệu.",
    });
  }
};


export const getAllCategories = async () => {
  try {
    const response = await axiosClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi fetch danh mục:", error);
    throw new Error("Không thể tải danh sách danh mục.");
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await axiosClient.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm danh mục:", error);
    throw new Error("Không thể thêm danh mục mới.");
  }
};


export const getReviewsByProductId = async (productId) => {
  if (!productId) {
    throw new Error("❌ Product ID không được để trống.");
  }

  try {
    const response = await axiosClient.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi fetch đánh giá cho sản phẩm ${productId}:`, error);
    throw new Error("Không thể kết nối tới server hoặc tải dữ liệu đánh giá.");
  }
};

export const getAllBrands = async () => {
  try {
    const response = await axiosClient.get("/brands");
    return response.data; // Trả về mảng các brand
  } catch (error) {
    console.error("Lỗi khi fetch danh sách thương hiệu:", error);
    throw new Error("Không thể tải danh sách thương hiệu từ server.");
  }
};

export const addBrand = async (brandData) => {
  try {
    const response = await axiosClient.post("/brands", brandData);
    return {
      success: true,
      message: response.data.message || "Thêm thương hiệu thành công!",
      brand: response.data // hoặc response.data.data tùy backend trả về
    };
  } catch (error) {
    console.error("Lỗi khi thêm thương hiệu:", error);

    if (error.response?.data) {
      const errData = error.response.data;
      return Promise.reject({
        success: false,
        type: "validation",
        message: errData.message || "Dữ liệu không hợp lệ",
        errors: errData.errors || null,
      });
    }

    return Promise.reject({
      success: false,
      type: "network",
      message: "Không thể kết nối đến server. Vui lòng thử lại sau.",
    });
  }
};