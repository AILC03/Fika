import React, { useState } from "react";
import Calendar from "../../components/calendario";
import Eventos from "../../components/pedidosXDia"; // Componente de eventos
import CantidadesDiarias from "../../components/cantidadesDiarias"; // Tabla de cantidades

const General = () => {
  const [selectedDate, setSelectedDate] = useState(null); //recibe la fecha que se selecciono

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Columna izquierda */}
        <div className="flex flex-col w-full lg:w-3/4 p-2 lg:m-5 lg:p-0">
          <div className="flex-grow mb-2 lg:mb-5 rounded-xl bg-yellow-100">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
          <div className="w-full overflow-x-auto">
            <CantidadesDiarias selectedDate={selectedDate} />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col w-full lg:w-1/4 p-2 lg:p-4 bg-amber-800 lg:bg-transparent max-h-screen">
          <Eventos selectedDate={selectedDate} />
        </div>
      </main>
    </div>
  );
};

export default General;
