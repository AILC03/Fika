import { useState } from "react";

export default function ProductTable({ data }) {
  // Agrupar los productos por sabor y tamaño
  const groupProducts = (products) => {
    const grouped = {};
    products.forEach((product) => {
      const key = `${product.sabor}-${product.tamano}`;
      if (!grouped[key]) {
        grouped[key] = { ...product, quantity: product.cantidad };
      } else {
        grouped[key].quantity += product.cantidad;
      }
    });
    return Object.values(grouped);
  };

  // Separar los productos en "hoy" y "manana"
  const todayProducts = groupProducts(data.today || []);
  const tomorrowProducts = groupProducts(data.tomorrow || []);

  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-end mb-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 font-medium rounded-l-md rounded-r-none ${
              activeTab === "today"
                ? "bg-amber-800 text-white"
                : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
            }`}
          >
            Totales de hoy
          </button>
          <button
            onClick={() => setActiveTab("tomorrow")}
            className={`px-4 py-2 font-medium rounded-r-md rounded-l-none ${
              activeTab === "tomorrow"
                ? "bg-amber-800 text-white"
                : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
            }`}
          >
            Totales día sig
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-amber-300 rounded-md overflow-hidden">
        <div className="bg-amber-800 text-white text-center py-3 px-4">
          <h3 className="text-lg font-medium">
            {activeTab === "today" ? "Totales de hoy" : "Totales día sig"}
          </h3>
        </div>

        {/* Contenedor con scroll si hay más de 4 filas */}
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-amber-100">
              <tr>
                <th className="py-2 px-4 text-left bg-amber-100 border border-amber-300 text-amber-900 font-medium">
                  Sabor
                </th>
                <th className="py-2 px-4 text-left bg-amber-100 border border-amber-300 text-amber-900 font-medium">
                  Tamaño
                </th>
                <th className="py-2 px-4 text-left bg-amber-100 border border-amber-300 text-amber-900 font-medium">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "today" ? todayProducts : tomorrowProducts).map(
                (product, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border border-amber-300 bg-amber-50">
                      {product.sabor}
                    </td>
                    <td className="py-2 px-4 border border-amber-300 bg-amber-50">
                      {product.tamano}
                    </td>
                    <td className="py-2 px-4 border border-amber-300 bg-amber-50">
                      {product.quantity}
                    </td>
                  </tr>
                )
              )}
              {(activeTab === "today" ? todayProducts : tomorrowProducts)
                .length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 text-center bg-amber-50 text-amber-700 border border-amber-300"
                  >
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
