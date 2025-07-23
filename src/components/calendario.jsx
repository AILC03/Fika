import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import OrderForm from "./OrderManager/OrderForm";

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pressTimer = useRef(null);

  // Navegación entre meses
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Días en el mes actual
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Manejo de selección de fecha
  const handleDateClick = (day, year, month) => {
    const selectedDate = new Date(year, month, day);
    setSelectedDay(selectedDate);
    onDateSelect?.(selectedDate);
  };

  // Manejo de doble click
  const handleDoubleClick = (day, year, month) => {
    const selectedDate = new Date(year, month, day);
    setSelectedDay(selectedDate);
    onDateSelect?.(selectedDate);
    setIsModalOpen(true);
  };

  // Long press para móviles
  const handleTouchStart = (day, isPastDay, year, month) => {
    if (isPastDay) return;
    pressTimer.current = setTimeout(() => {
      const selectedDate = new Date(year, month, day);
      setSelectedDay(selectedDate);
      onDateSelect?.(selectedDate);
      setIsModalOpen(true);
    }, 500);
  };

  const clearPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Cierre del modal
  const handleCloseModal = (success) => {
    setIsModalOpen(false);
    success && console.log("Pedido guardado exitosamente");
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();

    // Días vacíos al inicio
    const emptyDays = Array(firstDayOfMonth)
      .fill(null)
      .map((_, i) => <div key={`empty-${i}`} className="text-gray-300" />);

    // Días del mes
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isPastDay =
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth()) ||
        (year === today.getFullYear() &&
          month === today.getMonth() &&
          day < today.getDate());

      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate();

      const isSelected =
        selectedDay &&
        year === selectedDay.getFullYear() &&
        month === selectedDay.getMonth() &&
        day === selectedDay.getDate();

      const dayClasses = [
        "text-xs cursor-pointer p-2 rounded transition-transform duration-200 transform hover:scale-90",
        isToday
          ? "bg-yellow-200 text-black hover:bg-yellow-400 font-bold"
          : isPastDay
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : isSelected
          ? "bg-amber-800 text-white hover:bg-amber-900"
          : "bg-white hover:bg-yellow-400 text-inherit",
      ].join(" ");

      return (
        <div
          key={day}
          className={dayClasses}
          onClick={() => !isPastDay && handleDateClick(day, year, month)}
          onDoubleClick={() =>
            !isPastDay && handleDoubleClick(day, year, month)
          }
          onMouseDown={() =>
            !isPastDay && handleTouchStart(day, isPastDay, year, month)
          }
          onMouseUp={clearPressTimer}
          onMouseLeave={clearPressTimer}
          onTouchStart={() =>
            !isPastDay && handleTouchStart(day, isPastDay, year, month)
          }
          onTouchEnd={clearPressTimer}
        >
          {day}
        </div>
      );
    });

    return [...emptyDays, ...monthDays];
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="w-full h-full p-2 sm:p-4 flex flex-col">
        {/* Encabezado del calendario */}
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-amber-900 px-2 py-1 sm:py-2 rounded border border-amber-800 hover:bg-yellow-400 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h2>
          <button
            onClick={handleNextMonth}
            className="text-amber-900 px-2 py-1 sm:py-2 rounded border border-amber-800 hover:bg-yellow-400 flex items-center"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-base font-bold">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-0.5 mt-1 sm:mt-2 flex-grow">
          {generateCalendarDays()}
        </div>

        {/* Formulario de pedido */}
        <OrderForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          orderDate={
            selectedDay?.toISOString().split("T")[0] ||
            new Date().toISOString().split("T")[0]
          }
          orderToEdit={null}
        />
      </div>
    </LocalizationProvider>
  );
};

export default Calendar;
