import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
        <Route element={<Sidebar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
