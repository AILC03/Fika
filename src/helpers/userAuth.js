import { setSession } from "../context/setUser";

const loginUser = async (user, password) => {
  const API = import.meta.env.VITE_URI;

  try {
    const response = await fetch(`${API}/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante para que guarde cookie httpOnly
      body: JSON.stringify({ user, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login fallido" };
    }

    // Guardar sesión en localStorage (sencillo)
    setSession(data.user);

    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      message: "Error durante login",
      error: error.message,
    };
  }
};
export default loginUser;
