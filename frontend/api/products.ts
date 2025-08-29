const API_BASE_URL = "http://localhost:5000";

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      return data.products || data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      return data.product || data;
    } catch (error) {
      throw error;
    }
  },
};
