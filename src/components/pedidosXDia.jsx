import { useState } from "react";
import { AlertCircle } from "lucide-react";
import cakePic from "../Assets/32422shortcake_98853.png";

const Eventos = ({ data }) => {
  const [hoveredPedido, setHoveredPedido] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (pedido, e) => {
    setHoveredPedido(pedido);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePedidoClick = (pedido) => {
    console.log("Pedido seleccionado:", pedido);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("es-MX", options);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="flex items-center gap-2 text-xl md:text-2xl text-white bg-amber-800 p-2 md:p-4 rounded-sm font-bold mb-2 md:mb-4">
        Eventos
      </h2>

      <div className="flex-grow overflow-y-auto space-y-2">
        {data?.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white rounded-lg p-3 shadow hover:shadow-md transition-shadow cursor-pointer flex items-start gap-3"
            onClick={() => handlePedidoClick(pedido)}
            onMouseEnter={(e) => handleMouseEnter(pedido, e)}
            onMouseLeave={() => setHoveredPedido(null)}
          >
            {/* Círculo con imagen del pastel */}
            <div className="bg-yellow-100 p-2 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
              <img
                src={cakePic}
                alt="Pastel"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-amber-800">
                  {pedido.client.fullName}
                </h3>
                {pedido.caution && (
                  <AlertCircle className="text-red-500 w-5 h-5" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(pedido.pickupDate)}
              </p>
              <p className="text-sm text-gray-800">{pedido.writing}</p>
              <p className="text-xs text-gray-500 truncate">{pedido.notes}</p>
              <p
                className={`text-xs mt-1 ${
                  pedido.status === "Agendado"
                    ? "text-green-600"
                    : pedido.status === "Entregado"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {pedido.status}
              </p>
            </div>
          </div>
        ))}

        {(!data || data.length === 0) && (
          <div className="text-center text-gray-500 py-4">
            No hay pedidos para esta fecha
          </div>
        )}
      </div>

      {/* Tooltip al hacer hover (se mantiene igual) */}
      {hoveredPedido && (
        <div
          className="fixed bg-white p-4 shadow-lg rounded-lg border border-amber-800 z-50 max-w-md"
          style={{
            left: `${hoverPosition.x + 20}px`,
            top: `${hoverPosition.y + 20}px`,
          }}
        >
          <h3 className="font-bold text-amber-800 mb-2">
            {hoveredPedido.client.fullName}
          </h3>
          <p className="text-sm">
            <span className="font-semibold">Recoger:</span>{" "}
            {formatDate(hoveredPedido.pickupDate)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Estado:</span>{" "}
            {hoveredPedido.status}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Texto:</span>{" "}
            {hoveredPedido.writing}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Notas:</span> {hoveredPedido.notes}
          </p>

          {hoveredPedido.caution && (
            <p className="text-red-500 text-sm mt-1">¡Precaución especial!</p>
          )}

          <div className="mt-3">
            <h4 className="font-semibold text-sm mb-1">Pasteles:</h4>
            <ul className="text-xs space-y-2">
              {hoveredPedido.cakes.map((cake, index) => (
                <li key={index} className="border-b border-gray-100 pb-1">
                  <p className="font-medium">
                    {cake.line.line} - {cake.itemType}
                  </p>
                  {cake.floors?.length > 0 ? (
                    <div className="ml-2">
                      {cake.floors.map((floor) => (
                        <div key={floor.id} className="mt-1">
                          <p>
                            Piso {floor.floorNumber}: {floor.flavor.flavor} (
                            {floor.size.size}")
                          </p>
                          {floor.ingredients.length > 0 && (
                            <p className="text-gray-600">
                              Ingredientes:{" "}
                              {floor.ingredients
                                .map((i) => i.ingredient)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {cake.flavor && <p>Sabor: {cake.flavor.flavor}</p>}
                      {cake.size && <p>Tamaño: {cake.size.size}"</p>}
                      {cake.cupcakeQty && (
                        <p>Cantidad: {cake.cupcakeQty} cupcakes</p>
                      )}
                      {cake.numberShape && <p>Número: {cake.numberShape}</p>}
                      {cake.ingredients.length > 0 && (
                        <p className="text-gray-600">
                          Ingredientes:{" "}
                          {cake.ingredients.map((i) => i.ingredient).join(", ")}
                        </p>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventos;
