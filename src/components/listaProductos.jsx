import { useEffect, useState } from "react";

export default function Pasteles({ apiResponse }) {
  const [pasteles, setPasteles] = useState({});
  const [activos, setActivos] = useState({});
  const [activosOriginal, setActivosOriginal] = useState({}); // Guardamos el estado original
  const [guardado, setGuardado] = useState(true); // Estado para saber si se han realizado cambios

  useEffect(() => {
    // Usamos la respuesta simulada de la API pasada como prop
    const data = apiResponse;
    setPasteles(data);

    // Inicializa el estado de disponibilidad
    const inicial = {};
    Object.keys(data).forEach((categoria) => {
      inicial[categoria] = data[categoria].reduce((acc, producto) => {
        acc[producto.sabor] = producto.disponible;
        return acc;
      }, {});
    });

    // Guardamos el estado original
    setActivos(inicial);
    setActivosOriginal(inicial);
  }, [apiResponse]);

  const toggleActivo = (categoria, sabor) => {
    setActivos((prev) => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [sabor]: !prev[categoria][sabor],
      },
    }));
    setGuardado(false); // Marcar como "no guardado" cuando hay cambios
  };

  const guardarCambios = async () => {
    await new Promise((res) => setTimeout(res, 500)); // Simula retardo
    setGuardado(true);
    localStorage.setItem("pastelesState", JSON.stringify(activos)); // Guardamos el estado en localStorage
  };

  return (
    <div className="p-6 bg-orange-100 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-amber-900">
        Gestión de Pasteles
      </h2>
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(pasteles).map(([categoria, sabores]) => (
          <div key={categoria} className="mb-6">
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              {categoria}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sabores.map((producto) => {
                const key = `${categoria}-${producto.sabor}`;
                return (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded shadow transition-all duration-300 ${
                      activos[categoria]?.[producto.sabor]
                        ? "bg-yellow-200 hover:bg-yellow-300"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={activos[categoria]?.[producto.sabor]}
                      onChange={() => toggleActivo(categoria, producto.sabor)}
                      disabled={false} // Los checkboxes siempre son habilitados
                      className="mr-2"
                    />
                    {producto.sabor}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* Botones para guardar o deshacer cambios */}
      {!guardado && (
        <div className="mt-4 space-x-2">
          <button
            onClick={guardarCambios}
            className="py-2 px-4 bg-amber-500 text-white rounded-md"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}
