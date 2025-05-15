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
    >
      {tabs.map((tab) => (
        <Tab key={tab.id} value={tab.id} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default MenuTabs;
