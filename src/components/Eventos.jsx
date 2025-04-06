import React from "react";

const Eventos = ({ eventos }) => {
  return (
    <div className="p-4 overflow-y-auto">
      <div className="space-y-4">
        {eventos.length > 0 ? (
          eventos.map((evento, index) => (
            <div
              key={index}
              className="flex items-center bg-white shadow-md rounded-lg p-4"
            >
              {/* Ícono o logo */}
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full mr-4">
                {evento.icono}
              </div>

              {/* Información del evento */}
              <div>
                <p className="text-sm text-gray-500">{evento.fecha}</p>
                <p className="text-lg font-semibold">{evento.texto}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay eventos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Eventos;
