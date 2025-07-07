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
  Box,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import { Refresh, Edit, Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EditOrderDialog from "./EditOrder";

const OrdersList = ({ orders, onRefresh, onUpdateOrder, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("customerName");
  const [dateFilter, setDateFilter] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const statusColors = {
    in_progress: { backgroundColor: "#FFD538", color: "#000000" },
    completed: { backgroundColor: "#7E4300", color: "#FFFFFF" },
    cancelled: { backgroundColor: "#d32f2f", color: "#FFFFFF" },
    pending: { backgroundColor: "#FFF2C9", color: "#000000" },
  };

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

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order, pickupDateTime: dayjs(order.pickupDateTime) });
    setOpenEditDialog(true);
  };

  const handleSaveOrder = (updatedOrder) => {
    onUpdateOrder({
      ...updatedOrder,
      pickupDateTime: updatedOrder.pickupDateTime.toISOString(),
    });
    setOpenEditDialog(false);
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
            sx={{
              minWidth: isMobile ? "100%" : 180,
              backgroundColor: "#FFF2C9",
            }}
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
              sx: {
                backgroundColor: "#FFF2C9",
              },
            }}
            sx={{ flexGrow: 1 }}
          />

          <DatePicker
            label="Filtrar por fecha"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
            textField={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth={isMobile}
                sx={{
                  backgroundColor: "#FFF2C9",
                }}
              />
            )}
            sx={{ minWidth: isMobile ? "100%" : 200 }}
          />

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            fullWidth={isMobile}
            sx={{
              backgroundColor: "#FFD538",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#e6c032",
              },
            }}
          >
            {isMobile ? "Actualizar" : "Actualizar lista"}
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
            backgroundColor: "#FFF2C9",
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#7E4300" }}>
                <TableCell
                  sx={{
                    display: isMobile ? "none" : "table-cell",
                    color: "#FFFFFF",
                  }}
                >
                  ID
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>Cliente</TableCell>
                {!isMobile && (
                  <TableCell sx={{ color: "#FFFFFF" }}>Contacto</TableCell>
                )}
                <TableCell
                  sx={{
                    display: isTablet
                      ? "table-cell"
                      : isMobile
                      ? "none"
                      : "table-cell",
                    color: "#FFFFFF",
                  }}
                >
                  Fecha
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>Estado</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#FFF2C9",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#FFD53833",
                    },
                  }}
                >
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
                      sx={{
                        backgroundColor:
                          statusColors[order.status]?.backgroundColor,
                        color: statusColors[order.status]?.color,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditOrder(order)}
                      size="small"
                      sx={{
                        color: "#7E4300",
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <EditOrderDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          order={editingOrder}
          onSave={handleSaveOrder}
          isMobile={isMobile}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default OrdersList;
