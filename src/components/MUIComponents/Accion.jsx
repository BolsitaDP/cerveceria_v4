import { useTheme } from "@emotion/react";
import { Box, Card, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ClearIcon from "@mui/icons-material/Clear";

const Accion = ({
  accion,
  index,
  handleOpenDetalles,
  handleDeleteAccion,
  calendario,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant={
        accion.tipo === "correctiva"
          ? "accion correctiva"
          : accion.tipo === "operativa"
          ? "accion operativa"
          : "accion notas"
      }
      sx={{
        width: calendario ? "200px" : "200px",
        // height: calendario ? "70px" : "200px",
        display: "flex",
      }}
      // onClick={() => !calendario && handleOpenDetalles(accion)}
    >
      <Box
        sx={{
          width: "200px",
          display: "flex",
          justifyContent: "space-between",
          padding: "5px 15px",
          height: "20px",
          alignItems: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            textAlign: "center",
            fontSize: calendario ? "1.8vh" : "2vh",
          }}>
          {accion.tipo !== "notas" &&
            parseFloat(accion.duracion.toFixed(2)) + " horas"}
        </Box>
        <Tooltip title="Eliminar actividad" arrow>
          <IconButton
            sx={{
              color: theme.palette.primary.contrast,
              display: "flex",
            }}
            onClick={() => handleDeleteAccion(accion)}
            edge="end">
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "200px",
          justifyContent: "center",
          alignItems: "center",
          fontSize: calendario ? "1.8vh" : "2vh",
        }}>
        <Box sx={{ textAlign: "center" }}>
          <Tooltip title={accion.nombreDeLaAccion} arrow>
            {accion.nombreDeLaAccion.slice(0, 22)}
            {accion.nombreDeLaAccion.length >= 22 && "..."}
          </Tooltip>
        </Box>
        <Box sx={{ width: "80%", textAlign: "right" }}>
          {accion.tipo.charAt(0).toUpperCase() + accion.tipo.slice(1)}
        </Box>
      </Box>
    </Card>
  );
};

export default Accion;
