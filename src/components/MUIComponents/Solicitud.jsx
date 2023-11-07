import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const Solicitud = ({
  solicitud,
  index,
  handleOpenModalDetalles,
  calendario = false,
}) => {
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
          sx={{
            width: calendario ? "400px" : "100%",
            minHeight: "65px",
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => handleOpenModalDetalles(solicitud)}
          ref={provided.innerRef}>
          <Typography
            sx={{ width: "100%", fontSize: calendario ? "1.5vh" : "1.8vh" }}>
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
                fontSize: calendario ? "1.8vh" : "2vh",
              }}>
              {solicitud.producto.slice(0, 30)}
              {solicitud.producto.length > 30 && "..."}
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "right",
                fontSize: calendario ? "1.5vh" : "1.8vh",
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
