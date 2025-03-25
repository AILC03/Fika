import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../views/auth/Login";
import Sidebar from "../components/sidebar";
import Home from "../views/home/General";
import Admin from "../views/home/Admin";
import PrivateRoute from "../views/auth/PrivateRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Sidebar */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Sidebar />}>
            <Route path="home" element={<Home />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
