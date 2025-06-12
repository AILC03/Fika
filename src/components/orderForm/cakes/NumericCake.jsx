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
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Pastel Numérico
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "#7E4300" }}>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          label="Línea del Pastel"
          sx={{
            backgroundColor: "#FFF2C9",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
          }}
        >
          {availableLines.map((line) => (
            <MenuItem key={line.id} value={line.type} sx={{ color: "#7E4300" }}>
              {line.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ color: "#7E4300" }}>
          Número:
        </Typography>
        <TextField
          fullWidth
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{
            backgroundColor: "#FFF2C9",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#7E4300",
              },
              "&:hover fieldset": {
                borderColor: "#7E4300",
              },
            },
          }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <Button
              key={digit}
              variant="outlined"
              onClick={() => handleAddDigit(digit)}
              sx={{
                minWidth: "40px",
                color: "#7E4300",
                borderColor: "#7E4300",
                "&:hover": {
                  backgroundColor: "#FFD538",
                  borderColor: "#7E4300",
                },
              }}
            >
              {digit}
            </Button>
          ))}
          <Button
            variant="outlined"
            onClick={() => setNumber("")}
            sx={{
              minWidth: "40px",
              color: "#7E4300",
              borderColor: "#7E4300",
              "&:hover": {
                backgroundColor: "#FFD538",
                borderColor: "#7E4300",
              },
            }}
          >
            C
          </Button>
        </Box>
      </Box>

      {number.length > 0 && selectedLine && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#7E4300" }}
          >
            Configuración por dígito
          </Typography>

          {number.split("").map((digit, index) => {
            const config = digitConfigs[index] || {};
            const flavorIngredients = getFlavorIngredients(config.flavor);

            return (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#FFF2C9",
                  border: "1px solid #7E4300",
                }}
              >
                <Typography gutterBottom sx={{ color: "#7E4300" }}>
                  Dígito: {digit}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#7E4300" }}>Sabor</InputLabel>
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
                        sx={{
                          backgroundColor: "#FFF2C9",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7E4300",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7E4300",
                          },
                        }}
                      >
                        {lineData.flavors?.map((flavor) => (
                          <MenuItem
                            key={flavor.id}
                            value={flavor.id}
                            sx={{ color: "#7E4300" }}
                          >
                            {flavor.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#7E4300" }}>Tamaño</InputLabel>
                      <Select
                        value={config.size || ""}
                        onChange={(e) =>
                          handleDigitConfigChange(index, "size", e.target.value)
                        }
                        label="Tamaño"
                        sx={{
                          backgroundColor: "#FFF2C9",
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
                            sx={{ color: "#7E4300" }}
                          >
                            {size.size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {config.flavor && flavorIngredients.length > 0 && (
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
                                  checked={config.selectedIngredients?.includes(
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
        </Box>
      )}

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
          disabled={!number || !selectedLine}
          sx={{
            backgroundColor: "#FFD538",
            color: "#7E4300",
            "&:hover": {
              backgroundColor: "#7E4300", // Color oscuro en hover
              color: "#FFD538",
              opacity: 1,
            },
            "&.Mui-disabled": {
              backgroundColor: "#f5f5f5",
              color: "#bdbdbd",
            },
          }}
        >
          Agregar al Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default NumericCakeForm;
