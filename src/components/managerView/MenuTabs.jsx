import React from "react";
import { Tabs, Tab } from "@mui/material";

const MenuTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "orders", label: "Pedidos" },
    { id: "cakeManagement", label: "Gestión de Pasteles" },
    { id: "saleLimitations", label: "Delimitaciones de Venta" },
    { id: "customers", label: "Clientes" },
    { id: "employees", label: "Empleados" },
  ];

  return (
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => onTabChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Administración"
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "#FFD538", // Amarillo brillante para el indicador
        },
        backgroundColor: "#FFF2C9", // Fondo crema claro
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          value={tab.id}
          label={tab.label}
          sx={{
            color: "#7E4300", // Marrón oscuro para texto inactivo
            "&.Mui-selected": {
              color: "#7E4300", // Marrón oscuro para texto activo
              fontWeight: "bold",
            },
            "&:hover": {
              color: "#7E4300", // Marrón oscuro al hover
              backgroundColor: "#FFD538", // Amarillo brillante de fondo al hover
              opacity: 0.8,
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default MenuTabs;
