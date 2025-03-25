// filepath: d:\sopa\Frontend\Fika\src\components\sidebar.jsx
import { Link, Outlet } from "react-router-dom";
import Banner2 from "../Assets/Banner2.jpg";

const Sidebar = () => {
  const routes = [
    { path: "/home", label: "Home" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-32 bg-amber-900 text-white p-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="block px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg transition"
          >
            {route.label}
          </Link>
        ))}
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
