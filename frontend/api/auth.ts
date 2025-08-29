const API_BASE_URL = "http://localhost:5000";

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
    });
    const data = await response.text();
    console.log("Backend connection test:", data);
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login with:", { email, password });
    console.log("API URL:", `${API_BASE_URL}/auth/login`);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", response.status);

    const data = await response.json();
    console.log("Login response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
