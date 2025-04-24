import { useState } from "react";

export default function PedidoForm({ onClose }) {
  const [tab, setTab] = useState("datos"); // Pestaña actual
  const [tipoPastel, setTipoPastel] = useState(""); // Tipo de pastel
  const [cantidad, setCantidad] = useState(""); // Cantidad o pisos
  const [tamano, setTamano] = useState(""); // Tamaño del pastel
  const [sabor, setSabor] = useState(""); // Sabor del pastel
  const [decoracion, setDecoracion] = useState(""); // Decoración
  const [escritura, setEscritura] = useState(""); // Texto en el pastel
  const [decoracionesSeleccionadas, setDecoracionesSeleccionadas] = useState(
    []
  ); // Decoraciones seleccionadas
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(
    []
  ); // Ingredientes seleccionados
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [date, setDate] = useState("");
  const [hora, setHora] = useState("");
  const [estatus, setEstatus] = useState("");

  const isDatosComplete = () =>
    celular.trim() && email.trim() && nombre.trim() && tipoPastel && cantidad;

  const isPastelComplete = () =>
    tamano && sabor && decoracion && escritura.trim();

  const isDecoracionesComplete = () =>
    decoracionesSeleccionadas.length > 0 &&
    ingredientesSeleccionados.length > 0;

  const isFormComplete = () =>
    isDatosComplete() &&
    isPastelComplete() &&
    isDecoracionesComplete() &&
    date &&
    hora &&
    estatus;

  const handleNext = () => {
    if (tab === "datos" && isDatosComplete()) setTab("pastel");
    else if (tab === "pastel" && isPastelComplete()) setTab("decoraciones");
    else if (tab === "decoraciones" && isDecoracionesComplete())
      setTab("detalles");
  };

  const handlePrevious = () => {
    if (tab === "pastel") setTab("datos");
    else if (tab === "decoraciones") setTab("pastel");
    else if (tab === "detalles") setTab("decoraciones");
  };

  const toggleCheckbox = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="relative w-full max-w-2xl mx-auto p-6 bg-white border shadow rounded-xl">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex justify-between mb-4 text-sm font-medium">
          {["datos", "pastel", "decoraciones", "detalles"].map((t, idx) => {
            const tabs = ["datos", "pastel", "decoraciones", "detalles"];
            const currentIndex = tabs.indexOf(tab);
            const canGoBack = idx <= currentIndex; // Permite regresar o quedarse

            return (
              <button
                key={t}
                className={`px-4 py-2 border-b-2 ${
                  tab === t
                    ? "border-black font-bold"
                    : canGoBack
                    ? "border-transparent text-gray-400 hover:text-black"
                    : "border-transparent text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (canGoBack) setTab(t);
                }}
                disabled={!canGoBack}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENIDOS */}
        {tab === "datos" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Tipo de pastel</label>
              <select
                value={tipoPastel}
                onChange={(e) => setTipoPastel(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecciona un tipo</option>
                <option value="clasico">Clásico</option>
                <option value="personalizado">Personalizado</option>
                <option value="tematico">Temático</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">
                {tipoPastel === "personalizado" ? "Pisos" : "Cantidad"}
              </label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"
                disabled={tab === "datos"} // Deshabilita el botón si está en la primera pestaña
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={!isDatosComplete()}
                className={`px-4 py-2 rounded ${
                  isDatosComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {tab === "pastel" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Tamaño</label>
              <input
                type="text"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Sabor</label>
              <select
                value={sabor}
                onChange={(e) => setSabor(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecciona un sabor</option>
                <option value="chocolate">Chocolate</option>
                <option value="vainilla">Vainilla</option>
                <option value="fresa">Fresa</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Decoración</label>
              <select
                value={decoracion}
                onChange={(e) => setDecoracion(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecciona una decoración</option>
                <option value="flores">Flores</option>
                <option value="tematica">Temática</option>
                <option value="minimalista">Minimalista</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Escritura</label>
              <input
                type="text"
                value={escritura}
                onChange={(e) => setEscritura(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={!isPastelComplete()}
                className={`px-4 py-2 rounded ${
                  isPastelComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {tab === "decoraciones" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Decoraciones</h3>
              {["Flores", "Figuras", "Perlas"].map((item) => (
                <div key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={decoracionesSeleccionadas.includes(item)}
                    onChange={() =>
                      toggleCheckbox(
                        decoracionesSeleccionadas,
                        setDecoracionesSeleccionadas,
                        item
                      )
                    }
                    className="mr-2"
                  />
                  <label>{item}</label>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-bold mb-2">Ingredientes</h3>
              {["Chocolate", "Frutas", "Crema"].map((item) => (
                <div key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ingredientesSeleccionados.includes(item)}
                    onChange={() =>
                      toggleCheckbox(
                        ingredientesSeleccionados,
                        setIngredientesSeleccionados,
                        item
                      )
                    }
                    className="mr-2"
                  />
                  <label>{item}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={!isDecoracionesComplete()}
                className={`px-4 py-2 rounded ${
                  isDecoracionesComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {tab === "detalles" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Fecha de recolección</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Estatus</label>
              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecciona un estatus</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400"
              >
                Anterior
              </button>
              <button
                onClick={onClose}
                disabled={!isFormComplete()}
                className={`px-4 py-2 rounded ${
                  isFormComplete()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
