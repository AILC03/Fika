import { useState } from "react";
import { X } from "lucide-react";

const FormularioCliente = ({ datosIniciales = {}, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    celular: "",
    nombre: "",
    email: "",
    ...datosIniciales,
  });

  const handleInputChange = (e, campo) => {
    const value = e.target.value;

    if (campo === "nombre") {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, nombre: value }));
      }
    } else if (campo === "celular") {
      if (/^\d{0,10}$/.test(value)) {
        setForm((prev) => ({ ...prev, celular: value }));
      }
    } else if (campo === "email") {
      setForm((prev) => ({ ...prev, email: value }));
    }
  };

  const handleSubmit = () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValido) {
      alert("Correo no válido.");
      return;
    }

    // Llamar a la función onSubmit con los datos actualizados
    if (onSubmit) onSubmit(form);

    // Cerrar el formulario
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-yellow-100 rounded-xl shadow-2xl p-6 w-[380px] border border-yellow-400 z-50">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold text-center text-amber-800 mb-4">
        Editar Cliente
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-amber-800">Teléfono Celular</label>
          <input
            type="text"
            value={form.celular}
            onChange={(e) => handleInputChange(e, "celular")}
            placeholder="10 dígitos"
            className="w-full p-2 rounded-md bg-white border border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm text-amber-800">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleInputChange(e, "nombre")}
            placeholder="Nombre del cliente"
            className="w-full p-2 rounded-md bg-white border border-yellow-400"
          />
        </div>
        <div>
          <label className="block text-sm text-amber-800">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange(e, "email")}
            placeholder="ejemplo@correo.com"
            className="w-full p-2 rounded-md bg-white border border-yellow-400"
          />
        </div>
      </div>

      {/* Botón Confirmar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 text-amber-800 px-4 py-2 rounded-lg font-semibold hover:brightness-105"
        >
          Confirmar Cambios
        </button>
      </div>
    </div>
  );
};

export default FormularioCliente;
