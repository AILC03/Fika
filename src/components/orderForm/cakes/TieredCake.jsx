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
} from "@mui/material";
import { Trash2, Plus } from "lucide-react";

const TieredCakeForm = ({ cakeData, onAddCake, onCancel }) => {
  const [selectedLine, setSelectedLine] = useState("");
  const [tiers, setTiers] = useState([{ size: "", flavor: "" }]);

  // DEBUG: Verificar que cakeData llega correctamente
  console.log("Datos de pasteles recibidos en TieredCakeForm:", cakeData);

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
    setSelectedLine(lineType);
    setTiers([{ size: "", flavor: "" }]); // Resetear pisos al cambiar línea
  };

  // Función para agregar nuevo piso
  const handleAddTier = () => {
    if (tiers.length < 4) {
      setTiers([...tiers, { size: "", flavor: "" }]);
    }
  };

  // Función para eliminar piso
  const handleRemoveTier = (index) => {
    if (tiers.length > 1) {
      const newTiers = [...tiers];
      newTiers.splice(index, 1);
      setTiers(newTiers);
    }
  };

  // Función para actualizar un piso
  const handleTierChange = (index, field, value) => {
    const newTiers = tiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setTiers(newTiers);
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

  // Función para enviar los datos al padre
  const handleSubmit = () => {
    if (!validateSizes()) {
      alert("Error: Cada piso debe ser más pequeño que el anterior");
      return;
    }

    const preparedTiers = tiers.map((tier) => {
      const sizeObj = lineData.sizes.find((s) => s.id === tier.size);
      const flavorObj = lineData.flavors.find((f) => f.id === tier.flavor);

      return {
        size: sizeObj ? sizeObj.size : "",
        sizeId: tier.size,
        flavor: flavorObj ? flavorObj.name : "",
        flavorId: tier.flavor,
        ingredients: flavorObj ? flavorObj.ingredients : [],
      };
    });

    onAddCake({
      type: "tiered",
      line: selectedLine,
      tiers: tiers.map((tier) => ({
        size: lineData.sizes.find((s) => s.id === tier.size)?.size || "",
        flavor: lineData.flavors.find((f) => f.id === tier.flavor)?.name || "",
        sizeId: tier.size,
        flavorId: tier.flavor,
      })),
    });
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
    <Box>
      <Typography variant="h6" gutterBottom>
        Pastel de Pisos
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Mínimo 2 pisos, máximo 4 pisos. Cada piso debe ser más pequeño que el
        anterior.
      </Typography>

      {/* Selector de línea */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Línea del Pastel</InputLabel>
        <Select
          value={selectedLine}
          onChange={(e) => handleLineChange(e.target.value)}
          label="Línea del Pastel"
          disabled={!availableLines.length}
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
          {/* Lista de pisos */}
          {tiers.map((tier, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
              <Typography variant="subtitle1" gutterBottom>
                Piso {index + 1}
              </Typography>

              {index > 0 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveTier(index)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  color="error"
                >
                  <Trash2 size={16} />
                </IconButton>
              )}

              <Grid container spacing={2}>
                {/* Selector de tamaño */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tamaño</InputLabel>
                    <Select
                      value={tier.size}
                      onChange={(e) =>
                        handleTierChange(index, "size", e.target.value)
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

                {/* Selector de sabor */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sabor</InputLabel>
                    <Select
                      value={tier.flavor}
                      onChange={(e) =>
                        handleTierChange(index, "flavor", e.target.value)
                      }
                      label="Sabor"
                    >
                      {lineData.flavors.map((flavor) => (
                        <MenuItem key={flavor.id} value={flavor.id}>
                          {flavor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* Botón para agregar más pisos */}
          {tiers.length < 4 && (
            <Button
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={handleAddTier}
              fullWidth
              sx={{ mb: 3 }}
            >
              Agregar Piso
            </Button>
          )}

          {/* Validación visual */}
          {tiers.length > 1 && !validateSizes() && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              ❌ Cada piso debe ser más pequeño que el anterior
            </Typography>
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
        </>
      )}
    </Box>
  );
};

export default TieredCakeForm;
