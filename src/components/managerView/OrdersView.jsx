import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputAdornment,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Refresh, Edit, Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const OrdersView = ({ orders, onRefresh, onUpdateOrder, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("customerName");
  const [dateFilter, setDateFilter] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (
      dateFilter &&
      !dayjs(order.pickupDateTime).isSame(dayjs(dateFilter), "day")
    ) {
      return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const customer = order.customer || {};

      switch (searchType) {
        case "customerName":
          return customer.name?.toLowerCase().includes(term);
        case "phone":
          return customer.phone?.includes(term);
        case "email":
          return customer.email?.toLowerCase().includes(term);
        default:
          return true;
      }
    }

    return true;
  });

  const statusColors = {
    in_progress: "warning",
    completed: "success",
    cancelled: "error",
    pending: "info",
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order, pickupDateTime: dayjs(order.pickupDateTime) });
    setOpenEditDialog(true);
  };

  const handleSaveOrder = () => {
    onUpdateOrder({
      ...editingOrder,
      pickupDateTime: editingOrder.pickupDateTime.toISOString(),
    });
    setOpenEditDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 3,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            size="small"
            sx={{ minWidth: isMobile ? "100%" : 180 }}
          >
            <MenuItem value="customerName">Nombre</MenuItem>
            <MenuItem value="phone">Teléfono</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>

          <TextField
            placeholder="Buscar..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />

          <DatePicker
            label="Filtrar por fecha"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
            textField={(params) => (
              <TextField {...params} size="small" fullWidth={isMobile} />
            )}
            sx={{ minWidth: isMobile ? "100%" : 200 }}
          />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            fullWidth={isMobile}
          >
            {isMobile ? "Actualizar" : "Actualizar lista"}
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                  ID
                </TableCell>
                <TableCell>Cliente</TableCell>
                {!isMobile && <TableCell>Contacto</TableCell>}
                <TableCell
                  sx={{
                    display: isTablet
                      ? "table-cell"
                      : isMobile
                      ? "none"
                      : "table-cell",
                  }}
                >
                  Fecha
                </TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ display: isMobile ? "none" : "table-cell" }}>
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <Box>
                      {order.customer?.name || "N/A"}
                      {isMobile && order.customer?.phone && (
                        <Box
                          sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                        >
                          {order.customer.phone}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Box>{order.customer?.phone || "N/A"}</Box>
                      {order.customer?.email && (
                        <Box
                          sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                        >
                          {order.customer.email}
                        </Box>
                      )}
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      display: isTablet
                        ? "table-cell"
                        : isMobile
                        ? "none"
                        : "table-cell",
                    }}
                  >
                    {dayjs(order.pickupDateTime).format(
                      isMobile ? "DD/MM" : "DD/MM/YYYY HH:mm"
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        isMobile ? order.status.substring(0, 3) : order.status
                      }
                      color={statusColors[order.status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOrder(order)}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          fullWidth
          maxWidth={isMobile ? "xs" : "sm"}
        >
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Dedicatoria"
                name="writing"
                value={editingOrder?.writing || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Notas"
                name="notes"
                value={editingOrder?.notes || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />

              <DatePicker
                label="Fecha de recogida"
                value={editingOrder?.pickupDateTime || null}
                onChange={(date) =>
                  handleChange({
                    target: { name: "pickupDateTime", value: date },
                  })
                }
                textField={(params) => <TextField {...params} fullWidth />}
              />

              <Select
                label="Estado"
                name="status"
                value={editingOrder?.status || ""}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="in_progress">En progreso</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
              </Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleSaveOrder}
              color="primary"
              variant="contained"
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default OrdersView;
