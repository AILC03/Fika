import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CakeOrderForm = ({
  apiData,
  onOrderSubmit,
  isOpen,
  onClose,
  orderDate,
}) => {
  // Estados del formulario
  const [orderType, setOrderType] = useState("regular");
  const [customer, setCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [cakes, setCakes] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [activeTab, setActiveTab] = useState(0);
  const [note, setNote] = useState("");
  const [cakeText, setCakeText] = useState("");

  // Tipos de pedido
  const orderTypes = [
    { value: "numerico", label: "Numérico" },
    { value: "regular", label: "Regular" },
    { value: "pisos", label: "Pisos" },
  ];

  // Opciones de estado
  const statusOptions = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "Abonado", label: "Abonado" },
    { value: "Pagado", label: "Pagado" },
    { value: "No pagado", label: "No pagado" },
  ];

  // Inicializar pasteles según tipo de pedido
  useEffect(() => {
    if (isOpen && orderDate) {
      // Formatear la fecha a YYYY-MM-DD para el input type="date"
      const formattedDate = formatDateForInput(orderDate);
      setPickupDate(formattedDate);
    }
  }, [isOpen, orderDate]);

  const formatDateForInput = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const initializeCakes = () => {
    if (orderType === "numerico") {
      // Para pedido numérico: mínimo 1 pastel con campo para dígito
      setCakes([{ ...createEmptyCake(), digit: "" }]);
    } else if (orderType === "pisos") {
      // Para pedido de pisos: mínimo 1 pastel con 2 pisos
      setCakes([
        {
          ...createEmptyCake(),
          floors: [createEmptyFloor(), createEmptyFloor()],
        },
      ]);
    } else {
      // Para pedido regular: mínimo 1 pastel básico
      setCakes([createEmptyCake()]);
    }
    setActiveTab(0);
  };

  const createEmptyCake = () => ({
    type: "",
    line: "",
    flavor: "",
    size: "",
    category: "",
    ingredients: [], // Este array contendrá objetos con {id, name, available, selected}
    digit: "",
    floors: [],
  });

  const createEmptyFloor = () => ({
    size: "",
    flavor: "",
    ingredients: [], // Este array contendrá objetos con {id, name, available, selected}
  });
  // Buscar clientes (simulado)
  const handleSearchCustomer = async () => {
    const mockResults = [
      {
        id: 1,
        name: "Cliente Existente 1",
        phone: "555-1234",
        email: "cliente1@example.com",
      },
      {
        id: 2,
        name: "Cliente Existente 2",
        phone: "555-5678",
        email: "cliente2@example.com",
      },
    ];
    setCustomerResults(
      mockResults.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm)
      )
    );
  };

  // Seleccionar cliente existente
  const handleSelectCustomer = (selectedCustomer) => {
    setCustomer(selectedCustomer);
    setShowCustomerForm(false);
  };

  // Manejar cambios en nuevo cliente
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en pasteles
  const handleCakeChange = (cakeIndex, field, value) => {
    const updatedCakes = [...cakes];
    updatedCakes[cakeIndex][field] = value;

    // Resetear dependencias cuando cambia el tipo o línea
    if (field === "type" || field === "line") {
      updatedCakes[cakeIndex].flavor = "";
      updatedCakes[cakeIndex].size = "";
      updatedCakes[cakeIndex].ingredients = [];
      updatedCakes[cakeIndex].category = "";
    }

    // Actualizar ingredientes cuando cambia el sabor
    if (field === "flavor") {
      const selectedType = apiData.pasteles.find(
        (t) => t.id === parseInt(updatedCakes[cakeIndex].type)
      );
      if (selectedType) {
        const selectedFlavor = selectedType.flavors.find(
          (f) => f.id === parseInt(value)
        );
        updatedCakes[cakeIndex].ingredients =
          selectedFlavor?.ingredients.map((ing) => ({
            ...ing,
            selected: true, // Por defecto seleccionado
          })) || [];
      }
    }

    setCakes(updatedCakes);
  };

  // Manejar cambios en pisos
  const handleFloorChange = (cakeIndex, floorIndex, field, value) => {
    const updatedCakes = [...cakes];
    const updatedFloors = [...updatedCakes[cakeIndex].floors];

    updatedFloors[floorIndex][field] = value;

    // Si cambia el sabor, actualizar ingredientes
    if (field === "flavor") {
      const selectedType = apiData.pasteles.find(
        (t) => t.id === parseInt(updatedCakes[cakeIndex].type)
      );
      if (selectedType) {
        const selectedFlavor = selectedType.flavors.find(
          (f) => f.id === parseInt(value)
        );
        updatedFloors[floorIndex].ingredients =
          selectedFlavor?.ingredients.map((ing) => ({
            ...ing,
            selected: true, // Por defecto seleccionado
          })) || [];
      }
    }

    updatedCakes[cakeIndex].floors = updatedFloors;
    setCakes(updatedCakes);
  };

  const handleIngredientToggle = (
    cakeIndex,
    ingredientId,
    isFloor = false,
    floorIndex = null
  ) => {
    const updatedCakes = [...cakes];

    if (isFloor && floorIndex !== null) {
      // Para ingredientes de pisos
      const updatedFloors = [...updatedCakes[cakeIndex].floors];
      updatedFloors[floorIndex].ingredients = updatedFloors[
        floorIndex
      ].ingredients.map((ing) =>
        ing.id === ingredientId ? { ...ing, selected: !ing.selected } : ing
      );
      updatedCakes[cakeIndex].floors = updatedFloors;
    } else {
      // Para ingredientes de pasteles regulares/numéricos
      updatedCakes[cakeIndex].ingredients = updatedCakes[
        cakeIndex
      ].ingredients.map((ing) =>
        ing.id === ingredientId ? { ...ing, selected: !ing.selected } : ing
      );
    }

    setCakes(updatedCakes);
  };

  // Agregar más pasteles
  const addCake = () => {
    let newCake;
    if (orderType === "numerico") {
      newCake = { ...createEmptyCake(), digit: "" };
    } else if (orderType === "pisos") {
      newCake = {
        ...createEmptyCake(),
        floors: [createEmptyFloor(), createEmptyFloor()],
      };
    } else {
      newCake = createEmptyCake();
    }
    setCakes([...cakes, newCake]);
    setActiveTab(cakes.length);
  };

  // Eliminar pastel
  const removeCake = (index) => {
    if (cakes.length <= 1) return;

    const newCakes = cakes.filter((_, i) => i !== index);
    setCakes(newCakes);

    if (activeTab >= newCakes.length) {
      setActiveTab(newCakes.length - 1);
    }
  };

  // Agregar piso a un pastel
  const addFloor = (cakeIndex) => {
    if (cakes[cakeIndex].floors.length >= 4) {
      alert("Máximo 4 pisos por pastel");
      return;
    }
    const updatedCakes = [...cakes];
    updatedCakes[cakeIndex].floors.push(createEmptyFloor());
    setCakes(updatedCakes);
  };

  // Eliminar piso de un pastel
  const removeFloor = (cakeIndex, floorIndex) => {
    if (cakes[cakeIndex].floors.length <= 2) return;

    const updatedCakes = [...cakes];
    updatedCakes[cakeIndex].floors = updatedCakes[cakeIndex].floors.filter(
      (_, i) => i !== floorIndex
    );
    setCakes(updatedCakes);
  };

  // Obtener opciones disponibles para tipos de pastel
  const getCakeTypeOptions = () => {
    if (orderType === "pisos") {
      // Para pasteles de pisos, solo mostrar tipos 1 y 2
      return apiData.pasteles
        .filter((t) => t.id === 1 || t.id === 2)
        .map((t) => ({
          value: t.id,
          label: t.type.replace("_", " "),
        }));
    }
    // Para otros tipos, mostrar todos los pasteles
    return apiData.pasteles.map((t) => ({
      value: t.id,
      label: t.type.replace("_", " "),
    }));
  };

  // Obtener opciones de línea (Deluxe/Bizcocho)
  const getLineOptions = () => [
    { value: "deluxe", label: "Deluxe" },
    { value: "bizcocho", label: "Bizcocho" },
  ];

  // Obtener opciones de sabor para un pastel
  const getFlavorOptions = (cakeIndex) => {
    const cake = cakes[cakeIndex];
    if (!cake.type) return [];

    const selectedType = apiData.pasteles.find(
      (t) => t.id === parseInt(cake.type)
    );
    if (!selectedType) return [];

    return selectedType.flavors.map((f) => ({
      value: f.id,
      label: f.name,
      disabled: f.ingredients.some((i) => !i.available),
    }));
  };

  // Obtener opciones de tamaño
  const getSizeOptions = (cakeIndex) => {
    const cake = cakes[cakeIndex];
    if (!cake.type) return [];

    const typeData = apiData.pasteles.find((t) => t.id === parseInt(cake.type));
    if (!typeData) return [];

    return typeData.sizes.map((s) => ({ value: s.id, label: s.size }));
  };

  // Obtener opciones de tamaño para pisos con restricciones
  const getFloorSizeOptions = (cakeIndex, floorIndex) => {
    const cake = cakes[cakeIndex];
    if (!cake.type) return [];

    const typeData = apiData.pasteles.find((t) => t.id === parseInt(cake.type));
    if (!typeData) return [];

    // Ordenar tamaños de mayor a menor
    const sizes = typeData.sizes
      .map((s) => ({
        value: s.id,
        label: s.size,
        numericValue: parseFloat(s.size),
      }))
      .sort((a, b) => b.numericValue - a.numericValue);

    // Si no es el primer piso, filtrar tamaños menores que el piso anterior
    if (floorIndex > 0) {
      const prevFloorSize = parseFloat(cake.floors[floorIndex - 1].size);
      return sizes.filter((s) => s.numericValue < prevFloorSize);
    }

    return sizes;
  };

  // Obtener opciones de categoría
  const getCategoryOptions = (cakeIndex) => {
    const cake = cakes[cakeIndex];
    if (!cake.type) return [];

    const cakeType = apiData.pasteles.find((t) => t.id === parseInt(cake.type));
    if (!cakeType?.category?.length) return [];

    return cakeType.category.map((c) => ({ value: c.id, label: c.name }));
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    if (!customer && !showCustomerForm) {
      alert("Debe seleccionar o registrar un cliente");
      return false;
    }

    if (showCustomerForm && (!newCustomer.name || !newCustomer.phone)) {
      alert("Debe completar al menos nombre y teléfono del cliente");
      return false;
    }

    // Validar cada pastel según su tipo
    for (const cake of cakes) {
      if (!cake.type) {
        alert("Todos los pasteles deben tener un tipo definido");
        return false;
      }

      if (orderType === "numerico") {
        // Validación para pasteles numéricos
        if (!cake.digit || !/^\d$/.test(cake.digit)) {
          alert("Todos los dígitos deben ser un único número (0-9)");
          return false;
        }
        // if (!cake.line) {
        //   alert("Debe seleccionar una línea para el pastel numérico");
        //   return false;
        // }
        if (!cake.flavor || !cake.size) {
          alert("Todos los pasteles deben tener sabor y tamaño definidos");
          return false;
        }
      } else if (orderType === "pisos") {
        // Validación para pasteles de pisos
        for (let i = 0; i < cake.floors.length; i++) {
          const floor = cake.floors[i];
          if (!floor.size) {
            alert(
              `Todos los pisos del pastel ${
                cakes.indexOf(cake) + 1
              } deben tener tamaño definido`
            );
            return false;
          }
          if (!floor.flavor) {
            alert(
              `Todos los pisos del pastel ${
                cakes.indexOf(cake) + 1
              } deben tener sabor definido`
            );
            return false;
          }
          // Validar tamaños descendentes
          if (i > 0) {
            const prevSize = parseFloat(cake.floors[i - 1].size);
            const currentSize = parseFloat(floor.size);
            if (currentSize >= prevSize) {
              alert(
                `En el pastel ${cakes.indexOf(cake) + 1}, el piso ${
                  i + 1
                } debe ser más pequeño que el piso ${i}`
              );
              return false;
            }
          }
        }
      } else {
        // Validación para pasteles regulares
        if (!cake.type) {
          alert("Debe seleccionar una línea para el pastel regular");
          return false;
        }
        if (!cake.flavor || !cake.size) {
          alert("Todos los pasteles deben tener sabor y tamaño definidos");
          return false;
        }
      }
    }

    return true;
  };

  // Enviar pedido
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const orderData = {
      orderType,
      cakes,
      customer: customer || newCustomer,
      isNewCustomer: showCustomerForm,
      pickupDate,
      pickupTime,
      status,
      note,
      cakeText,
    };

    console.log("Datos del pedido:", orderData);
    if (onOrderSubmit) onOrderSubmit(orderData);

    // Resetear formulario
    setCustomer(null);
    setNewCustomer({ name: "", phone: "", email: "" });
    setShowCustomerForm(false);
    setNote("");
    setCakeText("");
    setStatus("Pendiente");
    initializeCakes();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#FFF2C9", color: "#7E4300" }}>
      Ordenar Pastel
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#7E4300",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#FFF2C9" }}>
        {/* Tipo de pedido */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300", mb: 1 }}>
            Tipo de Pedido
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {orderTypes.map((type) => (
              <Button
                key={type.value}
                variant={orderType === type.value ? "contained" : "outlined"}
                onClick={() => setOrderType(type.value)}
                sx={{
                  backgroundColor:
                    orderType === type.value ? "#FFD538" : "inherit",
                  color: "#7E4300",
                  "&:hover": {
                    backgroundColor:
                      orderType === type.value
                        ? "#FFD538"
                        : "rgba(255, 213, 56, 0.1)",
                  },
                }}
              >
                {type.label}
              </Button>
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "#7E4300", mt: 1 }}>
            {orderType === "numerico" &&
              "Anade un pastel por cada numero"}
            {orderType === "regular" &&
              "Cada pastel se maneja por separado"}
            {orderType === "pisos" &&
              "Cada pastel debe tener al menos 2 pisos"}
          </Typography>
        </Box>

        {/* Información del cliente */}
        <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: "#FFD538" }}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300", mb: 2 }}>
            Información del Cliente
          </Typography>

          {!customer && !showCustomerForm ? (
            <>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="Buscar cliente por nombre o teléfono"
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: "#FFF2C9" }}
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleSearchCustomer}
                  sx={{ bgcolor: "#7E4300", "&:hover": { bgcolor: "#5E3200" } }}
                >
                  Buscar
                </Button>
              </Box>

              {customerResults.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: "#7E4300" }}>
                    Clientes encontrados:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {customerResults.map((cust) => (
                      <Card
                        key={cust.id}
                        onClick={() => handleSelectCustomer(cust)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(255, 213, 56, 0.5)" },
                          bgcolor: "#FFF2C9",
                        }}
                      >
                        <CardContent sx={{ p: 1 }}>
                          <Typography variant="body2">{cust.name}</Typography>
                          <Typography variant="caption">
                            {cust.phone}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              <Button
                variant="outlined"
                onClick={() => setShowCustomerForm(true)}
                sx={{ color: "#7E4300", borderColor: "#7E4300" }}
              >
                Registrar nuevo cliente
              </Button>
            </>
          ) : showCustomerForm ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#7E4300" }}>
                Nuevo Cliente
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Nombre"
                  name="name"
                  sx={{ bgcolor: "#FFF2C9" }}
                  value={newCustomer.name}
                  onChange={handleNewCustomerChange}
                  required
                  size="small"
                />
                <TextField
                  label="Teléfono"
                  name="phone"
                  sx={{ bgcolor: "#FFF2C9" }}
                  value={newCustomer.phone}
                  onChange={handleNewCustomerChange}
                  required
                  size="small"
                />
                <TextField
                  label="Email"
                  name="email"
                  sx={{ bgcolor: "#FFF2C9" }}
                  value={newCustomer.email}
                  onChange={handleNewCustomerChange}
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowCustomerForm(false)}
                  sx={{ color: "#7E4300", borderColor: "#7E4300" }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1">{customer.name}</Typography>
                <Typography variant="caption">{customer.phone}</Typography>
              </Box>
              <Button
                variant="text"
                onClick={() => setCustomer(null)}
                sx={{ color: "#7E4300" }}
              >
                Cambiar cliente
              </Button>
            </Box>
          )}
        </Paper>

        {/* Estado del pedido */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado del Pedido</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Estado del Pedido"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Configuración de pasteles */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "#7E4300", mb: 1 }}>
            {orderType === "numerico"
              ? "Configuración de Dígitos"
              : orderType === "pisos"
              ? "Configuración de Pasteles y Pisos"
              : "Configuración de Pasteles"}
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {cakes.map((_, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {orderType === "numerico"
                        ? `Dígito ${index + 1}`
                        : `Pastel ${index + 1}`}
                      {cakes.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCake(index);
                          }}
                          sx={{ ml: 1, color: "error.main" }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {cakes.map((cake, cakeIndex) => (
            <Box
              key={cakeIndex}
              role="tabpanel"
              hidden={activeTab !== cakeIndex}
            >
              {activeTab === cakeIndex && (
                <Box sx={{ p: 2 }}>
                  {/* Controles específicos para pastel numérico */}
                  {orderType === "numerico" && (
                    <TextField
                      label="Dígito (0-9)"
                      value={cake.digit}
                      onChange={(e) =>
                        handleCakeChange(cakeIndex, "digit", e.target.value)
                      }
                      inputProps={{ maxLength: 1 }}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}

                  {/* Controles comunes */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {/* Tipo de pastel */}
                    <FormControl size="small" fullWidth>
                      <InputLabel>Tipo de Pastel</InputLabel>
                      <Select
                        value={cake.type}
                        onChange={(e) =>
                          handleCakeChange(cakeIndex, "type", e.target.value)
                        }
                        label="Tipo de Pastel"
                      >
                        {getCakeTypeOptions().map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Línea (Deluxe/Bizcocho) - solo para pisos */}
                    {/* {orderType === "pisos" && (
                      <FormControl size="small" fullWidth>
                        <InputLabel>Línea</InputLabel>
                        <Select
                          value={cake.line}
                          onChange={(e) =>
                            handleCakeChange(cakeIndex, "line", e.target.value)
                          }
                          label="Línea"
                        >
                          {getLineOptions().map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )} */}
                  </Box>

                  {/* Categoría (si aplica) */}
                  {cake.type && getCategoryOptions(cakeIndex).length > 0 && (
                    <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        value={cake.category}
                        onChange={(e) =>
                          handleCakeChange(
                            cakeIndex,
                            "category",
                            e.target.value
                          )
                        }
                        label="Categoría"
                      >
                        {getCategoryOptions(cakeIndex).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* Configuración para pasteles de pisos */}
                  {orderType === "pisos" && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#7E4300", mb: 2 }}
                      >
                        Configuración de Pisos
                      </Typography>

                      {cake.floors.map((floor, floorIndex) => (
                        <Paper
                          key={floorIndex}
                          elevation={2}
                          sx={{ p: 2, mb: 2, bgcolor: "#FFE9A0" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              Piso {floorIndex + 1}
                            </Typography>
                            {cake.floors.length > 2 && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeFloor(cakeIndex, floorIndex)
                                }
                                sx={{ color: "error.main" }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 2,
                            }}
                          >
                            {/* Sabor del piso */}
                            <FormControl size="small" fullWidth>
                              <InputLabel>Sabor</InputLabel>
                              <Select
                                value={floor.flavor}
                                onChange={(e) =>
                                  handleFloorChange(
                                    cakeIndex,
                                    floorIndex,
                                    "flavor",
                                    e.target.value
                                  )
                                }
                                label="Sabor"
                                disabled={!cake.type}
                              >
                                {getFlavorOptions(cakeIndex).map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                  >
                                    {option.disabled
                                      ? `${option.label} (No disponible)`
                                      : option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Tamaño del piso */}
                            <FormControl size="small" fullWidth>
                              <InputLabel>Tamaño</InputLabel>
                              <Select
                                value={floor.size}
                                onChange={(e) =>
                                  handleFloorChange(
                                    cakeIndex,
                                    floorIndex,
                                    "size",
                                    e.target.value
                                  )
                                }
                                label="Tamaño"
                                disabled={!cake.type}
                              >
                                {getFloorSizeOptions(cakeIndex, floorIndex).map(
                                  (option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Ingredientes del piso */}
                          {floor.flavor && floor.ingredients.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "#7E4300", mb: 1 }}
                              >
                                Ingredientes:
                              </Typography>
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 1,
                                }}
                              >
                                {floor.ingredients.map((ing, i) => (
                                  <FormControlLabel
                                    key={i}
                                    control={
                                      <Checkbox
                                        checked={ing.selected}
                                        onChange={() =>
                                          handleIngredientToggle(
                                            cakeIndex,
                                            ing.id,
                                            true,
                                            floorIndex
                                          )
                                        }
                                        sx={{
                                          color: "primary.main",
                                          "&.Mui-checked": {
                                            color: "primary.main",
                                          },
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="body2"
                                        sx={
                                          !ing.available
                                            ? {
                                                textDecoration: "line-through",
                                                color: "text.disabled",
                                              }
                                            : {}
                                        }
                                      >
                                        {ing.name}
                                      </Typography>
                                    }
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      ))}

                      {/* Botón para agregar más pisos */}
                      {cake.floors.length < 4 && (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => addFloor(cakeIndex)}
                          sx={{ color: "#7E4300", borderColor: "#7E4300" }}
                        >
                          Agregar Piso
                        </Button>
                      )}
                    </Box>
                  )}

                  {/* Configuración para pasteles regulares o numéricos */}
                  {(orderType === "regular" || orderType === "numerico") && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {/* Sabor */}
                      <FormControl size="small" fullWidth>
                        <InputLabel>Sabor</InputLabel>
                        <Select
                          value={cake.flavor}
                          onChange={(e) =>
                            handleCakeChange(
                              cakeIndex,
                              "flavor",
                              e.target.value
                            )
                          }
                          label="Sabor"
                          disabled={!cake.type}
                        >
                          {getFlavorOptions(cakeIndex).map((option) => (
                            <MenuItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disabled}
                            >
                              {option.disabled
                                ? `${option.label} (No disponible)`
                                : option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Tamaño */}
                      <FormControl size="small" fullWidth>
                        <InputLabel>Tamaño</InputLabel>
                        <Select
                          value={cake.size}
                          onChange={(e) =>
                            handleCakeChange(cakeIndex, "size", e.target.value)
                          }
                          label="Tamaño"
                          disabled={!cake.type}
                        >
                          {getSizeOptions(cakeIndex).map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {/* Ingredientes (para pasteles regulares o numéricos) */}
                  {(orderType === "regular" || orderType === "numerico") &&
                    cake.flavor &&
                    cake.ingredients.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#7E4300", mb: 1 }}
                        >
                          Ingredientes:
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                          }}
                        >
                          {cake.ingredients
                            .filter((ing) => ing.available) // Solo mostrar ingredientes disponibles
                            .map((ing, i) => (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox
                                    checked={ing.selected}
                                    onChange={() =>
                                      handleIngredientToggle(cakeIndex, ing.id)
                                    }
                                    sx={{
                                      color: "primary.main",
                                      "&.Mui-checked": {
                                        color: "primary.main",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    variant="body2"
                                    sx={
                                      !ing.available
                                        ? {
                                            textDecoration: "line-through",
                                            color: "text.disabled",
                                          }
                                        : {}
                                    }
                                  >
                                    {ing.name}
                                  </Typography>
                                }
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                </Box>
              )}
            </Box>
          ))}

          {/* Botón para agregar más pasteles */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addCake}
            sx={{ mt: 2, color: "#7E4300", borderColor: "#7E4300" }}
          >
            Agregar Pastel
          </Button>
        </Box>

        {/* Texto para el pastel */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Escritura para el pastel (ej. 'Feliz Cumpleaños')"
            variant="outlined"
            fullWidth
            value={cakeText}
            onChange={(e) => setCakeText(e.target.value)}
            size="small"
          />
        </Box>

        {/* Notas adicionales */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Notas adicionales (ej. Escritura en el lateral del pastel en color blanco)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            size="small"
          />
        </Box>

        {/* Fecha y hora de recolección */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            label="Fecha de recolección"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="Hora de recolección"
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "#FFF2C9" }}>
        <Button onClick={onClose} sx={{ color: "#7E4300" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: "#7E4300", "&:hover": { bgcolor: "#5E3200" } }}
        >
          Guardar Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CakeOrderForm;
