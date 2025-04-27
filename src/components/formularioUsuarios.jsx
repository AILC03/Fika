import { useState } from "react";
import { X } from "lucide-react";

const FormularioEmpleado = ({ datosIniciales = {}, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    numEmpleado: "",
    nombre: "",
    turno: "",
    cargo: "",
    ...datosIniciales,
  });

  const handleInputChange = (e, campo) => {
    const value = e.target.value;

    if (campo === "nombre") {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, nombre: value }));
      }
    } else if (campo === "numEmpleado") {
      if (/^\d{0,10}$/.test(value)) {
        setForm((prev) => ({ ...prev, numEmpleado: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [campo]: value }));
    }
  };

  const handleSubmit = () => {
    // Verificar que todos los campos estén completos
    if (!form.nombre || !form.turno || !form.cargo || !form.numEmpleado) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Llamar a la función onSubmit con los datos actualizados
    if (onSubmit) onSubmit(form);

    // Cerrar el formulario
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#FFF2C9] rounded-xl shadow-2xl p-6 w-[380px] border border-[#FFD538] z-50">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-bold text-center text-[#7E4300] mb-4">
        Editar Empleado
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[#7E4300]">Número de Empleado</label>
          <input
            type="text"
            value={form.numEmpleado}
            onChange={(e) => handleInputChange(e, "numEmpleado")}
            placeholder="Número de empleado"
            className="w-full p-2 rounded-md bg-white border border-[#FFD538]"
          />
        </div>
        <div>
          <label className="block text-sm text-[#7E4300]">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleInputChange(e, "nombre")}
            placeholder="Nombre del empleado"
            className="w-full p-2 rounded-md bg-white border border-[#FFD538]"
          />
        </div>
        <div>
          <label className="block text-sm text-[#7E4300]">Turno</label>
          <input
            type="text"
            value={form.turno}
            onChange={(e) => handleInputChange(e, "turno")}
            placeholder="Turno del empleado"
            className="w-full p-2 rounded-md bg-white border border-[#FFD538]"
          />
        </div>
        <div>
          <label className="block text-sm text-[#7E4300]">Cargo</label>
          <input
            type="text"
            value={form.cargo}
            onChange={(e) => handleInputChange(e, "cargo")}
            placeholder="Cargo del empleado"
            className="w-full p-2 rounded-md bg-white border border-[#FFD538]"
          />
        </div>
      </div>

      {/* Botón Confirmar */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#FFD538] text-[#7E4300] px-4 py-2 rounded-lg font-semibold hover:brightness-105"
        >
          Confirmar Cambios
        </button>
      </div>
    </div>
  );
};

export default FormularioEmpleado;
