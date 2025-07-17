import { setSession } from "../context/setUser";

const loginUser = async (user, password) => {
  const API = import.meta.env.VITE_URI;

  try {
    const response = await fetch(`${API}/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ user, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Login fallido" };
    }

    // Guardar sesión en localStorage (sencillo)
    setSession(data.user);

    console.log("XD no falle");

    return { success: true, user: data.user };
  } catch (error) {
    console.log("ERROR:", error);
    return {
      success: false,
      message: "Error durante login",
      error: error.message,
    };
  }
};
export default loginUser;
