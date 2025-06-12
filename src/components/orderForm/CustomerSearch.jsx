import { useState } from "react";
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

const CustomerSearch = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Aquí iría la llamada real a la API
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
    <div className="p-4">
      <Typography variant="h6" className="mb-4 text-[#7E4300]">
        Buscar Cliente
      </Typography>

      <div className="flex gap-2 mb-2">
        <TextField
          fullWidth
          label="Nombre o Teléfono"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="[&_.MuiOutlinedInput-root]:border-[#7E4300] [&_.MuiOutlinedInput-root:hover]:border-[#7E4300] [&_.MuiInputLabel-root]:text-[#7E4300]"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isSearching}
          className="min-w-[120px] bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 disabled:bg-[#FFF2C9] disabled:text-[#7E4300]/50"
        >
          {isSearching ? (
            <CircularProgress size={24} className="text-[#7E4300]" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>

      {isSearching ? (
        <div className="flex justify-center p-3">
          <CircularProgress className="text-[#7E4300]" />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="border border-[#7E4300] rounded bg-[#FFF2C9]">
          {searchResults.map((customer) => (
            <ListItem
              key={customer.id}
              button
              onClick={() => onSelectCustomer(customer)}
              className="hover:bg-[#FFD538] hover:text-[#7E4300]"
            >
              <ListItemText
                primary={
                  <span className="text-[#7E4300]">{customer.name}</span>
                }
                secondary={
                  <span className="text-[#7E4300]">
                    {`${customer.phone} ${
                      customer.email ? `• ${customer.email}` : ""
                    }`}
                  </span>
                }
              />
            </ListItem>
          ))}
        </div>
      ) : searchTerm ? (
        <Typography className="p-2 text-center text-[#7E4300]">
          No se encontraron clientes
        </Typography>
      ) : null}
    </div>
  );
};

export default CustomerSearch;
