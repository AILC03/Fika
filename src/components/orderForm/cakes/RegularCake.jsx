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

const RegularCakeForm = ({ cakeData, onAddCake }) => {
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
  const handleLineChange = (lineType) => {
    const selectedLineObj = availableLines.find(
      (line) => line.type === lineType
    );
    setSelectedLine(lineType);
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

  // Limpiar todo el formulario
  const handleClearForm = () => {
    setSelectedLine("");
    setSelectedFlavor("");
    setSelectedSize("");
    setSelectedIngredients([]);
  };

  // Enviar datos al componente padre
  const handleSubmit = () => {
    // Verificar que los campos obligatorios estén completos
    if (!selectedLine || !selectedFlavor || !selectedSize) return;

    // Obtener los objetos completos de los elementos seleccionados
    const selectedLineObj = availableLines.find(
      (line) => line.type === selectedLine
    );
    const selectedFlavorObj = lineData.flavors.find(
      (f) => f.id === selectedFlavor
    );
    const selectedSizeObj = lineData.sizes.find((s) => s.id === selectedSize);

    // Obtener los ingredientes seleccionados con sus datos completos
    const selectedIngredientsData = flavorData.ingredients
      .filter((ing) => selectedIngredients.includes(ing.id))
      .map((ing) => ({
        id: ing.id,
        name: ing.name,
      }));

    // Construir el objeto del pastel según el estándar
    const cake = {
      type: "regular",
      line: {
        id: selectedLineObj?.id || 0,
        name: selectedLineObj?.type || "",
      },
      flavor: {
        id: selectedFlavorObj?.id || 0,
        name: selectedFlavorObj?.name || "",
        ingredients:
          selectedFlavorObj?.ingredients?.map((ing) => ({
            id: ing.id,
            name: ing.name,
          })) || [],
      },
      size: {
        id: selectedSizeObj?.id || 0,
        name: selectedSizeObj?.size || "",
      },
      ingredients: selectedIngredientsData,
      quantity: 1, // Valor por defecto
    };

    // Enviar al componente padre
    onAddCake(cake);
  };

  // Verificar si el formulario está completo
  const isFormComplete = () => {
    return selectedLine && selectedFlavor && selectedSize;
  };

  return (
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Pastel Regular
      </Typography>

      {/* Selector de línea */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "#7E4300" }}>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => handleLineChange(e.target.value)}
          label="Línea del Pastel"
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
          {availableLines.map((line) => (
            <MenuItem
              key={line.id}
              value={line.type}
              sx={{
                color: "#7E4300",
                "&:hover": { backgroundColor: "#FFD538" },
              }}
            >
              {line.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLine && (
        <>
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
              {lineData.flavors.map((flavor) => (
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

          {selectedFlavor && (
            <>
              {/* Selector de tamaño */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: "#7E4300" }}>Tamaño</InputLabel>
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  label="Tamaño"
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
                  {lineData.sizes.map((size) => (
                    <MenuItem
                      key={size.id}
                      value={size.id}
                      sx={{
                        color: "#7E4300",
                        "&:hover": { backgroundColor: "#FFD538" },
                      }}
                    >
                      {size.size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selector de ingredientes (si el sabor tiene ingredientes) */}
              {flavorData.ingredients.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    Ingredientes Adicionales
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#7E4300", mb: 2 }}
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
                              sx={{
                                color: "#7E4300",
                                "&.Mui-checked": {
                                  color: "#7E4300",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: "#7E4300" }}>
                              {ingredient.name}
                            </Typography>
                          }
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

export default RegularCakeForm;
