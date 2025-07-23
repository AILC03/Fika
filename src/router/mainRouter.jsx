import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import { validationToken } from "../context/setUser";
import Login from "../views/auth/Login";
import Sidebar from "../components/sidebar";
import Home from "../views/home/General";
import Admin from "../views/home/Admin";
import Report from "../views/home/Reports";

const AppRouter = () => {
  useEffect(() => {
    const handleInteraction = () => {
      if (window.location.pathname !== "/") {
        validationToken();
      }
    };

    window.addEventListener("click", handleInteraction);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Sidebar />}>
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/report" element={<Report />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.rol) {
    window.location.href = "/";
  }

  const allowedRoutes = {
    ADMIN: ["/home", "/admin", "/report"],
    CAJA: ["/home", "/report"],
  };

  const isAllowed = (path) => {
    if (user.rol === "ADMIN") {
      return true;
    }
    return allowedRoutes[user.rol]?.includes(path);
  };

  const currentPath = window.location.pathname;

  if (!isAllowed(currentPath) && currentPath !== "/") {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default AppRouter;
