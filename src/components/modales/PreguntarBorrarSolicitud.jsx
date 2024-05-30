import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const PreguntarBorrarSolicitud = ({ onSiBorrar, onNoBorrar }) => {
  return (
    <BasicModal titulo="Eliminar solicitud">
      <Box sx={{ width: "30vw", padding: "30px" }}>
        <Box>¿Desea eliminar la solicitud?</Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: "20px",
          }}>
          <Button variant="contained" onClick={() => onSiBorrar()}>
            Sí
          </Button>
          <Button variant="contained" onClick={() => onNoBorrar()}>
            No
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default PreguntarBorrarSolicitud;
