import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const PreguntarDevolverSolicitudes = ({ onSiDevolver, onNoDevolver }) => {
  return (
    <BasicModal titulo="Devolver solicitudes">
      <Box sx={{ width: "30vw", padding: "30px" }}>
        <Box>
          ¿Desea realmente devolver todas las solicitudes planeadas devuelta a
          pendientes por programar?
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
