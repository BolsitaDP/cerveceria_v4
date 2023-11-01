import { useTheme } from "@emotion/react";
import { Box, Card, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ClearIcon from "@mui/icons-material/Clear";

const Accion = ({ accion, index, handleOpenDetalles, handleDeleteAccion }) => {
  const theme = useTheme();

  let accionId = accion.idDnd;
  return (
    <Draggable draggableId={accionId} index={index} key={accionId}>
      {(provided) => (
        <Card
          variant={
            accion.tipo === "correctiva"
              ? "accion correctiva"
              : "accion operativa"
          }
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => handleOpenDetalles(accion)}
          ref={provided.innerRef}>
          <Box
            sx={{
              width: "200px",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 15px",
              alignItems: "center",
            }}>
            <Box sx={{ display: "flex", textAlign: "center" }}>
              {accion.nombreDeLaAccion.slice(0, 11)}
              {accion.nombreDeLaAccion.length >= 11 && "..."}
            </Box>
            <Tooltip title="Eliminar actividad" arrow>
              <IconButton
                sx={{
                  color: theme.palette.primary.contrast,
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
            }}>
            <Box sx={{ textAlign: "center" }}>{accion.duracion} minutos</Box>
            <Box sx={{ width: "80%", textAlign: "right" }}>{accion.tipo}</Box>
          </Box>
        </Card>
      )}
    </Draggable>
  );
};

export default Accion;
