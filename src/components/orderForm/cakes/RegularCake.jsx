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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const RegularCakeForm = ({ cakeData, onAddCake, onCancel }) => {
  // Estados para la configuración del pastel
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Obtener líneas disponibles para pasteles regulares
  const availableLines = cakeData.filter((cake) =>
    ["DELUXE", "SPONGE_CAKE", "TRADITIONAL", "CLASIC"].includes(cake.type)
  );

  // Datos de la línea seleccionada
  const lineData = availableLines.find(
    (line) => line.type === selectedLine
  ) || {
    flavors: [],
    sizes: [],
    ingredients: [],
  };

  // Datos del sabor seleccionado
  const flavorData = lineData.flavors.find(
    (flavor) => flavor.id === selectedFlavor
  ) || {
    ingredients: [],
  };

  // Manejar cambio de línea (resetear selecciones cuando cambia)
  const handleLineChange = (line) => {
    setSelectedLine(line);
    setSelectedFlavor("");
    setSelectedSize("");
    setSelectedIngredients([]);
  };

  // Manejar cambio de sabor (resetear ingredientes cuando cambia)
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
    setSelectedIngredients([]);
  };

  // Manejar selección de ingredientes
  const handleIngredientToggle = (ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  // Enviar datos al componente padre
  const handleSubmit = () => {
    // Verificar que los campos obligatorios estén completos
    if (!selectedLine || !selectedFlavor || !selectedSize) return;

    // Obtener los objetos completos de sabor y tamaño
    const selectedFlavorObj = lineData.flavors.find(
      (f) => f.id === selectedFlavor
    );
    const selectedSizeObj = lineData.sizes.find((s) => s.id === selectedSize);

    // Obtener los ingredientes seleccionados con sus datos completos
    const selectedIngredientsData = flavorData.ingredients.filter((ing) =>
      selectedIngredients.includes(ing.id)
    );

    // Construir el objeto del pastel
    const cake = {
      type: "regular",
      line: selectedLine,
      flavor: {
        id: selectedFlavor,
        name: selectedFlavorObj?.name || "",
        ingredients: selectedIngredientsData.map((ing) => ({
          id: ing.id,
          name: ing.name,
        })),
      },
      size: {
        id: selectedSize,
        name: selectedSizeObj?.size || "",
      },
      ingredients: selectedIngredientsData.map((ing) => ing.name),
    };

    // Enviar al componente padre
    onAddCake(cake);
  };

  // Verificar si el formulario está completo
  const isFormComplete = () => {
    return selectedLine && selectedFlavor && selectedSize;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pastel Regular
      </Typography>

      {/* Selector de línea */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => handleLineChange(e.target.value)}
          label="Línea del Pastel"
        >
          {availableLines.map((line) => (
            <MenuItem key={line.id} value={line.type}>
              {line.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLine && (
        <>
          {/* Selector de sabor */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sabor</InputLabel>
            <Select
              value={selectedFlavor}
              onChange={(e) => handleFlavorChange(e.target.value)}
              label="Sabor"
            >
              {lineData.flavors.map((flavor) => (
                <MenuItem key={flavor.id} value={flavor.id}>
                  {flavor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedFlavor && (
            <>
              {/* Selector de tamaño */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tamaño</InputLabel>
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  label="Tamaño"
                >
                  {lineData.sizes.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                      {size.size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selector de ingredientes (si el sabor tiene ingredientes) */}
              {flavorData.ingredients.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Ingredientes Adicionales
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Selecciona los ingredientes que deseas incluir
                  </Typography>
                  <Grid container spacing={1}>
                    {flavorData.ingredients.map((ingredient) => (
                      <Grid item xs={12} sm={6} key={ingredient.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedIngredients.includes(
                                ingredient.id
                              )}
                              onChange={() =>
                                handleIngredientToggle(ingredient.id)
                              }
                            />
                          }
                          label={ingredient.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Botones de acción */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onCancel} variant="outlined">
          Cancelar
        </Button>
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

export default RegularCakeForm;
