import { v4 as uuid } from "uuid";
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
import Accion from "../MUIComponents/Accion";
import { useDispatch } from "react-redux";
import { setSalonSeleccionado } from "../../redux/slices/historySlice";
import DetallesSolicitud from "../modales/DetallesSolicitud";
import ModalDetallesAccion from "../modales/ModalDetallesAccion";
import EstadisticasDia from "../modales/EstadisticasDia";
import { deteleAccionCalendario } from "../../redux/slices/contenedoresSlice";

import { toast } from "react-toastify";

const Calendario = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [modalAbierto, setModalAbierto] = useState(null);
  const [estadisticasSalon, setEstadisticasSalon] = useState(null);
  const [estadisticasDia, setEstadisticasDia] = useState(null);

  const [solicitudAbierta, setSolicitudAbierta] = useState(null);
  const [accionAbierta, setAccionAbierta] = useState(null);

  const [dias, setDias] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  const salones = useSelector((state) => state.contenedores.calendario);
  const diasDeLaSemana = useSelector((state) => state.utils.diasDeLaSemana);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  useEffect(() => {
    setModalAbierto("seleccionadorDeFechas");
  }, []);

  let fechasSoloDiaMes = [];
  fechasSeleccionadas.forEach((fecha) => {
    let arrFecha = fecha.split("/");
    fechasSoloDiaMes.push(`${arrFecha[0]}/${arrFecha[1]}`);
  });

  const handleMostrarModal = (modal) => {
    setModalAbierto(modal);
  };

  const handleOpenModalStatsSalon = (salon) => {
    setModalAbierto("estadisticasSalon");
    setEstadisticasSalon(salon);
  };

  const handleOpenModalStatsDia = (dia) => {
    setModalAbierto("estadisticasDia");
    setEstadisticasDia(dia);
  };

  const handleTabClick = (index, salon) => {
    setActiveTab(index);
    dispatch(setSalonSeleccionado(salon));
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

  let porcentajesDeOcupacion = [];
  if (fechasSeleccionadas[1]) {
    Object.values(salones[salonSeleccionadoEstado].dias).forEach(
      (dia, index) => {
        if (fechasSeleccionadas.includes(dia.fecha)) {
          porcentajesDeOcupacion.push(100 - Math.round(dia.horas * (100 / 24)));
        }
      }
    );
  }

  const handleOpenModalDetallesSolicitud = (solicitud) => {
    setSolicitudAbierta(solicitud);
    setModalAbierto("detallesSolicitud");
  };

  const handleOpenModalDetallesAccion = (accion) => {
    setAccionAbierta(accion);
    setModalAbierto("detallesAccion");
  };

  const handleDeleteAccion = (accion) => {
    dispatch(deteleAccionCalendario(accion));
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          {fechasSeleccionadas[1]
            ? `Programación del ${fechasSoloDiaMes[0]} al ${fechasSoloDiaMes[6]}`
            : "Selecciona una fecha para continuar"}

          <Box sx={{ display: "flex", gap: "20px" }}>
            <Tooltip title="Seleccionar fecha" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() => handleMostrarModal("seleccionadorDeFechas")}
                edge="end">
                <CalendarTodayRoundedIcon />
              </IconButton>
            </Tooltip>

            {/* <Tooltip title="Notificar cambios" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() => handleMostrarModal("notificarCambios")}
                edge="end">
                <BackupRoundedIcon />
              </IconButton>
            </Tooltip> */}

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
                  // minWidth: "150px",
                  padding: "0vh 2vw",
                  whiteSpace: "nowrap",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "2vh",
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
                    onClick={() => handleOpenModalStatsSalon(salon)}
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
                    // minHeight: "9ch",
                    padding: "5px",
                  }}>
                  <Tooltip title={`${fechasSoloDiaMes[index]}`} arrow>
                    <Card
                      sx={{
                        transform: "rotate(270deg)",
                        // padding: "2px",
                        borderRadius: "5px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "1.8vh",
                      }}>
                      {dia}
                      <Box
                        sx={{
                          position: "absolute",
                          top: "0",
                          backgroundColor:
                            porcentajesDeOcupacion[index] > 75
                              ? "red"
                              : porcentajesDeOcupacion[index] > 25
                              ? "#F9E078"
                              : "green",
                          opacity: 0.3,
                          height: "100%",
                          width: `${porcentajesDeOcupacion[index]}%`,
                          padding: "2px",
                        }}></Box>
                      <Box>
                        {`${
                          porcentajesDeOcupacion[index] > 0
                            ? porcentajesDeOcupacion[index]
                            : "0"
                        }%`}
                        <Tooltip title={`Estadísticas del día ${dia}`} arrow>
                          <IconButton
                            sx={{
                              color: theme.palette.primary.main,
                            }}
                            onClick={() =>
                              handleOpenModalStatsDia(
                                fechasSeleccionadas[index]
                              )
                            }
                            edge="end">
                            <QueryStatsRoundedIcon sx={{ fontSize: "1.7vh" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Tooltip>
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
                    overflow: "auto",
                  }}
                  key={salon}>
                  {Object.entries(dias).map(([diaNombre, diaInfo]) => {
                    const { contenido, fecha } = diaInfo;
                    let sieteDias = fechasSeleccionadas.slice(0, 7);
                    const fechaSeleccionada = sieteDias.includes(fecha);

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
                              // minHeight: "8ch",
                              backgroundColor: "white",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              padding: "0 10px",
                              gap: "10px",
                              overflow: "auto",
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
                                    <Box
                                      // sx={{ height: "45px" }}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}>
                                      {contenidoContenido.codigoNombre ? (
                                        <Solicitud
                                          solicitud={contenidoContenido}
                                          index={index}
                                          calendario
                                          handleOpenModalDetalles={
                                            handleOpenModalDetallesSolicitud
                                          }
                                        />
                                      ) : (
                                        <Accion
                                          accion={contenidoContenido}
                                          index={index}
                                          calendario
                                          handleOpenDetalles={
                                            handleOpenModalDetallesAccion
                                          }
                                          handleDeleteAccion={
                                            handleDeleteAccion
                                          }
                                        />
                                      )}
                                    </Box>
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
        onClose={() => {
          if (fechasSeleccionadas[1]) {
            setModalAbierto(null);
          } else {
            toast.error("Debes seleccionar una fecha para continuar");
          }
        }}>
        <SeleccionadorDeFechas onClose={() => setModalAbierto(null)} />
      </Modal>
      <Modal
        open={modalAbierto === "estadisticasDia"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasDia estadisticasDia={estadisticasDia} />
      </Modal>
      <Modal
        open={modalAbierto === "estadisticasGenerales"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasGenerales />
      </Modal>
      <Modal
        open={modalAbierto === "estadisticasSalon"}
        onClose={() => setModalAbierto(null)}>
        <EstadisticasSalon estadisticasSalon={estadisticasSalon} />
      </Modal>
      <Modal
        open={modalAbierto === "detallesSolicitud"}
        onClose={() => setModalAbierto(null)}>
        <DetallesSolicitud
          solicitudAbierta={solicitudAbierta}
          calendario={true}
        />
      </Modal>
      <Modal
        open={modalAbierto === "detallesAccion"}
        onClose={() => setModalAbierto(null)}>
        <ModalDetallesAccion accionAbierta={accionAbierta} />
      </Modal>
    </Box>
  );
};

export default Calendario;
