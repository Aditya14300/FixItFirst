import api from "./api";

// Fetch all active categories from MongoDB database
export const getCategories = async () => {
  try {
    const { data } = await api.get("/categories");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, categories: [] };
  }
};
