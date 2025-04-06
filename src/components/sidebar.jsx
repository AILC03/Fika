// filepath: d:\sopa\Frontend\Fika\src\components\sidebar.jsx
import { Link, Outlet } from "react-router-dom";
import Banner2 from "../Assets/Banner2.jpg";
import Logo from "../Assets/logo1.png"; // Ruta del logo
import AccountIcon from "../Assets/account_avatar_face_man_people_profile_user_icon_123197.png"; // Ruta del ícono de cuenta
import HomeIcon from "../Assets/32422shortcake_98853.png"; // Ruta del ícono de "Home"
import AdminIcon from "../Assets/agenda_icon_129512.png"; // Ruta del ícono de "Admin"

const Sidebar = () => {
  const routes = [
    { path: "/home", icon: HomeIcon },
    { path: "/admin", icon: AdminIcon },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-24 bg-amber-900 text-white p-4 flex flex-col items-center justify-between">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={Logo}
            alt="Logo de Fika"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Links de navegación */}
        <div className="flex flex-col space-y-8 w-full">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="flex justify-center items-center px-4 py-8 bg-amber-100 hover:bg-amber-300 text-white font-bold rounded-full transition"
            >
              <img
                src={route.icon}
                alt="Icono"
                className="absolute w-15 h-15 object-contain"
              />
            </Link>
          ))}
        </div>

        {/* Ícono de cuenta */}
        <div className="flex justify-center mt-4 bg-amber-100 p-1 w-14 rounded-full">
          <img
            src={AccountIcon}
            alt="Ícono de cuenta"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Contenido dinámico de las rutas */}
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${Banner2})` }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
