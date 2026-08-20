import api from "./api";

// Register
export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Login
export const loginUser = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

// Profile
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

// Reset Password
export const resetPasswordUser = async (resetData) => {
  const { data } = await api.post("/auth/reset-password", resetData);
  return data;
};