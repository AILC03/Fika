import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const EditOrderDialog = ({ open, onClose, order, onSave, isMobile }) => {
  const [editingOrder, setEditingOrder] = React.useState(order);

  React.useEffect(() => {
    setEditingOrder(order);
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditingOrder((prev) => ({ ...prev, pickupDateTime: date }));
  };

  const handleSubmit = () => {
    onSave(editingOrder);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "xs" : "sm"}
      PaperProps={{
        sx: {
          backgroundColor: "#FFF2C9",
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
        Editar Pedido
      </DialogTitle>
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
            sx={{
              backgroundColor: "#FFFFFF",
            }}
          />

          <TextField
            label="Notas"
            name="notes"
            value={editingOrder?.notes || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            sx={{
              backgroundColor: "#FFFFFF",
            }}
          />

          <DatePicker
            label="Fecha de recogida"
            value={editingOrder?.pickupDateTime || null}
            onChange={handleDateChange}
            textField={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  backgroundColor: "#FFFFFF",
                }}
              />
            )}
          />

          <Select
            label="Estado"
            name="status"
            value={editingOrder?.status || ""}
            onChange={handleChange}
            fullWidth
            sx={{
              backgroundColor: "#FFFFFF",
            }}
          >
            <MenuItem value="in_progress">En progreso</MenuItem>
            <MenuItem value="completed">Completado</MenuItem>
            <MenuItem value="cancelled">Cancelado</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#7E4300",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#FFD538",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e6c032",
            },
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
