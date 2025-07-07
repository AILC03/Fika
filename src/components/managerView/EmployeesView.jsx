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
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputAdornment,
  Box,
} from "@mui/material";
import { Refresh, Delete, Search, Add } from "@mui/icons-material";
import { format } from "date-fns";

const EmployeesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    user: "",
    password: "",
    shift: "MATUTINO",
    rol: "CAJA",
  });

  const API = import.meta.env.VITE_URI;

  // Función para obtener todos los usuarios
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/users/auth/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching users");
      }

      const data = await response.json();
      setEmployees(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo usuario
  const createUser = async () => {
    try {
      const response = await fetch(`${API}/users/auth/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error("Error creating user");
      }

      await getAllUsers(); // Actualizar la lista después de crear
      setOpenCreateDialog(false);
      setNewEmployee({
        name: "",
        user: "",
        password: "",
        shift: "MATUTINO",
        rol: "CAJA",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API}/users/auth/deleteUser/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error deleting user");
      }

      await getAllUsers(); // Actualizar la lista después de eliminar
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    getAllUsers();
  }, []);

  // Filtrar empleados según búsqueda
  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    switch (searchType) {
      case "name":
        return employee.name.toLowerCase().includes(term);
      case "user":
        return employee.user.toLowerCase().includes(term);
      case "rol":
        return employee.rol.toLowerCase().includes(term);
      case "shift":
        return employee.shift.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteUser(employeeToDelete.Id);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#FFF2C9", minHeight: "100vh" }}>
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
          }}
        >
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="user">Usuario</MenuItem>
          <MenuItem value="rol">Rol</MenuItem>
          <MenuItem value="shift">Turno</MenuItem>
        </Select>

        <TextField
          placeholder="Buscar empleado..."
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
            },
          }}
          sx={{ flexGrow: 1, maxWidth: "md" }}
        />

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={getAllUsers}
          disabled={loading}
          sx={{
            backgroundColor: "#FFD538",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#e6c032",
            },
          }}
        >
          Actualizar
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            backgroundColor: "#4CAF50",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#388E3C",
            },
          }}
        >
          Nuevo
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#FFF2C9",
          "& .MuiTableCell-root": {
            borderColor: "#7E430055",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#7E4300" }}>
              <TableCell sx={{ color: "#FFFFFF" }}>Nombre</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Usuario</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Rol</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Turno</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Registro</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow
                key={employee.Id}
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
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.user}</TableCell>
                <TableCell>{employee.rol}</TableCell>
                <TableCell>{employee.shift}</TableCell>
                <TableCell>
                  {format(new Date(employee.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(employee)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear nuevo usuario */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
          Crear Nuevo Usuario
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 3 }}>
          <TextField
            label="Nombre completo"
            name="name"
            value={newEmployee.name}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <TextField
            label="Usuario"
            name="user"
            value={newEmployee.user}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={newEmployee.password}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <Select
            label="Rol"
            name="rol"
            value={newEmployee.rol}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          >
            <MenuItem value="ADMIN">Administrador</MenuItem>
            <MenuItem value="CAJA">Caja</MenuItem>
          </Select>

          <Select
            label="Turno"
            name="shift"
            value={newEmployee.shift}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          >
            <MenuItem value="MATUTINO">Matutino</MenuItem>
            <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
            <MenuItem value="VESPERTINO">Vespertino</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={createUser}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
              },
            }}
            disabled={
              !newEmployee.name ||
              !newEmployee.user ||
              !newEmployee.password ||
              !newEmployee.rol ||
              !newEmployee.shift
            }
          >
            Crear
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
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography>
            ¿Estás seguro que deseas eliminar al usuario{" "}
            {employeeToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              backgroundColor: "#d32f2f",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#b71c1c",
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

export default EmployeesView;
