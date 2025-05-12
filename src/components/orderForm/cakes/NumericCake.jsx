import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const NumericCakeForm = ({ cakeData, onAddCake, onCancel }) => {
  const [number, setNumber] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [digitConfigs, setDigitConfigs] = useState([]);

  const availableLines = (cakeData || []).filter((cake) =>
    ["DELUXE", "SPONGE_CAKE", "TRADITIONAL", "CLASIC"].includes(cake.type)
  );

  const lineData = availableLines.find(
    (line) => line.type === selectedLine
  ) || { flavors: [], sizes: [], ingredients: [] };

  useEffect(() => {
    setDigitConfigs(
      number.split("").map(
        (_, index) =>
          digitConfigs[index] || {
            selectedIngredients: [],
          }
      )
    );
  }, [number]);

  const handleAddDigit = (digit) => {
    setNumber((prev) => prev + digit);
  };

  const handleClearForm = () => {
    setNumber("");
    setSelectedLine("");
    setDigitConfigs([]);
  };

  const handleSubmit = () => {
    if (!number || !selectedLine) return;

    const selectedLineObj = availableLines.find(
      (line) => line.type === selectedLine
    );

    // Preparar los datos según el estándar
    const cakeData = {
      type: "numeric",
      line: {
        id: selectedLineObj?.id || 0,
        name: selectedLineObj?.type || "",
      },
      digits: number.split("").map((digit, index) => {
        const config = digitConfigs[index] || {};
        const flavorObj = lineData.flavors.find((f) => f.id === config.flavor);
        const sizeObj = lineData.sizes.find((s) => s.id === config.size);
        const ingredientsData =
          flavorObj?.ingredients?.filter((ing) =>
            config.selectedIngredients?.includes(ing.id)
          ) || [];

        return {
          digit,
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

  const handleDigitConfigChange = (index, field, value) => {
    const newConfigs = [...digitConfigs];
    if (!newConfigs[index]) newConfigs[index] = { selectedIngredients: [] };
    newConfigs[index][field] = value;

    // Resetear ingredientes cuando cambia el sabor
    if (field === "flavor") {
      newConfigs[index].selectedIngredients = [];
    }

    setDigitConfigs(newConfigs);
  };

  const handleIngredientToggle = (index, ingredientId) => {
    const newConfigs = [...digitConfigs];
    if (!newConfigs[index]) newConfigs[index] = { selectedIngredients: [] };

    newConfigs[index].selectedIngredients = newConfigs[
      index
    ].selectedIngredients.includes(ingredientId)
      ? newConfigs[index].selectedIngredients.filter(
          (id) => id !== ingredientId
        )
      : [...newConfigs[index].selectedIngredients, ingredientId];

    setDigitConfigs(newConfigs);
  };

  const getFlavorIngredients = (flavorId) => {
    const flavor = lineData.flavors.find((f) => f.id === flavorId);
    return flavor?.ingredients || [];
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pastel Numérico
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          label="Línea del Pastel"
        >
          {availableLines.map((line) => (
            <MenuItem key={line.id} value={line.type}>
              {line.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Número:</Typography>
        <TextField
          fullWidth
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <Button
              key={digit}
              variant="outlined"
              onClick={() => handleAddDigit(digit)}
              sx={{ minWidth: "40px" }}
            >
              {digit}
            </Button>
          ))}
          <Button
            variant="outlined"
            color="error"
            onClick={() => setNumber("")}
            sx={{ minWidth: "40px" }}
          >
            C
          </Button>
        </Box>
      </Box>

      {number.length > 0 && selectedLine && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Configuración por dígito
          </Typography>

          {number.split("").map((digit, index) => {
            const config = digitConfigs[index] || {};
            const flavorIngredients = getFlavorIngredients(config.flavor);

            return (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography gutterBottom>Dígito: {digit}</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Sabor</InputLabel>
                      <Select
                        value={config.flavor || ""}
                        onChange={(e) =>
                          handleDigitConfigChange(
                            index,
                            "flavor",
                            e.target.value
                          )
                        }
                        label="Sabor"
                      >
                        {lineData.flavors?.map((flavor) => (
                          <MenuItem key={flavor.id} value={flavor.id}>
                            {flavor.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tamaño</InputLabel>
                      <Select
                        value={config.size || ""}
                        onChange={(e) =>
                          handleDigitConfigChange(index, "size", e.target.value)
                        }
                        label="Tamaño"
                      >
                        {lineData.sizes.map((size) => (
                          <MenuItem key={size.id} value={size.id}>
                            {size.size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {config.flavor && flavorIngredients.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Ingredientes Adicionales
                      </Typography>
                      <Grid container spacing={1}>
                        {flavorIngredients.map((ingredient) => (
                          <Grid item xs={12} sm={6} key={ingredient.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={config.selectedIngredients?.includes(
                                    ingredient.id
                                  )}
                                  onChange={() =>
                                    handleIngredientToggle(index, ingredient.id)
                                  }
                                />
                              }
                              label={ingredient.name}
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
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={handleClearForm} variant="outlined">
          Limpiar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!number || !selectedLine}
        >
          Agregar al Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default NumericCakeForm;
