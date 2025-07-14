// OrderSummary.jsx
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const OrderSummary = ({ order, lines }) => {
  if (!order) return null;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Cliente: {order.clientId ? `ID ${order.clientId}` : "No seleccionado"}
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle1">Detalles:</Typography>
        <Typography>Texto: {order.writing || "Ninguno"}</Typography>
        <Typography>Notas: {order.notes || "Ninguna"}</Typography>
        <Typography>Estado: {order.status}</Typography>
        <Typography>
          Fecha recolección: {new Date(order.pickupDate).toLocaleString()}
        </Typography>
        <Chip
          label={order.caution ? "Atencion" : "Normal"}
          color={order.caution ? "error" : "default"}
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Pasteles:</Typography>
      {order.items.length === 0 ? (
        <Typography>No hay pasteles agregados</Typography>
      ) : (
        <List dense>
          {order.items.map((item, index) => {
            const line = lines.find((l) => l.Id === item.lineId);
            return (
              <ListItem key={index}>
                <ListItemText
                  primary={`${getCakeTypeName(
                    item.itemType
                  )} - ${getCakeDescription(item, lines)}`}
                  secondary={`Línea: ${line?.line || "Desconocida"}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

// Reutilizar las mismas funciones helper de CakesStep
function getCakeTypeName(type) {
  switch (type) {
    case "REGULAR":
      return "Regular";
    case "NUMERIC":
      return "Numérico";
    case "CUPCAKE":
      return "Cupcakes";
    case "MULTIFLOOR":
      return "Pisos";
    default:
      return type;
  }
}

function getCakeDescription(item, lines) {
  const line = lines.find((l) => l.Id === item.lineId);
  if (!line) return "";

  switch (item.itemType) {
    case "REGULAR":
      const flavor = line.flavors.find((f) => f.Id === item.flavorId);
      const size = line.sizes.find((s) => s.Id === item.sizeId);
      return `${flavor?.flavor || ""} - Tamaño: ${size?.size || ""}`;

    case "NUMERIC":
      const numFlavor = line.flavors.find((f) => f.Id === item.flavorId);
      const numSize = line.sizes.find((s) => s.Id === item.sizeId);
      return `Número ${item.numberShape} - ${
        numFlavor?.flavor || ""
      } - Tamaño: ${numSize?.size || ""}`;

    case "CUPCAKE":
      const cupcakeFlavor = line.flavors.find((f) => f.Id === item.flavorId);
      return `${cupcakeFlavor?.flavor || ""} - Cantidad: ${item.cupcakeQty}`;

    case "MULTIFLOOR":
      return `${item.floors?.length || 0} pisos`;

    default:
      return "";
  }
}

export default OrderSummary;
