import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Ingredientes from "./listaProductos";
import PedidosTable from "./tablaPedidosAdmon";
import ListaClientes from "./tablaClientesAdmon";
import ListaEmpleados from "./tablaUsuarios";
const navItems = [
  {
    label: "Pedidos",
    view: "Pedidos",
  },
  {
    label: "Ingredientes",
    view: "Ingredientes",
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

const empleados = [
  {
    numEmpleado: "E001",
    nombre: "Juan Pérez",
    turno: "Mañana",
    cargo: "Caja",
  },
  {
    numEmpleado: "E002",
    nombre: "Ana García",
    turno: "Tarde",
    cargo: "Cocinero",
  },
  {
    numEmpleado: "E003",
    nombre: "Carlos López",
    turno: "Noche",
    cargo: "General",
  },
  // Agregar más empleados según sea necesario
];

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
              <ListaEmpleados empleados={empleados} />
            )}
            {currentView === "Ingredientes" && (
              <Ingredientes apiData={mockApiData} />
            )}
            {currentView === "Pedidos" && (
              <PedidosTable
                pedidos={pedidosSimulados} // recibe info de pedidos
                onClose={handleCloseBuscador}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
