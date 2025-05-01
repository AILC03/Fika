import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CakeOrderForm from "./pedidoDatos";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual
  const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
  const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado
  const [apiData, setApiData] = useState(null); // Datos de la API simulados
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

  // Datos simulados de la API
  const mockApiData = {
    pasteles: [
      {
        id: 1,
        type: "DELUXE",
        flavors: [
          {
            id: 1,
            name: "Frutos Rojos",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 5,
                name: "Queso Mascarpone",
                available: true,
              },
              {
                id: 6,
                name: "Frambuesa",
                available: true,
              },
              {
                id: 7,
                name: "Zarzamora",
                available: true,
              },
            ],
          },
          {
            id: 5,
            name: "Pellizco",
            ingredients: [
              {
                id: 8,
                name: "Dulce de leche",
                available: true,
              },
              {
                id: 9,
                name: "Almendra",
                available: true,
              },
            ],
          },
          {
            id: 7,
            name: "Pasion",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 2,
                name: "Platano",
                available: true,
              },
              {
                id: 3,
                name: "Nutella",
                available: true,
              },
              {
                id: 4,
                name: "Nuez",
                available: true,
              },
            ],
          },
          {
            id: 8,
            name: "Fresas con Crema",
            ingredients: [],
          },
          {
            id: 9,
            name: "Barroco",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 3,
                name: "Nutella",
                available: true,
              },
              {
                id: 4,
                name: "Nuez",
                available: true,
              },
            ],
          },
        ],
        sizes: [
          {
            id: 1,
            size: "3",
          },
          {
            id: 2,
            size: "4",
          },
          {
            id: 3,
            size: "6",
          },
          {
            id: 5,
            size: "9",
          },
          {
            id: 6,
            size: "12",
          },
          {
            id: 7,
            size: "1/4 de Plancha",
          },
          {
            id: 8,
            size: "1/2 Plancha",
          },
        ],
      },
      {
        id: 2,
        type: "SPONGE_CAKE",
        flavors: [
          {
            id: 2,
            name: "Chocolate",
            ingredients: [],
          },
          {
            id: 10,
            name: "Blueberry",
            ingredients: [
              {
                id: 10,
                name: "Cheesecake",
                available: true,
              },
              {
                id: 11,
                name: "Curl de limon",
                available: true,
              },
            ],
          },
          {
            id: 11,
            name: "Vainilla",
            ingredients: [
              {
                id: 12,
                name: "Cremoso de frutos rojos",
                available: true,
              },
              {
                id: 13,
                name: "Confitura de frambuesa",
                available: true,
              },
            ],
          },
          {
            id: 12,
            name: "Red Velvet",
            ingredients: [
              {
                id: 10,
                name: "Cheesecake",
                available: true,
              },
              {
                id: 14,
                name: "Galleta de cheesecake",
                available: true,
              },
            ],
          },
          {
            id: 13,
            name: "Zanahoria",
            ingredients: [],
          },
        ],
        sizes: [
          {
            id: 1,
            size: "3",
          },
          {
            id: 4,
            size: "8",
          },
          {
            id: 6,
            size: "12",
          },
        ],
      },
      {
        id: 3,
        type: "TRADITIONAL",
        flavors: [
          {
            id: 15,
            name: "Tartas",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 14,
                name: "Galleta de cheesecake",
                available: true,
              },
            ],
          },
          {
            id: 16,
            name: "3 Leches",
            ingredients: [],
          },
          {
            id: 17,
            name: "Chocoflan",
            ingredients: [],
          },
          {
            id: 18,
            name: "Cheesecake",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 6,
                name: "Frambuesa",
                available: true,
              },
            ],
          },
          {
            id: 19,
            name: "Tiramisu",
            ingredients: [],
          },
        ],
        sizes: [
          {
            id: 1,
            size: "3",
          },
          {
            id: 3,
            size: "6",
          },
          {
            id: 4,
            size: "8",
          },
          {
            id: 5,
            size: "9",
          },
          {
            id: 6,
            size: "12",
          },
        ],
      },
      {
        id: 4,
        type: "CLASIC",
        flavors: [
          {
            id: 1,
            name: "Frutos Rojos",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
                available: true,
              },
              {
                id: 5,
                name: "Queso Mascarpone",
                available: true,
              },
              {
                id: 6,
                name: "Frambuesa",
                available: true,
              },
              {
                id: 7,
                name: "Zarzamora",
                available: true,
              },
            ],
          },
          {
            id: 2,
            name: "Chocolate",
            ingredients: [],
          },
          {
            id: 3,
            name: "Guayaba",
            ingredients: [],
          },
          {
            id: 4,
            name: "Mango",
            ingredients: [],
          },
          {
            id: 5,
            name: "Pellizco",
            ingredients: [
              {
                id: 8,
                name: "Dulce de leche",
                available: true,
              },
              {
                id: 9,
                name: "Almendra",
                available: true,
              },
            ],
          },
          {
            id: 6,
            name: "Temporada",
            ingredients: [],
          },
        ],
        sizes: [
          {
            id: 4,
            size: "8",
          },
        ],
      },
    ],
  };

  // Cargar datos simulados en lugar de la API
  useEffect(() => {
    setApiData(mockApiData); // Asigna los datos simulados al estado
  }, []);

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

  // Maneja el envío del pedido
  const handleOrderSubmit = (orderData) => {
    console.log("Pedido enviado:", orderData); // Informacion que sale del formulario
    setIsModalOpen(false);
  };

  // Genera los días del mes actual
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Día de la semana del primer día del mes
    const today = new Date(); // Fecha actual
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

      days.push(
        <div
          key={day}
          className={`text-xs cursor-pointer p-2 rounded transition-transform duration-200 transform hover:scale-90 ${
            isToday
              ? "bg-yellow-200 text-black hover:bg-yellow-400 font-bold"
              : isPastDay
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-yellow-400 text-inherit"
          }`}
          onDoubleClick={() => {
            if (!isPastDay) {
              const selectedDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              setSelectedDay(selectedDate);
              setIsModalOpen(true);
            }
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // if (!apiData) return <div>Cargando...</div>; // Muestra un mensaje mientras se cargan los datos

  return (
    <div className="w-full h-full p-4 flex flex-col">
      {/* Encabezado del calendario */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="text-amber-900 px-2 py-2 rounded border border-amber-800 hover:bg-yellow-400 flex items-center"
        >
          <ChevronLeft className="w-5 h-5" /> {/* Flecha izquierda */}
        </button>
        <h2 className="text-xl font-bold">
          {`${currentDate.toLocaleString("default", {
            month: "long",
          })} ${currentDate.getFullYear()}`}
        </h2>
        <button
          onClick={handleNextMonth}
          className="text-amber-900 px-2 py-2 rounded border border-amber-800 hover:bg-yellow-400 flex items-center"
        >
          <ChevronRight className="w-5 h-5" /> {/* Flecha derecha */}
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

      {/* Formulario de nuevo pedido */}
      <CakeOrderForm
        apiData={mockApiData} // Pasa los datos de la API aquí
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderSubmit={handleOrderSubmit}
        orderDate={selectedDay}
      />
    </div>
  );
};

export default Calendar;
