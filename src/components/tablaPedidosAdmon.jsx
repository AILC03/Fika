import { useEffect, useState } from "react";
import ConfirmModal from "./alerta"; // Importa el componente de alerta
import { X, Edit, Trash2 } from "lucide-react"; // Importa los iconos necesarios

const getPedidos = async () => {
  return [
    {
      celular: "6641234567",
      email: "A@usuario.123",
      nombre: "Juan Gonzales",
      fechaRecoleccion: "12 - 03 - 2025",
      productos: [
        {
          categoria: "Clasico",
          sabor: "Chocolate",
          tamano: '8"',
          escritura: "Feliz cumple",
        },
      ],
    },
    {
      celular: "6645551234",
      email: "A@usuario.123",
      nombre: "Ernesto Peña",
      fechaRecoleccion: "12 - 03 - 2025",
      productos: [
        {
          categoria: "Tradicional",
          sabor: "3 leches",
          tamano: '12"',
        },
      ],
    },
  ];
};

export default function PedidosTable() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null); // Pedido a eliminar

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

  const handleConfirm = () => {
    // Lógica para eliminar el pedido
    setPedidos((prevPedidos) =>
      prevPedidos.filter((pedido) => pedido !== pedidoAEliminar)
    );
    setShowModal(false);
    setPedidoAEliminar(null);
  };

  return (
    <div className="p-4 bg-orange-100 shadow-amber-900 rounded-lg shadow-xl w-full max-w-[100rem] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-amber-900">Pedidos</h2>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar por correo o celular"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-2 py-2 border bg-white rounded-md w-1/2"
        />
      </div>

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
                    <button
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="text-green-700 hover:underline"
                    >
                      Ver productos
                    </button>
                    <button
                      onClick={() => {
                        setPedidoAEliminar(pedido);
                        setShowModal(true); // Muestra el modal al hacer clic
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={16} />
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

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)} // Cierra el modal
        onConfirm={handleConfirm} // Confirma la eliminación
      />

      {/* Modal emergente de productos */}
      {pedidoSeleccionado && (
        <div className="absolute top-10 right-10 z-50 bg-amber-50 border-2 border-amber-300 shadow-amber-800 shadow-xl rounded-xl p-6 w-[26rem] max-h-[32rem] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-amber-900">
              Productos de {pedidoSeleccionado.nombre}
            </h3>
            <button
              onClick={() => setPedidoSeleccionado(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X />
            </button>
          </div>
          <ul className="space-y-4">
            {pedidoSeleccionado.productos.map((producto, idx) => (
              <li
                key={idx}
                className="bg-yellow-100 border border-yellow-300 p-3 rounded-md shadow-md"
              >
                <h4 className="font-bold text-lg text-amber-800 mb-2">
                  Pastel {idx + 1}
                </h4>
                {Object.entries(producto).map(([clave, valor], i) => (
                  <div key={i}>
                    <span className="font-semibold capitalize text-amber-900">
                      {clave}:
                    </span>{" "}
                    <span className="text-gray-800">{valor}</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
