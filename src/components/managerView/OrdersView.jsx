import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  Search,
  Person,
  Refresh,
  Close,
  Cake,
  Layers,
  LooksOne,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import OrderForm from "../OrderManager/OrderForm"; // Asegúrate de tener la ruta correcta

const OrdersTable = () => {
  const API = import.meta.env.VITE_URI;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Función para obtener las órdenes
  const getAllOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/orders/order/getAllorders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al obtener las órdenes");
      }
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Manejar apertura del modal de edición
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = (success) => {
    setIsModalOpen(false);
    if (success) {
      getAllOrders(); // Recargar órdenes si hubo cambios
    }
  };

  // Filtrar órdenes basado en el término de búsqueda
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.client?.fullName?.toLowerCase().includes(searchLower) ||
      order.writing?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      order.client?.company?.toLowerCase().includes(searchLower)
    );
  });

  // Función para mostrar el estado como Chip con color
  const renderStatusChip = (status) => {
    let color;
    switch (status) {
      case "Agendado":
        color = "default";
        break;
      case "En proceso":
        color = "primary";
        break;
      case "Completado":
        color = "success";
        break;
      case "Cancelado":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size="small" />;
  };

  // Función para mostrar los items de la orden de forma resumida
  const renderOrderItemsSummary = (items) => {
    const itemTypes =
      items?.map((item) => {
        switch (item.itemType) {
          case "MULTIFLOOR":
            return "Pastel Multinivel";
          case "NUMERIC":
            return `Número ${item.numberShape}`;
          case "CUPCAKE":
            return `${item.cupcakeQty} Cupcakes`;
          case "REGULAR":
            return "Pastel Regular";
          default:
            return "Otro";
        }
      }) || [];

    return (
      itemTypes.slice(0, 2).join(", ") + (itemTypes.length > 2 ? "..." : "")
    );
  };

  // Componente para el tooltip de items
  const ItemsTooltipContent = ({ items }) => (
    <Box sx={{ p: 1, maxWidth: 300 }}>
      <Typography variant="subtitle2" gutterBottom>
        Detalle de Items
      </Typography>
      <List dense>
        {items?.map((item, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemAvatar sx={{ minWidth: 30 }}>
              {item.itemType === "MULTIFLOOR" && <Layers color="primary" />}
              {item.itemType === "NUMERIC" && <LooksOne color="secondary" />}
              {item.itemType === "CUPCAKE" && <Cake color="error" />}{" "}
              {item.itemType === "REGULAR" && <Cake color="warning" />}
            </ListItemAvatar>

            <ListItemText
              primary={
                item.itemType === "MULTIFLOOR"
                  ? `Pastel Multinivel (${item.floors?.length || 0} pisos)`
                  : item.itemType === "NUMERIC"
                  ? `Número ${item.numberShape}`
                  : item.itemType === "CUPCAKE"
                  ? `${item.cupcakeQty} Cupcakes`
                  : "Pastel Regular"
              }
              secondary={
                item.line?.line && (
                  <Typography variant="caption">
                    Línea: {item.line.line}
                  </Typography>
                )
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        {/* Modal de edición */}
        <OrderForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          orderDate={
            selectedOrder?.pickupDate &&
            !isNaN(new Date(selectedOrder.pickupDate))
              ? new Date(selectedOrder.pickupDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          orderToEdit={selectedOrder}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ color: "#7E4300", fontWeight: "bold" }}
          >
            Lista de Órdenes
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, width: isMobile ? "100%" : "auto" }}
          >
            <TextField
              size="small"
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "#FFF2C9",
                borderRadius: 1,
                minWidth: isMobile ? "100%" : 300,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#7E4300" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={getAllOrders}
              startIcon={<Refresh />}
              sx={{
                backgroundColor: "#FFD538",
                color: "#7E4300",
                "&:hover": {
                  backgroundColor: "#FFC107",
                },
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#FFD538" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FFF2C9" }}>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    Cliente
                  </TableCell>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    Escrito
                  </TableCell>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    Items
                  </TableCell>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ color: "#7E4300", fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#FFD53833" : "white",
                        "&:hover": {
                          backgroundColor: "#FFF2C9",
                        },
                      }}
                    >
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {order.client?.fullName || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {order.client?.company || ""}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 150 }}>
                          {order.writing || "Sin texto"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={<ItemsTooltipContent items={order.items} />}
                          arrow
                          placement="top"
                        >
                          <Box>
                            <Typography variant="body2">
                              {renderOrderItemsSummary(order.items)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {order.items?.length || 0} items
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {renderStatusChip(order.status || "Agendado")}
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <Box sx={{ p: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Responsable(s)
                              </Typography>
                              <List dense>
                                {order.orderUser?.map((orderUser) => (
                                  <ListItem key={orderUser.id} disablePadding>
                                    <ListItemAvatar>
                                      <Avatar sx={{ width: 24, height: 24 }}>
                                        <Person sx={{ fontSize: 14 }} />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={orderUser.user?.name || "N/A"}
                                      secondary={
                                        <>
                                          <Typography
                                            component="span"
                                            variant="caption"
                                            display="block"
                                          >
                                            {orderUser.user?.rol || ""} •{" "}
                                            {orderUser.user?.shift || ""}
                                          </Typography>
                                          <Typography
                                            component="span"
                                            variant="caption"
                                            display="block"
                                          >
                                            {orderUser.user?.user || ""}
                                          </Typography>
                                        </>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          }
                          arrow
                          placement="left"
                        >
                          <IconButton
                            size="small"
                            sx={{ color: "#7E4300", mr: 1 }}
                          >
                            <Person />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          sx={{ color: "#7E4300" }}
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No se encontraron órdenes
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default OrdersTable;
