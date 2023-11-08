import React from "react";
import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import BasicModal from "../MUIComponents/BasicModal";
import { useState } from "react";
import { Box } from "@mui/material";
import obtenerFechasDeLaSemana from "../../helpers/obtenerFechasDeLaSemana";
import obtenerDiasDeLaSemana from "../../helpers/obtenerDiasDeLaSemana";
import { useDispatch } from "react-redux";
import { addDates } from "../../redux/slices/datesSlice";
import { setDias } from "../../redux/slices/contenedoresSlice";

import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1,
});

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary[theme.palette.mode],
    },
  }),
  ...(day.day() === 1 && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(day.day() === 0 && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

const isInSameWeek = (dayA, dayB) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, "week");
};

function Day(props) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export default function SeleccionadorDeFechas({ onClose }) {
  const dispatch = useDispatch();

  const [hoveredDay, setHoveredDay] = useState(null);
  const [value, setValue] = useState(null);

  const handleDateChange = (newValue) => {
    setValue(newValue);

    let fechaFormateadada = newValue.format("YYYY-MM-DD");

    let fechasDeLaSemana = obtenerFechasDeLaSemana(fechaFormateadada);
    let fechasDeLaSemanaCompletas = obtenerDiasDeLaSemana(fechasDeLaSemana);

    dispatch(addDates(fechasDeLaSemana));
    dispatch(setDias(fechasDeLaSemanaCompletas));

    onClose();
  };

  return (
    <BasicModal titulo={"Seleccionar fechas"}>
      <Box sx={{ width: "30vw", minWidth: "350px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-ES">
          <DateCalendar
            value={value}
            onChange={(newValue) => handleDateChange(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber
            slots={{ day: Day }}
            slotProps={{
              day: (ownerState) => ({
                selectedDay: value,
                hoveredDay,
                onPointerEnter: () => setHoveredDay(ownerState.day),
                onPointerLeave: () => setHoveredDay(null),
              }),
            }}
          />
        </LocalizationProvider>
      </Box>
    </BasicModal>
  );
}
