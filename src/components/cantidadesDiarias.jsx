import { useState, useEffect } from "react";

const CantidadesDiarias = ({ cakes }) => {
  const [groupedCakes, setGroupedCakes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cakes) {
      setLoading(true);
      try {
        // Procesamos los cakes para agruparlos
        const processed = processCakes(cakes);
        setGroupedCakes(processed);
      } catch (error) {
        console.error("Error processing cakes:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [cakes]);

  const processCakes = (cakesData) => {
    const counts = {};

    cakesData.forEach((cake) => {
      // Manejar pasteles multifloor (pisos)
      if (cake.itemType === "MULTIFLOOR" && cake.floors?.length > 0) {
        cake.floors.forEach((floor) => {
          const key = `MULTIFLOOR-${cake.line.line}-${floor.flavor.flavor}-${floor.size.size}`;
          counts[key] = (counts[key] || 0) + 1;
        });
      }
      // Manejar cupcakes
      else if (cake.itemType === "CUPCAKE") {
        const key = `CUPCAKE-${cake.line.line}-${
          cake.flavor?.flavor || "Sin sabor"
        }-${cake.cupcakeQty || 0}`;
        counts[key] = (counts[key] || 0) + (cake.cupcakeQty || 1);
      }
      // Manejar pasteles regulares
      else {
        const key = `${cake.itemType}-${cake.line.line}-${
          cake.flavor?.flavor || "Sin sabor"
        }-${cake.size?.size || "N/A"}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    // Convertir el objeto de conteo a un array para renderizar
    return Object.entries(counts).map(([key, count]) => {
      const [type, line, flavor, size] = key.split("-");
      return { type, line, flavor, size, count };
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Tipo</th>
            <th className="py-2 px-4 text-left">Línea</th>
            <th className="py-2 px-4 text-left">Sabor</th>
            <th className="py-2 px-4 text-left">Tamaño/Cant</th>
            <th className="py-2 px-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : groupedCakes.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            groupedCakes.map((cake, idx) => (
              <tr
                key={`${cake.type}-${cake.line}-${cake.flavor}-${cake.size}-${idx}`}
                className={idx % 2 === 0 ? "bg-yellow-100" : "bg-white"}
              >
                <td className="py-2 px-4 capitalize">
                  {cake.type.toLowerCase()}
                </td>
                <td className="py-2 px-4">{cake.line}</td>
                <td className="py-2 px-4">{cake.flavor}</td>
                <td className="py-2 px-4">{cake.size}</td>
                <td className="py-2 px-4 font-bold">{cake.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CantidadesDiarias;
