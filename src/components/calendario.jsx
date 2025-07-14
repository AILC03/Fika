import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderForm from "./orderForm/OrderForm";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: 1 });
  const [selectedDate, setSelectedDate] = useState(null);

  let pressTimer = null;

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

  const handleLongPressStart = (day, isPastDay, year, month) => {
    if (isPastDay) return;
    pressTimer = setTimeout(() => {
      const selectedDate = new Date(year, month, day);
      setSelectedDay(selectedDate);
      setIsModalOpen(true);
    }, 500); // 500ms para long press
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer);
  };

  // Maneja el envío del pedido
  const handleOrderSubmit = (orderData) => {
    console.log("Pedido enviado:", orderData);
    setIsModalOpen(false);

    // Aquí puedes hacer el envío real a tu API
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(orderData)
    // })
  };

  // Genera los días del mes actual
  const handleDateClick = (day, isPastDay) => {
    if (isPastDay) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);

    // Formatear fecha como YYYY-MM-DD para la API
    const formattedDate = clickedDate.toISOString().split("T")[0];
    onDateSelect(formattedDate);
  };

  // Modificar generateCalendarDays para incluir el manejo de clicks
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-300"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
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
        selectedDate &&
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth() &&
        day === selectedDate.getDate();

      days.push(
        <div
          key={day}
          className={`text-xs cursor-pointer p-2 rounded transition-transform duration-200 transform hover:scale-90 ${
            isToday
              ? "bg-yellow-200 text-black hover:bg-yellow-400 font-bold"
              : isPastDay
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isSelected
              ? "bg-amber-800 text-white hover:bg-amber-900"
              : "bg-white hover:bg-yellow-400 text-inherit"
          }`}
          onClick={() => handleDateClick(day, isPastDay)}
          // Doble click (opcional, puedes quitarlo si solo quieres long press)
          onDoubleClick={() => {
            if (!isPastDay) {
              const selectedDate = new Date(year, month, day);
              setSelectedDay(selectedDate);
              setIsModalOpen(true);
            }
          }}
          // Long press para mouse
          onMouseDown={() => handleLongPressStart(day, isPastDay, year, month)}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          // Long press para touch
          onTouchStart={() => handleLongPressStart(day, isPastDay, year, month)}
          onTouchEnd={handleLongPressEnd}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Obtener userId del localStorage al cargar el componente
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser({ id: Number(userId) });
    }
  }, []);

  return (
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
          {`${currentDate.toLocaleString("default", {
            month: "long",
          })} ${currentDate.getFullYear()}`}
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

      {/* Formulario de pedido (permanece igual) */}
      <OrderForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderSubmit={handleOrderSubmit}
        orderDate={selectedDay ? selectedDay.toISOString().split("T")[0] : null}
      />
    </div>
  );
};

export default Calendar;
