import React, { useState } from "react";
import {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          size="small"
          className="min-w-[180px]"
        >
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="phone">Celular</MenuItem>
          <MenuItem value="email">Correo</MenuItem>
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
                <Search />
              </InputAdornment>
            ),
          }}
          className="flex-grow max-w-md"
        />

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
        >
          Actualizar
        </Button>
      </div>

      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid item xs={12} sm={6} md={4} key={customer.id}>
            <Card>
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" gutterBottom>
                    {customer.name}
                  </Typography>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(customer)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Celular:</strong> {customer.phone}
                </Typography>

                {customer.email && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    <strong>Email:</strong> {customer.email}
                  </Typography>
                )}

                <Typography variant="caption" color="textSecondary">
                  Registrado el:{" "}
                  {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para editar cliente */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent className="space-y-4 min-w-[400px]">
          <TextField
            label="Nombre"
            name="name"
            value={editingCustomer?.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Celular"
            name="phone"
            value={editingCustomer?.phone || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Correo electrónico (opcional)"
            name="email"
            value={editingCustomer?.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSaveCustomer}
            color="primary"
            variant="contained"
            disabled={!editingCustomer?.name || !editingCustomer?.phone}
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
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar al cliente{" "}
            {customerToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomersView;
