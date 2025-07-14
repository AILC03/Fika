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
  Grid,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const MultiflorCake = ({ lines, onSave, onCancel }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [floors, setFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState({
    floorNumber: 1,
    flavorId: "",
    sizeId: "",
    ingredients: [],
  });

  const availableLines = lines.filter(
    (line) => line.line === "Deluxe" || line.line === "Bizcocho"
  );
  const line = availableLines.find((l) => l.Id === selectedLine);
  const availableFlavors = line?.flavors || [];
  const availableSizes = line?.sizes || [];
  const flavor = availableFlavors.find((f) => f.Id === currentFloor.flavorId);
  const availableIngredients = flavor?.ingredients || [];

  const handleAddFloor = () => {
    if (!currentFloor.flavorId || !currentFloor.sizeId) return;

    const newFloor = {
      floorNumber: floors.length + 1,
      flavorId: currentFloor.flavorId,
      sizeId: currentFloor.sizeId,
      ingredients: currentFloor.ingredients,
    };

    setFloors([...floors, newFloor]);
    setCurrentFloor({
      floorNumber: floors.length + 2,
      flavorId: "",
      sizeId: "",
      ingredients: [],
    });
  };

  const handleRemoveFloor = (index) => {
    const newFloors = floors
      .filter((_, i) => i !== index)
      .map((floor, idx) => ({
        ...floor,
        floorNumber: idx + 1,
      }));

    setFloors(newFloors);
    setCurrentFloor((prev) => ({
      ...prev,
      floorNumber: newFloors.length + 1,
    }));
  };

  const handleSubmit = () => {
    if (!selectedLine || floors.length < 2) return;

    onSave({
      lineId: selectedLine,
      itemType: "MULTIFLOOR",
      floors: floors,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Pastel de Pisos
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Línea</InputLabel>
            <Select
              value={selectedLine}
              onChange={(e) => {
                setSelectedLine(e.target.value);
                setFloors([]);
                setCurrentFloor({
                  floorNumber: 1,
                  flavorId: "",
                  sizeId: "",
                  ingredients: [],
                });
              }}
              label="Línea"
            >
              {availableLines.map((line) => (
                <MenuItem key={line.Id} value={line.Id}>
                  {line.line}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedLine && (
          <>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Piso {currentFloor.floorNumber} - Sabor</InputLabel>
                <Select
                  value={currentFloor.flavorId}
                  onChange={(e) => {
                    setCurrentFloor({
                      ...currentFloor,
                      flavorId: e.target.value,
                      ingredients: [],
                    });
                  }}
                  label={`Piso ${currentFloor.floorNumber} - Sabor`}
                >
                  {availableFlavors.map((flavor) => (
                    <MenuItem key={flavor.Id} value={flavor.Id}>
                      {flavor.flavor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>
                  Piso {currentFloor.floorNumber} - Tamaño
                </InputLabel>
                <Select
                  value={currentFloor.sizeId}
                  onChange={(e) =>
                    setCurrentFloor({
                      ...currentFloor,
                      sizeId: e.target.value,
                    })
                  }
                  label={`Piso ${currentFloor.floorNumber} - Tamaño`}
                  disabled={!currentFloor.flavorId}
                >
                  {availableSizes.map((size) => (
                    <MenuItem key={size.Id} value={size.Id}>
                      {size.size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} display="flex" alignItems="flex-end">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddFloor}
                disabled={!currentFloor.flavorId || !currentFloor.sizeId}
                fullWidth
              >
                Agregar Piso
              </Button>
            </Grid>

            {availableIngredients.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Ingredientes para piso {currentFloor.floorNumber}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {availableIngredients.map((ingredient) => (
                    <FormControlLabel
                      key={ingredient.Id}
                      control={
                        <Checkbox
                          checked={currentFloor.ingredients.includes(
                            ingredient.Id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCurrentFloor({
                                ...currentFloor,
                                ingredients: [
                                  ...currentFloor.ingredients,
                                  ingredient.Id,
                                ],
                              });
                            } else {
                              setCurrentFloor({
                                ...currentFloor,
                                ingredients: currentFloor.ingredients.filter(
                                  (id) => id !== ingredient.Id
                                ),
                              });
                            }
                          }}
                        />
                      }
                      label={ingredient.ingredient}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </>
        )}

        {floors.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2}>
              <List>
                {floors.map((floor, index) => {
                  const flavor = availableFlavors.find(
                    (f) => f.Id === floor.flavorId
                  );
                  const size = availableSizes.find(
                    (s) => s.Id === floor.sizeId
                  );

                  return (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Piso ${floor.floorNumber}: ${
                          flavor?.flavor || ""
                        } - Tamaño: ${size?.size || ""}`}
                        secondary={`Ingredientes: ${floor.ingredients.length}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFloor(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedLine || floors.length < 2}
        >
          Agregar Pastel
        </Button>
      </Box>
    </Box>
  );
};

export default MultiflorCake;
