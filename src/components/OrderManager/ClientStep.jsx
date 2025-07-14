// ClientStep.jsx
import { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ClientStep = ({
  clients,
  selectedClient,
  onSelectClient,
  onCreateClient,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [newClient, setNewClient] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    observation: "",
  });

  const handleCreateClient = () => {
    onCreateClient(newClient);
    setOpenModal(false);
    setNewClient({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      observation: "",
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Cliente
      </Typography>

      <Autocomplete
        options={clients}
        getOptionLabel={(option) => `${option.fullName} - ${option.phone}`}
        value={clients.find((c) => c.id === selectedClient) || null}
        onChange={(_, value) => onSelectClient(value?.id || null)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar cliente"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Box mt={2}>
        <Button variant="outlined" onClick={() => setOpenModal(true)}>
          Crear nuevo cliente
        </Button>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nombre completo"
              value={newClient.fullName}
              onChange={(e) =>
                setNewClient({ ...newClient, fullName: e.target.value })
              }
              required
            />
            <TextField
              label="Teléfono"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
            />
            <TextField
              label="Empresa"
              value={newClient.company}
              onChange={(e) =>
                setNewClient({ ...newClient, company: e.target.value })
              }
            />
            <TextField
              label="Observaciones"
              multiline
              rows={3}
              value={newClient.observation}
              onChange={(e) =>
                setNewClient({ ...newClient, observation: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateClient}
            disabled={!newClient.fullName || !newClient.phone}
            variant="contained"
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientStep;
