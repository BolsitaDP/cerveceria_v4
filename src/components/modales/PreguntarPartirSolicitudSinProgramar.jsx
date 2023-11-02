import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const PreguntarPartirSolicitudSinProgramar = ({
  onSiPartir,
  onNoPartir,
  openPartir,
}) => {
  return (
    <BasicModal titulo="Creación de copia">
      <Box sx={{ width: "30vw", padding: "30px" }}>
        <Box>
          La cantidad ingresada es menor a la actual, ¿desea partir la solicitud
          con la diferencia?
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: "20px",
          }}>
          <Button variant="contained" onClick={() => onSiPartir()}>
            Sí
          </Button>
          <Button variant="contained" onClick={() => onNoPartir()}>
            No
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default PreguntarPartirSolicitudSinProgramar;
