import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";

const statusColors = {
  pending: "default",
  confirmed: "primary",
  paid: "success",
  cancelled: "error",
};

const statusLabels = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  paid: "Pagado",
  cancelled: "Cancelado",
};

const OrderSummary = ({
  customer,
  items,
  writing,
  notes,
  status,
  pickupDateTime,
}) => {
  return (
    <div className="space-y-6">
      <Typography variant="h6">Resumen del Pedido</Typography>

      <Paper className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-2">
          Cliente
        </Typography>
        <Typography>{customer?.name || "No seleccionado"}</Typography>
        <Typography>{customer?.phone}</Typography>
        {customer?.email && <Typography>{customer.email}</Typography>}
      </Paper>

      <Paper className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-2">
          Estado
        </Typography>
        <Chip
          label={statusLabels[status] || status}
          color={statusColors[status] || "default"}
        />
      </Paper>

      <Paper className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-2">
          Pasteles
        </Typography>
        {items.length === 0 ? (
          <Typography>No hay pasteles en el pedido</Typography>
        ) : (
          <List>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${index + 1}. ${getCakeTypeName(item.type)}`}
                    secondary={renderCakeDetails(item)}
                  />
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {writing && (
        <Paper className="p-4">
          <Typography variant="subtitle1" className="font-bold mb-2">
            Texto decoración
          </Typography>
          <Typography>{writing}</Typography>
        </Paper>
      )}

      <Paper className="p-4">
        <Typography variant="subtitle1" className="font-bold mb-2">
          Fecha recolección
        </Typography>
        <Typography>{new Date(pickupDateTime).toLocaleString()}</Typography>
      </Paper>

      {notes && (
        <Paper className="p-4">
          <Typography variant="subtitle1" className="font-bold mb-2">
            Notas
          </Typography>
          <Typography>{notes}</Typography>
        </Paper>
      )}
    </div>
  );
};

// Helper para mostrar nombres de tipos de pastel
function getCakeTypeName(type) {
  switch (type) {
    case "numeric":
      return "Numérico";
    case "regular":
      return "Regular";
    case "tiered":
      return "De Pisos";
    case "cupcakes":
      return "Cupcakes";
    default:
      return type;
  }
}

// Helper para mostrar detalles específicos de cada tipo de pastel
function renderCakeDetails(item) {
  switch (item.type) {
    case "numeric":
      return `Número: ${item.digits.map((d) => d.digit).join("")}`;
    case "regular":
      return `Sabor: ${item.flavor}`;
    case "tiered":
      return `${item.tiers.length} pisos`;
    case "cupcakes":
      return `${item.quantity} cupcakes`;
    default:
      return "";
  }
}

export default OrderSummary;
