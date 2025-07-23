import { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ClientStep from "./ClientStep";
import CakesStep from "./CakesStep";
import SummaryStep from "./SummaryStep";
import OrderSummary from "./OrderSummary";

const API = import.meta.env.VITE_URI;

const OrderForm = ({
  isOpen,
  onClose,
  onOrderSubmit,
  orderDate,
  orderToEdit,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [lines, setLines] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para transformar items al formato de creación (POST)
  const transformItemForCreation = (item) => {
    const baseItem = {
      itemType: item.itemType,
      lineId: item.lineId,
      description: item.description || "",
    };

    switch (item.itemType) {
      case "REGULAR":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          sizeId: item.sizeId,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "NUMERIC":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          sizeId: item.sizeId,
          numberShape: item.numberShape,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "CUPCAKE":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          cupcakeQty: item.cupcakeQty,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "MULTIFLOOR":
        return {
          ...baseItem,
          floors: item.floors.map((floor) => ({
            floorNumber: floor.floorNumber,
            flavorId: floor.flavorId,
            sizeId: floor.sizeId,
            ingredientsIds:
              floor.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
          })),
        };

      default:
        return baseItem;
    }
  };

  // Función para transformar items al formato de actualización (PUT)
  const transformItemForUpdate = (item) => {
    const baseItem = {
      itemType: item.itemType,
      lineId: item.lineId,
    };

    switch (item.itemType) {
      case "REGULAR":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          sizeId: item.sizeId,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "NUMERIC":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          sizeId: item.sizeId,
          numberShape: item.numberShape,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "CUPCAKE":
        return {
          ...baseItem,
          flavorId: item.flavorId,
          cupcakeQty: item.cupcakeQty,
          ingredientsIds:
            item.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
        };

      case "MULTIFLOOR":
        return {
          ...baseItem,
          floors: item.floors.map((floor) => ({
            flavorId: floor.flavorId,
            sizeId: floor.sizeId,
            ingredientsIds:
              floor.ingredients?.map((ing) => ing.id || ing.Id || ing) || [],
          })),
        };

      default:
        return baseItem;
    }
  };

  const transformItemForEdit = (item) => {
    const transformIngredients = (ingredients) => {
      if (!ingredients) return [];
      return ingredients.map((ing) => {
        // Si el ingrediente es solo un ID (número)
        if (typeof ing === "number" || typeof ing === "string") {
          return { id: Number(ing) };
        }
        // Si el ingrediente es un objeto
        return {
          id: ing.id || ing.Id || ing,
        };
      });
    };

    switch (item.itemType) {
      case "REGULAR":
      case "NUMERIC":
      case "CUPCAKE":
        return {
          ...item,
          ingredients: transformIngredients(
            item.ingredients || item.ingredientsIds || []
          ),
        };

      case "MULTIFLOOR":
        return {
          ...item,
          floors: item.floors.map((floor) => ({
            ...floor,
            ingredients: transformIngredients(
              floor.ingredients || floor.ingredientsIds || []
            ),
          })),
        };

      default:
        return item;
    }
  };

  // Estado del pedido
  const [order, setOrder] = useState({
    clientId: orderToEdit?.clientId || null,
    userId: JSON.parse(localStorage.getItem("user"))?.id || null,
    writing: orderToEdit?.writing || "",
    caution: orderToEdit?.caution || false,
    notes: orderToEdit?.notes || "",
    status: orderToEdit?.status || "Agendado",
    pickupDate: orderToEdit?.pickupDate || `${orderDate}T12:00:00Z`,
    items: orderToEdit?.items?.map(transformItemForEdit) || [],
  });

  // Resetear el formulario cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setOrder({
        clientId: orderToEdit?.clientId || null,
        userId: JSON.parse(localStorage.getItem("user"))?.id || null,
        writing: orderToEdit?.writing || "",
        caution: orderToEdit?.caution || false,
        notes: orderToEdit?.notes || "",
        status: orderToEdit?.status || "Agendado",
        pickupDate: orderToEdit?.pickupDate || `${orderDate}T12:00:00Z`,
        items: orderToEdit?.items?.map(transformItemForEdit) || [],
      });
      fetchData();
    }
  }, [isOpen, orderToEdit, orderDate]);

  // Cargar datos iniciales
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      };

      const [linesRes, clientsRes] = await Promise.all([
        fetch(`${API}/cakes/lines/getAll`, options).then(handleResponse),
        fetch(`${API}/clients/client/getClients`, options).then(handleResponse),
      ]);

      // Filtrar por fecha seleccionada
      const selectedDateObj = new Date(orderDate);
      const filteredLines = linesRes
        .filter((line) => isAvailableForDate(line, selectedDateObj))
        .map((line) => ({
          ...line,
          flavors:
            line.flavors?.filter((f) =>
              isAvailableForDate(f, selectedDateObj)
            ) || [],
          sizes:
            line.sizes?.filter((s) => isAvailableForDate(s, selectedDateObj)) ||
            [],
        }));

      setLines(filteredLines);
      setClients(clientsRes);
    } catch (err) {
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Helper para verificar disponibilidad
  const isAvailableForDate = (item, date) => {
    return (
      item.avilable !== false &&
      (!item.expDate || new Date(item.expDate) <= date)
    );
  };

  // Helper para manejar respuestas
  const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error en la respuesta del servidor"
      );
    }
    return response.json();
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let payload = {
        clientId: order.clientId,
        userId: order.userId,
        writing: order.writing,
        caution: order.caution,
        notes: order.notes,
        status: order.status,
        pickupDate: order.pickupDate,
        items: order.items.map((item) => transformItemForUpdate(item)),
      };

      const url = orderToEdit
        ? `${API}/orders/order/updateOrder/${orderToEdit.id}`
        : `${API}/orders/order/createOrder`;

      const options = {
        method: orderToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      };

      const response = await fetch(url, options);
      const result = await handleResponse(response);

      setSuccessMessage(
        orderToEdit
          ? "Pedido actualizado correctamente"
          : "Pedido creado correctamente"
      );

      setTimeout(() => {
        onOrderSubmit?.(result);
        onClose(true);
      }, 1000);
    } catch (err) {
      setError(err.message || "Error al guardar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccessMessage(null);

  const steps = ["Cliente", "Pasteles", "Detalles"];

  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(false);
        }
      }}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        {orderToEdit ? "Editar Pedido" : "Nuevo Pedido"} - {orderDate}
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" onClose={handleCloseError}>
            {error}
          </Alert>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box>
              {activeStep === 0 && (
                <ClientStep
                  clients={clients}
                  selectedClient={order.clientId}
                  onSelectClient={(clientId) =>
                    setOrder({ ...order, clientId })
                  }
                  onCreateClient={async (clientData) => {
                    try {
                      const response = await fetch(
                        `${API}/clients/client/createClient`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify(clientData),
                        }
                      );
                      const newClient = await handleResponse(response);
                      setClients([...clients, newClient]);
                      setOrder({ ...order, clientId: newClient.id });
                    } catch (err) {
                      setError(err.message || "Error al crear el cliente");
                    }
                  }}
                />
              )}

              {activeStep === 1 && (
                <CakesStep
                  lines={lines}
                  items={order.items}
                  onAddItem={(item) =>
                    setOrder({
                      ...order,
                      items: [...order.items, item],
                    })
                  }
                  onRemoveItem={(index) =>
                    setOrder({
                      ...order,
                      items: order.items.filter((_, i) => i !== index),
                    })
                  }
                />
              )}

              {activeStep === 2 && (
                <SummaryStep
                  order={order}
                  onChange={(field, value) =>
                    setOrder({
                      ...order,
                      [field]: value,
                    })
                  }
                />
              )}
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <OrderSummary order={order} lines={lines} clients={clients} />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Box>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                Atrás
              </Button>
            )}
          </Box>

          <Box display="flex" gap={2}>
            <Button
              onClick={() => onClose(false)}
              variant="outlined"
              color="secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !order.clientId) ||
                  (activeStep === 1 && order.items.length === 0)
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    {orderToEdit ? "Actualizando..." : "Creando..."}
                  </Box>
                ) : orderToEdit ? (
                  "Actualizar Pedido"
                ) : (
                  "Crear Pedido"
                )}
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default OrderForm;
