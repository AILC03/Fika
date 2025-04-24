import React, { useState } from "react";
import ConfirmModal from "../../components/alerta";
import NavigationMenu from "../../components/navigateMenu";

const General = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    console.log("Cambio confirmado.");
    setShowModal(false);
  };

  return (
    <div className="  m-10 flex">
      {/* Contenido principal con margen igual al ancho del menú */}
      <main className="flex-grow">
        <div className="p-10">
          <NavigationMenu />
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
