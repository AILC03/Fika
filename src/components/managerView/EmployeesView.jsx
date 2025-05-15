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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          size="small"
          className="min-w-[180px]"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Turno</TableCell>
              <TableCell>Registro</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
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
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(employee)}
                    color="error"
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
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Empleado</DialogTitle>
        <DialogContent className="space-y-4 min-w-[400px]">
          <TextField
            label="Nombre completo"
            name="name"
            value={editingEmployee?.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Número de empleado"
            name="employeeNumber"
            value={editingEmployee?.employeeNumber || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Puesto"
            name="position"
            value={editingEmployee?.position || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Select
            label="Turno"
            name="shift"
            value={editingEmployee?.shift || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="matutino">Matutino</MenuItem>
            <MenuItem value="vespertino">Vespertino</MenuItem>
            <MenuItem value="nocturno">Nocturno</MenuItem>
            <MenuItem value="completo">Tiempo completo</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSaveEmployee}
            color="primary"
            variant="contained"
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
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar al empleado{" "}
            {employeeToDelete?.name}?
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

export default EmployeesView;
