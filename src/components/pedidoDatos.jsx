import { useState } from "react";
import { X } from "lucide-react";

const FormularioPastel = ({ datosIniciales = {}, onSubmit, onClose }) => {
  const [pestañaActiva, setPestañaActiva] = useState("Datos");

  const [form, setForm] = useState({
    celular: "",
    email: "",
    nombre: "",
    tipo: "Regular",
    cantidad: 1,
    decoraciones: {
      flores: false,
      velas: false,
      mensaje: false,
    },
    ingredientes: {
      fresa: false,
      chocolate: false,
      nuez: false,
    },
    ...datosIniciales,
  });

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const toggleCheckbox = (tipo, grupo) => {
    setForm((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [tipo]: !prev[grupo][tipo],
      },
    }));
  };

  const handleInput = (e, tipo) => {
    const value = e.target.value;
    if (tipo === "nombre") {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
        actualizarCampo("nombre", value);
      }
    } else if (tipo === "celular") {
      if (/^\d{0,10}$/.test(value)) {
        actualizarCampo("celular", value);
      }
    } else if (tipo === "email") {
      actualizarCampo("email", value);
    }
  };

  const handleSubmit = () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValido) {
      alert("Correo no válido.");
      return;
    }

    // Simular envío a API
    console.log("Enviando datos a la API...", form);
    setTimeout(() => {
      console.log("Respuesta recibida: ✅");
      if (onSubmit) onSubmit(form);
      if (onClose) onClose();
    }, 1000); // Simulación de espera de 1 segundo
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-yellow-100 rounded-xl shadow-2xl p-4 w-[400px] border border-yellow-400 z-50">
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Pestañas */}
      <div className="flex gap-2 mb-4 text-sm font-semibold text-amber-800">
        {["Datos", "Pastel", "Decoraciones", "Detalles"].map((tab) => (
          <button
            key={tab}
            onClick={() => setPestañaActiva(tab)}
            className={`px-3 py-1 rounded-lg ${
              pestañaActiva === tab ? "bg-white shadow" : "hover:bg-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="space-y-4">
        {pestañaActiva === "Datos" && (
          <>
            <div>
              <label className="block text-sm text-amber-800">Celular</label>
              <input
                type="text"
                value={form.celular}
                onChange={(e) => handleInput(e, "celular")}
                placeholder="10 dígitos"
                className="w-full p-2 rounded-md bg-white border border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-800">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleInput(e, "email")}
                placeholder="ejemplo@correo.com"
                className="w-full p-2 rounded-md bg-white border border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-800">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleInput(e, "nombre")}
                placeholder="Nombre del cliente"
                className="w-full p-2 rounded-md bg-white border border-yellow-400"
              />
            </div>
          </>
        )}

        {pestañaActiva === "Pastel" && (
          <>
            <div>
              <label className="block text-sm text-amber-800">
                Tipo de pastel
              </label>
              <select
                value={form.tipo}
                onChange={(e) => actualizarCampo("tipo", e.target.value)}
                className="w-full p-2 rounded-md bg-white border border-yellow-400"
              >
                <option value="Regular">Regular</option>
                <option value="Personalizado">Personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-amber-800">Cantidad</label>
              <select
                value={form.cantidad}
                onChange={(e) =>
                  actualizarCampo("cantidad", parseInt(e.target.value))
                }
                className="w-full p-2 rounded-md bg-white border border-yellow-400"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {pestañaActiva === "Decoraciones" && (
          <>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Decoraciones
              </p>
              {Object.keys(form.decoraciones).map((key) => (
                <label key={key} className="block text-sm text-amber-800">
                  <input
                    type="checkbox"
                    checked={form.decoraciones[key]}
                    onChange={() => toggleCheckbox(key, "decoraciones")}
                    className="mr-2"
                  />
                  {key}
                </label>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Ingredientes
              </p>
              {Object.keys(form.ingredientes).map((key) => (
                <label key={key} className="block text-sm text-amber-800">
                  <input
                    type="checkbox"
                    checked={form.ingredientes[key]}
                    onChange={() => toggleCheckbox(key, "ingredientes")}
                    className="mr-2"
                  />
                  {key}
                </label>
              ))}
            </div>
          </>
        )}

        {pestañaActiva === "Detalles" && (
          <div className="text-sm text-amber-800">
            Aquí puedes agregar instrucciones especiales u observaciones sobre
            el pastel.
          </div>
        )}
      </div>

      {/* Botón Aceptar */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 text-amber-800 px-4 py-2 rounded-lg font-semibold hover:brightness-105"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default FormularioPastel;
