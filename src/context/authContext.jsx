import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authUser } from "../helpers/userAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cambiar el verifyAuth en el useEffect para simular un usuario
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Simular un usuario admin (comentar para desarrollo)
        setUser({ rol: "admin" }); // <-- Esta línea simula estar logueado
        return;

        // Comentar todo este bloque:
        /*
      const response = await fetch('https://api-legisconnect-production.up.railway.app/users/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
      */
      } catch (error) {
        console.error("Error verifying auth:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authUser(email, password);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(
        "https://api-legisconnect-production.up.railway.app/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
