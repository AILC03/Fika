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
} from "@mui/material";
import {
  Edit,
  Search,
  Person,
  Refresh,
  Cake,
  Layers,
  LooksOne,
  CalendarToday,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import OrderForm from "../OrderManager/OrderForm";

const OrdersTable = () => {
  const API = import.meta.env.VITE_URI;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Función para transformar cakes a items para el formulario
  const transformCakesToItems = (cakes) => {
    return (
      cakes?.map((cake) => {
        const baseItem = {
          itemType: cake.itemType,
          lineId: cake.lineId,
          flavorId: cake.flavorId,
          sizeId: cake.sizeId,
          ingredientsIds: cake.ingredients?.map((ing) => ing.Id) || [],
        };

        if (cake.itemType === "NUMERIC") {
          baseItem.numberShape = cake.numberShape;
        } else if (cake.itemType === "CUPCAKE") {
          baseItem.cupcakeQty = cake.cupcakeQty;
        } else if (cake.itemType === "MULTIFLOOR") {
          baseItem.floors =
            cake.floors?.map((floor) => ({
              flavorId: floor.flavorId,
              sizeId: floor.sizeId,
              ingredientsIds: floor.ingredients?.map((ing) => ing.Id) || [],
            })) || [];
        }

        return baseItem;
      }) || []
    );
  };

  // Función para obtener las órdenes
  const getAllOrdersPickup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/orders/order/getOrderPickUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pickupDate: selectedDate.toISOString(),
        }),
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
    getAllOrdersPickup();
  }, [selectedDate]);

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Manejar apertura del modal de edición
  const handleEditOrder = (order) => {
    const orderForForm = {
      ...order,
      items: transformCakesToItems(order.cakes),
      userId: order.orderUser?.[0]?.userId,
    };
    setSelectedOrder(orderForForm);
    setIsModalOpen(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = (success) => {
    setIsModalOpen(false);
    if (success) {
      getAllOrdersPickup(); // Recargar órdenes si hubo cambios
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
              {item.itemType === "CUPCAKE" && <Cake color="error" />}
              {item.itemType === "REGULAR" && <Cake color="warning" />}
            </ListItemAvatar>

            <ListItemText
              primary={
                item.itemType === "MULTIFLOOR"
                  ? `Pastel de pisos (${item.floors?.length || 0} pisos)`
                  : item.itemType === "NUMERIC"
                  ? `Pastel de número ${item.numberShape}`
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
            sx={{
              display: "flex",
              gap: 2,
              width: isMobile ? "100%" : "auto",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <DatePicker
              label="Fecha de recolección"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    backgroundColor: "#FFF2C9",
                    borderRadius: 1,
                    minWidth: isMobile ? "100%" : 200,
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "#7E4300" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

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
              onClick={getAllOrdersPickup}
              startIcon={<Refresh />}
              sx={{
                backgroundColor: "#FFD538",
                color: "#7E4300",
                "&:hover": {
                  backgroundColor: "#FFC107",
                },
                width: isMobile ? "100%" : "auto",
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300" }}>
            Mostrando órdenes para:{" "}
            {format(selectedDate, "PPPP", { locale: es })}
          </Typography>
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
                          title={<ItemsTooltipContent items={order.cakes} />}
                          arrow
                          placement="top"
                        >
                          <Box>
                            <Typography variant="body2">
                              {renderOrderItemsSummary(order.cakes)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {order.cakes?.length || 0} items
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
                        No se encontraron órdenes para esta fecha
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
