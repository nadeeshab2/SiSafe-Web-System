import api from "./axios";

export const detectText = async (text) => {
  const response = await api.post("/api/predict", { text });
  return response.data;
};

export const detectFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/file-predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};