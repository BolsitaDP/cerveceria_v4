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
        accion.tipo === "correctiva" ? "accion correctiva" : "accion operativa"
      }
      sx={{
        width: calendario ? "200px" : "200px",
        // height: calendario ? "70px" : "200px",
        display: "flex",
      }}
      onClick={() => !calendario && handleOpenDetalles(accion)}>
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
          {accion.nombreDeLaAccion.slice(0, 11)}
          {accion.nombreDeLaAccion.length >= 11 && "..."}
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
        <Box sx={{ textAlign: "center" }}>{accion.duracion} minutos</Box>
        <Box sx={{ width: "80%", textAlign: "right" }}>{accion.tipo}</Box>
      </Box>
    </Card>
  );
};

export default Accion;
