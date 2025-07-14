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
  TextField,
  Grid,
  Slider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const CupcakeCake = ({ lines, onSave, onCancel }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [cupcakeQty, setCupcakeQty] = useState(6);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const cupcakeLine = lines.find((line) => line.line === "CUPCAKES");
  const flavor = cupcakeLine?.flavors.find((f) => f.Id === selectedFlavor);
  const availableIngredients = flavor?.ingredients || [];

  const handleQtyChange = (event, newValue) => {
    // Redondear a múltiplos de 6
    const roundedValue = Math.round(newValue / 6) * 6;
    setCupcakeQty(roundedValue);
  };

  const handleSubmit = () => {
    if (!selectedLine || !selectedFlavor) return;

    onSave({
      lineId: selectedLine,
      itemType: "CUPCAKE",
      flavorId: selectedFlavor,
      cupcakeQty: cupcakeQty,
      ingredients: selectedIngredients,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Cupcakes
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Línea</InputLabel>
            <Select
              value={selectedLine}
              onChange={(e) => {
                setSelectedLine(e.target.value);
                setSelectedFlavor("");
                setSelectedIngredients([]);
              }}
              label="Línea"
            >
              {cupcakeLine && (
                <MenuItem value={cupcakeLine.Id}>{cupcakeLine.line}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sabor</InputLabel>
            <Select
              value={selectedFlavor}
              onChange={(e) => {
                setSelectedFlavor(e.target.value);
                setSelectedIngredients([]);
              }}
              label="Sabor"
              disabled={!selectedLine}
            >
              {cupcakeLine?.flavors.map((flavor) => (
                <MenuItem key={flavor.Id} value={flavor.Id}>
                  {flavor.flavor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>Cantidad: {cupcakeQty}</Typography>
          <Slider
            value={cupcakeQty}
            onChange={handleQtyChange}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={6}
            marks
            min={6}
            max={48}
          />
        </Grid>

        {availableIngredients.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredientes adicionales
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {availableIngredients.map((ingredient) => (
                <FormControlLabel
                  key={ingredient.Id}
                  control={
                    <Checkbox
                      checked={selectedIngredients.includes(ingredient.Id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIngredients([
                            ...selectedIngredients,
                            ingredient.Id,
                          ]);
                        } else {
                          setSelectedIngredients(
                            selectedIngredients.filter(
                              (id) => id !== ingredient.Id
                            )
                          );
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
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedLine || !selectedFlavor}
        >
          Agregar Cupcakes
        </Button>
      </Box>
    </Box>
  );
};

export default CupcakeCake;
