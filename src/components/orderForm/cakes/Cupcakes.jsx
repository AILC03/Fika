import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Plus, Minus } from "lucide-react";

const CupcakesForm = ({ cakeData, onAddCake }) => {
  // Estados del formulario
  const [quantity, setQuantity] = useState(12); // Mínimo 12 cupcakes
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
    if (newQuantity >= 12) {
      setQuantity(newQuantity);
    }
  };

  // Limpiar todo el formulario
  const handleClearForm = () => {
    setQuantity(6);
    setSelectedFlavor("");
    setSelectedIngredients([]);
  };

  // Enviar datos al componente padre
  const handleSubmit = () => {
    if (!selectedFlavor) return;

    const flavorData = availableFlavors.find((f) => f.id === selectedFlavor);
    const selectedIngredientsData =
      flavorData?.ingredients?.filter((ing) =>
        selectedIngredients.includes(ing.id)
      ) || [];

    onAddCake({
      type: "cupcakes",
      quantity,
      line: {
        id: cupcakeLine.id,
        name: cupcakeLine.name,
      },
      flavor: {
        id: flavorData?.id || null,
        name: flavorData?.name || "",
        ingredients: selectedIngredientsData.map((ing) => ({
          id: ing.id,
          name: ing.name,
        })),
      },
      size: {
        id: 0,
        name: "N/A",
      },
      ingredients: selectedIngredientsData.map((ing) => ({
        id: ing.id,
        name: ing.name,
      })),
      tiers: [],
      digits: [],
    });
  };

  // Verificar si el formulario está completo
  const isFormComplete = () => {
    return selectedFlavor && quantity >= 12;
  };

  return (
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Cupcakes
      </Typography>
      <Typography variant="body2" sx={{ color: "#7E4300", mb: 2 }} gutterBottom>
        Se venden por mínimo de 12.
      </Typography>

      {/* Selector de cantidad */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: "#7E4300" }} gutterBottom>
          Cantidad
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => adjustQuantity(-1)}
            disabled={quantity <= 12}
            sx={{
              color: "#7E4300",
              "&:hover": { backgroundColor: "#FFD538" },
            }}
          >
            <Minus />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              minWidth: "3rem",
              textAlign: "center",
              color: "#7E4300",
            }}
          >
            {quantity}
          </Typography>
          <IconButton
            onClick={() => adjustQuantity(1)}
            sx={{
              color: "#7E4300",
              "&:hover": { backgroundColor: "#FFD538" },
            }}
          >
            <Plus />
          </IconButton>
        </Box>
      </Box>

      {/* Selector de sabor */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "#7E4300" }}>Sabor</InputLabel>
        <Select
          value={selectedFlavor}
          onChange={(e) => handleFlavorChange(e.target.value)}
          label="Sabor"
          sx={{
            backgroundColor: "#FFF2C9",
            color: "#7E4300",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
          }}
        >
          {availableFlavors.map((flavor) => (
            <MenuItem
              key={flavor.id}
              value={flavor.id}
              sx={{
                color: "#7E4300",
                "&:hover": { backgroundColor: "#FFD538" },
              }}
            >
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
            <Typography sx={{ color: "#7E4300" }} gutterBottom>
              Ingredientes Adicionales
            </Typography>
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
                      sx={{
                        color: selectedIngredients.includes(ingredient.id)
                          ? "#FFF2C9"
                          : "#7E4300",
                        backgroundColor: selectedIngredients.includes(
                          ingredient.id
                        )
                          ? "#7E4300"
                          : "transparent",
                        borderColor: "#7E4300",
                        "&:hover": {
                          backgroundColor: selectedIngredients.includes(
                            ingredient.id
                          )
                            ? "#7E4300"
                            : "#FFD538",
                          borderColor: "#7E4300",
                        },
                      }}
                    >
                      {ingredient.name}
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          onClick={handleClearForm}
          variant="outlined"
          sx={{
            color: "#7E4300",
            borderColor: "#7E4300",
            "&:hover": {
              backgroundColor: "#FFD538",
              borderColor: "#7E4300",
            },
          }}
        >
          Limpiar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormComplete()}
          sx={{
            backgroundColor: "#FFD538",
            color: "#7E4300",
            "&:hover": {
              backgroundColor: "#7E4300",
              color: "#FFD538",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
          }}
        >
          Agregar al Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default CupcakesForm;
