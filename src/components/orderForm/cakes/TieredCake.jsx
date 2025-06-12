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
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Trash2, Plus } from "lucide-react";

const TieredCakeForm = ({ cakeData, onAddCake }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [tiers, setTiers] = useState([
    { size: "", flavor: "", selectedIngredients: [] },
    { size: "", flavor: "", selectedIngredients: [] },
  ]);

  // Obtener solo líneas disponibles para pasteles de pisos
  const availableLines = cakeData
    ? cakeData.filter((cake) => ["DELUXE", "SPONGE_CAKE"].includes(cake.type))
    : [];

  // Obtener datos completos de la línea seleccionada
  const lineData = availableLines.find(
    (line) => line.type === selectedLine
  ) || {
    flavors: [],
    sizes: [],
  };

  // Función para manejar cambio de línea
  const handleLineChange = (lineType) => {
    const selectedLineData = availableLines.find(
      (line) => line.type === lineType
    );
    setSelectedLine(selectedLineData?.type || "");
    // Inicializar con 2 pisos al cambiar línea
    setTiers([
      { size: "", flavor: "", selectedIngredients: [] },
      { size: "", flavor: "", selectedIngredients: [] },
    ]);
  };

  // Función para agregar nuevo piso
  const handleAddTier = () => {
    if (tiers.length < 4) {
      setTiers([...tiers, { size: "", flavor: "", selectedIngredients: [] }]);
    }
  };

  // Función para eliminar piso
  const handleRemoveTier = (index) => {
    if (tiers.length > 2) {
      // Mínimo 2 pisos
      const newTiers = [...tiers];
      newTiers.splice(index, 1);
      setTiers(newTiers);
    }
  };

  // Función para actualizar un piso
  const handleTierChange = (index, field, value) => {
    const newTiers = tiers.map((tier, i) => {
      if (i === index) {
        // Resetear ingredientes cuando cambia el sabor
        if (field === "flavor") {
          return { ...tier, [field]: value, selectedIngredients: [] };
        }
        return { ...tier, [field]: value };
      }
      return tier;
    });
    setTiers(newTiers);
  };

  // Manejar selección de ingredientes
  const handleIngredientToggle = (tierIndex, ingredientId) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].selectedIngredients = newTiers[
      tierIndex
    ].selectedIngredients.includes(ingredientId)
      ? newTiers[tierIndex].selectedIngredients.filter(
          (id) => id !== ingredientId
        )
      : [...newTiers[tierIndex].selectedIngredients, ingredientId];
    setTiers(newTiers);
  };

  // Obtener ingredientes del sabor seleccionado
  const getFlavorIngredients = (flavorId) => {
    const flavor = lineData.flavors.find((f) => f.id === flavorId);
    return flavor?.ingredients || [];
  };

  // Validar que los tamaños sean decrecientes
  const validateSizes = () => {
    if (!lineData.sizes) return false;

    const sizeOrder = lineData.sizes.map((size) => size.id);
    for (let i = 0; i < tiers.length - 1; i++) {
      const currentIndex = sizeOrder.indexOf(tiers[i].size);
      const nextIndex = sizeOrder.indexOf(tiers[i + 1].size);
      if (
        currentIndex === -1 ||
        nextIndex === -1 ||
        currentIndex <= nextIndex
      ) {
        return false;
      }
    }
    return true;
  };

  // Limpiar todo el formulario
  const handleClearForm = () => {
    setSelectedLine("");
    setTiers([
      { size: "", flavor: "", selectedIngredients: [] },
      { size: "", flavor: "", selectedIngredients: [] },
    ]);
  };

  // Función para enviar los datos al padre
  const handleSubmit = () => {
    if (!validateSizes()) {
      alert("Error: Cada piso debe ser más pequeño que el anterior");
      return;
    }

    const selectedLineData = availableLines.find(
      (line) => line.type === selectedLine
    );

    // Preparar los datos según el estándar
    const cakeData = {
      type: "tiered",
      line: {
        id: selectedLineData?.id || 0,
        name: selectedLineData?.type || "",
      },
      tiers: tiers.map((tier) => {
        const sizeObj = lineData.sizes.find((s) => s.id === tier.size);
        const flavorObj = lineData.flavors.find((f) => f.id === tier.flavor);
        const ingredientsData =
          flavorObj?.ingredients?.filter((ing) =>
            tier.selectedIngredients.includes(ing.id)
          ) || [];

        return {
          flavor: {
            id: flavorObj?.id || 0,
            name: flavorObj?.name || "",
            ingredients: ingredientsData.map((ing) => ({
              id: ing.id,
              name: ing.name,
            })),
          },
          size: {
            id: sizeObj?.id || 0,
            name: sizeObj?.size || "",
          },
        };
      }),
      quantity: 1, // Asumiendo cantidad 1 por defecto
    };

    onAddCake(cakeData);
  };

  // Verificar si el formulario está completo
  const isFormComplete = () => {
    return (
      selectedLine &&
      tiers.every((tier) => tier.size && tier.flavor) &&
      validateSizes()
    );
  };

  return (
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Pastel de Pisos
      </Typography>
      <Typography variant="body2" sx={{ color: "#7E4300", mb: 2 }} gutterBottom>
        Mínimo 2 pisos, máximo 4 pisos. Cada piso debe ser más pequeño que el
        anterior.
      </Typography>

      {/* Selector de línea */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "#7E4300" }}>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => handleLineChange(e.target.value)}
          label="Línea del Pastel"
          disabled={!availableLines.length}
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
          {/* Lista de pisos */}
          {tiers.map((tier, index) => {
            const flavorIngredients = getFlavorIngredients(tier.flavor);

            return (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  position: "relative",
                  backgroundColor: "#FFF2C9",
                  border: "1px solid #7E4300",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "#7E4300" }}
                >
                  Piso {index + 1}
                </Typography>

                {index >= 2 && ( // Solo mostrar botón de eliminar en pisos adicionales
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveTier(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "#7E4300",
                      "&:hover": { backgroundColor: "#FFD538" },
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                )}

                <Grid container spacing={2}>
                  {/* Selector de tamaño */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#7E4300" }}>Tamaño</InputLabel>
                      <Select
                        value={tier.size}
                        onChange={(e) =>
                          handleTierChange(index, "size", e.target.value)
                        }
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
                  </Grid>

                  {/* Selector de sabor */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#7E4300" }}>Sabor</InputLabel>
                      <Select
                        value={tier.flavor}
                        onChange={(e) =>
                          handleTierChange(index, "flavor", e.target.value)
                        }
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
                  </Grid>

                  {/* Ingredientes del sabor seleccionado */}
                  {tier.flavor && flavorIngredients.length > 0 && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ color: "#7E4300" }}
                      >
                        Ingredientes Adicionales
                      </Typography>
                      <Grid container spacing={1}>
                        {flavorIngredients.map((ingredient) => (
                          <Grid item xs={12} sm={6} key={ingredient.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={tier.selectedIngredients?.includes(
                                    ingredient.id
                                  )}
                                  onChange={() =>
                                    handleIngredientToggle(index, ingredient.id)
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
                    </Grid>
                  )}
                </Grid>
              </Paper>
            );
          })}

          {/* Botón para agregar más pisos */}
          {tiers.length < 4 && (
            <Button
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={handleAddTier}
              fullWidth
              sx={{
                mb: 3,
                color: "#7E4300",
                borderColor: "#7E4300",
                "&:hover": {
                  backgroundColor: "#FFD538",
                  borderColor: "#7E4300",
                },
              }}
            >
              Agregar Piso (Máximo 4)
            </Button>
          )}

          {/* Validación visual */}
          {tiers.length > 1 && !validateSizes() && (
            <Typography sx={{ color: "#7E4300", mb: 2 }}>
              ❌ Cada piso debe ser más pequeño que el anterior
            </Typography>
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
        </>
      )}
    </Box>
  );
};

export default TieredCakeForm;
