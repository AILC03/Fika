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
  Chip,
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
    <Box sx={{ backgroundColor: "#FFF2C9", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "#7E4300" }}>
        Seleccionar Cliente
      </Typography>

      <Autocomplete
        options={clients}
        getOptionLabel={(option) =>
          `${option.fullName} - ${option.phone}${
            option.company ? ` (${option.company})` : ""
          }`
        }
        value={clients.find((c) => c.id === selectedClient) || null}
        onChange={(_, value) => onSelectClient(value?.id || null)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar cliente"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                color: "#7E4300",
                "&.Mui-focused": { color: "#FFD538" },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7E4300" },
                "&:hover fieldset": { borderColor: "#FFD538" },
                "&.Mui-focused fieldset": { borderColor: "#FFD538" },
              },
              mb: 2,
            }}
          />
        )}
      />

      {selectedClient && (
        <Box sx={{ backgroundColor: "white", p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300" }}>
            Cliente seleccionado:
          </Typography>
          {(() => {
            const client = clients.find((c) => c.id === selectedClient);
            return (
              <>
                <Typography>{client.fullName}</Typography>
                <Typography>Teléfono: {client.phone}</Typography>
                {client.email && <Typography>Email: {client.email}</Typography>}
                {client.company && (
                  <Typography>Empresa: {client.company}</Typography>
                )}
                {client.observation && (
                  <Typography>Observaciones: {client.observation}</Typography>
                )}
              </>
            );
          })()}
        </Box>
      )}

      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        sx={{
          backgroundColor: "#FFD538",
          color: "#7E4300",
          "&:hover": { backgroundColor: "#e6c032" },
        }}
      >
        Crear nuevo cliente
      </Button>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle sx={{ backgroundColor: "#FFF2C9", color: "#7E4300" }}>
          Nuevo Cliente
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#FFF2C9", pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nombre completo"
              value={newClient.fullName}
              onChange={(e) =>
                setNewClient({ ...newClient, fullName: e.target.value })
              }
              required
              sx={{
                "& .MuiInputLabel-root": { color: "#7E4300" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7E4300" },
                  "&:hover fieldset": { borderColor: "#FFD538" },
                },
              }}
            />
            <TextField
              label="Teléfono"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              required
              sx={{
                "& .MuiInputLabel-root": { color: "#7E4300" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7E4300" },
                  "&:hover fieldset": { borderColor: "#FFD538" },
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              sx={{
                "& .MuiInputLabel-root": { color: "#7E4300" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7E4300" },
                  "&:hover fieldset": { borderColor: "#FFD538" },
                },
              }}
            />
            <TextField
              label="Empresa"
              value={newClient.company}
              onChange={(e) =>
                setNewClient({ ...newClient, company: e.target.value })
              }
              sx={{
                "& .MuiInputLabel-root": { color: "#7E4300" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7E4300" },
                  "&:hover fieldset": { borderColor: "#FFD538" },
                },
              }}
            />
            <TextField
              label="Observaciones"
              multiline
              rows={3}
              value={newClient.observation}
              onChange={(e) =>
                setNewClient({ ...newClient, observation: e.target.value })
              }
              sx={{
                "& .MuiInputLabel-root": { color: "#7E4300" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#7E4300" },
                  "&:hover fieldset": { borderColor: "#FFD538" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#FFF2C9" }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#7E4300" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateClient}
            disabled={!newClient.fullName || !newClient.phone}
            variant="contained"
            sx={{
              backgroundColor: "#FFD538",
              color: "#7E4300",
              "&:hover": { backgroundColor: "#e6c032" },
              "&:disabled": { backgroundColor: "#cccccc" },
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientStep;
