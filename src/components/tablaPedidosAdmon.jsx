import { useState } from "react";
import { Search, User, Phone, Mail } from "lucide-react";


const BuscadorPedidos = ({ pedidos }) => { //recibe la info de pedidos
  const [filtro, setFiltro] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const valorBusqueda = busqueda.toLowerCase();
    switch (filtro) {
      case "nombre":
        return pedido.nombre.toLowerCase().includes(valorBusqueda);
      case "celular":
        return pedido.celular.includes(valorBusqueda);
      case "email":
        return pedido.email.toLowerCase().includes(valorBusqueda);
      default:
        return true;
    }
  });

  const handlePedidoClick = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  return (
    <div className=" p-6 bg-[#FFF2C9] rounded-2xl shadow-lg border border-[#FFD538] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#7E4300] text-center flex items-center justify-center gap-2">
        <Search className="w-6 h-6" /> Buscar Pedidos
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
          <option value="celular">Celular</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {pedidosFiltrados.map((pedido, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-[#FFD538] p-4 rounded-lg shadow-sm cursor-pointer transition hover:bg-yellow-50"
            onClick={() => handlePedidoClick(pedido)}
          >
            <p className="text-[#7E4300] font-semibold flex items-center gap-2">
              <User className="w-4 h-4" /> {pedido.nombre}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FFD538]" /> {pedido.celular}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FFD538]" /> {pedido.email}
            </p>
            <p className="text-sm text-[#7E4300] mt-1">
              <strong>Fecha de recolección:</strong> {pedido.fechaRecoleccion}
            </p>
            <ul className="text-sm list-disc ml-6 mt-2">
              {pedido.productos.map((prod, i) => (
                <li key={i}>
                  {prod.categoria}, {prod.sabor}, {prod.tamano}{" "}
                  {prod.escritura && <em>- "{prod.escritura}"</em>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <p className="text-center text-[#7E4300] mt-4">
          No se encontraron pedidos.
        </p>
      )}
      // Componente para editar la informacion que hay en ese pedido
    </div>
  );
};

export default BuscadorPedidos;
