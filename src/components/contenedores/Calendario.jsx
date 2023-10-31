import { Box, Card, IconButton, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useTheme } from "@emotion/react";
import SeleccionadorDeFechas from "../modales/SeleccionadorDeFechas";

const Calendario = () => {
  const theme = useTheme();

  const [modalAbierto, setModalAbierto] = useState(null);

  const handleMostrarSeleccionadorDeFechas = () => {
    setModalAbierto("seleccionadorDeFechas");
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Calendario</p>
          <Tooltip title="Seleccionar fecha" arrow>
            <IconButton
              sx={{ color: theme.palette.primary.contrast }}
              onClick={handleMostrarSeleccionadorDeFechas}
              edge="end">
              <CalendarTodayRoundedIcon />
            </IconButton>
          </Tooltip>
        </Card>

        <Card>Salones</Card>

        <Box sx={{ backgroundColor: "red", display: "flex", height: "100%" }}>
          <Card
            sx={{ height: "95%", backgroundColor: "blue", padding: "5% 0" }}>
            <Box sx={{ height: "calc(100% / 7)", minHeight: "9ch" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Lunes</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Martes</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Miércoles</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Jueves</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Viernes</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Sábado</Card>
            </Box>
            <Box sx={{ height: "calc(100% / 7)" }}>
              <Card sx={{ transform: "rotate(270deg)" }}>Domingo</Card>
            </Box>
          </Card>
          <Card>Porcentaje</Card>
          <Card>Programación</Card>
        </Box>
      </Card>

      <Modal
        open={modalAbierto === "seleccionadorDeFechas"}
        onClose={() => setModalAbierto(null)}>
        <SeleccionadorDeFechas />
      </Modal>
    </Box>
  );
};

export default Calendario;
