import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../views/auth/Login";
import Sidebar from "../components/sidebar";
import Home from "../views/home/General";
import Admin from "../views/home/Admin";
import { AuthProvider } from "../context/authContext";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Login />} />

          {/* Rutas protegidas */}
          {/* <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "caja"]}>
                <Sidebar />
              </ProtectedRoute>
            }
          >
            <Route
              path="/home"
              element={
                <ProtectedRoute allowedRoles={["admin", "caja"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route> */}
          {/* Rutas protegidas sin roles específicos */}
          <Route
            element={
              <ProtectedRoute>
                {" "}
                <Sidebar />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
