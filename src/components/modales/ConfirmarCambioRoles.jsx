import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const ConfirmarCambioRoles = ({ handleConfirmation, accion = "" }) => {
  return (
    <BasicModal titulo={`Confirmar ${accion}`}>
      <Box
        sx={{
          padding: "10px",
          width: "100%",
          minWidth: "max-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginY: "5vh",
        }}>
        <Button onClick={() => handleConfirmation("no")} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={() => handleConfirmation("si")} variant="contained">
          Confirmar
        </Button>
      </Box>
    </BasicModal>
  );
};

export default ConfirmarCambioRoles;
