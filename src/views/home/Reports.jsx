import { useState, useEffect } from "react";
import ReporteDetallado from "../../components/reports/detailReport";
import EtiquetasPedidos from "../../components/reports/stickerReport";
import {
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Cake,
  LooksOne,
  Layers,
  CalendarToday,
  Refresh,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";

const GeneradorReportes = () => {
  const API = import.meta.env.VITE_URI;
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Función para obtener los pedidos de la API
  const getOrdersPickup = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/orders/order/getOrderPickUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pickupDate: date.toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDocumentos(data);
      } else {
        console.error("Error al obtener pedidos:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrdersPickup(selectedDate);
  }, [selectedDate]);

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

  // Componente para el tooltip de items
  const ItemsTooltipContent = ({ items }) => (
    <div className="p-2 max-w-xs">
      <h3 className="font-bold mb-2">Detalle del Pedido</h3>
      <ul className="space-y-2">
        {items?.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="mt-1">
              {item.itemType === "MULTIFLOOR" && <Layers color="primary" />}
              {item.itemType === "NUMERIC" && <LooksOne color="secondary" />}
              {item.itemType === "CUPCAKE" && <Cake color="error" />}
              {item.itemType === "REGULAR" && <Cake color="warning" />}
            </div>
            <div>
              <p className="font-medium">
                {item.itemType === "MULTIFLOOR"
                  ? `Pastel Multinivel (${item.floors?.length || 0} pisos)`
                  : item.itemType === "NUMERIC"
                  ? `Número ${item.numberShape}`
                  : item.itemType === "CUPCAKE"
                  ? `${item.cupcakeQty} Cupcakes`
                  : "Pastel Regular"}
              </p>
              {item.line?.line && (
                <p className="text-sm">Línea: {item.line.line}</p>
              )}
              {item.flavor?.flavor && (
                <p className="text-sm">Sabor: {item.flavor.flavor}</p>
              )}
              {item.size?.size && (
                <p className="text-sm">Tamaño: {item.size.size} pulgadas</p>
              )}
              {item.ingredients?.length > 0 && (
                <p className="text-sm">
                  Ingredientes: {item.ingredients.map((i) => i.name).join(", ")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Función para mostrar los items de forma resumida
  const renderOrderItemsSummary = (items) => {
    const itemTypes =
      items?.map((item) => {
        switch (item.itemType) {
          case "MULTIFLOOR":
            return "Multinivel";
          case "NUMERIC":
            return `Núm ${item.numberShape}`;
          case "CUPCAKE":
            return `${item.cupcakeQty} Cupcakes`;
          case "REGULAR":
            return "Regular";
          default:
            return "Otro";
        }
      }) || [];

    return (
      itemTypes.slice(0, 2).join(", ") + (itemTypes.length > 2 ? "..." : "")
    );
  };

  if (loading) {
    return (
      <div
        className="w-full px-1 sm:px-2 md:px-4 py-2 flex justify-center items-center"
        style={{ background: "#FFF2C9", minHeight: "100vh" }}
      >
        <div className="text-center">
          <p style={{ color: "#7E4300" }}>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
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

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <DatePicker
              label="Fecha de recolección"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    backgroundColor: "#FFF2C9",
                    borderRadius: 1,
                    minWidth: 200,
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "#7E4300" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <IconButton
              onClick={() => getOrdersPickup(selectedDate)}
              sx={{ color: "#7E4300" }}
            >
              <Refresh />
            </IconButton>
          </div>

          <div className="font-semibold" style={{ color: "#7E4300" }}>
            {format(selectedDate, "PPPP", { locale: esLocale })}
          </div>
        </div>

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

          {documentos.length === 0 ? (
            <div className="text-center py-8" style={{ color: "#7E4300" }}>
              No hay pedidos para la fecha seleccionada
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {documentos.map((doc) => (
                <Tooltip
                  key={doc.id}
                  title={<ItemsTooltipContent items={doc.cakes} />}
                  arrow
                  placement="top"
                >
                  <div
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
                        Pedido #{doc.id}
                      </span>
                      <span className="ml-2" style={{ color: "#7E4300" }}>
                        Cliente: {doc.client?.fullName || "N/A"}
                      </span>
                      <span
                        className="block text-sm"
                        style={{ color: "#7E4300" }}
                      >
                        Recolección:{" "}
                        {new Date(doc.pickupDate).toLocaleDateString()}{" "}
                        {new Date(doc.pickupDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {doc.caution && (
                        <Chip
                          label="ALERGIAS"
                          size="small"
                          className="mt-1"
                          style={{
                            backgroundColor: "#7E4300",
                            color: "#FFD538",
                          }}
                        />
                      )}
                      {doc.notes && (
                        <p
                          className="text-xs mt-1 italic"
                          style={{ color: "#7E4300" }}
                        >
                          Notas: {doc.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 text-sm">
                      {doc.cakes.slice(0, 2).map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md"
                          style={{
                            background: "#FFD538",
                            color: "#7E4300",
                          }}
                        >
                          {renderOrderItemsSummary([item])}
                        </span>
                      ))}
                      {doc.cakes.length > 2 && (
                        <span
                          className="px-2 py-1 italic text-sm"
                          style={{ color: "#7E4300", background: "#FFF2C9" }}
                        >
                          +{doc.cakes.length - 2} más...
                        </span>
                      )}
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
          <ReporteDetallado pedidosSeleccionados={pedidosSeleccionados} />
          <EtiquetasPedidos pedidosSeleccionados={pedidosSeleccionados} />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default GeneradorReportes;
