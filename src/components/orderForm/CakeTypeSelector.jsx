import React from "react";
import { Button, Grid, Typography, Paper } from "@mui/material";

const CakeTypeSelector = ({ onSelectType, selectedType }) => {
  const cakeTypes = [
    {
      id: "numeric",
      name: "Numérico",
      description: "Pastel con números personalizados",
    },
    { id: "regular", name: "Regular", description: "Pastel tradicional" },
    {
      id: "tiered",
      name: "De Pisos",
      description: "Pastel con múltiples niveles",
    },
    { id: "cupcakes", name: "Cupcakes", description: "Conjunto de cupcakes" },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h6">Selecciona el tipo de pastel</Typography>

      <Grid container spacing={3}>
        {cakeTypes.map((type) => (
          <Grid item xs={12} sm={6} key={type.id}>
            <Paper
              className={`p-4 cursor-pointer transition-all ${
                selectedType === type.id
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-md"
              }`}
              onClick={() => onSelectType(type.id)}
            >
              <Typography variant="h6" className="font-medium">
                {type.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {type.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CakeTypeSelector;
