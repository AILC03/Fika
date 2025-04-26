import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {motion, AnimatePresence } from "framer-motion";
import Pasteles from "./listaProductos";
import PedidosTable from "./tablaPedidosAdmon";
import ListaClientes from "./tablaClientesAdmon"

const navItems = [
  {
    label: "Pedidos",
    view: "Pedidos",
  },
  {
    label: "Productos",
    view: "Productos",
  },
  {
    label: "Clientes",
    view: "Clientes",
  },
  {
    label: "Usuarios",
    view: "Usuarios",
  },
];

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
const Clientes = [
  {
    id: "6641230001",
    nombre: "Ana Pérez",
    email: "ana.perez@example.com",
  },
  {
    id: "6641230002",
    nombre: "Luis Martínez",
    email: "luis.martinez@example.com",
  },
  {
    id: "6641230003",
    nombre: "Carla Gómez",
    email: "carla.gomez@example.com",
  },
  {
    id: "6641230004",
    nombre: "Pedro Sánchez",
    email: "pedro.sanchez@example.com",
  },
  {
    id: "6641230005",
    nombre: "Marta Rodríguez",
    email: "marta.rodriguez@example.com",
  },
  {
    id: "6641230006",
    nombre: "Daniel Torres",
    email: "daniel.torres@example.com",
  },
  {
    id: "6641230007",
    nombre: "Laura Jiménez",
    email: "laura.jimenez@example.com",
  },
  {
    id: "6641230008",
    nombre: "Jorge Ramírez",
    email: "jorge.ramirez@example.com",
  },
  {
    id: "6641230009",
    nombre: "Lucía Morales",
    email: "lucia.morales@example.com",
  },
  {
    id: "6641230010",
    nombre: "Ricardo Herrera",
    email: "ricardo.herrera@example.com",
  },
];

const apiResponse = {
  Clásicos: [
    { sabor: "Frutos rojos", disponible: true },
    { sabor: "Chocolate", disponible: false },
    { sabor: "Guayaba", disponible: true },
    { sabor: "Mango", disponible: false },
    { sabor: "Pellizco", disponible: true },
    { sabor: "Temporada", disponible: false },
  ],
  Deluxe: [
    { sabor: "Pasión", disponible: true },
    { sabor: "Frutos Rojos", disponible: false },
    { sabor: "Fresas con crema", disponible: true },
    { sabor: "Barroco", disponible: false },
    { sabor: "Pellizco", disponible: true },
  ],
  Biscochos: [
    { sabor: "Chocolate", disponible: true },
    { sabor: "Blueberry", disponible: false },
    { sabor: "Vainilla", disponible: true },
    { sabor: "Red Velvet", disponible: false },
    { sabor: "Zanahoria", disponible: true },
  ],
  Tradicionales: [
    { sabor: "Tartas - Limón", disponible: false },
    { sabor: "Tartas - Frutos Rojos", disponible: true },
    { sabor: "3 leches", disponible: true },
    { sabor: "Chocoflan", disponible: false },
    { sabor: "Cheesecake - Frutos Rojos", disponible: true },
    { sabor: "Cheesecake - Temporada", disponible: false },
    { sabor: "Tiramisú", disponible: true },
  ],
};



export default function NavigationMenu() {
  const [openIndex, setOpenIndex] = useState(null);
  const [currentView, setCurrentView] = useState("Pedidos");

  const handleClick = (view) => {
    setCurrentView(view);
    setOpenIndex(null);
  };

  const toggleSubmenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCloseBuscador = () => {
    setShowBuscador(false); // Cierra el componente "Buscador"
  };

  return (
    <div className="h-full flex flex-col">
      {/* NAV */}
      <nav className="bg-white shadow px-6 py-4 rounded-md">
        <ul className="flex space-x-6">
          {navItems.map((item, index) => (
            <li key={index} className="relative">
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(index)}
                  className="flex items-center gap-1 text-gray-800 hover:text-amber-700 font-medium"
                >
                  {item.label}
                  <ChevronDown size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleClick(item.view)}
                  className={`font-medium px-3 py-1 rounded-md transition-colors ${
                    currentView === item.view
                      ? "bg-amber-100 text-amber-800"
                      : "hover:bg-amber-100 text-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              )}

              {/* Submenu con animación */}
              <AnimatePresence>
                {item.submenu && openIndex === index && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-md shadow-md py-2 w-48 z-50"
                  >
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <button
                          onClick={() => handleClick(subitem.view)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                        >
                          {subitem.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>

      {/* VISTA ACTUAL */}
      <div className="mt-6 border rounded-2xl bg-gray-50 shadow-inner flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto" // Asegura que ocupe todo el espacio disponible
          >
            {currentView === "Clientes" && (
              <ListaClientes personas={Clientes} />
            )}
            {currentView === "Usuarios" && (
              <ListaClientes personas={Clientes} />
            )}
            {currentView === "Productos" && (
              <Pasteles apiResponse={apiResponse} />
            )}
            {currentView === "Pedidos" && (
              <PedidosTable
                pedidos={pedidosSimulados}
                onClose={handleCloseBuscador}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
