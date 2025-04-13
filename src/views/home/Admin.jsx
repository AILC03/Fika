import React, { useState } from "react";
import MapApi from "../../components/tablaAdmon";
import ConfirmModal from "../../components/alerta";
import NavigationMenu from "../../components/navigateMenu";

const General = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    console.log("Cambio confirmado.");
    setShowModal(false);
  };

  return (
    <div className="h-screen  m-10 flex">
      {/* Contenido principal con margen igual al ancho del menú */}
      <main className="flex-grow">
        <MapApi />
        <div className="p-10">
          <NavigationMenu />
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 px-4 py-2 text-white rounded"
          >
            Eliminar algo
          </button>

          <ConfirmModal
            isOpen={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        </div>
      </main>
    </div>
  );
};
export default General;
