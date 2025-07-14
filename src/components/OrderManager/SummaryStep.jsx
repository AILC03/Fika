// SummaryStep.jsx
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

const statusOptions = [
  "Agendado",
  "En proceso",
  "Pagado",
  "Abonado",
  "Entregado",
  "Cancelado",
  "Pagar al recoger",
];

const SummaryStep = ({ order, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detalles Generales del Pedido
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          label="Texto en el pastel"
          value={order.writing}
          onChange={(e) => onChange("writing", e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={order.caution}
              onChange={(e) => onChange("caution", e.target.checked)}
            />
          }
          label="Alergias / Atencion Especial"
        />

        <TextField
          label="Notas adicionales"
          value={order.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={order.status}
            onChange={(e) => onChange("status", e.target.value)}
            label="Estado"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DateTimePicker
          label="Fecha de recolección"
          value={new Date(order.pickupDate)}
          onChange={(date) => onChange("pickupDate", date.toISOString())}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
    </Box>
  );
};

export default SummaryStep;
