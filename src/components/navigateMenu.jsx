import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "Inicio",
    view: "inicio",
  },
  {
    label: "Servicios",
    submenu: [
      { label: "Diseño Web", view: "diseno" },
      { label: "Desarrollo", view: "desarrollo" },
      { label: "SEO", view: "seo" },
    ],
  },
  {
    label: "Acerca de",
    view: "acerca",
  },
  {
    label: "Contacto",
    view: "contacto",
  },
];

export default function NavigationMenu() {
  const [openIndex, setOpenIndex] = useState(null);
  const [currentView, setCurrentView] = useState("inicio");

  const handleClick = (view) => {
    setCurrentView(view);
    setOpenIndex(null);
  };

  const toggleSubmenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
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
                  className="text-gray-800 hover:text-amber-700 font-medium"
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
      <div className="mt-6 p-6 border rounded-md bg-gray-50 shadow-inner min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold capitalize text-gray-800">
              Vista: {currentView}
            </h2>
            <p className="text-gray-600 mt-2">
              Este es el contenido de la vista <strong>{currentView}</strong>.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
