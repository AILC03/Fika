import Banner from "../../Assets/Banner1.jpg";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Variables de estado para manejar los campos del formulario y el mensaje de error
  const [showPassword, setShowPassword] = useState(false);
  const [usr, setUsr] = useState(""); // Usuario
  const [pwd, setPwd] = useState(""); // Contraseña
  const [error, setError] = useState(""); // Mensaje de error

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!usr || !pwd) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-legisconnect-production.up.railway.app/users/auth",
        {
          method: "POST",
          credentials: "include", // Para cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: usr,
            password: pwd,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso.");
        navigate("/home"); // Redirigir al home
      } else {
        setError(data.message || "Error en la validación, intenta de nuevo.");
      }
    } catch (err) {
      setError("El servidor no responde. Intenta más tarde.");
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col lg:flex-row"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      {/* Sección izquierda */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
        <img
          src="/src/Assets/logo1.png"
          alt="Bienvenida"
          className="w-72 h-72 object-contain"
        />
      </div>

      {/* Sección derecha */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
        <div className="w-96 p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Usuario */}
            <div className="mb-1.5">
              <label className="block text-amber-900 font-bold text-lg mb-2">
                Usuario
              </label>
              <input
                id="usr"
                type="text"
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Ingresa tu usuario"
                value={usr}
                onChange={(e) => setUsr(e.target.value)}
              />
            </div>
            <span className="text-gray-500">No olvides tu usuario.</span>

            {/* Contraseña */}
            <div className="mb-1.5 mt-14 relative">
              <label className="block text-amber-900 font-bold text-lg mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="pwd"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200 pr-10"
                  placeholder="********"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <span className="text-gray-500">Verifica tu contraseña.</span>

            {/* Mensaje de error */}
            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="mt-4 w-full bg-amber-900 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
