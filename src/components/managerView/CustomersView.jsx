import React, { useState, useEffect } from "react";
import {
  Box,
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
  Button,
} from "@mui/material";
import { Edit, Search, Add } from "@mui/icons-material";
import { format } from "date-fns";

const CustomersView = () => {
  const API = import.meta.env.VITE_URI;
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    company: "Fika",
    observation: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/clients/client/getClients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const formattedCustomers = data.map((customer) => ({
          id: customer.id,
          name: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          company: customer.company,
          observation: customer.observation,
          createdAt: customer.createdAt,
        }));
        setCustomers(formattedCustomers);
      } else {
        console.error("Error al obtener clientes:", data.message);
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (updatedCustomer) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/clients/client/updateClient/${updatedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: updatedCustomer.name,
            phone: updatedCustomer.phone,
            email: updatedCustomer.email || "",
            company: updatedCustomer.company || "Fika",
            observation: updatedCustomer.observation || "",
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchCustomers();
      } else {
        console.error("Error al actualizar cliente:", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/clients/client/createClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email,
          company: newCustomer.company,
          observation: newCustomer.observation,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        fetchCustomers();
        setOpenCreateDialog(false);
        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          company: "Fika",
          observation: "",
        });
      } else {
        console.error("Error al crear cliente:", data.message);
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
    } finally {
      setLoading(false);
    }
  };

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
    updateCustomer(editingCustomer);
    setOpenEditDialog(false);
  };

  const handleCreateCustomer = () => {
    setOpenCreateDialog(true);
  };

  const handleSaveNewCustomer = () => {
    createCustomer();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
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
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateCustomer}
          sx={{
            backgroundColor: "#FFD538",
            color: "#7E4300",
            "&:hover": {
              backgroundColor: "#FFD538",
              opacity: 0.9,
            },
          }}
        >
          Nuevo Cliente
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
                  <IconButton
                    size="small"
                    onClick={() => handleEditCustomer(customer)}
                    sx={{ color: "#7E4300" }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
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

                {customer.company && (
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    <strong>Empresa:</strong> {customer.company}
                  </Typography>
                )}

                {customer.observation && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#7E4300", fontStyle: "italic" }}
                  >
                    <strong>Observación:</strong> {customer.observation}
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

          <TextField
            label="Empresa"
            name="company"
            value={editingCustomer?.company || ""}
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
            label="Observaciones"
            name="observation"
            value={editingCustomer?.observation || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
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

      {/* Dialog para crear nuevo cliente */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
            border: "1px solid #7E4300",
          },
        }}
      >
        <DialogTitle sx={{ color: "#7E4300" }}>Nuevo Cliente</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            label="Nombre"
            name="name"
            value={newCustomer.name}
            onChange={handleNewCustomerChange}
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
            value={newCustomer.phone}
            onChange={handleNewCustomerChange}
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
            value={newCustomer.email}
            onChange={handleNewCustomerChange}
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
            label="Empresa"
            name="company"
            value={newCustomer.company}
            onChange={handleNewCustomerChange}
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
            label="Observaciones"
            name="observation"
            value={newCustomer.observation}
            onChange={handleNewCustomerChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
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
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveNewCustomer}
            variant="contained"
            disabled={!newCustomer.name || !newCustomer.phone}
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
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersView;
