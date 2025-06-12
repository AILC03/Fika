import { useState, useEffect } from "react";
import {
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

//componente principal

const steps = ["Cliente", "Pasteles", "Detalles", "Resumen"];

const cakeTypes = [
  { id: "regular", name: "Pastel Regular", description: "Pastel tradicional" },
  {
    id: "numeric",
    name: "Pastel Numérico",
    description: "Para números y cifras",
  },
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
    caution: false,
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
      caution: false,
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
          <div className="space-y-4">
            <Typography variant="h6" className="mb-4 text-[#7E4300]">
              {orderItems.length > 0
                ? "Pasteles en este pedido"
                : "Selecciona los pasteles para tu pedido"}
            </Typography>

            {orderItems.map((item, index) => (
              <Paper
                key={index}
                className="p-4 mb-4 relative border border-[#7E4300]/30"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Typography className="font-bold text-[#7E4300]">
                      {getCakeTypeName(item.type)}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-[#7E4300]/80 whitespace-pre-line"
                    >
                      {getCakeDetails(item)}
                    </Typography>
                  </div>
                  <div>
                    {expandedForm === `${item.type}-edit-${index}` ? (
                      <Button
                        size="small"
                        className="bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 mr-2"
                        onClick={() => setExpandedForm(null)}
                      >
                        Cancelar
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="small"
                          className="bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 mr-2"
                          onClick={() => {
                            setExpandedForm(`${item.type}-edit-${index}`);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleRemoveCake(index)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Formulario de edición */}
                {/* Formulario de edición - Ordenado por tipo de pastel */}
                <Collapse in={expandedForm === `${item.type}-edit-${index}`}>
                  <div className="mt-4">
                    {/* 1. Pastel Regular (primero por ser el más común) */}
                    {item.type === "regular" && (
                      <RegularCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}

                    {/* 2. Pastel Numérico */}
                    {item.type === "numeric" && (
                      <NumericCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}

                    {/* 3. Pastel de Pisos */}
                    {item.type === "tiered" && (
                      <TieredCakeForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}

                    {/* 4. Cupcakes (último por ser categoría diferente) */}
                    {item.type === "cupcakes" && (
                      <CupcakesForm
                        cakeData={filteredCakeData}
                        onAddCake={(updated) => handleEditCake(index, updated)}
                        initialData={item}
                        editMode
                        onCancel={() => setExpandedForm(null)}
                      />
                    )}
                  </div>
                </Collapse>
              </Paper>
            ))}

            <Typography variant="subtitle1" className="text-[#7E4300] mb-4">
              Agregar pasteles
            </Typography>

            <Grid container spacing={2}>
              {cakeTypes.map((type) => (
                <Grid item xs={12} key={type.id}>
                  <Paper className="overflow-hidden">
                    <div
                      className={`p-4 flex justify-between items-center cursor-pointer ${
                        expandedForm === type.id
                          ? "bg-[#FFF2C9]"
                          : "bg-white hover:bg-[#FFF2C9]/50"
                      }`}
                      onClick={() => handleExpandForm(type.id)}
                    >
                      <div>
                        <Typography className="font-bold text-[#7E4300]">
                          {type.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-[#7E4300]/80"
                        >
                          {type.description}
                        </Typography>
                      </div>
                      {expandedForm === type.id ? (
                        <ChevronUp className="text-[#7E4300]" />
                      ) : (
                        <ChevronDown className="text-[#7E4300]" />
                      )}
                    </div>

                    <Collapse in={expandedForm === type.id}>
                      <div className="p-4">
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
                      </div>
                    </Collapse>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
        );

      case 2: // Paso 3: Detalles generales
        return (
          <div>
            <Typography variant="h6" className="text-[#7E4300] mb-4">
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
              caution={orderGeneral.caution} // <-- ¡Agrega esta línea!
              onCautionChange={(value) => handleGeneralChange("caution", value)}
            />
          </div>
        );

      case 3: // Paso 4: Resumen
        return (
          <div>
            <Typography variant="h6" className="text-[#7E4300] mb-4">
              Resumen del Pedido
            </Typography>

            <div className="mb-6">
              <Typography variant="subtitle1" className="text-[#7E4300]">
                Cliente
              </Typography>
              <Typography className="text-[#7E4300]">
                {customer?.name} - {customer?.phone}
                {customer?.email && ` (${customer.email})`}
              </Typography>
            </div>

            <div className="mb-6">
              <Typography variant="subtitle1" className="text-[#7E4300]">
                Pasteles ({orderItems.length})
              </Typography>
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-[#7E4300]/30 rounded-lg"
                >
                  <Typography className="font-bold text-[#7E4300]">
                    {index + 1}. {getCakeTypeName(item.type)}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#7E4300]/80 whitespace-pre-line"
                  >
                    {getCakeDetails(item)}
                  </Typography>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <Typography variant="subtitle1" className="text-[#7E4300]">
                Detalles Adicionales
              </Typography>
              <Typography className="text-[#7E4300]">
                <strong>Texto en el pastel:</strong>{" "}
                {orderGeneral.writing || "Ninguno"}
              </Typography>
              <Typography className="text-[#7E4300]">
                <strong>Notas:</strong> {orderGeneral.notes || "Ninguna"}
              </Typography>
              <Typography className="text-[#7E4300]">
                <strong>Fecha de recolección:</strong>{" "}
                {orderGeneral.pickupDateTime.toLocaleString()}
              </Typography>
              <Typography className="text-[#7E4300]">
                <strong>Estado:</strong>{" "}
                {orderGeneral.status === "pending" ? "Pendiente" : "Confirmado"}
              </Typography>
            </div>
          </div>
        );

      default:
        return (
          <Typography className="text-[#7E4300]">Paso desconocido</Typography>
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      PaperProps={{
        className: "bg-[#FFF2C9]/20",
      }}
    >
      <DialogContent className="p-0 bg-yellow-100">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="absolute right-2 top-2 text-[#7E4300] z-10"
        >
          <X />
        </IconButton>

        <div className="p-6">
          <Stepper activeStep={activeStep} className="mb-6">
            {steps.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel className="text-[#7E4300]">{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="mb-6">{renderStepContent(activeStep)}</div>

          <div className="flex justify-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ChevronLeft size={16} className="text-[#7E4300]" />}
              className="text-[#7E4300] hover:bg-[#FFF2C9]/50"
            >
              Atrás
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmitOrder}
                disabled={orderItems.length === 0 || !customer}
                className="bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 disabled:bg-[#FFF2C9] disabled:text-[#7E4300]/50"
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
                className="bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 disabled:bg-[#FFF2C9] disabled:text-[#7E4300]/50"
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
