import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const PreguntarDevolverSolicitudes = ({
  onSiDevolver,
  onNoDevolver,
  id,
  general,
  fechas,
}) => {
  let diaNombre, dia, fecha, day, month;

  if (!general) {
    [, diaNombre] = id.split("|");
    [dia, fecha] = diaNombre.split("&");
    [day, month] = fecha.split("/");
  }

  return (
    <BasicModal titulo="Devolver solicitudes">
      <Box sx={{ width: "30vw", padding: "30px" }}>
        <Box>
          ¿Desea realmente devolver
          {general
            ? " todas las solicitudes planeadas "
            : ` las solicitudes del ${dia} ${day}/${month} `}
          devuelta a pendientes por programar?
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: "20px",
          }}>
          <Button variant="contained" onClick={() => onSiDevolver()}>
            Sí
          </Button>
          <Button variant="contained" onClick={() => onNoDevolver()}>
            No
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default PreguntarDevolverSolicitudes;
