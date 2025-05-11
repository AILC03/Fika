import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  TextField,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { Plus, Minus } from "lucide-react";

const CupcakesForm = ({ cakeData, onAddCake, onCancel }) => {
  // Estados del formulario
  const [quantity, setQuantity] = useState(6); // Mínimo 6 cupcakes
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Obtener línea de cupcakes
  const cupcakeLine = cakeData.find((cake) => cake.type === "CUPCAKE") || {
    flavors: [],
    sizes: [],
  };
  const availableFlavors = cupcakeLine.flavors || [];

  // Manejar cambio de sabor (resetear ingredientes)
  const handleFlavorChange = (flavorId) => {
    setSelectedFlavor(flavorId);
    setSelectedIngredients([]);
  };

  // Manejar cambio en ingredientes
  const handleIngredientToggle = (ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  // Ajustar cantidad (múltiplos de 6)
  const adjustQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 6 && newQuantity <= 120) {
      // Máximo 120 cupcakes
      setQuantity(newQuantity);
    }
  };

  // Enviar datos al componente padre
  const handleSubmit = () => {
    if (!selectedFlavor) return;

    const flavorData = availableFlavors.find((f) => f.id === selectedFlavor);

    onAddCake({
      type: "cupcakes",
      quantity,
      flavor: flavorData.name,
      flavorId: selectedFlavor,
      ingredients: selectedIngredients
        .map((id) => flavorData.ingredients.find((ing) => ing.id === id)?.name)
        .filter(Boolean),
      // Nota: writing y notes se manejan en el componente padre
    });
  };

  // Verificar si el formulario está completo
  const isFormComplete = () => {
    return selectedFlavor && quantity >= 6;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cupcakes
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Se venden en paquetes de 6. Mínimo 6, máximo 120.
      </Typography>

      {/* Selector de cantidad */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Cantidad</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => adjustQuantity(-6)}
            disabled={quantity <= 6}
          >
            <Minus />
          </Button>
          <Typography
            variant="h6"
            sx={{ minWidth: "3rem", textAlign: "center" }}
          >
            {quantity}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => adjustQuantity(6)}
            disabled={quantity >= 120}
          >
            <Plus />
          </Button>
        </Box>
      </Box>

      {/* Selector de sabor */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Sabor</InputLabel>
        <Select
          value={selectedFlavor}
          onChange={(e) => handleFlavorChange(e.target.value)}
          label="Sabor"
        >
          {availableFlavors.map((flavor) => (
            <MenuItem key={flavor.id} value={flavor.id}>
              {flavor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Selector de ingredientes (si el sabor tiene ingredientes) */}
      {selectedFlavor &&
        availableFlavors.find((f) => f.id === selectedFlavor)?.ingredients
          ?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Ingredientes Adicionales</Typography>
            <Grid container spacing={1}>
              {availableFlavors
                .find((f) => f.id === selectedFlavor)
                ?.ingredients?.map((ingredient) => (
                  <Grid item xs={6} sm={4} key={ingredient.id}>
                    <Button
                      fullWidth
                      variant={
                        selectedIngredients.includes(ingredient.id)
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleIngredientToggle(ingredient.id)}
                      size="small"
                    >
                      {ingredient.name}
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormComplete()}
        >
          Agregar al Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default CupcakesForm;
