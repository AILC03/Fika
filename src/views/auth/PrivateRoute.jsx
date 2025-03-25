import { Navigate, Outlet } from "react-router-dom";
//Descomentar cuando este la api
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const authToken = Cookies.get("token"); // Obtener la cookie de autenticación

  // Si no hay token, redirigir al login, desscomentar cuando este la api
  return authToken ? <Outlet /> : <Navigate to="/" />;
  //return <Outlet />;
};

export default PrivateRoute;
