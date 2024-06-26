import {
  Box,
  Card,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import { useTheme } from "@emotion/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import ordenarSolicitudes from "../../helpers/ordenarSolicitudes";
import { useDispatch } from "react-redux";
import filtrarObjetoAnidado from "../../helpers/filtrarObjetoAnidado";
import { setSolicitudes } from "../../redux/slices/contenedoresSlice";
import Solicitud from "../MUIComponents/Solicitud";
import DetallesSolicitud from "../modales/DetallesSolicitud";

const Solicitudes = () => {
  const theme = useTheme();

  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState("");
  const [textoFiltro, setTextoFiltro] = useState("");

  const [modalAbierto, setModalAbierto] = useState(null);
  const [solicitudAbierta, setSolicitudAbierta] = useState(null);

  const solicitudes = useSelector((state) => state.contenedores.solicitudes);
  // const versionEstado = useSelector((state) => state.history.version);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  const posiblesOrdenamientos = ["Fecha", "Cantidad"];

  const handleMostrarFiltro = () => {
    setFiltrosVisibles(!filtrosVisibles);
  };

  const deleteTextoFiltro = () => {
    setTextoFiltro("");
  };

  const handleChangeTextoFiltro = (e) => {
    setTextoFiltro(e.target.value);
  };

  const dispatch = useDispatch();

  const handleChangeOrden = (e) => {
    if (e.target.value !== "") {
      setOrdenamiento(e.target.value);
      let solicitudesOrdenadas = ordenarSolicitudes(
        solicitudes,
        e.target.value
      );
      dispatch(setSolicitudes(solicitudesOrdenadas));
    }
  };

  const handleOpenModalDetalles = (solicitud) => {
    setSolicitudAbierta(solicitud);
    setModalAbierto("detallesSolicitud");
  };

  const solicitudesFiltradas = Object.entries(solicitudes).reduce(
    (acc, [key, value]) => {
      if (filtrarObjetoAnidado(value, textoFiltro)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  const solicitudesARenderizar = {};

  for (const key in solicitudesFiltradas) {
    const objeto = solicitudesFiltradas[key];
    if (
      objeto.velocidadesSalonProducto?.some(
        (producto) => producto.Linea === salonSeleccionadoEstado
      )
    ) {
      solicitudesARenderizar[key] = objeto;
    }
  }

  return (
    <Box sx={{ height: "65%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo" sx={{ fontSize: "17px" }}>
          <p>Pendiente por programar</p>

          <Tooltip title="Abrir filtros" arrow>
            <IconButton
              sx={{ color: theme.palette.primary.contrast }}
              onClick={handleMostrarFiltro}
              edge="end">
              <FilterAltRoundedIcon />
            </IconButton>
          </Tooltip>
        </Card>

        <Card
          sx={{
            height: filtrosVisibles ? "12%" : "0px",
            transition: "0.3s ease all",
            padding: "0 10%",
            backgroundColor: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <FormControl variant="outlined" color="secondary">
            <InputLabel color="secondary">Filtrar solicitudes</InputLabel>
            <Input
              id="standard-search"
              type="text"
              color="secondary"
              value={textoFiltro}
              onChange={handleChangeTextoFiltro}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: theme.palette.primary.contrast }}
                    onClick={deleteTextoFiltro}
                    edge="end">
                    {textoFiltro && (
                      <BackspaceRoundedIcon onClick={deleteTextoFiltro} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              size="small"
              label="Solicitud a filtrar"
              variant="standard"
            />
          </FormControl>

          <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
            color="secondary">
            <InputLabel
              id="demo-simple-select-standard-label"
              color="secondary">
              Ordenar por
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              color="secondary"
              value={ordenamiento}
              onChange={handleChangeOrden}
              label="Age">
              <MenuItem value="">
                <em>No ordenar</em>
              </MenuItem>
              {posiblesOrdenamientos.map((filtro) => {
                return (
                  <MenuItem key={filtro} value={filtro}>
                    {filtro}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Card>

        <Droppable droppableId="solicitudes" key="solicitudes">
          {(provided) => (
            <Box
              sx={{
                padding: "10px",
                gap: "10px",
                display: "flex",
                flexDirection: "column",
                height: filtrosVisibles ? "48vh" : "55vh",
                overflow: "auto",
                transition: "0.3s ease all",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {Object.values(solicitudesARenderizar).map((solicitud, index) => {
                return (
                  <Draggable
                    draggableId={solicitud.idDnd}
                    index={index}
                    key={solicitud.idDnd}>
                    {(provided, snapshot) => (
                      <Box
                        // sx={{ height: "45px" }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <Solicitud
                          solicitud={solicitud}
                          key={index}
                          index={index}
                          handleOpenModalDetalles={handleOpenModalDetalles}
                        />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Card>
      <Modal
        open={modalAbierto === "detallesSolicitud"}
        onClose={() => setModalAbierto(null)}>
        <DetallesSolicitud
          onClose={() => setModalAbierto(null)}
          solicitudAbierta={solicitudAbierta}
        />
      </Modal>
    </Box>
  );
};

export default Solicitudes;
