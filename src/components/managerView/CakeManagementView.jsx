import React, { useState } from "react";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import { Refresh, ExpandMore, Save } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CakeManagementView = ({
  cakesData,
  onRefresh,
  onUpdateCakeData,
  loading,
}) => {
  const [expanded, setExpanded] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editDate, setEditDate] = useState(dayjs()); // Inicializa con dayjs
  const [editType, setEditType] = useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const startEditing = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setEditDate(item.date ? dayjs(item.date) : dayjs());
  };

  const saveEdit = () => {
    const updatedItem = { ...editingItem, date: editDate.format("YYYY-MM-DD") };
    onUpdateCakeData(updatedItem, editType);
    setEditingItem(null);
  };

  const renderFlavors = (flavors) => {
    return flavors.map((flavor) => (
      <div key={flavor.id} className="ml-6 mb-4 border-l-2 pl-4">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="subtitle1">
            {flavor.name}
            {editingItem?.id === flavor.id && editType === "flavor" ? (
              <div className="flex items-center gap-2 ml-2">
                <DatePicker
                  value={editDate} // Asegúrate de que sea una instancia de dayjs
                  onChange={(newValue) => setEditDate(newValue)} // `newValue` ya es una instancia de dayjs
                  textField={(params) => <TextField {...params} size="small" />}
                />
                <IconButton onClick={saveEdit} color="primary">
                  <Save />
                </IconButton>
              </div>
            ) : (
              <Chip
                label={dayjs(flavor.date).format("DD/MM/YYYY")}
                size="small"
                className="ml-2"
                onClick={() => startEditing(flavor, "flavor")}
              />
            )}
          </Typography>
        </div>
      </div>
    ));
  };

  const renderSizes = (sizes) => {
    return sizes.map((size) => (
      <div key={size.id} className="ml-6 mb-2">
        <Typography variant="body2">
          {size.size}
          {editingItem?.id === size.id && editType === "size" ? (
            <span className="flex items-center gap-2 ml-2">
              <DatePicker
                value={editDate} // Asegúrate de que sea una instancia de dayjs
                onChange={(newValue) => setEditDate(newValue)} // `newValue` ya es una instancia de dayjs
                textField={(params) => <TextField {...params} size="small" />}
              />
              <IconButton onClick={saveEdit} size="small" color="primary">
                <Save />
              </IconButton>
            </span>
          ) : (
            <Chip
              label={dayjs(size.date).format("DD/MM/YYYY")}
              size="small"
              className="ml-2"
              onClick={() => startEditing(size, "size")}
            />
          )}
        </Typography>
      </div>
    ));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Gestión de Pasteles</Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
          >
            Actualizar
          </Button>
        </div>

        {cakesData.map((cake) => (
          <Accordion
            key={cake.id}
            expanded={expanded === `cake-${cake.id}`}
            onChange={handleChange(`cake-${cake.id}`)}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <div className="flex items-center justify-between w-full">
                <Typography>{cake.type}</Typography>
                {editingItem?.id === cake.id && editType === "cake" ? (
                  <div className="flex items-center gap-2">
                    <DatePicker
                      value={editDate} // Asegúrate de que sea una instancia de dayjs
                      onChange={(newValue) => setEditDate(newValue)} // `newValue` ya es una instancia de dayjs
                      textField={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                    <IconButton onClick={saveEdit} size="small" color="primary">
                      <Save />
                    </IconButton>
                  </div>
                ) : (
                  <Chip
                    label={dayjs(cake.date).format("DD/MM/YYYY")}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(cake, "cake");
                    }}
                  />
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Sabores:
                  </Typography>
                  {renderFlavors(cake.flavors)}
                </div>
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    Tamaños:
                  </Typography>
                  {renderSizes(cake.sizes)}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </LocalizationProvider>
  );
};

export default CakeManagementView;
