import { useState } from "react";
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
} from "@mui/material";
import { X, ChevronLeft } from "lucide-react";
import CustomerSearch from "./CustomerSearch";
import OrderGeneralFields from "./OrderGeneralFields";

const steps = ["Cliente", "Pasteles", "Detalles", "Resumen"];

const OrderForm = ({
  isOpen,
  onClose,
  onOrderSubmit,
  orderDate,
  userId = 1,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [orderGeneral, setOrderGeneral] = useState({
    writing: "",
    notes: "",
    status: "pending",
    pickupDateTime: new Date(new Date().setHours(14, 0, 0, 0)),
    caution: false,
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleGeneralChange = (field, value) => {
    setOrderGeneral((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitOrder = () => {
    const orderData = {
      userId,
      customerId: customer?.id,
      items: [], // Ahora siempre vacío
      ...orderGeneral,
      pickupDateTime: orderGeneral.pickupDateTime.toISOString(),
    };
    onOrderSubmit(orderData);
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setCustomer(null);
    setOrderGeneral({
      writing: "",
      notes: "",
      status: "pending",
      pickupDateTime: new Date(new Date().setHours(14, 0, 0, 0)),
      caution: false,
    });
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CustomerSearch onSelectCustomer={setCustomer} searchOnly />;

      case 1:
        return (
          <div className="space-y-4">
            <Typography variant="h6" className="mb-4 text-[#7E4300]">
              No hay formularios disponibles
            </Typography>

            <Paper className="p-8 text-center">
              <Typography className="text-[#7E4300] text-lg font-medium">
                No hay formularios para mostrar en este momento.
              </Typography>
            </Paper>
          </div>
        );

      case 2:
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
              caution={orderGeneral.caution}
              onCautionChange={(value) => handleGeneralChange("caution", value)}
            />
          </div>
        );

      case 3:
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
                Pasteles
              </Typography>
              <Typography className="text-[#7E4300]">
                No se agregaron pasteles a este pedido.
              </Typography>
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
                disabled={!customer}
                className="bg-[#FFD538] text-[#7E4300] hover:bg-[#FFD538]/90 disabled:bg-[#FFF2C9] disabled:text-[#7E4300]/50"
              >
                Confirmar Pedido
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 0 && !customer}
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
