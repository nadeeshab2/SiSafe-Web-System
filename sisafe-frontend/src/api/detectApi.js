import api from "./axios";

export const detectText = async (text) => {
  const response = await api.post("/api/predict", { text });
  return response.data;
};