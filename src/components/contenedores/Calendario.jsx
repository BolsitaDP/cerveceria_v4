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
  const diasDeLaSemana = useSelector((state) => state.utils.diasDeLaSemana);

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

        <Box
          sx={{
            display: "flex",
            width: "100%",
            overflow: "auto",
            // paddingLeft: "50px",
            backgroundColor: theme.palette.primary.main,
          }}>
          {Object.keys(salones).map((salon, index) => {
            return (
              <Box
                sx={{
                  backgroundColor:
                    activeTab === index
                      ? theme.palette.primary.contrast
                      : theme.palette.primary.main,
                  color:
                    activeTab === index
                      ? theme.palette.primary.main
                      : theme.palette.primary.contrast,
                  minWidth: "150px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                key={index}
                onClick={() => handleTabClick(index, salon)}>
                {`Salón ${salon}`}

                <Tooltip title={`Estadísticas del salón ${salon}`} arrow>
                  <IconButton
                    sx={{
                      color:
                        activeTab === index
                          ? theme.palette.primary.main
                          : theme.palette.primary.contrast,
                    }}
                    onClick={() => handleOpenModalStats(salon)}
                    edge="end">
                    <QueryStatsRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            backgroundColor: "red",
            display: "flex",
            height: "100%",
            overflow: "scroll",
          }}>
          <Card
            sx={{
              height: "86%",
              backgroundColor: theme.palette.primary.main,
              padding: "2% 0",
              overflow: "hidden",
            }}>
            {diasDeLaSemana.map((dia, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    height: "calc(100% / 7)",
                    minHeight: "9ch",
                    padding: "5px",
                  }}>
                  <Card
                    sx={{
                      transform: "rotate(270deg)",
                      padding: "2px",
                      borderRadius: "5px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    {dia}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "0",
                        backgroundColor: "pink",
                        opacity: 0.5,
                        height: "100%",
                        width: "50%",
                        padding: "2px",
                      }}></Box>
                    <Box>
                      50%
                      <Tooltip title={`Estadísticas del día ${dia}`} arrow>
                        <IconButton
                          sx={{
                            color: theme.palette.primary.main,
                          }}
                          // onClick={() => handleOpenModalStats(salon)}
                          edge="end">
                          <QueryStatsRoundedIcon sx={{ fontSize: "1.7vh" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Card>
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
