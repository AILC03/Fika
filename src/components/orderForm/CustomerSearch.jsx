import { useState, useEffect } from "react";
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
  const API = import.meta.env.VITE_URI;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Cargar todos los clientes al montar el componente
  useEffect(() => {
    const fetchAllClients = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`${API}/clients/client/getClients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error fetching clients");
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchAllClients();
  }, [API]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Si el término de búsqueda está vacío, recargar todos los clientes
      const response = await fetch(`${API}/clients/client/getClients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setSearchResults(data);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API}/clients/client/getClients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching clients");
      }

      const data = await response.json();

      // Filtrar los resultados basados en el término de búsqueda
      const filteredResults = data.filter(
        (client) =>
          client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          (client.email &&
            client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (client.company &&
            client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setSearchResults(filteredResults);
      setSelectedCustomerId(null); // Resetear selección al realizar nueva búsqueda
    } catch (error) {
      console.error("Error buscando clientes:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    onSelectCustomer({
      name: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      company: customer.company,
      observation: customer.observation,
      createdAt: customer.createdAt,
    });
  };

  return (
    <div className="p-4">
      <Typography variant="h6" className="mb-4 text-[#7E4300]">
        Buscar Cliente
      </Typography>

      <div className="flex gap-2 mb-2">
        <TextField
          fullWidth
          label="Nombre, Teléfono, Email o Empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="[&_.MuiOutlinedInput-root]:border-[#7E4300] [&_.MuiOutlinedInput-root:hover]:border-[#7E4300] [&_.MuiInputLabel-root]:text-[#7E4300]"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching}
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
        <div className="border border-[#7E4300] rounded bg-[#FFF2C9] max-h-[400px] overflow-y-auto">
          {searchResults.map((customer) => (
            <ListItem
              key={customer.id}
              button
              onClick={() => handleSelectCustomer(customer)}
              className={`hover:bg-[#FFD538] ${
                selectedCustomerId === customer.id
                  ? "bg-[#FFD538] text-[#7E4300]"
                  : "text-[#7E4300]"
              }`}
            >
              <ListItemText
                primary={
                  <span className="font-medium">{customer.fullName}</span>
                }
                secondary={
                  <span>
                    {`${customer.phone} • ${customer.email}`}
                    {customer.company && ` • Empresa: ${customer.company}`}
                  </span>
                }
              />
            </ListItem>
          ))}
        </div>
      ) : (
        <Typography className="p-2 text-center text-[#7E4300]">
          No se encontraron clientes
        </Typography>
      )}
    </div>
  );
};

export default CustomerSearch;
