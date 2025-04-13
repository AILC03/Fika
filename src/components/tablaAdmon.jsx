import { useEffect, useState } from "react";

const getPedidosFromAPI = async () => {
  // Simulación de una respuesta de API (esto puede ser reemplazado con fetch)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          celular: "6641234567",
          email: "A@usuario.123",
          nombre: "Juan Gonzales",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6645551234",
          email: "A@usuario.123",
          nombre: "Ernesto Peña",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6649876543",
          email: "A@usuario.123",
          nombre: "Juan Aguirre",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6647890123",
          email: "A@usuario.123",
          nombre: "Matilda Lopez",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6642345678",
          email: "A@usuario.123",
          nombre: "David Benavides",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6648765432",
          email: "A@usuario.123",
          nombre: "Omar Salcedo",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
        {
          celular: "6643456789",
          email: "A@usuario.123",
          nombre: "Santiago Lugo",
          fechaRecoleccion: "12 - 03 - 2025",
          ejemplo: "ejemplo",
        },
      ]);
    }, 500);
  });
};

export default function MapApi() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const datos = await getPedidosFromAPI();
      setPedidos(datos);
    };
    fetchData();
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.celular.includes(busqueda)
  );

  return (
    <div className="p-4 bg-orange-100 shadow-amber-900 rounded-lg shadow-xl w-full max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por correo o celular"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-2 py-2 border bg-white rounded-md w-1/2"
        />
        <button className="px-4 py-1 ml-28 bg-amber-900 text-white rounded-md hover:bg-amber-600">
          Buscar
        </button>
        <div className="relative">
          <select className="px-2 py-2 ml-28 w-32 border rounded-md bg-white">
            <option>Filtro</option>
            <option>Correo</option>
            <option>Celular</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-lg shadow-amber-900 rounded-md">
        <table className="min-w-full table-auto text-sm bg-yellow-50 rounded-lg">
          <thead className="bg-yellow-200">
            <tr>
              <th className="p-2 text-left" />
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Correo</th>
              <th className="p-2 text-left">Celular</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length ? (
              pedidosFiltrados.map((pedido, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-yellow-100" : "bg-yellow-50"
                  }`}
                >
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">{pedido.nombre}</td>
                  <td className="p-2 lowercase">{pedido.email}</td>
                  <td className="p-2">{pedido.celular}</td>
                  <td className="p-2">{pedido.fechaRecoleccion}</td>
                  <td className="p-2 flex space-x-2">
                    <button className="text-red-500 hover:underline">🗑</button>
                    <button className="text-blue-500 hover:underline">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No hay resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
