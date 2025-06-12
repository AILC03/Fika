import { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import es from "date-fns/locale/es";

//parece que tampoco se usa xd

const DateTimePickerComponent = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box className="mb-4">
        <Typography variant="subtitle1" className="mb-2">
          {label}
        </Typography>
        <DateTimePicker
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          value={value}
          onChange={onChange}
          minDate={new Date()}
          minTime={new Date(0, 0, 0, 8, 0)} // 8 AM
          maxTime={new Date(0, 0, 0, 20, 0)} // 8 PM
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              onClick={() => setOpen(true)}
              helperText="Selecciona fecha y hora de recolección"
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
