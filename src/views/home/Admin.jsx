import React, { useState } from "react";
import ConfirmModal from "../../components/alerta";
import NavigationMenu from "../../components/navigateMenu";

const General = () => {
  return (
    <div className="  m-10 flex">
      {/* Contenido principal con margen igual al ancho del menú */}
      <main className="flex-grow">
        <div className="p-10">
          <NavigationMenu />
        </div>
      </main>
    </div>
  );
};
export default General;
