import { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";

const Eventos = ({ selectedDate }) => {
  const [pedidos, setPedidos] = useState([]);
  const [hoveredPedido, setHoveredPedido] = useState(null);

  // Fetch pedidos cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const fetchPedidos = async () => {
        try {
          const response = await fetch(`/api/pedidos?fecha=${selectedDate}`);
          const data = await response.json();
          setPedidos(data);
        } catch (error) {
          console.error("Error fetching pedidos:", error);
        }
      };
      fetchPedidos();
    }
  }, [selectedDate]);

  const handleCloseBuscador = () => {
    setShowBuscador(false);
  };

  const handlePedidoClick = (pedido) => {
    // Lógica para mostrar detalles completos y editar
    console.log("Pedido seleccionado:", pedido);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="flex items-center gap-2 text-xl md:text-2xl text-white bg-amber-800 p-2 md:p-4 rounded-sm font-bold mb-2 md:mb-4">
        Eventos
      </h2>

      <div className="flex-grow overflow-y-auto space-y-2">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePedidoClick(pedido)}
            onMouseEnter={() => setHoveredPedido(pedido)}
            onMouseLeave={() => setHoveredPedido(null)}
          >
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                {/* Icono o imagen */}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-amber-800">
                    {pedido.customerName}
                  </h3>
                  {pedido.caution && (
                    <AlertCircle className="text-red-500 w-5 h-5" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(pedido.pickupDateTime).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  ID: {pedido.id} | {pedido.notes?.substring(0, 30)}...
                </p>
              </div>
            </div>
          </div>
        ))}

        {pedidos.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No hay pedidos para esta fecha
          </div>
        )}
      </div>

      {/* Tooltip al hacer hover */}
      {hoveredPedido && (
        <div className="fixed bg-white p-4 shadow-lg rounded-lg border border-amber-800 z-10">
          <h3 className="font-bold text-amber-800">
            {hoveredPedido.customerName}
          </h3>
          <p>ID: {hoveredPedido.id}</p>
          <p>
            Recoger: {new Date(hoveredPedido.pickupDateTime).toLocaleString()}
          </p>
          <p>Notas: {hoveredPedido.notes}</p>
          <p>Texto: {hoveredPedido.writing}</p>
          {hoveredPedido.caution && (
            <p className="text-red-500">¡Precaución! Alergias</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Eventos;
