import { Grid, Typography, Paper } from "@mui/material";

//parece que no lo uso para nada xd

const CakeTypeSelector = ({ onSelectType, selectedType }) => {
  const cakeTypes = [
    { id: "regular", name: "Regular", description: "Pastel tradicional" },
    {
      id: "numeric",
      name: "Numérico",
      description: "Pastel con números personalizados",
    },
    {
      id: "tiered",
      name: "De Pisos",
      description: "Pastel con múltiples  niveles",
    },
    { id: "cupcakes", name: "Cupcakes", description: "Conjunto de cupcakes" },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h6" className="text-[#7E4300]">
        Selecciona el tipo de pastel
      </Typography>

      <Grid container spacing={3}>
        {cakeTypes.map((type) => (
          <Grid item xs={12} sm={6} key={type.id}>
            <Paper
              className={`p-4 cursor-pointer transition-all ${
                selectedType === type.id
                  ? "ring-2 ring-[#FFD538] bg-[#FFF2C9]"
                  : "bg-white hover:bg-[#FFF2C9]/50"
              } border border-[#7E4300]/30`}
              onClick={() => onSelectType(type.id)}
            >
              <Typography variant="h6" className="font-medium text-[#7E4300]">
                {type.name}
              </Typography>
              <Typography variant="body2" className="text-[#7E4300]/80">
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
