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
} from "@mui/icons-material";

const OrdersTable = () => {
  const API = import.meta.env.VITE_URI;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Función para obtener las órdenes
  const getAllOrders = async () => {
    setLoading(true);
    try {
      console.log("API URL:", API);

      const response = await fetch(`${API}/orders/order/getAllorders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log("Fetching orders from API...");
      const data = await response.json();
      console.log("Response data:", data);
      if (!response.ok) {
        console.error("Server returned an error:", errorText);
      }
      setOrders(data);
      console.log("Órdenes obtenidas:", data);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Filtrar órdenes basado en el término de búsqueda
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.client.fullName.toLowerCase().includes(searchLower) ||
      order.writing.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.client.company.toLowerCase().includes(searchLower)
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
    const itemTypes = items.map((item) => {
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
    });

    return (
      itemTypes.slice(0, 2).join(", ") + (itemTypes.length > 2 ? "..." : "")
    );
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
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
                      backgroundColor: index % 2 === 0 ? "#FFD53833" : "white",
                      "&:hover": {
                        backgroundColor: "#FFF2C9",
                      },
                    }}
                  >
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {order.client.fullName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.client.company}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 150 }}>
                        {order.writing}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {renderOrderItemsSummary(order.items)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.items.length} items
                      </Typography>
                    </TableCell>
                    <TableCell>{renderStatusChip(order.status)}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Responsable(s)
                            </Typography>
                            <List dense>
                              {order.orderUser.map((orderUser) => (
                                <ListItem key={orderUser.id} disablePadding>
                                  <ListItemAvatar>
                                    <Avatar sx={{ width: 24, height: 24 }}>
                                      <Person sx={{ fontSize: 14 }} />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={orderUser.user.name}
                                    secondary={
                                      <>
                                        <Typography
                                          component="span"
                                          variant="caption"
                                          display="block"
                                        >
                                          {orderUser.user.rol} •{" "}
                                          {orderUser.user.shift}
                                        </Typography>
                                        <Typography
                                          component="span"
                                          variant="caption"
                                          display="block"
                                        >
                                          {orderUser.user.user}
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
                      <IconButton size="small" sx={{ color: "#7E4300" }}>
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
  );
};

export default OrdersTable;
