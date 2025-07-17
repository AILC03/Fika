const API = import.meta.env.VITE_URI;

const logout = async () => {
  const out = await fetch(`${API}/users/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (out.ok) {
    window.location.href= ("/")
  }
};

export const setSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("user");
  logout();
};
