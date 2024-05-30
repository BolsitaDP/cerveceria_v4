import { useTheme } from "@emotion/react";
import { Box, Card, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ClearIcon from "@mui/icons-material/Clear";
import isLightColor from "../../helpers/getBackgroundBrightness";

const Accion = ({
  accion,
  index,
  handleOpenDetalles,
  handleDeleteAccion,
  calendario,
}) => {
  const theme = useTheme();

  let esClaro;
  if (accion.hexa) {
    esClaro = isLightColor(accion.hexa);
  } else {
    esClaro = false;
  }

  return (
    <Card
      variant={
        accion.tipo === "correctiva"
          ? "accion correctiva"
          : accion.tipo === "operativa"
          ? "accion operativa"
          : accion.tipo === "horario"
          ? "accion horario"
          : "accion notas"
      }
      sx={{
        width: "200px",
        height: "max-content",
        display: "flex",
        backgroundColor: `#${accion.hexa}`,
        color: esClaro ? "#000000" : "#ffffff",
      }}>
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
            fontSize: "1.4vh",
          }}>
          {accion.tipo !== "notas" &&
            accion.tipo !== "horario" &&
            parseFloat(accion.duracion.toFixed(2)) + " horas"}
        </Box>
        <Tooltip title="Eliminar actividad" arrow>
          <IconButton
            sx={{
              fontSize: "1.2vh",
              color: esClaro ? "#000000" : "#ffffff",
              display: "flex",
            }}
            onClick={() => handleDeleteAccion(accion)}
            edge="end">
            <ClearIcon sx={{ fontSize: "2.5vh" }} />
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
          fontSize: "1.4vh",
        }}>
        <Box sx={{ textAlign: "center" }}>
          <Tooltip title={accion.nombreDeLaAccion} arrow>
            {accion.nombreDeLaAccion.slice(0, 30)}
            {accion.nombreDeLaAccion.length >= 30 && "..."}
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
