import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Button } from "@mui/material";

const PreguntarProgramarDiferencia = ({
  onSiProgramar,
  onNoProgramar,
  diferenciaAProgramar,
}) => {
  let { solicitudFaltante, solicitudAbiertaEditable } = diferenciaAProgramar;
  console.log(solicitudFaltante, solicitudAbiertaEditable);
  return (
    <BasicModal titulo="Reprogramar faltante">
      <Box sx={{ width: "30vw", padding: "30px" }}>
        <Box>
          La cantidad producida{" "}
          <strong>
            {(
              Math.round(solicitudAbiertaEditable.cantidad) -
              Math.round(solicitudFaltante.cantidad)
            ).toLocaleString()}{" "}
            CJS
          </strong>{" "}
          es menor a la planeada{" "}
          <strong>
            {Number(solicitudAbiertaEditable.cantidad).toLocaleString()} CJS
          </strong>
          , ¿desea reprogramar la diferencia de{" "}
          <strong>
            {Math.round(solicitudFaltante.cantidad).toLocaleString()} CJS
          </strong>
          ?
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: "20px",
          }}>
          <Button variant="contained" onClick={() => onSiProgramar()}>
            Sí
          </Button>
          <Button variant="contained" onClick={() => onNoProgramar()}>
            No
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default PreguntarProgramarDiferencia;
