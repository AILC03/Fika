import React from "react";
import cake from "../Assets/32422shortcake_98853.png"; // Asegúrate de que la ruta sea correcta

const Eventos = ({ eventos }) => {
  // Obtener la fecha actual en formato ISO 8601 (YYYY-MM-DD)
  const fechaActual = new Date().toISOString().split("T")[0];

  // Filtrar eventos con la fecha actual
  const eventosHoy = eventos.filter((evento) => evento.fecha == fechaActual);

  return (
    <div className="p-4 overflow-y-auto">
      <div className="space-y-4">
        {eventosHoy.length > 0 ? (
          eventosHoy.map((evento, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-xl p-10"
            >
              {/* Ícono o logo */}
              <div className="w-16 h-16 flex items-center justify-center bg-amber-200 text-white rounded-full mr-4">
                <img src={cake} alt="Logo" className="w-10 h-12 object-cover" />
              </div>

              {/* Información del evento */}
              <div>
                <p className="text-sm text-gray-500">{evento.fecha}</p>
                <p className="text-lg font-semibold">{evento.cliente}</p>
                <p className="text-sm text-gray-700">{evento.texto}</p>
              </div>
            </div>
          ))
        ) : (
          // Skeleton para "No hay eventos para hoy"
          <div className="flex items-center bg-white rounded-xl p-10 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex flex-col space-y-2">
              <div className="w-40 h-6 bg-gray-200 rounded"></div>
              <div className="w-64 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventos;
