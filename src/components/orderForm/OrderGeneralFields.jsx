import React from "react";
import {
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import DateTimePicker from "./DateTimePicker";

const statusOptions = [
  { value: "pending", label: "Pagar al recoger" },
  { value: "payed", label: "Pagado" },
  { value: "payment", label: "Abonado" },
  { value: "complete", label: "Entregado" },
  { value: "cancel", label: "Cancelado" },
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
  caution, // Nuevo prop para alergias/preparación sensible
  onCautionChange, // Nuevo handler
}) => {
  return (
    <div className="space-y-4 mt-6">
      {/* Divider con borde marrón claro */}
      <Divider className="border-[#7E4300]/30" />

      {/* Título en marrón oscuro */}
      <Typography variant="h6" className="mt-4 text-[#7E4300]">
        Detalles Generales del Pedido
      </Typography>

      {/* Switch para alergias o preparación sensible */}
      <FormControlLabel
        control={
          <Switch
            checked={caution}
            onChange={(e) => onCautionChange(e.target.checked)}
            color="warning"
          />
        }
        label="¿Este pedido requiere atención especial (alergias/preparación sensible)?"
        className="!text-[#7E4300]"
      />

      {/* Campo de texto para decoración */}
      <TextField
        label="Texto para decoración del pastel"
        fullWidth
        multiline
        rows={2}
        value={writing}
        onChange={(e) => onWritingChange(e.target.value)}
        helperText="Texto que aparecerá en el pastel (ej. Feliz Cumpleaños)"
        InputProps={{
          className:
            "text-[#7E4300] border-[#7E4300] hover:border-[#7E4300] focus:border-[#FFD538] focus:ring-[#FFD538] rounded",
        }}
        InputLabelProps={{
          className: "text-[#7E4300]",
        }}
        FormHelperTextProps={{
          className: "text-[#7E4300]/70",
        }}
      />

      {/* Selector de fecha y hora */}
      <DateTimePicker
        value={pickupDateTime}
        onChange={onDateTimeChange}
        label="Fecha y hora de recolección"
        className="[&_.MuiInputBase-root]:border-[#7E4300] [&_.MuiInputBase-root:hover]:border-[#7E4300] [&_.Mui-focused]:border-[#FFD538] [&_.MuiInputLabel-root]:text-[#7E4300]"
      />

      {/* Selector de estado */}
      <FormControl fullWidth>
        <InputLabel className="text-[#7E4300]">Estado del Pedido</InputLabel>
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          label="Estado del Pedido"
          className="text-[#7E4300] mb-4"
          MenuProps={{
            PaperProps: {
              className: "bg-[#FFF2C9] border border-[#7E4300]/30",
            },
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              className="hover:bg-[#FFD538]/50 text-[#7E4300]"
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Campo de notas adicionales */}
      <TextField
        label="Notas adicionales del pedido"
        fullWidth
        multiline
        rows={2}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        helperText="Indicaciones especiales, alergias, etc."
        InputProps={{
          className:
            "text-[#7E4300] border-[#7E4300] hover:border-[#7E4300] focus:border-[#FFD538] focus:ring-[#FFD538] rounded",
        }}
        InputLabelProps={{
          className: "text-[#7E4300]",
        }}
        FormHelperTextProps={{
          className: "text-[#7E4300]/70",
        }}
      />
    </div>
  );
};

export default OrderGeneralFields;
