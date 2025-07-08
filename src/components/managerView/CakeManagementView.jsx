import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import { ExpandMore, Save } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CakeManagementView = () => {
  const API = import.meta.env.VITE_URI;
  const [expanded, setExpanded] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editDate, setEditDate] = useState(dayjs());
  const [editType, setEditType] = useState("");
  const [cakesData, setCakesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCakesData();
  }, []);

  const fetchCakesData = async () => {
    setLoading(true);
    try {
      const data = await getAllLines();
      if (data && data.length > 0) {
        const transformedData = data.map((line) => ({
          id: line.Id,
          type: line.line,
          date: line.expDate,
          flavors: line.flavors.map((flavor) => ({
            id: flavor.Id,
            name: flavor.flavor,
            date: flavor.expDate,
          })),
          sizes: line.sizes.map((size) => ({
            id: size.Id,
            size: size.size,
            date: size.expDate,
          })),
        }));
        setCakesData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching cakes data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllLines = async () => {
    try {
      const response = await fetch(`${API}/cakes/lines/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error fetching cakes data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cakes:", error);
      return [];
    }
  };

  const updateLine = async (lineId, updateData) => {
    try {
      const response = await fetch(`${API}/cakes/lines/expDate/${lineId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Error updating line");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating line:", error);
      throw error;
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const startEditing = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setEditDate(item.date ? dayjs(item.date) : dayjs());
  };

  const saveEdit = async () => {
    try {
      setLoading(true);

      let updatePayload = {};
      const formattedDate = editDate.format("YYYY-MM-DD");

      if (editType === "cake") {
        updatePayload = {
          lineExpDate: formattedDate,
        };
        await updateLine(editingItem.id, updatePayload);
      } else if (editType === "flavor") {
        updatePayload = {
          flavors: [{ id: editingItem.id, expDate: formattedDate }],
        };
        await updateLine(
          findLineIdForItem(editingItem.id, "flavor"),
          updatePayload
        );
      } else if (editType === "size") {
        updatePayload = {
          sizes: [{ id: editingItem.id, expDate: formattedDate }],
        };
        await updateLine(
          findLineIdForItem(editingItem.id, "size"),
          updatePayload
        );
      }

      const updatedCakesData = cakesData.map((cake) => {
        if (editType === "cake" && cake.id === editingItem.id) {
          return { ...cake, date: formattedDate };
        }

        if (editType === "flavor" || editType === "size") {
          const updatedItems = cake[editType + "s"].map((item) =>
            item.id === editingItem.id ? { ...item, date: formattedDate } : item
          );
          return { ...cake, [editType + "s"]: updatedItems };
        }

        return cake;
      });

      setCakesData(updatedCakesData);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  const findLineIdForItem = (itemId, itemType) => {
    for (const cake of cakesData) {
      const items = cake[itemType + "s"];
      if (items.some((item) => item.id === itemId)) {
        return cake.id;
      }
    }
    return null;
  };

  const renderFlavors = (flavors) => {
    return flavors.map((flavor) => (
      <Box
        key={`flavor-${flavor.id}`}
        sx={{ ml: 3, mb: 2, pl: 2, borderLeft: "2px solid #7E4300" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1">
            {flavor.name}
            {editingItem?.id === flavor.id && editType === "flavor" ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
              >
                <DatePicker
                  value={editDate}
                  onChange={(newValue) => setEditDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{ backgroundColor: "#FFF2C9" }}
                    />
                  )}
                />
                <IconButton
                  onClick={saveEdit}
                  sx={{
                    color: "#7E4300",
                    "&:hover": { backgroundColor: "#FFD538" },
                  }}
                >
                  <Save />
                </IconButton>
              </Box>
            ) : (
              <Chip
                label={dayjs(flavor.date).format("DD/MM/YYYY")}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: "#FFD538",
                  color: "#000000",
                  "&:hover": { backgroundColor: "#e6c032" },
                }}
                onClick={() => startEditing(flavor, "flavor")}
              />
            )}
          </Typography>
        </Box>
      </Box>
    ));
  };

  const renderSizes = (sizes) => {
    return sizes.map((size) => (
      <Box key={`size-${size.id}`} sx={{ ml: 3, mb: 1 }}>
        <Typography variant="body2">
          {size.size}
          {editingItem?.id === size.id && editType === "size" ? (
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
            >
              <DatePicker
                value={editDate}
                onChange={(newValue) => setEditDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{ backgroundColor: "#FFF2C9" }}
                  />
                )}
              />
              <IconButton
                onClick={saveEdit}
                size="small"
                sx={{
                  color: "#7E4300",
                  "&:hover": { backgroundColor: "#FFD538" },
                }}
              >
                <Save />
              </IconButton>
            </Box>
          ) : (
            <Chip
              label={dayjs(size.date).format("DD/MM/YYYY")}
              size="small"
              sx={{
                ml: 1,
                backgroundColor: "#FFD538",
                color: "#000000",
                "&:hover": { backgroundColor: "#e6c032" },
              }}
              onClick={() => startEditing(size, "size")}
            />
          )}
        </Typography>
      </Box>
    ));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, backgroundColor: "#FFF2C9", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "#7E4300" }}>
            Disponibilidad de las lineas de pasteleria
          </Typography>
        </Box>

        {cakesData.map((cake) => (
          <Accordion
            key={`cake-${cake.id}`}
            expanded={expanded === `cake-${cake.id}`}
            onChange={handleChange(`cake-${cake.id}`)}
            sx={{
              mb: 2,
              "&:before": {
                backgroundColor: "transparent",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: "#7E4300" }} />}
              sx={{
                backgroundColor: "#7E4300",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#5a3000",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>{cake.type}</Typography>
                {editingItem?.id === cake.id && editType === "cake" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DatePicker
                      value={editDate}
                      onChange={(newValue) => setEditDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          sx={{ backgroundColor: "#FFF2C9" }}
                        />
                      )}
                    />
                    <IconButton
                      onClick={saveEdit}
                      size="small"
                      sx={{
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "#FFD538" },
                      }}
                    >
                      <Save />
                    </IconButton>
                  </Box>
                ) : (
                  <Chip
                    label={dayjs(cake.date).format("DD/MM/YYYY")}
                    size="small"
                    sx={{
                      backgroundColor: "#FFD538",
                      color: "#000000",
                      "&:hover": { backgroundColor: "#e6c032" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(cake, "cake");
                    }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#FFF2C9" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    Sabores:
                  </Typography>
                  {renderFlavors(cake.flavors)}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ color: "#7E4300" }}
                  >
                    Tamaños:
                  </Typography>
                  {renderSizes(cake.sizes)}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </LocalizationProvider>
  );
};

export default CakeManagementView;
