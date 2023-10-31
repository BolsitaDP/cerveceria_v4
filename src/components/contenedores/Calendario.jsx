import { Box, Card, IconButton, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";

import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useTheme } from "@emotion/react";
import SeleccionadorDeFechas from "../modales/SeleccionadorDeFechas";
import EstadisticasGenerales from "../modales/EstadisticasGenerales";
import { useSelector } from "react-redux";
import EstadisticasSalon from "../modales/EstadisticasSalon";

const Calendario = () => {
  const theme = useTheme();

  const [modalAbierto, setModalAbierto] = useState(null);
  const [estadisticasSalon, setEstadisticasSalon] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  const salones = useSelector((state) => state.contenedores.calendario);

  const handleMostrarModal = (modal) => {
    setModalAbierto(modal);
  };

  const handleOpenModalStats = (salon) => {
    setModalAbierto("estadisitcasSalon");
    setEstadisticasSalon(salon);
  };

  const handleTabClick = (index, salon) => {
    setActiveTab(index);
    // dispatch(setSalonSeleccionado(salon));
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Calendario</p>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Tooltip title="Seleccionar fecha" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() => handleMostrarModal("seleccionadorDeFechas")}
                edge="end">
                <CalendarTodayRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notificar cambios" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() => handleMostrarModal("notificarCambios")}
                edge="end">
                <BackupRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Estadísticas generales" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() => handleMostrarModal("estadisticasGenerales")}
                edge="end">
                <QueryStatsRoundedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Card>

        <Card>
          {Object.keys(salones).map((salon, index) => {
            console.log(salon);
            return (
              <div key={index} onClick={() => handleTabClick(index, salon)}>
                {`Salón ${salon}`}

                <Tooltip title="Estadísticas generales" arrow>
                  <IconButton
                    sx={{ color: theme.palette.primary.contrast }}
                    onClick={() => handleOpenModalStats(salon)}
                    edge="end">
                    <QueryStatsRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
            );
          })}
        </Card>

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
      <Modal
        open={modalAbierto === "estadisticasGenerales"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasGenerales />
      </Modal>
      <Modal
        open={modalAbierto === "estadisitcasSalon"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasSalon />
      </Modal>
    </Box>
  );
};

export default Calendario;
