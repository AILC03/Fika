import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Select,
  MenuItem,
} from "@mui/material";
import { Refresh, Edit, Delete, Search } from "@mui/icons-material";
import { format } from "date-fns";

const CustomersView = ({
  customers,
  onRefresh,
  onUpdateCustomer,
  onDeleteCustomer,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    switch (searchType) {
      case "name":
        return customer.name.toLowerCase().includes(term);
      case "phone":
        return customer.phone.includes(term);
      case "email":
        return customer.email?.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    setOpenEditDialog(true);
  };

  const handleSaveCustomer = () => {
    onUpdateCustomer(editingCustomer);
    setOpenEditDialog(false);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDeleteCustomer(customerToDelete.id);
    setOpenDeleteDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          size="small"
          sx={{
            minWidth: 180,
            backgroundColor: "#FFF2C9",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7E4300",
            },
          }}
        >
          <MenuItem value="name" sx={{ color: "#7E4300" }}>
            Nombre
          </MenuItem>
          <MenuItem value="phone" sx={{ color: "#7E4300" }}>
            Celular
          </MenuItem>
          <MenuItem value="email" sx={{ color: "#7E4300" }}>
            Correo
          </MenuItem>
        </Select>

        <TextField
          placeholder="Buscar cliente..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#7E4300" }} />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: "#FFF2C9",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7E4300",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7E4300",
              },
            },
          }}
          sx={{ flexGrow: 1, maxWidth: "md" }}
        />

        <Button
          variant="outlined"
          startIcon={<Refresh sx={{ color: "#7E4300" }} />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            color: "#7E4300",
            borderColor: "#7E4300",
            "&:hover": {
              backgroundColor: "#FFD538",
              borderColor: "#7E4300",
            },
            "&.Mui-disabled": {
              borderColor: "#bdbdbd",
              color: "#bdbdbd",
            },
          }}
        >
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid item xs={12} sm={6} md={4} key={customer.id}>
            <Card
              sx={{
                backgroundColor: "#FFF2C9",
                border: "1px solid #7E4300",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(126, 67, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    {customer.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCustomer(customer)}
                      sx={{ color: "#7E4300" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(customer)}
                      sx={{ color: "#7E4300" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ color: "#7E4300" }}
                >
                  <strong>Celular:</strong> {customer.phone}
                </Typography>

                {customer.email && (
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    <strong>Email:</strong> {customer.email}
                  </Typography>
                )}

                <Typography variant="caption" sx={{ color: "#7E4300" }}>
                  Registrado el:{" "}
                  {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para editar cliente */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
            border: "1px solid #7E4300",
          },
        }}
      >
        <DialogTitle sx={{ color: "#7E4300" }}>Editar Cliente</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            label="Nombre"
            name="name"
            value={editingCustomer?.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputLabel-root": { color: "#7E4300" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7E4300" },
                "&:hover fieldset": { borderColor: "#7E4300" },
                "&.Mui-focused fieldset": { borderColor: "#7E4300" },
              },
              "& .MuiInputBase-input": { color: "#7E4300" },
            }}
          />

          <TextField
            label="Celular"
            name="phone"
            value={editingCustomer?.phone || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputLabel-root": { color: "#7E4300" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7E4300" },
                "&:hover fieldset": { borderColor: "#7E4300" },
                "&.Mui-focused fieldset": { borderColor: "#7E4300" },
              },
              "& .MuiInputBase-input": { color: "#7E4300" },
            }}
          />

          <TextField
            label="Correo electrónico (opcional)"
            name="email"
            value={editingCustomer?.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputLabel-root": { color: "#7E4300" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7E4300" },
                "&:hover fieldset": { borderColor: "#7E4300" },
                "&.Mui-focused fieldset": { borderColor: "#7E4300" },
              },
              "& .MuiInputBase-input": { color: "#7E4300" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveCustomer}
            variant="contained"
            disabled={!editingCustomer?.name || !editingCustomer?.phone}
            sx={{
              backgroundColor: "#FFD538",
              color: "#7E4300",
              "&:hover": {
                backgroundColor: "#FFD538",
                opacity: 0.9,
              },
              "&.Mui-disabled": {
                backgroundColor: "#f5f5f5",
                color: "#bdbdbd",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
            border: "1px solid #7E4300",
          },
        }}
      >
        <DialogTitle sx={{ color: "#7E4300" }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#7E4300" }}>
            ¿Estás seguro que deseas eliminar al cliente{" "}
            {customerToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#FFD538",
              color: "#7E4300",
              "&:hover": {
                backgroundColor: "#FFD538",
                opacity: 0.9,
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersView;
