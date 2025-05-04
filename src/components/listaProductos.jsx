import { useEffect, useState } from "react";
import ConfirmModal from "./alerta"; // Asegúrate de importar el componente

export default function Ingredientes({ apiData }) {
  const [pasteles, setPasteles] = useState([]);
  const [ingredientesState, setIngredientesState] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  useEffect(() => {
    if (apiData?.pasteles) {
      const pastelesFiltrados = apiData.pasteles
        .map((pastel) => ({
          ...pastel,
          flavors: pastel.flavors.filter(
            (sabor) => sabor.ingredients?.length > 0
          ),
        }))
        .filter((pastel) => pastel.flavors.length > 0);

      setPasteles(pastelesFiltrados);

      const initialState = {};
      pastelesFiltrados.forEach((pastel) => {
        pastel.flavors.forEach((sabor) => {
          sabor.ingredients.forEach((ingrediente) => {
            const key = `${pastel.id}-${sabor.id}-${ingrediente.id}`;
            initialState[key] = ingrediente.available;
          });
        });
      });
      setIngredientesState(initialState);
    }
  }, [apiData]);

  const toggleIngrediente = (pastelId, saborId, ingredienteId) => {
    const key = `${pastelId}-${saborId}-${ingredienteId}`;
    setIngredientesState((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const guardarCambios = async () => {
    try {
      console.log("Datos a enviar a la API:", ingredientesState);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasChanges(false);
      // Mostrar modal de éxito
      setModal({
        isOpen: true,
        title: "Éxito",
        message: "Los cambios se guardaron correctamente",
        isSuccess: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      // Mostrar modal de error
      setModal({
        isOpen: true,
        title: "Error",
        message: "Hubo un problema al guardar los cambios",
        isSuccess: false,
      });
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const getTipoPastelNombre = (tipo) => {
    switch (tipo) {
      case "DELUXE":
        return "Deluxe";
      case "SPONGE_CAKE":
        return "Bisquet";
      case "TRADITIONAL":
        return "Tradicional";
      case "CLASIC":
        return "Clásico";
      default:
        return tipo;
    }
  };

  if (!pasteles?.length) {
    return (
      <div className="w-full p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          Gestión de Ingredientes
        </h1>
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-2/6 flex flex-col p-4 md:p-6 bg-amber-100 rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4 md:mb-6">
        Gestión de Ingredientes
      </h1>

      <div className="flex-1 overflow-y-auto pr-2 md:max-h-96">
        <div className="space-y-4">
          {pasteles.map((pastel) => (
            <div
              key={pastel.id}
              className="bg-amber-200 p-3 md:p-4 rounded-lg shadow"
            >
              <h2 className="text-lg md:text-xl font-semibold text-amber-800 mb-3">
                {getTipoPastelNombre(pastel.type)}
              </h2>

              <div className="space-y-4">
                {pastel.flavors.map((sabor) => (
                  <div
                    key={`${pastel.id}-${sabor.id}`}
                    className="border-b pb-3 last:border-b-0"
                  >
                    <h3 className="text-base md:text-lg font-medium text-amber-700 mb-2">
                      {sabor.name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                      {sabor.ingredients.map((ingrediente) => {
                        const key = `${pastel.id}-${sabor.id}-${ingrediente.id}`;
                        return (
                          <label
                            key={key}
                            className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                              ingredientesState[key]
                                ? "bg-green-50 hover:bg-green-100 border border-green-200"
                                : "bg-red-50 hover:bg-red-100 border border-red-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={ingredientesState[key] || false}
                              onChange={() =>
                                toggleIngrediente(
                                  pastel.id,
                                  sabor.id,
                                  ingrediente.id
                                )
                              }
                              className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm md:text-base">
                              {ingrediente.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasChanges && (
        <div className="sticky bottom-0 pt-4 bg-orange-50 border-t border-amber-200">
          <button
            onClick={guardarCambios}
            className="w-full md:w-auto px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        confirmText="Aceptar"
        showCancelButton={false}
        confirmButtonColor={
          modal.isSuccess
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }
      />
    </div>
  );
}
