import { useState } from "react";
import { Search, User, Clock, Briefcase, Edit, Trash } from "lucide-react";
import FormularioEmpleado from "./formularioUsuarios";


const ListaEmpleados = ({ empleados, onActualizarEmpleado, onEliminarEmpleado }) => {
  const [filtro, setFiltro] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const valorBusqueda = busqueda.toLowerCase();
    switch (filtro) {
      case "nombre":
        return empleado.nombre.toLowerCase().includes(valorBusqueda);
      case "id":
        return empleado.numEmpleado.includes(valorBusqueda);
      case "turno":
        return empleado.turno.toLowerCase().includes(valorBusqueda);
      case "cargo":
        return empleado.cargo.toLowerCase().includes(valorBusqueda);
      default:
        return true;
    }
  });

  return (
    <div className="p-6 bg-[#FFF2C9] rounded-2xl shadow-lg border border-[#FFD538] mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-[#7E4300] text-center flex items-center justify-center gap-2">
        <Search className="w-6 h-6" /> Buscar Empleados
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <input
          type="text"
          placeholder={`Buscar por ${filtro}`}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-[#FFD538] focus:outline-none focus:ring-2 focus:ring-[#FFD538] bg-white"
        />

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 rounded-lg border border-[#FFD538] bg-white text-[#7E4300] font-semibold"
        >
          <option value="nombre">Nombre</option>
          <option value="id">Número de empleado</option>
          <option value="turno">Turno</option>
          <option value="cargo">Cargo</option>
        </select>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {empleadosFiltrados.map((empleado, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-[#FFD538] p-4 rounded-lg shadow-sm transition hover:bg-yellow-50 flex justify-between items-center"
          >
            <div>
              <p className="text-[#7E4300] font-semibold flex items-center gap-2">
                <User className="w-4 h-4" /> {empleado.nombre}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFD538]" /> {empleado.turno}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FFD538]" /> {empleado.cargo}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#FFD538]"># {empleado.numEmpleado}</span>
              </p>
            </div>

            {/* Botones Editar / Eliminar */}
            <div className="flex gap-2">
              <button
                onClick={() => setEmpleadoEditando(empleado)}
                className="text-blue-600 hover:scale-110"
                title="Editar"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEliminarEmpleado(empleado)}
                className="text-red-600 hover:scale-110"
                title="Eliminar"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {empleadosFiltrados.length === 0 && (
        <p className="text-center text-[#7E4300] mt-4">
          No se encontraron empleados.
        </p>
      )}

      {/* Modal de editar empleado */}
      {empleadoEditando && (
        <FormularioEmpleado
          datosIniciales={{
            numEmpleado: empleadoEditando.numEmpleado,
            nombre: empleadoEditando.nombre,
            turno: empleadoEditando.turno,
            cargo: empleadoEditando.cargo,
          }}
          onSubmit={(datosActualizados) => {
            // Aseguramos que los datos se actualicen correctamente
            onActualizarEmpleado(empleadoEditando.numEmpleado, datosActualizados);
            setEmpleadoEditando(null); // Cerramos el formulario al confirmar
          }}
          onClose={() => setEmpleadoEditando(null)}
        />
      )}
    </div>
  );
};

export default ListaEmpleados;
