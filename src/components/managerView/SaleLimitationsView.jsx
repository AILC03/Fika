import React, { useState, useEffect } from "react";
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
import { Refresh, Add, Delete, Edit } from "@mui/icons-material";

const API = import.meta.env.VITE_URI;

const StockLimitationsView = () => {
  const [limitations, setLimitations] = useState([]);
  const [cakesData, setCakesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLimitation, setNewLimitation] = useState({
    lineId: "",
    flavorId: "",
    sizeId: "",
    quantity: "",
    description: "",
  });
  const [editingLimitation, setEditingLimitation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Fetch all stock limitations
  const fetchLimitations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/stocks/stocksLim/getAllStocks`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error fetching limitations");
      const data = await response.json();
      setLimitations(Array.isArray(data?.stocks) ? data.stocks : []);
    } catch (error) {
      console.error("Error fetching limitations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cake lines data
  const fetchCakesData = async () => {
    try {
      const response = await fetch(`${API}/cakes/lines/getAll`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error fetching cakes data");
      const data = await response.json();
      setCakesData(data);
    } catch (error) {
      console.error("Error fetching cakes data:", error);
    }
  };

  useEffect(() => {
    fetchCakesData();
    fetchLimitations();
  }, []);

  // Create new stock limitation
  const createLimitation = async () => {
    try {
      const response = await fetch(`${API}/stocks/stocksLim/createStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newLimitation),
      });
      if (!response.ok) throw new Error("Error creating limitation");
      await fetchLimitations();
      setNewLimitation({
        lineId: "",
        flavorId: "",
        sizeId: "",
        quantity: "",
        description: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating limitation:", error);
    }
  };

  // Update stock limitation
  const updateLimitation = async () => {
    try {
      const response = await fetch(
        `${API}/stocks/stocksLim/updateStock/${editingLimitation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            quantity: editingLimitation.quantity,
            description: editingLimitation.description,
          }),
        }
      );
      if (!response.ok) throw new Error("Error updating limitation");
      await fetchLimitations();
      setEditingLimitation(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating limitation:", error);
    }
  };

  // Delete stock limitation
  const deleteLimitation = async (id) => {
    try {
      const response = await fetch(
        `${API}/stocks/stocksLim/deleteStock/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Error deleting limitation");
      await fetchLimitations();
    } catch (error) {
      console.error("Error deleting limitation:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLimitation((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingLimitation((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (limitation) => {
    setEditingLimitation(limitation);
    setOpenEditDialog(true);
  };

  const getLineName = (id) => {
    return cakesData.find((cake) => cake.Id === id)?.line || "N/A";
  };

  const getFlavorName = (lineId, flavorId) => {
    const line = cakesData.find((cake) => cake.Id === lineId);
    if (!line) return "N/A";
    const flavor = line.flavors.find((f) => f.Id === flavorId);
    return flavor?.flavor || "N/A";
  };

  const getSizeName = (lineId, sizeId) => {
    const line = cakesData.find((cake) => cake.Id === lineId);
    if (!line) return "N/A";
    const size = line.sizes.find((s) => s.Id === sizeId);
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
          Límites de Stock
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
            onClick={fetchLimitations}
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
            Nuevo Límite
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
              <TableCell sx={{ color: "#FFFFFF" }}>Cantidad</TableCell>
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
                <TableCell>{limitation.quantity}</TableCell>
                <TableCell>{limitation.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(limitation)}
                    sx={{ color: "#1976d2" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteLimitation(limitation.id)}
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

      {/* Dialog para crear nuevo límite */}
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
          Nuevo Límite de Stock
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="line-label">Línea</InputLabel>
                <Select
                  labelId="line-label"
                  name="lineId"
                  value={newLimitation.lineId}
                  onChange={handleInputChange}
                  label="Línea"
                >
                  {cakesData.map((line) => (
                    <MenuItem key={line.Id} value={line.Id}>
                      {line.line}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="flavor-label">Sabor</InputLabel>
                <Select
                  labelId="flavor-label"
                  name="flavorId"
                  value={newLimitation.flavorId}
                  onChange={handleInputChange}
                  label="Sabor"
                  disabled={!newLimitation.lineId}
                >
                  {newLimitation.lineId &&
                    cakesData
                      .find((line) => line.Id === Number(newLimitation.lineId))
                      ?.flavors.map((flavor) => (
                        <MenuItem key={flavor.Id} value={flavor.Id}>
                          {flavor.flavor}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="size-label">Tamaño</InputLabel>
                <Select
                  labelId="size-label"
                  name="sizeId"
                  value={newLimitation.sizeId}
                  onChange={handleInputChange}
                  label="Tamaño"
                  disabled={!newLimitation.lineId}
                >
                  {newLimitation.lineId &&
                    cakesData
                      .find((line) => line.Id === Number(newLimitation.lineId))
                      ?.sizes.map((size) => (
                        <MenuItem key={size.Id} value={size.Id}>
                          {size.size}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="quantity"
                label="Cantidad"
                type="number"
                value={newLimitation.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Descripción"
                value={newLimitation.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
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
            onClick={createLimitation}
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
            disabled={!newLimitation.lineId || !newLimitation.quantity}
          >
            Crear Límite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar límite */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
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
          Editar Límite de Stock
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Línea:{" "}
                {editingLimitation && getLineName(editingLimitation.lineId)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Sabor:{" "}
                {editingLimitation &&
                  getFlavorName(
                    editingLimitation.lineId,
                    editingLimitation.flavorId
                  )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Tamaño:{" "}
                {editingLimitation &&
                  getSizeName(
                    editingLimitation.lineId,
                    editingLimitation.sizeId
                  )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="quantity"
                label="Cantidad"
                type="number"
                value={editingLimitation?.quantity || ""}
                onChange={handleEditInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Descripción"
                value={editingLimitation?.description || ""}
                onChange={handleEditInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={updateLimitation}
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
            disabled={!editingLimitation?.quantity}
          >
            Actualizar Límite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockLimitationsView;
