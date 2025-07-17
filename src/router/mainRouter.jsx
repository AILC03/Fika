import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "../views/auth/Login";
import Sidebar from "../components/sidebar";
import Home from "../views/home/General";
import Admin from "../views/home/Admin";
import Report from "../views/home/Reports";

const AppRouter = () => {
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
    return <Navigate to="/" />;
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

  if (currentPath !== "/" && !isAllowed(currentPath)) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default AppRouter;
