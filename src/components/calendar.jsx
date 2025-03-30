import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual

  // Obtiene el nombre del mes y el año actual
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Cambia al mes anterior
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Cambia al siguiente mes
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Obtiene los días del mes actual
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Genera los días del mes actual
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Día de la semana del primer día del mes
    const days = [];

    // Agregar días vacíos al inicio del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-gray-300">
          {" "}
        </div>
      );
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className="text-inherit text-xs cursor-pointer p-2 bg-white hover:bg-yellow-400 rounded"
          onClick={() => alert("Hola")} // Muestra el mensaje "Hola" al hacer clic
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full h-full p-4 flex flex-col">
      {/* Encabezado del calendario */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="text-amber-900 px-4 py-2 rounded border border-amber-800 hover:bg-yellow-400"
        >
          Anterior
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className=" text-amber-900 px-4 py-2 rounded border border-amber-800 hover:bg-yellow-400"
        >
          Siguiente
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-0.5 mt-2 flex-grow">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
