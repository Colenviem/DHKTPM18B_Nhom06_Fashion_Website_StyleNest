import axios from "axios";
import { createContext } from "react";

export const ReviewsContext = createContext();

export const likeReview = async (reviewId, userId) => {
  await axios.post(`/api/reviews/${reviewId}/like`, null, {
    params: { userId }
  });
};

export const unlikeReview = async (reviewId, userId) => {
  await axios.delete(`/api/reviews/${reviewId}/like`, {
    params: { userId }
  });
};

export const checkLiked = async (reviewId, userId) => {
  const res = await axios.get(`/api/reviews/${reviewId}/liked`, {
    params: { userId }
  });
  return res.data;
};