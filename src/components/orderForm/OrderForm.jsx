import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Paper,
  Collapse,
} from "@mui/material";
import { X, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

// Componentes de tipos de pastel
import NumericCakeForm from "./cakes/NumericCake";
import RegularCakeForm from "./cakes/RegularCake";
import TieredCakeForm from "./cakes/TieredCake";
import CupcakesForm from "./cakes/Cupcakes";
import CustomerSearch from "./CustomerSearch";
import OrderGeneralFields from "./OrderGeneralFields";

const steps = ["Cliente", "Pasteles", "Detalles", "Resumen"];

const cakeTypes = [
  {
    id: "numeric",
    name: "Pastel Numérico",
    description: "Para números y cifras",
  },
  { id: "regular", name: "Pastel Regular", description: "Pastel tradicional" },
  {
    id: "tiered",
    name: "Pastel de Pisos",
    description: "Pastel con múltiples niveles",
  },
  { id: "cupcakes", name: "Cupcakes", description: "Conjunto de cupcakes" },
];

const OrderForm = ({
  apiData,
  isOpen,
  onClose,
  onOrderSubmit,
  orderDate,
  userId = 1,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [expandedForm, setExpandedForm] = useState(null);
  const [orderGeneral, setOrderGeneral] = useState({
    writing: "",
    notes: "",
    status: "pending",
    pickupDateTime: new Date(new Date().setHours(14, 0, 0, 0)),
  });
  const [filteredCakeData, setFilteredCakeData] = useState([]);

  // Filtrar datos de pasteles disponibles
  useEffect(() => {
    if (apiData && apiData.pasteles) {
      const filtered = apiData.pasteles
        .filter(
          (cake) => new Date(orderDate) >= new Date(cake.date) && cake.avalible
        )
        .map((cake) => ({
          ...cake,
          flavors: cake.flavors
            .filter(
              (flavor) =>
                new Date(orderDate) >= new Date(flavor.date) && flavor.avalible
            )
            .map((flavor) => ({
              ...flavor,
              ingredients: flavor.ingredients.filter(
                (ing) => new Date(orderDate) >= new Date(ing.date)
              ),
            })),
          sizes: cake.sizes.filter(
            (size) =>
              new Date(orderDate) >= new Date(size.date) && size.avalible
          ),
        }));
      setFilteredCakeData(filtered);
    }
  }, [apiData, orderDate]);

  // Manejar expansión/colapso de formularios
  const handleExpandForm = (type) => {
    setExpandedForm(expandedForm === type ? null : type);
  };

  // Normalizar los datos del pastel antes de agregarlos
  const normalizeCakeData = (cakeDetails) => {
    const normalized = { type: cakeDetails.type };

    // Campos comunes a todos los tipos
    if (cakeDetails.line) {
      normalized.line = {
        id: cakeDetails.line.id,
        name: cakeDetails.line.name,
      };
    }

    // Campos específicos por tipo
    switch (cakeDetails.type) {
      case "regular":
        if (cakeDetails.flavor) {
          normalized.flavor = {
            id: cakeDetails.flavor.id,
            name: cakeDetails.flavor.name,
            ingredients:
              cakeDetails.flavor.ingredients?.map((ing) => ({
                id: ing.id,
                name: ing.name,
              })) || [],
          };
        }
        if (cakeDetails.size) {
          normalized.size = {
            id: cakeDetails.size.id,
            name: cakeDetails.size.name,
          };
        }
        break;

      case "numeric":
        if (cakeDetails.digits) {
          normalized.digits = cakeDetails.digits.map((digit) => ({
            digit: digit.digit,
            ...(digit.flavor && {
              flavor: {
                id: digit.flavor.id,
                name: digit.flavor.name,
                ingredients:
                  digit.flavor.ingredients?.map((ing) => ({
                    id: ing.id,
                    name: ing.name,
                  })) || [],
              },
            }),
            ...(digit.size && {
              size: {
                id: digit.size.id,
                name: digit.size.name,
              },
            }),
          }));
        }
        break;

      case "tiered":
        if (cakeDetails.tiers) {
          normalized.tiers = cakeDetails.tiers.map((tier) => ({
            ...(tier.flavor && {
              flavor: {
                id: tier.flavor.id,
                name: tier.flavor.name,
                ingredients:
                  tier.flavor.ingredients?.map((ing) => ({
                    id: ing.id,
                    name: ing.name,
                  })) || [],
              },
            }),
            ...(tier.size && {
              size: {
                id: tier.size.id,
                name: tier.size.name,
              },
            }),
          }));
        }
        break;

      case "cupcakes":
        if (cakeDetails.quantity) {
          normalized.quantity = cakeDetails.quantity;
        }
        if (cakeDetails.flavor) {
          normalized.flavor = {
            id: cakeDetails.flavor.id,
            name: cakeDetails.flavor.name,
            ingredients:
              cakeDetails.flavor.ingredients?.map((ing) => ({
                id: ing.id,
                name: ing.name,
              })) || [],
          };
        }
        if (cakeDetails.size) {
          normalized.size = {
            id: cakeDetails.size.id,
            name: cakeDetails.size.name,
          };
        }
        break;
    }

    return normalized;
  };

  // Agregar nuevo pastel
  const handleAddCake = (cakeDetails) => {
    const normalizedData = normalizeCakeData(cakeDetails);
    setOrderItems([...orderItems, normalizedData]);
    setExpandedForm(null); // Colapsar el formulario después de agregar
  };

  // Editar pastel existente
  const handleEditCake = (index, updatedDetails) => {
    const normalizedData = normalizeCakeData(updatedDetails);
    const updatedItems = [...orderItems];
    updatedItems[index] = normalizedData;
    setOrderItems(updatedItems);
    setExpandedForm(null);
  };

  // Eliminar pastel
  const handleRemoveCake = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Navegación
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Manejar cambios en campos generales
  const handleGeneralChange = (field, value) => {
    setOrderGeneral((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Enviar pedido
  const handleSubmitOrder = () => {
    const orderData = {
      userId,
      customerId: customer?.id,
      items: orderItems,
      ...orderGeneral,
      pickupDateTime: orderGeneral.pickupDateTime.toISOString(),
    };
    onOrderSubmit(orderData);
    handleClose();
  };

  // Cerrar formulario
  const handleClose = () => {
    setActiveStep(0);
    setCustomer(null);
    setOrderItems([]);
    setExpandedForm(null);
    setOrderGeneral({
      writing: "",
      notes: "",
      status: "pending",
      pickupDateTime: new Date(new Date().setHours(14, 0, 0, 0)),
    });
    onClose();
  };

  // Obtener nombre del tipo de pastel
  const getCakeTypeName = (type) => {
    const cakeType = cakeTypes.find((ct) => ct.id === type);
    return cakeType ? cakeType.name : type;
  };

  // Obtener detalles resumidos del pastel
  const getCakeDetails = (item) => {
    switch (item.type) {
      case "numeric":
        return (
          item.digits
            ?.map((digit, index) => {
              const details = [];
              if (item.line) details.push(`Línea: ${item.line.name}`);
              if (digit.flavor) details.push(`Sabor: ${digit.flavor.name}`);
              if (digit.size) details.push(`Tamaño: ${digit.size.name}`);
              return `Dígito ${digit.digit}: ${details.join(", ")}`;
            })
            .join("\n") || "Sin detalles"
        );

      case "regular":
        const regularDetails = [];
        if (item.line) regularDetails.push(`Línea: ${item.line.name}`);
        if (item.flavor) regularDetails.push(`Sabor: ${item.flavor.name}`);
        if (item.size) regularDetails.push(`Tamaño: ${item.size.name}`);
        return regularDetails.join(", ") || "Sin detalles";

      case "tiered":
        return (
          item.tiers
            ?.map((tier, index) => {
              const tierDetails = [];
              if (item.line) tierDetails.push(`Línea: ${item.line.name}`);
              if (tier.flavor) tierDetails.push(`Sabor: ${tier.flavor.name}`);
              if (tier.size) tierDetails.push(`Tamaño: ${tier.size.name}`);
              return `Piso ${index + 1}: ${tierDetails.join(", ")}`;
            })
            .join("\n") || "Sin detalles"
        );

      case "cupcakes":
        const cupcakeDetails = [];
        if (item.quantity) cupcakeDetails.push(`Cantidad: ${item.quantity}`);
        if (item.flavor) cupcakeDetails.push(`Sabor: ${item.flavor.name}`);
        if (item.size) cupcakeDetails.push(`Tamaño: ${item.size.name}`);
        return cupcakeDetails.join(", ") || "Sin detalles";

      default:
        return "Detalles no disponibles";
    }
  };

  // Renderizar contenido de cada paso
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Paso 1: Búsqueda de cliente
        return <CustomerSearch onSelectCustomer={setCustomer} searchOnly />;

      case 1: // Paso 2: Selección y formularios de pasteles
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {orderItems.length > 0
                ? "Pasteles en este pedido"
                : "Selecciona los pasteles para tu pedido"}
            </Typography>

            {orderItems.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold">
                      {getCakeTypeName(item.type)}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {getCakeDetails(item)}
                    </Typography>
                  </Box>
                  <Box>
                    {expandedForm === `${item.type}-edit-${index}` ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setExpandedForm(null)}
                        sx={{ mr: 1 }}
                      >
                        Cancelar
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setExpandedForm(`${item.type}-edit-${index}`);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveCake(index)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Formulario de edición */}
                <Collapse in={expandedForm === `${item.type}-edit-${index}`}>
                  <Box sx={{ mt: 2 }}>
                    {item.type === "numeric" && (
                      <NumericCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}
                    {item.type === "regular" && (
                      <RegularCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}
                    {item.type === "tiered" && (
                      <TieredCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}
                    {item.type === "cupcakes" && (
                      <CupcakesForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}
                  </Box>
                </Collapse>
              </Paper>
            ))}

            <Typography variant="subtitle1" gutterBottom>
              Agregar pasteles
            </Typography>

            <Grid container spacing={2}>
              {cakeTypes.map((type) => (
                <Grid item xs={12} key={type.id}>
                  <Paper elevation={2} sx={{ overflow: "hidden" }}>
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        backgroundColor:
                          expandedForm === type.id
                            ? "action.hover"
                            : "background.paper",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                      onClick={() => handleExpandForm(type.id)}
                    >
                      <Box>
                        <Typography fontWeight="bold">{type.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                      {expandedForm === type.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </Box>

                    <Collapse in={expandedForm === type.id}>
                      <Box sx={{ p: 2 }}>
                        {type.id === "numeric" && (
                          <NumericCakeForm
                            cakeData={filteredCakeData}
                            onAddCake={handleAddCake}
                          />
                        )}
                        {type.id === "regular" && (
                          <RegularCakeForm
                            cakeData={filteredCakeData}
                            onAddCake={handleAddCake}
                          />
                        )}
                        {type.id === "tiered" && (
                          <TieredCakeForm
                            cakeData={filteredCakeData}
                            onAddCake={handleAddCake}
                          />
                        )}
                        {type.id === "cupcakes" && (
                          <CupcakesForm
                            cakeData={filteredCakeData}
                            onAddCake={handleAddCake}
                          />
                        )}
                      </Box>
                    </Collapse>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2: // Paso 3: Detalles generales
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Detalles Generales
            </Typography>
            <OrderGeneralFields
              writing={orderGeneral.writing}
              notes={orderGeneral.notes}
              pickupDateTime={orderGeneral.pickupDateTime}
              status={orderGeneral.status}
              onWritingChange={(value) => handleGeneralChange("writing", value)}
              onNotesChange={(value) => handleGeneralChange("notes", value)}
              onDateTimeChange={(value) =>
                handleGeneralChange("pickupDateTime", value)
              }
              onStatusChange={(value) => handleGeneralChange("status", value)}
            />
          </Box>
        );

      case 3: // Paso 4: Resumen
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Cliente</Typography>
              <Typography>
                {customer?.name} - {customer?.phone}
                {customer?.email && ` (${customer.email})`}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Pasteles ({orderItems.length})
              </Typography>
              {orderItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 1,
                  }}
                >
                  <Typography fontWeight="bold">
                    {index + 1}. {getCakeTypeName(item.type)}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {getCakeDetails(item)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Detalles Adicionales</Typography>
              <Typography>
                <strong>Texto en el pastel:</strong>{" "}
                {orderGeneral.writing || "Ninguno"}
              </Typography>
              <Typography>
                <strong>Notas:</strong> {orderGeneral.notes || "Ninguna"}
              </Typography>
              <Typography>
                <strong>Fecha de recolección:</strong>{" "}
                {orderGeneral.pickupDateTime.toLocaleString()}
              </Typography>
              <Typography>
                <strong>Estado:</strong>{" "}
                {orderGeneral.status === "pending" ? "Pendiente" : "Confirmado"}
              </Typography>
            </Box>
          </Box>
        );

      default:
        return <Typography>Paso desconocido</Typography>;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="body"
    >
      <DialogContent sx={{ p: 0 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <X />
        </IconButton>

        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ChevronLeft size={16} />}
            >
              Atrás
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmitOrder}
                disabled={orderItems.length === 0 || !customer}
              >
                Confirmar Pedido
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !customer) ||
                  (activeStep === 1 && orderItems.length === 0)
                }
              >
                Siguiente
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
