import { useState } from "react";
import { Search, User, Phone, Mail } from "lucide-react";

const ListaClientes = ({ personas }) => {
  const [filtro, setFiltro] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");

  const personasFiltradas = personas.filter((persona) => {
    const valorBusqueda = busqueda.toLowerCase();
    switch (filtro) {
      case "nombre":
        return persona.nombre.toLowerCase().includes(valorBusqueda);
      case "id":
        return persona.id.includes(valorBusqueda);
      case "email":
        return persona.email.toLowerCase().includes(valorBusqueda);
      default:
        return true;
    }
  });

  return (
    <div className="p-6 bg-[#FFF2C9] rounded-2xl shadow-lg border border-[#FFD538] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#7E4300] text-center flex items-center justify-center gap-2">
        <Search className="w-6 h-6" /> Buscar Personas
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
          <option value="id">ID (Celular)</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {personasFiltradas.map((persona, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-[#FFD538] p-4 rounded-lg shadow-sm transition hover:bg-yellow-50"
          >
            <p className="text-[#7E4300] font-semibold flex items-center gap-2">
              <User className="w-4 h-4" /> {persona.nombre}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FFD538]" /> {persona.id}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FFD538]" /> {persona.email}
            </p>
          </div>
        ))}
      </div>

      {personasFiltradas.length === 0 && (
        <p className="text-center text-[#7E4300] mt-4">
          No se encontraron personas.
        </p>
      )}
    </div>
  );
};

export default ListaClientes;
