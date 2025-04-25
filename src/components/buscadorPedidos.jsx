import { useState, useEffect, useRef } from "react";
import { Search, User, Phone, Mail, X } from "lucide-react";
import FormularioPastel from "./pedidoDatos"; // Asegúrate de importar el FormularioPastel

const BuscadorPedidos = ({ pedidos, onClose }) => {
  const [filtro, setFiltro] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); // Nuevo estado para el pedido seleccionado
  const boxRef = useRef(null);

  const startDrag = (e) => {
    const box = boxRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
    });
    setDragging(true);
  };

  const duringDrag = (e) => {
    if (!dragging) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const box = boxRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - box.width;
    const maxY = window.innerHeight - box.height;

    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY),
    });
  };

  const stopDrag = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", duringDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", duringDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  });

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
    // Actualizamos el estado con el pedido seleccionado
    setPedidoSeleccionado(pedido);
  };

  return (
    <div
      ref={boxRef}
      className="fixed z-50 max-w-2xl w-[90%] md:w-[600px] p-4 bg-[#FFF2C9] rounded-2xl shadow-lg border border-[#FFD538] cursor-move"
      onMouseDown={startDrag}
      style={{ top: position.y, left: position.x }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-[#7E4300] hover:text-red-600 transition"
        title="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-[#7E4300] text-center flex items-center gap-2">
        <Search className="w-6 h-6" /> Buscar Pedidos
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
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

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {pedidosFiltrados.map((pedido, index) => (
          <div
            key={index}
            className="bg-white border-l-4 border-[#FFD538] p-4 rounded-lg shadow-sm"
            onClick={() => handlePedidoClick(pedido)} // Manejar el click
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

      {pedidoSeleccionado && (
        <FormularioPastel
          datosIniciales={pedidoSeleccionado}
          onSubmit={(formData) => {
            console.log("Datos del formulario:", formData);
          }}
          onClose={() => setPedidoSeleccionado(null)} // Cierra el formulario cuando se cancela
        />
      )}
    </div>
  );
};

export default BuscadorPedidos;
