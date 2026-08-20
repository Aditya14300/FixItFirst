import api from "./api";

// Fetch all services from MongoDB database
export const getServices = async () => {
  try {
    const { data } = await api.get("/services");
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return { success: false, services: [] };
  }
};

// Fetch services by category ID from database
export const getServicesByCategory = async (categoryId) => {
  try {
    const { data } = await api.get(`/services/category/${categoryId}`);
    return data;
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return { success: false, services: [] };
  }
};
