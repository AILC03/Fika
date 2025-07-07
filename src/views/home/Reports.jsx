import { useState } from "react";
import ReporteDetallado from "../../components/reports/detailReport";
import EtiquetasPedidos from "../../components/reports/stickerReport";

const GeneradorReportes = ({}) => {
  const documentos = [
    {
      customerId: 1,
      items: [
        {
          type: "numeric",
          line: {
            id: 1,
            name: "DELUXE",
          },
          digits: [
            {
              digit: "1",
              flavor: {
                id: 5,
                name: "Pellizco",
                ingredients: [
                  {
                    id: 8,
                    name: "Dulce de leche",
                  },
                ],
              },
              size: {
                id: 5,
                name: "9",
              },
            },
          ],
        },
        {
          type: "numeric",
          line: {
            id: 1,
            name: "DELUXE",
          },
          digits: [
            {
              digit: "3",
              flavor: {
                id: 9,
                name: "Barroco",
                ingredients: [
                  {
                    id: 3,
                    name: "Nutella",
                  },
                ],
              },
              size: {
                id: 6,
                name: "12",
              },
            },
          ],
        },
        {
          type: "regular",
          line: {
            id: 1,
            name: "DELUXE",
          },
          flavor: {
            id: 5,
            name: "Pellizco",
            ingredients: [
              {
                id: 8,
                name: "Dulce de leche",
              },
              {
                id: 9,
                name: "Almendra",
              },
            ],
          },
          size: {
            id: 7,
            name: "1/4 de Plancha",
          },
        },
        {
          type: "regular",
          line: {
            id: 4,
            name: "CLASIC",
          },
          flavor: {
            id: 3,
            name: "Guayaba",
            ingredients: [],
          },
          size: {
            id: 4,
            name: "8",
          },
        },
        {
          type: "tiered",
          line: {
            id: 2,
            name: "SPONGE_CAKE",
          },
          tiers: [
            {
              flavor: {
                id: 12,
                name: "Red Velvet",
                ingredients: [
                  {
                    id: 10,
                    name: "Cheesecake",
                  },
                ],
              },
              size: {
                id: 6,
                name: "12",
              },
            },
            {
              flavor: {
                id: 2,
                name: "Chocolate",
                ingredients: [],
              },
              size: {
                id: 4,
                name: "8",
              },
            },
          ],
        },
        {
          type: "tiered",
          line: {
            id: 1,
            name: "DELUXE",
          },
          tiers: [
            {
              flavor: {
                id: 8,
                name: "Fresas con Crema",
                ingredients: [],
              },
              size: {
                id: 6,
                name: "12",
              },
            },
            {
              flavor: {
                id: 7,
                name: "Pasion",
                ingredients: [
                  {
                    id: 1,
                    name: "Fresa",
                  },
                  {
                    id: 4,
                    name: "Nuez",
                  },
                ],
              },
              size: {
                id: 5,
                name: "9",
              },
            },
            {
              flavor: {
                id: 1,
                name: "Frutos Rojos",
                ingredients: [
                  {
                    id: 6,
                    name: "Frambuesa",
                  },
                  {
                    id: 7,
                    name: "Zarzamora",
                  },
                ],
              },
              size: {
                id: 3,
                name: "6",
              },
            },
          ],
        },
        {
          type: "cupcakes",
          line: {
            id: 5,
          },
          quantity: 60,
          flavor: {
            id: 1,
            name: "SABOR 1",
            ingredients: [
              {
                id: 33,
                name: "RELLENNO 1",
              },
            ],
          },
          size: {
            id: 0,
            name: "N/A",
          },
        },
        {
          type: "cupcakes",
          line: {
            id: 5,
          },
          quantity: 60,
          flavor: {
            id: 1,
            name: "SABOR 1",
            ingredients: [],
          },
          size: {
            id: 0,
            name: "N/A",
          },
        },
      ],
      writing: "texto 1",
      caution: false, //Por si tiene alergia
      notes: "nota 1",
      status: "in_progress",
      pickupDateTime: "2025-05-30T23:00:00.000Z",
    },
    {
      customerId: 2,
      items: [
        {
          type: "numeric",
          line: {
            id: 2,
            name: "SPONGE_CAKE",
          },
          digits: [
            {
              digit: "4",
              flavor: {
                id: 2,
                name: "Chocolate",
                ingredients: [
                  {
                    id: 2,
                    name: "Cacao",
                  },
                ],
              },
              size: {
                id: 4,
                name: "8",
              },
            },
            {
              digit: "0",
              flavor: {
                id: 12,
                name: "Red Velvet",
                ingredients: [],
              },
              size: {
                id: 6,
                name: "12",
              },
            },
          ],
        },
        {
          type: "regular",
          line: {
            id: 3,
            name: "VEGAN",
          },
          flavor: {
            id: 10,
            name: "Coco",
            ingredients: [
              {
                id: 11,
                name: "Coco rallado",
              },
            ],
          },
          size: {
            id: 5,
            name: "9",
          },
        },
        {
          type: "tiered",
          line: {
            id: 1,
            name: "DELUXE",
          },
          tiers: [
            {
              flavor: {
                id: 6,
                name: "Vainilla",
                ingredients: [],
              },
              size: {
                id: 6,
                name: "12",
              },
            },
            {
              flavor: {
                id: 5,
                name: "Pellizco",
                ingredients: [
                  {
                    id: 8,
                    name: "Dulce de leche",
                  },
                ],
              },
              size: {
                id: 5,
                name: "9",
              },
            },
          ],
        },
      ],
      writing: "Feliz Aniversario",
      caution: true,
      notes: "Cliente es alérgico a frutos secos",
      status: "completed",
      pickupDateTime: "2025-06-15T18:30:00.000Z",
    },

    // Tercer mock
    {
      customerId: 3,
      items: [
        {
          type: "numeric",
          line: {
            id: 4,
            name: "CLASIC",
          },
          digits: [
            {
              digit: "2",
              flavor: {
                id: 4,
                name: "Limón",
                ingredients: [
                  {
                    id: 5,
                    name: "Limón natural",
                  },
                ],
              },
              size: {
                id: 3,
                name: "6",
              },
            },
          ],
        },
        {
          type: "regular",
          line: {
            id: 2,
            name: "SPONGE_CAKE",
          },
          flavor: {
            id: 11,
            name: "Zanahoria",
            ingredients: [
              {
                id: 12,
                name: "Zanahoria",
              },
              {
                id: 13,
                name: "Nuez",
              },
            ],
          },
          size: {
            id: 7,
            name: "1/4 de Plancha",
          },
        },
        {
          type: "cupcakes",
          line: {
            id: 5,
          },
          quantity: 24,
          flavor: {
            id: 7,
            name: "Pasion",
            ingredients: [
              {
                id: 1,
                name: "Fresa",
              },
            ],
          },
          size: {
            id: 0,
            name: "N/A",
          },
        },
      ],
      writing: "",
      caution: false,
      notes: "Empacar por separado los cupcakes",
      status: "pending",
      pickupDateTime: "2025-06-20T15:00:00.000Z",
    },
  ];
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState([]);

  const toggleSeleccion = (pedido) => {
    setPedidosSeleccionados((prev) =>
      prev.includes(pedido)
        ? prev.filter((p) => p !== pedido)
        : [...prev, pedido]
    );
  };

  const seleccionarTodos = () => {
    if (pedidosSeleccionados.length === documentos.length) {
      setPedidosSeleccionados([]);
    } else {
      setPedidosSeleccionados([...documentos]);
    }
  };

  return (
    <div
      className="w-full px-1 sm:px-2 md:px-4 py-2"
      style={{ background: "#FFF2C9", minHeight: "100vh" }}
    >
      <h2
        className="text-2xl font-bold mb-6 pb-2 border-b-2 text-center"
        style={{ color: "#7E4300", borderColor: "#FFD538" }}
      >
        Hoja de trabajo
      </h2>

      <div
        className="rounded-lg shadow-md p-2 sm:p-4 md:p-6 mb-8"
        style={{ background: "#FFF2C9" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="font-semibold" style={{ color: "#7E4300" }}>
            {pedidosSeleccionados.length} pedido(s) seleccionado(s)
          </div>
          <button
            onClick={seleccionarTodos}
            className="px-4 py-2 text-sm border rounded-md hover:bg-yellow-100 transition-colors"
            style={{
              borderColor: "#FFD538",
              color: "#7E4300",
              background:
                pedidosSeleccionados.length === documentos.length
                  ? "#FFD538"
                  : "#FFF2C9",
            }}
          >
            {pedidosSeleccionados.length === documentos.length
              ? "Deseleccionar todos"
              : "Seleccionar todos"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {documentos.map((doc, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all h-full flex flex-col justify-between ${
                pedidosSeleccionados.includes(doc)
                  ? "shadow-sm"
                  : "hover:shadow-md hover:-translate-y-1"
              }`}
              style={{
                border: pedidosSeleccionados.includes(doc)
                  ? "4px solid #FFD538"
                  : "1px solid #7E4300",
                background: pedidosSeleccionados.includes(doc)
                  ? "#FFD538"
                  : "#FFF2C9",
                minHeight: "160px",
              }}
              onClick={() => toggleSeleccion(doc)}
            >
              <div className="mb-2">
                <span className="font-bold" style={{ color: "#7E4300" }}>
                  Pedido #{index + 1}
                </span>
                <span className="ml-2" style={{ color: "#7E4300" }}>
                  Cliente: {doc.customerId}
                </span>
                <span className="block text-sm" style={{ color: "#7E4300" }}>
                  Recolección:{" "}
                  {new Date(doc.pickupDateTime).toLocaleDateString()}{" "}
                  {new Date(doc.pickupDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {doc.caution && (
                  <span
                    className="inline-block mt-1 px-2 py-1 text-xs font-bold rounded-md"
                    style={{
                      background: "#7E4300",
                      color: "#FFD538",
                    }}
                  >
                    ALERGIAS
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 text-sm">
                {doc.items.slice(0, 2).map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md"
                    style={{
                      background: "#FFD538",
                      color: "#7E4300",
                    }}
                  >
                    {item.type === "numeric" &&
                      `Núm: ${item.digits.map((d) => d.digit).join(",")}`}
                    {item.type === "regular" && `Regular: ${item.flavor.name}`}
                    {item.type === "tiered" &&
                      `Pastel ${item.tiers.length} pisos`}
                    {item.type === "cupcakes" && `${item.quantity} cupcakes`}
                  </span>
                ))}
                {doc.items.length > 2 && (
                  <span
                    className="px-2 py-1 italic text-sm"
                    style={{ color: "#7E4300", background: "#FFF2C9" }}
                  >
                    +{doc.items.length - 2} más...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
        <ReporteDetallado pedidosSeleccionados={pedidosSeleccionados} />
        <EtiquetasPedidos pedidosSeleccionados={pedidosSeleccionados} />
      </div>
    </div>
  );
};

export default GeneradorReportes;
