import { useState, useEffect } from "react";

const CantidadesDiarias = ({ selectedDate }) => {
  const [cantidades, setCantidades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cantidades cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const fetchCantidades = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/cantidades?fecha=${selectedDate}`);
          const data = await response.json();
          setCantidades(data);
        } catch (error) {
          console.error("Error fetching cantidades:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCantidades();
    }
  }, [selectedDate]);

  // Agrupar datos por tipo, línea, sabor y tamaño
  const groupedData = cantidades.reduce((acc, item) => {
    item.items.forEach((cakeItem) => {
      const type = cakeItem.type;
      const line = cakeItem.line.name;
      const flavor = cakeItem.flavor?.name || "Sin sabor";
      const size = cakeItem.size?.name || "N/A";

      if (!acc[type]) acc[type] = {};
      if (!acc[type][line]) acc[type][line] = {};
      if (!acc[type][line][flavor]) acc[type][line][flavor] = {};

      acc[type][line][flavor][size] = (acc[type][line][flavor][size] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-amber-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Tipo</th>
            <th className="py-2 px-4 text-left">Línea</th>
            <th className="py-2 px-4 text-left">Sabor</th>
            <th className="py-2 px-4 text-left">Tamaño</th>
            <th className="py-2 px-4 text-left">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : (
            Object.entries(groupedData).map(([type, lines]) =>
              Object.entries(lines).map(([line, flavors]) =>
                Object.entries(flavors).map(([flavor, sizes]) =>
                  Object.entries(sizes).map(([size, count], idx) => (
                    <tr
                      key={`${type}-${line}-${flavor}-${size}`}
                      className={idx % 2 === 0 ? "bg-yellow-100" : "bg-white"}
                    >
                      <td className="py-2 px-4">{type}</td>
                      <td className="py-2 px-4">{line}</td>
                      <td className="py-2 px-4">{flavor}</td>
                      <td className="py-2 px-4">{size}</td>
                      <td className="py-2 px-4">{count}</td>
                    </tr>
                  ))
                )
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CantidadesDiarias;
