import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { Refresh, Add, Delete } from "@mui/icons-material";

const SaleLimitationsView = ({
  limitations,
  cakesData,
  onRefresh,
  onCreateLimitation,
  onDeleteLimitation,
  loading,
}) => {
  const [newLimitation, setNewLimitation] = useState({
    lineId: "",
    flavorId: "",
    sizeId: "",
    limit: "",
    description: "",
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLimitation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onCreateLimitation(newLimitation);
    setNewLimitation({
      lineId: "",
      flavorId: "",
      sizeId: "",
      limit: "",
      description: "",
    });
    setOpenDialog(false);
  };

  const getLineName = (id) => {
    return cakesData.find((cake) => cake.id === id)?.type || "N/A";
  };

  const getFlavorName = (lineId, flavorId) => {
    const line = cakesData.find((cake) => cake.id === lineId);
    if (!line) return "N/A";
    const flavor = line.flavors.find((f) => f.id === flavorId);
    return flavor?.name || "N/A";
  };

  const getSizeName = (lineId, sizeId) => {
    const line = cakesData.find((cake) => cake.id === lineId);
    if (!line) return "N/A";
    const size = line.sizes.find((s) => s.id === sizeId);
    return size?.size || "N/A";
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        backgroundColor: "#FFF2C9",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 3,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h6" sx={{ color: "#7E4300" }}>
          Delimitaciones de Venta
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "flex-end", sm: "unset" },
          }}
        >
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              backgroundColor: "#FFD538",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#e6c032",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
              },
            }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: "#7E4300",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#5a3000",
              },
            }}
          >
            Nueva Delimitación
          </Button>
        </Box>
      </Box>

      {/* Tabla responsiva */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#FFF2C9",
          "& .MuiTableCell-root": {
            borderColor: "#7E430055",
          },
          overflowX: "auto",
          maxWidth: "100vw",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#7E4300" }}>
              <TableCell sx={{ color: "#FFFFFF" }}>Línea</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Sabor</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Tamaño</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Límite</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Descripción</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {limitations.map((limitation) => (
              <TableRow
                key={limitation.id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#FFF2C9",
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: "#FFD53833",
                  },
                  "&:hover": {
                    backgroundColor: "#FFD53866",
                  },
                }}
              >
                <TableCell>{getLineName(limitation.lineId)}</TableCell>
                <TableCell>
                  {getFlavorName(limitation.lineId, limitation.flavorId)}
                </TableCell>
                <TableCell>
                  {getSizeName(limitation.lineId, limitation.sizeId)}
                </TableCell>
                <TableCell>{limitation.limit}</TableCell>
                <TableCell>{limitation.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onDeleteLimitation(limitation.id)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear nueva delimitación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
            width: "100%",
            minWidth: { xs: "unset", sm: 500 },
            m: { xs: 1, sm: "auto" },
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
          Nueva Delimitación de Venta
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* ...campos del formulario igual... */}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#FFD538",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#e6c032",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
              },
            }}
            disabled={
              !newLimitation.lineId ||
              !newLimitation.flavorId ||
              !newLimitation.sizeId ||
              !newLimitation.limit
            }
          >
            Crear Delimitación
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SaleLimitationsView;
