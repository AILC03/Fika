import React, { useState } from "react";
import { Search } from "lucide-react";
import Calendar from "../../components/calendario";
import Eventos from "../../components/pedidosXDia"; // Componente de eventos
import BuscadorPedidos from "../../components/buscadorPedidos"; // Tabla de busqueda de pedidos
import ProductTable from "../../components/cantidadesDiarias"; // Tabla de cantidades

// Datos simulados para la tabla de eventos
const today = new Date();
const formattedToday = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const eventosData = [
  {
    fecha: formattedToday,
    cliente: "Juan Pérez",
    texto: "Feliz cumpleaños, Juan",
  },
  {
    fecha: formattedToday,
    cliente: "María López",
    texto: "Felicidades por tu graduación",
  },
  {
    fecha: formattedToday,
    cliente: "Carlos García",
    texto: "Feliz aniversario",
  },
  {
    fecha: formattedToday,
    cliente: "Ana Torres",
    texto: "Bienvenida al equipo",
  },
  {
    fecha: formattedToday,
    cliente: "Luis Martínez",
    texto: "Feliz cumpleaños, Luis",
  },
  {
    fecha: formattedToday,
    cliente: "Sofía Ramírez",
    texto: "Te queremos mucho",
  },
  {
    fecha: formattedToday,
    cliente: "Pedro Sánchez",
    texto: "Feliz jubilación",
  },
  {
    fecha: formattedToday,
    cliente: "Laura Fernández",
    texto: "Feliz cumpleaños, Laura",
  },
  {
    fecha: formattedToday,
    cliente: "Diego Herrera",
    texto: "Gracias por todo",
  },
];

// Datos simulados para la tabla de cantidades
const productData = {
  today: [
    { sabor: "Chocolate", tamano: '10"', cantidad: 6 },
    { sabor: "Vainilla", tamano: '12"', cantidad: 3 },
    { sabor: "Fresa", tamano: '8"', cantidad: 7 },
    { sabor: "Red Velvet", tamano: '10"', cantidad: 2 },
    { sabor: "Limon", tamano: '12"', cantidad: 5 },
    { sabor: "Mora", tamano: '8"', cantidad: 4 },
    { sabor: "Coco", tamano: '10"', cantidad: 1 },
    { sabor: "Cafe", tamano: '12"', cantidad: 8 },
    { sabor: "Nutella", tamano: '8"', cantidad: 3 },
    { sabor: "Maracuyá", tamano: '10"', cantidad: 2 },
    { sabor: "Mango", tamano: '12"', cantidad: 4 },
    { sabor: "Galleta", tamano: '8"', cantidad: 6 },
  ],
  tomorrow: [
    { sabor: "Chocolate", tamano: '10"', cantidad: 4 },
    { sabor: "Vainilla", tamano: '12"', cantidad: 6 },
    { sabor: "Red Velvet", tamano: '8"', cantidad: 2 },
    { sabor: "Fresa", tamano: '10"', cantidad: 5 },
    { sabor: "Limon", tamano: '12"', cantidad: 3 },
    { sabor: "Mora", tamano: '8"', cantidad: 7 },
    { sabor: "Coco", tamano: '10"', cantidad: 1 },
    { sabor: "Cafe", tamano: '12"', cantidad: 8 },
    { sabor: "Nutella", tamano: '8"', cantidad: 3 },
    { sabor: "Maracuyá", tamano: '10"', cantidad: 2 },
    { sabor: "Mango", tamano: '12"', cantidad: 4 },
    { sabor: "Galleta", tamano: '8"', cantidad: 6 },
  ],
};

