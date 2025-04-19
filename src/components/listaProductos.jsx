import { useEffect, useState } from "react";

const getPastelesFromAPI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Clásicos: [
          { sabor: "Frutos rojos", disponible: true },
          { sabor: "Chocolate", disponible: false },
          { sabor: "Guayaba", disponible: true },
          { sabor: "Mango", disponible: false },
          { sabor: "Pellizco", disponible: true },
          { sabor: "Temporada", disponible: false },
        ],
        Deluxe: [
          { sabor: "Pasión", disponible: true },
          { sabor: "Frutos Rojos", disponible: false },
          { sabor: "Fresas con crema", disponible: true },
          { sabor: "Barroco", disponible: false },
          { sabor: "Pellizco", disponible: true },
        ],
        Biscochos: [
          { sabor: "Chocholate", disponible: true },
          { sabor: "Blueberry", disponible: false },
          { sabor: "Vainilla", disponible: true },
          { sabor: "Red Velvet", disponible: false },
          { sabor: "Zanahoria", disponible: true },
        ],
        Tradicionales: [
          { sabor: "Tartas - Limón", disponible: false },
          { sabor: "Tartas - Frutos Rojos", disponible: true },
          { sabor: "3 leches", disponible: true },
          { sabor: "Chocoflan", disponible: false },
          { sabor: "Cheesecake - Frutos Rojos", disponible: true },
          { sabor: "Cheesecake - Temporada", disponible: false },
          { sabor: "Tiramisú", disponible: true },
        ],
      });
    }, 500);
  });
};

export default function Pasteles() {
  const [pasteles, setPasteles] = useState({});
  const [activos, setActivos] = useState({});
  const [activosOriginal, setActivosOriginal] = useState({}); // Guardamos el estado original
  const [guardado, setGuardado] = useState(true); // Estado para saber si se han realizado cambios

  useEffect(() => {
    const fetchPasteles = async () => {
      const data = await getPastelesFromAPI();
      setPasteles(data);

      // Inicializa el estado de disponibilidad desde la respuesta de la API
      const inicial = {};
      for (const categoria in data) {
        data[categoria].forEach((producto) => {
          inicial[`${categoria}-${producto.sabor}`] = producto.disponible;
        });
      }

      // Guardamos el estado original
      setActivos(inicial);
      setActivosOriginal(inicial);
    };

    fetchPasteles();
  }, []);

  // Función para manejar cambios en los checkboxes
  const toggleActivo = (key) => {
    setActivos((prev) => {
      const newActivos = { ...prev };
      newActivos[key] = !newActivos[key]; // Cambiar el estado del checkbox
      return newActivos;
    });
    setGuardado(false); // Marcar como "no guardado" cuando hay cambios
  };

  // Función para guardar cambios
  const guardarCambios = () => {
    // Simular guardar cambios en la base de datos (en este caso solo actualizamos el estado local)
    Object.keys(activos).forEach((key) => {
      const [categoria, sabor] = key.split('-');
      // Aquí deberías hacer una solicitud a la API para actualizar el estado del producto en la base de datos
      console.log(`Guardando cambio: ${categoria} - ${sabor} - ${activos[key] ? 'Activo' : 'Inactivo'}`);
    });

    setGuardado(true); // Marcar como "guardado"
  };

  // Función para deshacer cambios
  const deshacerCambios = () => {
    setActivos({ ...activosOriginal }); // Restauramos el estado original
    setGuardado(true); // Marcar como "guardado" porque se restauraron los cambios
  };

  return (
    <div className="p-6 bg-orange-100 rounded-lg shadow-xl w-full max-w-[100rem] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-amber-900">Gestión de Pasteles</h2>
      {Object.entries(pasteles).map(([categoria, sabores]) => (
        <div key={categoria} className="mb-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-2">{categoria}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sabores.map((producto) => {
              const key = `${categoria}-${producto.sabor}`;
              return (
                <label
                  key={key}
                  className={`flex items-center p-3 rounded shadow ${
                    activos[key] ? "bg-yellow-50 hover:bg-yellow-100" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activos[key]}
                    onChange={() => toggleActivo(key)}
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
      {/* Botones para guardar o deshacer cambios */}
      {!guardado && (
        <div className="mt-4 space-x-2">
          <button
            onClick={guardarCambios}
            className="py-2 px-4 bg-amber-500 text-white rounded-md"
          >
            Guardar cambios
          </button>
          <button
            onClick={deshacerCambios}
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
          >
            Deshacer cambios
          </button>
        </div>
      )}
    </div>
  );
}
