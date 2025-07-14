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
} from "@mui/material";

const NumericCake = ({ lines, onSave, onCancel }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [numberShape, setNumberShape] = useState("");

  const line = lines.find((l) => l.Id === selectedLine);
  const availableFlavors = line?.flavors || [];
  const availableSizes = line?.sizes || [];

  const handleSubmit = () => {
    if (!selectedLine || !selectedFlavor || !selectedSize || !numberShape)
      return;

    onSave({
      lineId: selectedLine,
      itemType: "NUMERIC",
      flavorId: selectedFlavor,
      sizeId: selectedSize,
      numberShape: numberShape,
      ingredients: [],
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Pastel Numérico
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Línea</InputLabel>
            <Select
              value={selectedLine}
              onChange={(e) => {
                setSelectedLine(e.target.value);
                setSelectedFlavor("");
                setSelectedSize("");
              }}
              label="Línea"
            >
              {lines.map((line) => (
                <MenuItem key={line.Id} value={line.Id}>
                  {line.line}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sabor</InputLabel>
            <Select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              label="Sabor"
              disabled={!selectedLine}
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
            <InputLabel>Tamaño</InputLabel>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              label="Tamaño"
              disabled={!selectedFlavor}
            >
              {availableSizes.map((size) => (
                <MenuItem key={size.Id} value={size.Id}>
                  {size.size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Número o forma"
            value={numberShape}
            onChange={(e) => setNumberShape(e.target.value)}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !selectedLine || !selectedFlavor || !selectedSize || !numberShape
          }
        >
          Agregar Pastel
        </Button>
      </Box>
    </Box>
  );
};

export default NumericCake;