const pedidosSimulados = [
  {
    celular: "6641234567",
    email: "A@usuario.123",
    nombre: "Juan Gonzales",
    fechaRecoleccion: "12 - 03 - 2025",
    productos: [
      {
        categoria: "Clasico",
        sabor: "Chocolate",
        tamano: '8"',
        escritura: "Feliz cumple",
      },
    ],
  },
  {
    celular: "6645551234",
    email: "B@usuario.456",
    nombre: "Ernesto Peña",
    fechaRecoleccion: "12 - 03 - 2025",
    productos: [
      {
        categoria: "Tradicional",
        sabor: "3 leches",
        tamano: '12"',
      },
    ],
  },
  {
    celular: "6648883344",
    email: "claudia@example.com",
    nombre: "Claudia Ramírez",
    fechaRecoleccion: "15 - 03 - 2025",
    productos: [
      {
        categoria: "Especial",
        sabor: "Vainilla",
        tamano: '10"',
        escritura: "Te amo",
      },
    ],
  },
  {
    celular: "6644447766",
    email: "diego@hotmail.com",
    nombre: "Diego Torres",
    fechaRecoleccion: "10 - 03 - 2025",
    productos: [
      {
        categoria: "Infantil",
        sabor: "Fresa",
        tamano: '6"',
        escritura: "Peppa Pig",
      },
    ],
  },
  {
    celular: "6646677889",
    email: "lucia@gmail.com",
    nombre: "Lucía Pérez",
    fechaRecoleccion: "20 - 03 - 2025",
    productos: [
      {
        categoria: "Clasico",
        sabor: "Chocolate",
        tamano: '9"',
      },
    ],
  },
  {
    celular: "6649988776",
    email: "manuel@hotmail.com",
    nombre: "Manuel López",
    fechaRecoleccion: "18 - 03 - 2025",
    productos: [
      {
        categoria: "Premium",
        sabor: "Red Velvet",
        tamano: '12"',
      },
    ],
  },
  {
    celular: "6642211344",
    email: "sofia123@gmail.com",
    nombre: "Sofía Méndez",
    fechaRecoleccion: "25 - 03 - 2025",
    productos: [
      {
        categoria: "Tradicional",
        sabor: "Zanahoria",
        tamano: '10"',
      },
    ],
  },
  {
    celular: "6643344556",
    email: "jose.luis@outlook.com",
    nombre: "José Luis",
    fechaRecoleccion: "22 - 03 - 2025",
    productos: [
      {
        categoria: "Especial",
        sabor: "Nuez",
        tamano: '8"',
        escritura: "Gracias mamá",
      },
    ],
  },
  {
    celular: "6641122334",
    email: "karla@email.com",
    nombre: "Karla Vázquez",
    fechaRecoleccion: "11 - 03 - 2025",
    productos: [
      {
        categoria: "Clasico",
        sabor: "Moka",
        tamano: '7"',
      },
    ],
  },
  {
    celular: "6645566778",
    email: "oscar.g@correo.com",
    nombre: "Óscar García",
    fechaRecoleccion: "17 - 03 - 2025",
    productos: [
      {
        categoria: "Infantil",
        sabor: "Fresa",
        tamano: '6"',
        escritura: "Frozen",
      },
    ],
  },
];

const General = () => {
  const [showBuscador, setShowBuscador] = useState(false);

  const handleCloseBuscador = () => {
    setShowBuscador(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row  overflow-hidden">
      {/* Contenido principal */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Columna izquierda - Apila verticalmente en móvil */}
        <div className="flex flex-col w-full md:w-2/3 p-2 md:m-5 md:p-0">
          <div
            id="Calendario"
            className="flex-grow mb-2 md:mb-5 rounded-xl bg-yellow-100"
          >
            <Calendar />
          </div>

          {/* Componente "Cantidades" */}
          <div className="w-full overflow-x-auto">
            <ProductTable data={productData} />
          </div>
        </div>

        {/* Columna derecha - Ocupa todo el ancho en móvil, 1/3 en desktop */}
        <div
          id="eventos"
          className="flex flex-col w-full md:w-1/3 p-2 md:p-4 bg-amber-800 md:bg-transparent max-h-screen"
        >
          <h2 className="flex items-center gap-2 text-xl md:text-2xl text-white bg-amber-800 p-2 md:p-4 rounded-sm font-bold mb-2 md:mb-4">
            Eventos
            <Search
              className="w-5 h-5 md:w-6 md:h-6 ml-auto cursor-pointer"
              onClick={() => setShowBuscador(true)}
            />
          </h2>

          <div className="flex-grow overflow-y-auto max-h-[calc(100vh-7rem)]">
            {/* Ajusta el valor restado (7rem) según el alto real de tu encabezado */}
            <Eventos eventos={eventosData} />
          </div>
        </div>
      </main>

      {/* Componente "Buscador" */}
      {showBuscador && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className=" p-4 md:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
            <BuscadorPedidos
              pedidos={pedidosSimulados}
              onClose={handleCloseBuscador}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default General;
