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
import { useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Solicitud from "../MUIComponents/Solicitud";

const Calendario = () => {
  const theme = useTheme();

  const [modalAbierto, setModalAbierto] = useState(null);
  const [estadisticasSalon, setEstadisticasSalon] = useState(null);

  const [dias, setDias] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  const salones = useSelector((state) => state.contenedores.calendario);
  const diasDeLaSemana = useSelector((state) => state.utils.diasDeLaSemana);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  console.log(fechasSeleccionadas);

  let fechasSoloDiaMes = [];
  fechasSeleccionadas.forEach((fecha) => {
    let arrFecha = fecha.split("/");
    fechasSoloDiaMes.push(`${arrFecha[0]}/${arrFecha[1]}`);
  });

  const handleMostrarModal = (modal) => {
    setModalAbierto(modal);
  };

  const handleOpenModalStats = (salon) => {
    setModalAbierto("estadisticasSalon");
    setEstadisticasSalon(salon);
  };

  const handleTabClick = (index, salon) => {
    setActiveTab(index);
    // dispatch(setSalonSeleccionado(salon));
  };

  useEffect(() => {
    setDiasRenderizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechasSeleccionadas]);

  const setDiasRenderizar = () => {
    let diasSet = new Set();
    Object.values(salones).forEach((salon) => {
      let dias = salon.dias;
      Object.keys(dias).forEach((dia) => {
        let [, fecha] = dia.split("&");
        if (fechasSeleccionadas.includes(fecha)) {
          diasSet.add(dia);
        }
      });
    });
    let diasArr = Array.from(diasSet);
    setDias(diasArr);
  };

  const handleOpenModalDetallesSolicitud = (solicitud) => {};

  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          {fechasSeleccionadas
            ? `Programación del ${fechasSoloDiaMes[0]} al ${fechasSoloDiaMes[6]}`
            : "Calendario"}

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
            backgroundColor: theme.palette.primary.main,
            display: "flex",
            height: "100%",
            // overflow: "scroll",
          }}>
          <Box
            sx={{
              height: "86%",
              backgroundColor: theme.palette.primary.main,
              padding: "2% 0",
              justifyContent: " space-between",
              alignItems: "center",
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
          </Box>

          <Box
            sx={{
              height: "86%",
              backgroundColor: theme.palette.primary.main,
              // padding: "2% 0",
              width: "90%",
            }}>
            {Object.entries(salones).map((salon, index) => {
              let salonNombre = salon[0];
              // let salonId = salon[1].id;
              let dias = salon[1].dias;
              return (
                <Box
                  sx={{
                    display: index === activeTab ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                    padding: "1%",
                    gap: "1%",
                  }}
                  key={salon}>
                  {Object.entries(dias).map(([diaNombre, diaInfo]) => {
                    const { contenido, fecha } = diaInfo;
                    const fechaSeleccionada =
                      fechasSeleccionadas.includes(fecha);

                    if (!fechaSeleccionada) {
                      return null; // No se renderiza nada si la fecha no coincide
                    }

                    const diaConteidoOrganizado = Object.entries(contenido);

                    return (
                      <Droppable
                        droppableId={`${salonNombre}|${diaNombre}`}
                        key={`${salonNombre}|${diaNombre}`}
                        direction="horizontal">
                        {(provided, snapshot) => (
                          <Box
                            sx={{
                              width: "100%",
                              height: "calc(100% / 7)",
                              minHeight: "8ch",
                              backgroundColor: "white",
                              borderRadius: "5px",
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {diaConteidoOrganizado.map((contenido, index) => {
                              let contenidoId = null;
                              let contenidoContenido = null;
                              if (contenido[1].idDnd) {
                                contenidoId = contenido[1].idDnd;
                                contenidoContenido = contenido[1];
                              } else {
                                contenidoId = contenido[1].Id;
                                contenidoContenido = contenido[1];
                              }

                              return (
                                <Draggable
                                  draggableId={contenidoId}
                                  index={index}
                                  key={contenidoId}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}>
                                      {contenidoContenido.codigoNombre ? (
                                        <Solicitud
                                          solicitud={contenidoContenido}
                                          index={index}
                                          handleOpenModalDetalles={
                                            handleOpenModalDetallesSolicitud
                                          }
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
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
        open={modalAbierto === "estadisticasSalon"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasSalon />
      </Modal>
    </Box>
  );
};

export default Calendario;
