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
import { Refresh, Edit, Delete, Search } from "@mui/icons-material";
import { format } from "date-fns";

const EmployeesView = ({
  employees,
  onRefresh,
  onUpdateEmployee,
  onDeleteEmployee,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    switch (searchType) {
      case "name":
        return employee.name.toLowerCase().includes(term);
      case "employeeNumber":
        return employee.employeeNumber.includes(term);
      case "position":
        return employee.position.toLowerCase().includes(term);
      case "shift":
        return employee.shift.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
    setOpenEditDialog(true);
  };

  const handleSaveEmployee = () => {
    onUpdateEmployee(editingEmployee);
    setOpenEditDialog(false);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDeleteEmployee(employeeToDelete.id);
    setOpenDeleteDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => ({ ...prev, [name]: value }));
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
          <MenuItem value="employeeNumber">Número de empleado</MenuItem>
          <MenuItem value="position">Puesto</MenuItem>
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
          onClick={onRefresh}
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
              <TableCell sx={{ color: "#FFFFFF" }}>Número</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Puesto</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Turno</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Registro</TableCell>
              <TableCell sx={{ color: "#FFFFFF" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow
                key={employee.id}
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
                <TableCell>{employee.employeeNumber}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.shift}</TableCell>
                <TableCell>
                  {format(new Date(employee.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditEmployee(employee)}
                    sx={{ color: "#7E4300" }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
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

      {/* Dialog para editar empleado */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#FFF2C9",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
          Editar Empleado
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 3 }}>
          <TextField
            label="Nombre completo"
            name="name"
            value={editingEmployee?.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <TextField
            label="Número de empleado"
            name="employeeNumber"
            value={editingEmployee?.employeeNumber || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <TextField
            label="Puesto"
            name="position"
            value={editingEmployee?.position || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          />

          <Select
            label="Turno"
            name="shift"
            value={editingEmployee?.shift || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ mb: 2, backgroundColor: "#FFFFFF" }}
          >
            <MenuItem value="matutino">Matutino</MenuItem>
            <MenuItem value="vespertino">Vespertino</MenuItem>
            <MenuItem value="nocturno">Nocturno</MenuItem>
            <MenuItem value="completo">Tiempo completo</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ color: "#7E4300" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEmployee}
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
              !editingEmployee?.name ||
              !editingEmployee?.employeeNumber ||
              !editingEmployee?.position ||
              !editingEmployee?.shift
            }
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
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#7E4300", color: "#FFFFFF" }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography>
            ¿Estás seguro que deseas eliminar al empleado{" "}
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
