import React, { useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { IconButton, Tooltip, Modal } from "@mui/material";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import PreguntarDevolverSolicitudes from "./modales/PreguntarDevolverSolicitudes";
import { useSelector } from "react-redux";
import postData from "../requests/postData";
import { useDispatch } from "react-redux";
import {
  agregarSolicitudesAlState,
  borrarSolicitudesDelState,
  deteleAccionCalendario,
} from "../redux/slices/contenedoresSlice";

const BtnDevolverSol = ({ id }) => {
  const [openPregunta, setOpenPregunta] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const salones = useSelector((state) => state.contenedores.calendario);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  const dispatch = useDispatch();

  const theme = useTheme();

  const handleDevolverSolicitudes = (re) => {
    const partes = re.split("|");
    const fechaC = partes[1];
    const fecha = fechaC.split("&");
    const fechaObjeto = new Date(fecha[1].split("/").reverse().join("-"));
    const fechaActual = new Date();

    if (fechaObjeto < fechaActual) {
      toast.error("No puedes devolver la planeación de días anteriores a hoy");
    } else {
      setOpenPregunta(true);
    }
  };

  const handleNoDevolver = () => {
    setOpenPregunta(false);
  };

  const handleSiDevolver = () => {
    setOpenPregunta(false);

    let [, fechaNombre] = id.split("|");

    let contenidoDia =
      salones[salonSeleccionadoEstado].dias[fechaNombre].contenido;

    // Objeto para realizar un seguimiento de las solicitudes por su "idPadre"
    let solicitudesPorIdPadre = {};
    let accionesAEliminar = [];
    let solicitudesAEliminar = [];

    contenidoDia.forEach((sol) => {
      if (sol.codigoNombre) {
        solicitudesAEliminar.push(sol);
        // Verifica si ya existe una solicitud con el mismo "idPadre"
        if (solicitudesPorIdPadre[sol.idPadre]) {
          // Si ya existe, suma la cantidad
          solicitudesPorIdPadre[sol.idPadre].cantidad += sol.cantidad;
        } else {
          // Si no existe, agrega la solicitud al objeto
          solicitudesPorIdPadre[sol.idPadre] = {
            ...sol,
          };
        }
      } else {
        accionesAEliminar.push(sol);
      }
    });

    // Convierte el objeto de solicitudes por "idPadre" en un array
    let arraySolicitudesAgrupadas = Object.values(solicitudesPorIdPadre);

    let arraySolicitudesAgrupadasSinFecha = arraySolicitudesAgrupadas.map(
      (sol) => ({
        ...sol,
        estado: "",
        fecha: "",
        salonProgramado: "",
      })
    );

    try {
      postData.postActualizarEstadoProducto(arraySolicitudesAgrupadasSinFecha);
      solicitudesAEliminar.forEach((sol) => {
        dispatch(borrarSolicitudesDelState(sol));
      });
      accionesAEliminar.forEach((acc) => {
        dispatch(deteleAccionCalendario(acc));
      });
      arraySolicitudesAgrupadasSinFecha.forEach((sol) => {
        dispatch(agregarSolicitudesAlState(sol));
      });
      toast.success("Día liberado correctamente");
    } catch (error) {
      toast.error("Error al liberar el día");
    }
  };

  useState(() => {
    const partes = id.split("|");
    const fechaC = partes[1];
    const fecha = fechaC.split("&");
    const fechaObjeto = new Date(fecha[1].split("/").reverse().join("-"));
    const fechaActual = new Date();
    setShowButton(fechaObjeto >= fechaActual);
  }, [id]);

  return (
    <>
      {showButton && (
        <Tooltip title="Devolver día" arrow>
          <IconButton
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={() => handleDevolverSolicitudes(id)}
            className="btnDevolverSolicitudes"
            edge="end">
            <ReplayIcon className="svgDevolverSolicitudes" />
          </IconButton>
        </Tooltip>
      )}

      <Modal open={openPregunta} onClose={() => setOpenPregunta(false)}>
        <PreguntarDevolverSolicitudes
          onNoDevolver={() => handleNoDevolver()}
          onSiDevolver={() => handleSiDevolver()}
          id={id}
        />
      </Modal>
    </>
  );
};

export default BtnDevolverSol;
