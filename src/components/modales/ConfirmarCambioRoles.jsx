import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const ConfirmarCambioRoles = ({ handleConfirmation, accion = "" }) => {
  let nombreAccion =
    accion === "crear"
      ? "creación de usuario"
      : accion === "permisos"
      ? "asignación de permisos"
      : "eliminación de usuario";
  return (
    <BasicModal titulo={`Confirmación`}>
      <Box
        sx={{
          paddingX: "30px",
          width: "100%",
          minWidth: "max-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginY: "5vh",
          flexDirection: "column",
        }}>
        Confirmar {nombreAccion}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleConfirmation("no")} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={() => handleConfirmation("si")} variant="contained">
            Confirmar
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default ConfirmarCambioRoles;
