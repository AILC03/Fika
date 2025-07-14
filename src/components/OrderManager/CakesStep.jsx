// CakesStep.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RegularCake from "./CakeItem/RegularCake";
import NumericCake from "./CakeItem/NumericCake";
import CupcakeCake from "./CakeItem/CupcakeCake";
import MultiflorCake from "./CakeItem/MultiflorCake";

const CakesStep = ({ lines, items, onAddItem, onRemoveItem }) => {
  const [cakeType, setCakeType] = useState("REGULAR");
  const [showForm, setShowForm] = useState(false);

  const handleAddCake = (cakeData) => {
    onAddItem(cakeData);
    setShowForm(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuración de Pasteles
      </Typography>

      {!showForm ? (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Pastel</InputLabel>
              <Select
                value={cakeType}
                onChange={(e) => setCakeType(e.target.value)}
                label="Tipo de Pastel"
              >
                <MenuItem value="REGULAR">Regular</MenuItem>
                <MenuItem value="NUMERIC">Numérico</MenuItem>
                <MenuItem value="CUPCAKE">Cupcakes</MenuItem>
                <MenuItem value="MULTIFLOOR">Pisos</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={() => setShowForm(true)}>
              Agregar Pastel
            </Button>
          </Box>

          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Pasteles agregados
            </Typography>
            {items.length === 0 ? (
              <Typography color="text.secondary">
                No hay pasteles agregados
              </Typography>
            ) : (
              <List>
                {items.map((item, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => onRemoveItem(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${getCakeTypeName(
                        item.itemType
                      )} - ${getCakeDescription(item, lines)}`}
                      secondary={`Línea: ${
                        lines.find((l) => l.Id === item.lineId)?.line
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      ) : (
        <Box>
          {cakeType === "REGULAR" && (
            <RegularCake
              lines={lines}
              onSave={handleAddCake}
              onCancel={() => setShowForm(false)}
            />
          )}

          {cakeType === "NUMERIC" && (
            <NumericCake
              lines={lines}
              onSave={handleAddCake}
              onCancel={() => setShowForm(false)}
            />
          )}

          {cakeType === "CUPCAKE" && (
            <CupcakeCake
              lines={lines}
              onSave={handleAddCake}
              onCancel={() => setShowForm(false)}
            />
          )}

          {cakeType === "MULTIFLOOR" && (
            <MultiflorCake
              lines={lines}
              onSave={handleAddCake}
              onCancel={() => setShowForm(false)}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

// Helper functions
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

export default CakesStep;
