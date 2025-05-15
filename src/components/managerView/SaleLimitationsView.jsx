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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h6">Delimitaciones de Venta</Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Nueva Delimitación
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Línea</TableCell>
              <TableCell>Sabor</TableCell>
              <TableCell>Tamaño</TableCell>
              <TableCell>Límite</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {limitations.map((limitation) => (
              <TableRow key={limitation.id}>
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
                  <IconButton onClick={() => onDeleteLimitation(limitation.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear nueva delimitación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva Delimitación de Venta</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Línea</InputLabel>
                <Select
                  name="lineId"
                  value={newLimitation.lineId}
                  onChange={handleInputChange}
                  label="Línea"
                  required
                >
                  {cakesData.map((cake) => (
                    <MenuItem key={cake.id} value={cake.id}>
                      {cake.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sabor</InputLabel>
                <Select
                  name="flavorId"
                  value={newLimitation.flavorId}
                  onChange={handleInputChange}
                  label="Sabor"
                  disabled={!newLimitation.lineId}
                  required
                >
                  {newLimitation.lineId &&
                    cakesData
                      .find((c) => c.id === newLimitation.lineId)
                      ?.flavors.map((flavor) => (
                        <MenuItem key={flavor.id} value={flavor.id}>
                          {flavor.name}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tamaño</InputLabel>
                <Select
                  name="sizeId"
                  value={newLimitation.sizeId}
                  onChange={handleInputChange}
                  label="Tamaño"
                  disabled={!newLimitation.lineId}
                  required
                >
                  {newLimitation.lineId &&
                    cakesData
                      .find((c) => c.id === newLimitation.lineId)
                      ?.sizes.map((size) => (
                        <MenuItem key={size.id} value={size.id}>
                          {size.size}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="limit"
                label="Cantidad a limitar"
                type="number"
                fullWidth
                value={newLimitation.limit}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={newLimitation.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
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
    </div>
  );
};

export default SaleLimitationsView;
