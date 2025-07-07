import { Link, Outlet, useLocation } from "react-router-dom";
import Banner2 from "../Assets/Banner2.jpg";
import Logo from "../Assets/logo1.png";
import adm from "../Assets/agenda_icon_129512.png";
import can from "../Assets/32422shortcake_98853.png";
import rep from "../Assets/report_102120.png";
import AccountIcon from "../Assets/account_avatar_face_man_people_profile_user_icon_123197.png";
import { LogOut } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const allRoutes = [
    {
      path: "/home",
      icon: (
        <img
          src={can}
          alt="Inicio"
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      ),
      label: "Inicio",
    },
    {
      path: "/report",
      icon: (
        <img
          src={rep}
          alt="Reportes"
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      ),
      label: "Reportes",
    },
    {
      path: "/admin",
      icon: (
        <img
          src={adm}
          alt="Admin"
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      ),
      label: "Admin",
    },
  ];

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${Banner2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Sidebar */}
      <div className="w-20 md:w-24 bg-amber-900 text-white p-4 flex flex-col items-center justify-between h-auto md:h-screen">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={Logo}
            alt="Logo de Fika"
            className="w-14 md:w-16 h-14 md:h-16 object-contain"
          />
        </div>

        {/* Links de navegación */}
        <div className="flex flex-col space-y-8 w-full">
          {allRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`flex justify-center items-center w-14 h-14 md:w-16 md:h-16 rounded-full transition mx-auto ${
                location.pathname === route.path
                  ? "bg-amber-300"
                  : "bg-amber-100 hover:bg-amber-300"
              }`}
            >
              {route.icon}
            </Link>
          ))}
        </div>

        {/* Ícono de cuenta con hover para logout */}
        <div
          className="relative flex justify-center mt-4 bg-amber-100 p-1 w-12 md:w-14 rounded-full transition cursor-pointer"
          onClick={() => setShowLogout((prev) => !prev)}
          tabIndex={0}
          onBlur={() => setShowLogout(false)}
        >
          {/* Ícono de usuario */}
          <img
            src={AccountIcon}
            alt="Ícono de cuenta"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />

          {showLogout && (
            <button
              onClick={() => alert("Cerrar sesión (no implementado)")}
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex items-center bg-amber-700 text-white px-3 py-1 rounded-lg whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Cerrar sesión
            </button>
          )}
        </div>
      </div>

      {/* Contenido dinámico de las rutas */}
      <div className="flex-1 min-h-0 max-h-screen overflow-auto bg-cover bg-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
