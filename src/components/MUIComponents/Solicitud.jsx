import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Solicitud = ({ solicitud, index, handleOpenModalDetalles }) => {
  let solicitudId = solicitud.idDnd;
  return (
    <Draggable draggableId={solicitudId} index={index} key={solicitudId}>
      {(provided) => (
        <Card
          variant={
            solicitud.pais === "Guatemala"
              ? "solicitud nacional"
              : "solicitud internacional"
          }
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => handleOpenModalDetalles(solicitud)}
          ref={provided.innerRef}>
          <Typography sx={{ width: "100%", fontSize: "1.8vh" }}>
            {solicitud.cantidad} {solicitud.unidadMedida}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}>
              {solicitud.producto.slice(0, 30)}
              {solicitud.producto.length > 30 && "..."}
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "right",
                fontSize: "1.8vh",
              }}>
              {solicitud.codigoNombre}
            </Typography>
          </Box>
        </Card>
      )}
    </Draggable>
  );
};

export default Solicitud;
