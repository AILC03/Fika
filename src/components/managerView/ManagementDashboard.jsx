import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MenuTabs from "./MenuTabs";
import OrdersView from "./OrdersView";
import CakeManagementView from "./CakeManagementView";
import SaleLimitationsView from "./SaleLimitationsView";
import CustomersView from "./CustomersView";
import EmployeesView from "./EmployeesView";

// Custom theme for Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontSize: "1.1rem",
    },
    body1: {
      fontSize: "0.9rem",
    },
  },
});

const ManagementDashboard = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State for active tab
  const [activeTab, setActiveTab] = useState("orders");

  // Loading and notification states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Data states
  const [orders, setOrders] = useState([]);
  const [cakesData, setCakesData] = useState([]);
  const [limitations, setLimitations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Handler for tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Load specific data when changing tabs
    if (tab === "orders" && orders.length === 0) fetchOrders();
    if (tab === "cakeManagement" && cakesData.length === 0) fetchCakesData();
    if (tab === "saleLimitations" && limitations.length === 0)
      fetchLimitations();
    if (tab === "customers" && customers.length === 0) fetchCustomers();
    if (tab === "employees" && employees.length === 0) fetchEmployees();
  };

  // Error handler
  const handleError = (err) => {
    console.error("Error:", err);
    setError(err.message || "An error occurred");
    setLoading(false);
  };

  // Success message handler
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Data refresh function
  const refreshData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "orders":
          await fetchOrders();
          break;
        case "cakeManagement":
          await fetchCakesData();
          break;
        case "saleLimitations":
          await fetchLimitations();
          break;
        case "customers":
          await fetchCustomers();
          break;
        case "employees":
          await fetchEmployees();
          break;
        default:
          break;
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data fetch functions
  const fetchOrders = async () => {
    try {
      const mockOrders = [
        {
          id: 1,
          customer: {
            id: 1,
            name: "Juan Pérez",
            phone: "5551234567",
            email: "juan@example.com",
            createdAt: "2025-01-15T10:00:00.000Z",
          },
          items: [],
          pickupDateTime: "2025-05-15T14:00:00.000Z",
          status: "in_progress",
          writing: "Feliz cumpleaños",
          notes: "Pastel con fresas",
        },
      ];
      setOrders(mockOrders);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchCakesData = async () => {
    try {
      const mockCakesData = [
        {
          id: 1,
          type: "DELUXE",
          date: "2025-05-05",
          avalible: true,
          flavors: [
            {
              id: 1,
              name: "Frutos Rojos",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 6, name: "Frambuesa", date: "2025-05-05" },
                { id: 7, name: "Zarzamora", date: "2025-05-05" },
              ],
            },
            {
              id: 5,
              name: "Pellizco",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 8, name: "Dulce de leche", date: "2025-05-05" },
                { id: 9, name: "Almendra", date: "2025-05-05" },
              ],
            },
            {
              id: 7,
              name: "Pasion",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 1, name: "Fresa", date: "2025-05-05" },
                { id: 2, name: "Platano", date: "2025-05-05" },
                { id: 3, name: "Nutella", date: "2025-05-05" },
                { id: 4, name: "Nuez", date: "2025-05-05" },
              ],
            },
            {
              id: 8,
              name: "Fresas con Crema",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 9,
              name: "Barroco",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 1, name: "Fresa", date: "2025-05-05" },
                { id: 3, name: "Nutella", date: "2025-05-05" },
                { id: 4, name: "Nuez", date: "2025-05-05" },
              ],
            },
          ],
          sizes: [
            { id: 1, size: "3", date: "2025-05-06", avalible: true },
            { id: 2, size: "4", date: "2025-05-05", avalible: true },
            { id: 3, size: "6", date: "2025-05-05", avalible: true },
            { id: 5, size: "9", date: "2025-05-05", avalible: true },
            { id: 6, size: "12", date: "2025-05-05", avalible: true },
            {
              id: 7,
              size: "1/4 de Plancha",
              date: "2025-05-05",
              avalible: true,
            },
            {
              id: 8,
              size: "1/2 Plancha",
              date: "2025-05-05",
              avalible: true,
            },
          ],
        },
        {
          id: 2,
          type: "SPONGE_CAKE",
          date: "2025-05-05",
          avalible: true,
          flavors: [
            {
              id: 2,
              name: "Chocolate",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 10,
              name: "Blueberry",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 10, name: "Cheesecake", date: "2025-05-05" },
                { id: 11, name: "Curl de limon", date: "2025-05-05" },
              ],
            },
            {
              id: 11,
              name: "Vainilla",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                {
                  id: 12,
                  name: "Cremoso de frutos rojos",
                  date: "2025-05-05",
                },
                {
                  id: 13,
                  name: "Confitura de frambuesa",
                  date: "2025-05-05",
                },
              ],
            },
            {
              id: 12,
              name: "Red Velvet",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 10, name: "Cheesecake", date: "2025-05-05" },
                { id: 14, name: "Galleta de cheesecake", date: "2025-05-05" },
              ],
            },
            {
              id: 13,
              name: "Zanahoria",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
          ],
          sizes: [
            { id: 1, size: "3", date: "2025-05-05", avalible: true },
            { id: 4, size: "8", date: "2025-05-05", avalible: true },
            { id: 6, size: "12", date: "2025-05-05", avalible: true },
          ],
        },
        {
          id: 3,
          type: "TRADITIONAL",
          date: "2025-05-05",
          avalible: true,
          flavors: [
            {
              id: 15,
              name: "Tartas",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 15, name: "Limon", date: "2025-05-05" },
                { id: 16, name: "Frutos rojos", date: "2025-05-05" },
              ],
            },
            {
              id: 16,
              name: "3 Leches",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 17,
              name: "Chocoflan",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 18,
              name: "Cheesecake",
              date: "2025-05-05",
              avalible: true,
              ingredients: [
                { id: 16, name: "Frutos rojos", date: "2025-05-05" },
                { id: 17, name: "temporada", date: "2025-05-05" },
              ],
            },
            {
              id: 19,
              name: "Tiramisu",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
          ],
          sizes: [
            { id: 1, size: "3", date: "2025-05-05", avalible: true },
            { id: 3, size: "6", date: "2025-05-05", avalible: true },
            { id: 4, size: "8", date: "2025-05-05", avalible: true },
            { id: 5, size: "9", date: "2025-05-05", avalible: true },
            { id: 6, size: "12", date: "2025-05-05", avalible: true },
          ],
        },
        {
          id: 4,
          type: "CLASIC",
          date: "2025-05-05",
          avalible: true,
          flavors: [
            {
              id: 1,
              name: "Frutos Rojos",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 2,
              name: "Chocolate",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 3,
              name: "Guayaba",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 4,
              name: "Mango",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 5,
              name: "Pellizco",
              date: "2025-05-05",
              avalible: true,
              ingredients: [],
            },
            {
              id: 6,
              name: "Temporada",
              date: "2025-05-07",
              avalible: true,
              ingredients: [],
            },
          ],
          sizes: [{ id: 4, size: "8", date: "2025-05-07", avalible: true }],
        },
        {
          id: 5,
          type: "CUPCAKE",
          date: "2025-05-05",
          avalible: true,
          flavors: [
            {
              id: 1,
              name: "SABOR 1",
              date: "2025-05-05",
              avalible: true,
              ingredients: [{ id: 33, name: "RELLENNO 1", date: "2025-05-05" }],
            },
          ],
          sizes: [],
        },
      ];
      setCakesData(mockCakesData);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchLimitations = async () => {
    try {
      const mockLimitations = [
        {
          id: 1,
          lineId: 1,
          flavorId: 1,
          sizeId: 1,
          limit: 5,
          description: "Limitación por temporada alta",
        },
      ];
      setLimitations(mockLimitations);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const mockCustomers = [
        {
          id: 1,
          name: "Cliente Ejemplo",
          phone: "5559876543",
          email: "cliente@ejemplo.com",
          createdAt: "2025-01-10T09:30:00.000Z",
        },
      ];
      setCustomers(mockCustomers);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const mockEmployees = [
        {
          id: 1,
          name: "Empleado Ejemplo",
          employeeNumber: "EMP001",
          position: "Pastelero",
          shift: "matutino",
          createdAt: "2024-12-01T08:00:00.000Z",
        },
      ];
      setEmployees(mockEmployees);
    } catch (err) {
      handleError(err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchOrders();
  }, []);

  // CRUD handlers
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      setLoading(true);
      setOrders(
        orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      showSuccess("Pedido actualizado correctamente");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCakeData = async (updatedData, type) => {
    try {
      setLoading(true);
      if (type === "cake") {
        setCakesData(
          cakesData.map((cake) =>
            cake.id === updatedData.id ? updatedData : cake
          )
        );
      }
      showSuccess("Datos de pasteles actualizados");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLimitation = async (newLimitation) => {
    try {
      setLoading(true);
      newLimitation.id = limitations.length + 1;
      setLimitations([...limitations, newLimitation]);
      showSuccess("Delimitación creada correctamente");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLimitation = async (limitationId) => {
    try {
      setLoading(true);
      setLimitations(limitations.filter((l) => l.id !== limitationId));
      showSuccess("Delimitación eliminada");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      setLoading(true);
      setCustomers(
        customers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
      showSuccess("Cliente actualizado");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      setLoading(true);
      setCustomers(customers.filter((c) => c.id !== customerId));
      showSuccess("Cliente eliminado");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      setLoading(true);
      setEmployees(
        employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        )
      );
      showSuccess("Empleado actualizado");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setLoading(true);
      setEmployees(employees.filter((e) => e.id !== employeeId));
      showSuccess("Empleado eliminado");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeTab) {
      case "orders":
        return (
          <OrdersView
            orders={orders}
            onRefresh={fetchOrders}
            onUpdateOrder={handleUpdateOrder}
            loading={loading}
          />
        );
      case "cakeManagement":
        return (
          <CakeManagementView
            cakesData={cakesData}
            onRefresh={fetchCakesData}
            onUpdateCakeData={handleUpdateCakeData}
            loading={loading}
          />
        );
      case "saleLimitations":
        return (
          <SaleLimitationsView
            limitations={limitations}
            cakesData={cakesData}
            onRefresh={fetchLimitations}
            onCreateLimitation={handleCreateLimitation}
            onDeleteLimitation={handleDeleteLimitation}
            loading={loading}
          />
        );
      case "customers":
        return (
          <CustomersView
            customers={customers}
            onRefresh={fetchCustomers}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            loading={loading}
          />
        );
      case "employees":
        return (
          <EmployeesView
            employees={employees}
            onRefresh={fetchEmployees}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            loading={loading}
          />
        );
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box
          sx={{
            height: "100vh", // Altura fija
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Previene desbordamiento general
          }}
        >
          {/* Tab menu */}
          <MenuTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
          />

          {/* Main content - Área scrollable */}
          <Box
            sx={{
              flex: 1,
              p: isMobile ? 1 : isTablet ? 3 : 4,
              overflow: "auto", // Scroll solo aquí
            }}
          >
            {loading && activeTab !== "orders" ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%", // Usa toda la altura disponible
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              renderActiveView()
            )}
          </Box>

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ mt: isMobile ? 7 : 0 }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!success}
            autoHideDuration={3000}
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ mt: isMobile ? 7 : 0 }}
          >
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default ManagementDashboard;
