const loginUser = async (user, password) => {
  const API = import.meta.env.VITE_URI;

  try {
    const response = await fetch(`${API}/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, password }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" };
    }
    return { success: true, ...data };
  } catch (error) {
    return {
      success: false,
      message: "Error during login",
      error: error.message,
    };
  }
};

export default loginUser;
