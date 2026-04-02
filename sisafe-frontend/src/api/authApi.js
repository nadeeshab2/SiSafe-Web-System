import api from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/api/auth/login", userData);
  return response.data;
};

export const getGoogleLoginUrl = () => {
  return "http://127.0.0.1:5000/api/auth/google/login";
};