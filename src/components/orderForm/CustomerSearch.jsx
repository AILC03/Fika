import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const CustomerSearch = ({ onSelectCustomer, searchOnly }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Aquí iría tu llamada real a la API
      const mockResults = [
        {
          id: 1,
          name: "Juan Pérez",
          phone: "555-1234",
          email: "juan@example.com",
        },
        {
          id: 2,
          name: "María García",
          phone: "555-5678",
          email: "maria@example.com",
        },
      ].filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error("Error buscando clientes:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Buscar Cliente
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Nombre o Teléfono"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isSearching}
          sx={{ minWidth: 120 }}
        >
          {isSearching ? <CircularProgress size={24} /> : "Buscar"}
        </Button>
      </Box>

      {isSearching ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : searchResults.length > 0 ? (
        <List sx={{ border: "1px solid #eee", borderRadius: 1 }}>
          {searchResults.map((customer) => (
            <ListItem
              key={customer.id}
              button
              onClick={() => onSelectCustomer(customer)}
              sx={{
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <ListItemText
                primary={customer.name}
                secondary={`${customer.phone} ${
                  customer.email ? `• ${customer.email}` : ""
                }`}
              />
            </ListItem>
          ))}
        </List>
      ) : searchTerm ? (
        <Typography color="textSecondary" sx={{ p: 2, textAlign: "center" }}>
          No se encontraron clientes
        </Typography>
      ) : null}
    </Box>
  );
};

export default CustomerSearch;
