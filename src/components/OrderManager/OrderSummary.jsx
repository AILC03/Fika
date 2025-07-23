import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
} from "@mui/material";

const OrderSummary = ({ order, lines, clients }) => {
  if (!order) return null;

  const selectedClient = clients?.find((c) => c.id === order.clientId);

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, backgroundColor: "#FFF2C9", borderRadius: 2 }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Resumen del Pedido
      </Typography>

      {selectedClient ? (
        <Box mb={2}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300" }}>
            Cliente:
          </Typography>
          <Typography>{selectedClient.fullName}</Typography>
          <Typography>Teléfono: {selectedClient.phone}</Typography>
          {selectedClient.email && (
            <Typography>Email: {selectedClient.email}</Typography>
          )}
          {selectedClient.company && (
            <Typography>Empresa: {selectedClient.company}</Typography>
          )}
          {selectedClient.observation && (
            <Typography>Observaciones: {selectedClient.observation}</Typography>
          )}
        </Box>
      ) : (
        <Typography variant="subtitle1" sx={{ color: "#7E4300", mb: 2 }}>
          Cliente: No seleccionado
        </Typography>
      )}

      <Divider sx={{ my: 2, borderColor: "#7E4300" }} />

      <Box mb={2}>
        <Typography variant="subtitle1" sx={{ color: "#7E4300" }}>
          Detalles del Pedido:
        </Typography>
        <Typography>Texto en pastel: {order.writing || "Ninguno"}</Typography>
        <Typography>Notas: {order.notes || "Ninguna"}</Typography>
        <Typography>Estado: {order.status}</Typography>
        <Typography>
          Fecha recolección: {new Date(order.pickupDate).toLocaleString()}
        </Typography>
        <Chip
          label={order.caution ? "Atención Especial (Alergias)" : "Normal"}
          color={order.caution ? "error" : "success"}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: "#7E4300" }} />

      <Typography variant="subtitle1" sx={{ color: "#7E4300" }}>
        Pasteles:
      </Typography>
      {order.items.length === 0 ? (
        <Typography>No hay pasteles agregados</Typography>
      ) : (
        <List dense>
          {order.items.map((item, index) => {
            const line = lines.find((l) => l.Id === item.lineId);
            return (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: "white",
                  mb: 1,
                  borderRadius: 1,
                  borderLeft: "4px solid #FFD538",
                }}
              >
                <ListItemText
                  primary={`${getCakeTypeName(
                    item.itemType
                  )} - ${getCakeDescription(item, lines)}`}
                  secondary={`Línea: ${line?.line || "Desconocida"}`}
                  primaryTypographyProps={{
                    color: "#7E4300",
                    fontWeight: "bold",
                  }}
                  secondaryTypographyProps={{ color: "#7E4300" }}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

// Helper functions (same as before)
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
