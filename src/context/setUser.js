const API = import.meta.env.VITE_URI;

const logout = async () => {
  const out = await fetch(`${API}/users/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const setSession = (user) => {
  console.log("Sesion iniciada:", user);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("user");
  logout();
};
