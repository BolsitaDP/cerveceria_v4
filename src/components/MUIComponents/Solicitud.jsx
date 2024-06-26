import { Box, Card, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { NumericFormat } from "react-number-format";
import { v4 as uuid } from "uuid";

const Solicitud = ({
  solicitud,
  index,
  handleOpenModalDetalles,
  calendario = false,
}) => {
  let solicitudId = solicitud.idDnd;

  const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
    props,
    ref
  ) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {}}
        thousandSeparator
      />
    );
  });

  return (
    <Card
      variant={
        solicitud.tipoRequerimiento === "PRODUCCIÓN LOCAL"
          ? "solicitud nacional"
          : "solicitud internacional"
      }
      sx={{
        width: calendario ? "400px" : "100%",
        position: "relative",
        overflow: "visible",
        // minHeight: "65px",
      }}
      onClick={() => handleOpenModalDetalles(solicitud)}>
      {solicitud.observaciones !== "" ||
      solicitud.observacionesGenerales !== "" ? (
        <div
          className={`badgetEnSolicitud ${
            solicitud.tipoRequerimiento !== "PRODUCCIÓN LOCAL" &&
            "internacional"
          }`}></div>
      ) : (
        ""
      )}

      <Typography
        sx={{ width: "100%", fontSize: calendario ? "1.5vh" : "1.5vh" }}>
        <NumericFormatCustom
          value={solicitud.cantidad}
          displayType={"text"} // Esto indica que el valor formateado es para mostrar como texto
          thousandSeparator={true} // Otras opciones de formato si es necesario
        />{" "}
        CJ
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}>
        <Tooltip title={solicitud.producto} arrow>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "1.5vh",
            }}>
            {solicitud.producto.slice(0, 40)}
            {solicitud.producto.length > 40 && "..."}
          </Typography>
        </Tooltip>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "right",
            fontSize: "1.5vh",
          }}>
          {solicitud.codigoNombre}
        </Typography>
      </Box>
    </Card>
  );
};

export default Solicitud;
