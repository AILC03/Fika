import React, { useState, useEffect } from "react";
import Calendar from "../../components/calendario";
import Eventos from "../../components/pedidosXDia";
import CantidadesDiarias from "../../components/cantidadesDiarias";

const General = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [apiData, setApiData] = useState(null); // Datos crudos de la API
  const [processedData, setProcessedData] = useState({
    // Datos procesados para CantidadesDiarias
    cakes: null,
    orders: null,
    clients: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_URI;

  const fetchOrdersPickup = async (date) => {
    if (!date) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API}/orders/order/getOrderPickUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pickupDate: date.toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Guardamos los datos crudos para Eventos
      setApiData(data);

      // Procesamos los datos para CantidadesDiarias
      const processed = {
        cakes: data.flatMap((order) => order.cakes),
        orders: data.map((order) => ({
          id: order.id,
          client: order.client,
          status: order.status,
          pickupDate: order.pickupDate,
          writing: order.writing,
          notes: order.notes,
          user: order.orderUser?.[0]?.user || null,
        })),
        clients: data.map((order) => order.client),
      };
      setProcessedData(processed);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersPickup(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Columna izquierda */}
        <div className="flex flex-col w-full lg:w-3/4 p-2 lg:m-5 lg:p-0">
          <div className="flex-grow mb-2 lg:mb-5 rounded-xl bg-yellow-100">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="p-4 text-center">Cargando cantidades...</div>
            ) : error ? (
              <div className="p-4 text-red-500">Error: {error}</div>
            ) : (
              <CantidadesDiarias
                cakes={processedData.cakes}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col w-full lg:w-1/4 p-2 lg:p-4 bg-amber-800 lg:bg-transparent max-h-screen">
          {loading ? (
            <div className="p-4 text-center">Cargando eventos...</div>
          ) : error ? (
            <div className="p-4 text-red-500">Error: {error}</div>
          ) : (
            <Eventos data={apiData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default General;
