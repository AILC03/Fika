import React from "react";
import {
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DateTimePicker from "./DateTimePicker";

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En Proceso" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
];

const OrderGeneralFields = ({
  writing,
  notes,
  pickupDateTime,
  status,
  onWritingChange,
  onNotesChange,
  onDateTimeChange,
  onStatusChange,
}) => {
  return (
    <div className="space-y-4 mt-6">
      <Divider />

      <Typography variant="h6" className="mt-4">
        Detalles Generales del Pedido
      </Typography>

      <TextField
        label="Texto para decoración del pastel"
        fullWidth
        multiline
        rows={2}
        value={writing}
        onChange={(e) => onWritingChange(e.target.value)}
        helperText="Texto que aparecerá en el pastel (ej. Feliz Cumpleaños)"
      />

      <DateTimePicker
        value={pickupDateTime}
        onChange={onDateTimeChange}
        label="Fecha y hora de recolección"
      />

      <FormControl fullWidth>
        <InputLabel>Estado del Pedido</InputLabel>
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          label="Estado del Pedido"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Notas adicionales del pedido"
        fullWidth
        multiline
        rows={3}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        helperText="Indicaciones especiales, alergias, etc."
      />
    </div>
  );
};

export default OrderGeneralFields;
