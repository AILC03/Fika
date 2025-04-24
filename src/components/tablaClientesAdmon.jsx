import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import ConfirmModal from "./alerta";

export default function MapApi({ pedidosIniciales = [] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.celular.includes(busqueda)
  );

  const handleEliminar = () => {
    setPedidos((prevPedidos) =>
      prevPedidos.filter((pedido) => pedido !== pedidoAEliminar)
    );
    setShowModal(false);
    setPedidoAEliminar(null);
  };

  return (
    <div className="w-full h-full p-4 bg-orange-100 shadow-amber-900 rounded-lg shadow-xl">
      <h5 className="text-2xl font-bold mb-6 text-amber-900">Buscador</h5>

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
        <select className="px-2 py-2 ml-28 w-32 border rounded-md bg-white">
          <option>Celular</option>
          <option>Nombre</option>
          <option>Correo</option>
        </select>
      </div>

      {/* Contenedor con scroll para evitar desbordamiento */}
      <div className="overflow-x-auto shadow-lg shadow-amber-900 rounded-md max-h-96 overflow-y-auto">
        <table className="min-w-full table-auto text-sm bg-yellow-50 rounded-lg">
          <thead className="bg-yellow-200 sticky top-0 z-10">
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
                      onClick={() => {
                        setPedidoAEliminar(pedido);
                        setShowModal(true);
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

      <ConfirmModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleEliminar}
      />
    </div>
  );
}
