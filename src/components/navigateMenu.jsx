import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
//import { view } from "framer-motion/client";
import MapApi from "./tablaClientesAdmon"; // Ajusta la ruta si está en una carpeta diferente
import Pasteles from "./listaProductos";
import PedidosTable from "./tablaPedidosAdmon";

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

  return (
    <div className="">
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
      <div className="mt-6 border rounded-md bg-gray-50 shadow-inner overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-h-[500px] overflow-y-auto" // Limita la altura y habilita el scroll
          >
            {currentView === "Clientes" && <MapApi />}
            {currentView === "Usuarios" && <MapApi />}
            {currentView === "Productos" && <Pasteles />}
            {currentView === "Pedidos" && <PedidosTable />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
