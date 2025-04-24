import React, { useState } from "react";
import Calendar from "../../components/calendario";
import Eventos from "../../components/Eventos";
import PedidosTable from "../../components/tablaPedidos"; // Importa el componente "Buscador"
import { Search } from "lucide-react";

const eventosData = [
  {
    fecha: "29 de marzo, 2025",
    icono: "🎉",
    texto: "Fiesta de cumpleaños de Juan",
  },
  {
    fecha: "30 de marzo, 2025",
    icono: "📅",
    texto: "Reunión de planificación semanal",
  },
  {
    fecha: "31 de marzo, 2025",
    icono: "🏆",
    texto: "Entrega de premios del torneo",
  },
  {
    fecha: "29 de marzo, 2025",
    icono: "🎉",
    texto: "Fiesta de cumpleaños de Juan",
  },
  {
    fecha: "30 de marzo, 2025",
    icono: "📅",
    texto: "Reunión de planificación semanal",
  },
  {
    fecha: "31 de marzo, 2025",
    icono: "🏆",
    texto: "Entrega de premios del torneo",
  },
  {
    fecha: "29 de marzo, 2025",
    icono: "🎉",
    texto: "Fiesta de cumpleaños de Juan",
  },
  {
    fecha: "30 de marzo, 2025",
    icono: "📅",
    texto: "Reunión de planificación semanal",
  },
  {
    fecha: "31 de marzo, 2025",
    icono: "🏆",
    texto: "Entrega de premios del torneo",
  },
];

const General = () => {
  const [showBuscador, setShowBuscador] = useState(false); // Estado para controlar la visibilidad del buscador

  const handleCloseBuscador = () => {
    setShowBuscador(false); // Cierra el componente "Buscador"
  };

  return (
    <div className="h-screen flex">
      {/* Contenido principal */}
      <main className="flex-grow flex">
        {/* Columna izquierda */}
        <div className="flex flex-col w-4/6 m-5">
          <div
            id="Calendario"
            className="flex-grow mb-5 rounded-xl bg-yellow-100"
          >
            <Calendar />
          </div>
          <div id="cantidades" className="bg-yellow-200 p-4">
            Cantidades
          </div>
        </div>

        {/* Columna derecha */}
        <div id="eventos" className="flex flex-col flex-grow p-4">
          {/* Encabezado fijo */}
          <h2 className="flex items-center gap-2 text-3xl text-white bg-amber-800 p-4 rounded-sm font-bold mb-4">
            Eventos
            <Search
              className="w-6 h-6 ml-auto cursor-pointer"
              onClick={() => setShowBuscador(true)} // Muestra el componente "Buscador" al hacer clic
            />
          </h2>

          {/* Contenedor de eventos con scroll */}
          <div className="flex-grow overflow-y-auto">
            <Eventos eventos={eventosData} />
          </div>
        </div>
      </main>

      {/* Componente "Buscador" */}
      {showBuscador && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="p-6 rounded">
            <PedidosTable onClose={handleCloseBuscador} />
            {/* Pasa la función de cierre */}
          </div>
        </div>
      )}
    </div>
  );
};

export default General;
