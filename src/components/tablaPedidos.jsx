import { useEffect, useState } from "react";
import { X } from "lucide-react";

const getPedidos = async () => {
  return [
    {
      celular: "6641234567",
      email: "A@usuario.123",
      nombre: "Juan Gonzales",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6645551234",
      email: "A@usuario.123",
      nombre: "Ernesto Peña",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6649876543",
      email: "A@usuario.123",
      nombre: "Juan Aguirre",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6647890123",
      email: "A@usuario.123",
      nombre: "Matilda Lopez",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6642345678",
      email: "A@usuario.123",
      nombre: "David Benavides",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6648765432",
      email: "A@usuario.123",
      nombre: "Omar Salcedo",
      fechaRecoleccion: "12 - 03 - 2025",
    },
    {
      celular: "6643456789",
      email: "A@usuario.123",
      nombre: "Santiago Lugo",
      fechaRecoleccion: "12 - 03 - 2025",
    },
  ];
};

export default function PedidosTable({ onClose }) {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // Posición inicial
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const datos = await getPedidos();
      setPedidos(datos);
    };
    fetchData();
  }, []);

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.celular.includes(busqueda)
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "fit-content",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="p-4 w-full bg-orange-100 shadow-amber-900 rounded-lg shadow-xl cursor-move"
        onMouseDown={handleMouseDown}
      >
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
          <button
            onClick={onClose} // Llama a la función para cerrar el componente
            className="p-2 ml-12 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto shadow-lg shadow-amber-900 rounded-md">
          <table className="min-w-full table-auto text-sm bg-yellow-50 rounded-lg">
            <thead className="bg-yellow-200">
              <tr>
                <th className="p-2 text-left"/>
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
                      <button className="text-red-500 hover:underline">
                        🗑
                      </button>
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
    </div>
  );
}
