import Banner from "../../Assets/Banner1.jpg";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginUser from "../../helpers/userAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser(user, password);

      if (result.success) {
        navigate("/home");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
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
            <div className="mb-1.5">
              <label className="block text-amber-900 font-bold text-lg mb-2">
                Usuario
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Ingresa tu usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <span className="text-gray-500">No olvides tu usuario.</span>

            <div className="mb-1.5 mt-14 relative">
              <label className="block text-amber-900 font-bold text-lg mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200 pr-10"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-amber-900 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
