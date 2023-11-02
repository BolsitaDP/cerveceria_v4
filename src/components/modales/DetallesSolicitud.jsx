import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, Modal, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import getFechaHoraActual from "../../helpers/getFechaHoraActual";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  particionSolicitudSinProgramar,
  updatePropiedadesSolicitud,
} from "../../redux/slices/contenedoresSlice";
import postData from "../../requests/postData";
import { addToHistory } from "../../redux/slices/historySlice";
import PreguntarPartirSolicitudSinProgramar from "./PreguntarPartirSolicitudSinProgramar";

const DetallesSolicitud = ({ solicitudAbierta, calendario }) => {
  const dispatch = useDispatch();

  const [fechaRequeridoPara, setFechaRequeridoPara] = useState(
    solicitudAbierta.fechaRequiere
  );
  const [observacionesInput, setObservacionesInput] = useState(
    solicitudAbierta.observaciones
  );
  const [cantidadInput, setCantidadInput] = useState(solicitudAbierta.cantidad);

  console.log(solicitudAbierta.fechaRequiere);

  const [valorPrevio, setValorPrevio] = useState(null);
  const [valueAPartir, setValueAPartir] = useState(null);
  const [editedPropertyState, setEditedPropertyState] = useState(null);
  const [openPartir, setOpenPartir] = useState(false);

  const versionEstado = useSelector((state) => state.history.version);
  const editorEstado = useSelector((state) => state.history.editor);
  const destino = useSelector((state) => state.history.destino);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );
  const contenedoresEstado = useSelector((state) => state.contenedores);

  let fechaHoraActual = getFechaHoraActual();

  const solicitudEditada = JSON.parse(JSON.stringify(solicitudAbierta));

  const handleCantidadChange = (e) => {
    let { value } = e.target;
    setCantidadInput(Math.round(Number(value)));
  };
  const handleObservacionesChange = (e) => {
    let { value } = e.target;
    setObservacionesInput(value);
  };

  const handleBlurred = (e) => {
    let { name, value } = e.target;
    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");
    let editedProperty = {
      codigo: solicitudAbierta.codigoNombre,
      tipoDeCambio: "Propiedad",
      propiedad: name,
      valorPrevio: valorPrevio || solicitudAbierta[name],
      valorNuevo: value,
      notificado: 0,
      fechaDelCambio: fechaActual,
      horaDelCambio: horaActual,
      versionDelCambio: versionEstado,
      editor: editorEstado,
    };

    if (
      name === "cantidad" &&
      Number(value) - Number(solicitudAbierta.cantidad) > cantidadExtraPosible
    ) {
      toast(
        "No puedes superar la cantidad máxima restante para este día: " +
          parseInt(
            Number(solicitudAbierta.cantidad) + Number(cantidadExtraPosible)
          )
      );
      // throw new Error();
    } else {
      if (!calendario && name === "cantidad") {
        if (valorPrevio) {
          if (Number(value) < Number(valorPrevio)) {
            setOpenPartir(true);
          }
        } else {
          if (Number(value) < solicitudAbierta[name]) {
            setOpenPartir(true);
          } else {
            dispatch(addToHistory(editedProperty));
            solicitudEditada[name] = value;
            setValorPrevio(solicitudEditada[name]);
            dispatch(updatePropiedadesSolicitud(solicitudEditada));
          }
        }

        setValueAPartir(value);
        setEditedPropertyState(editedProperty);

        return;
      }
      dispatch(addToHistory(editedProperty));
      solicitudEditada[name] = value;
      setValorPrevio(solicitudEditada[name]);
      // if (destino && destino[1]) {
      //   solicitudEditada.fecha = destino[1];
      //   solicitudEditada.salonProgramado = destino[0];
      // }
      dispatch(updatePropiedadesSolicitud(solicitudEditada));
    }
  };

  if (calendario) {
    if (destino && destino.length >= 1) {
      var [salonDest, diaDest] = destino;
    }

    var salon = null;
    if (solicitudAbierta.salonProgramado !== "") {
      salon = solicitudAbierta.salonProgramado;
    } else {
      salon = salonDest;
    }

    var dia = null;
    if (solicitudAbierta.fecha !== "") {
      dia = solicitudAbierta.fecha;
    } else {
      dia = diaDest;
    }

    let horasRestantesDia =
      contenedoresEstado.calendario[salon].dias[dia].horas;

    // let capacidadSalon = contenedoresEstado.calendario[ salon ].capacidadHora; -----
    let capacidadSalon;

    solicitudAbierta.velocidadesSalonProducto.forEach((linea) => {
      if (linea.Linea === salonSeleccionadoEstado) {
        // let minutosRestar = elementoArrastrado.cantidad / linea.Velocidad;
        capacidadSalon = linea.Velocidad * 60;
      }
    });

    var cantidadExtraPosible = parseInt(capacidadSalon * horasRestantesDia);
  }

  const onNoPartir = () => {
    // setCantidadInput(Number(valorPrevio) || solicitudAbierta.cantidad);
    dispatch(addToHistory(editedPropertyState));
    solicitudEditada.cantidad = valueAPartir;
    setValorPrevio(solicitudEditada.cantidad);
    dispatch(updatePropiedadesSolicitud(solicitudEditada));
    setOpenPartir(false);
  };

  const onSiPartir = () => {
    let solicitudPartidaCopia = JSON.parse(JSON.stringify(solicitudEditada));
    let solicitudPartidaOrig = JSON.parse(JSON.stringify(solicitudEditada));
    solicitudPartidaCopia.cantidad = valueAPartir;
    try {
      postData.postActualizarEstadoCopia(solicitudPartidaCopia).then((res) => {
        let objResuesta = JSON.parse(JSON.stringify(res.data));
        objResuesta.idDnd = uuid();
        dispatch(particionSolicitudSinProgramar(objResuesta));
      });
    } catch (error) {
      toast.error(
        "Ha ocurrido un error creando la copia de la solicitud: " + error
      );
    }

    // dispatch(particionSolicitudSinProgramar(solicitudEditada));
    solicitudPartidaOrig.cantidad = solicitudAbierta.cantidad - valueAPartir;
    // setValorPrevio(solicitudEditada.cantidad);
    dispatch(updatePropiedadesSolicitud(solicitudPartidaOrig));
    setOpenPartir(false);
  };

  return (
    <BasicModal
      titulo={solicitudAbierta.codigoNombre}
      tipo={
        solicitudAbierta.pais === "Guatemala" ? "nacional" : "internacional"
      }>
      <Box
        sx={{
          width: "60vw",
          height: "70vh",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0 50px",
          overflow: "auto",
        }}>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Nombre"
          defaultValue={solicitudAbierta.producto}
          variant="standard"
        />

        <TextField
          label="Cantidad"
          name="cantidad"
          // defaultValue={solicitudAbierta.cantidad}
          // variant="standard"value={Math.round(cantidadInput)}
          value={Math.round(cantidadInput)}
          onBlur={handleBlurred}
          onChange={handleCantidadChange}
          type="number"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Marca"
          defaultValue={solicitudAbierta.marca}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Fórmula"
          defaultValue={solicitudAbierta.formula}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Volumen"
          defaultValue={solicitudAbierta.volumen}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Envase"
          defaultValue={solicitudAbierta.envase}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Empaque"
          defaultValue={solicitudAbierta.empaque}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Tapa"
          defaultValue={solicitudAbierta.tapa}
          variant="standard"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Requerido para"
            value={fechaRequeridoPara}
            variant="standard"
            onChange={(newValue) => setFechaRequeridoPara(newValue)}
          />
        </LocalizationProvider>

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="País destino"
          defaultValue={solicitudAbierta.paisDestino}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Fecha de producción"
          defaultValue={solicitudAbierta.fechaProduccion}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Fecha de expiración"
          defaultValue={solicitudAbierta.fechaExpiración}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Salón"
          defaultValue={solicitudAbierta.salon}
          variant="standard"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          label="Versión"
          defaultValue={solicitudAbierta.version}
          variant="standard"
        />

        <TextField
          label="Observaciones"
          multiline
          rows={3}
          name="observaciones"
          onChange={handleObservacionesChange}
          value={observacionesInput}
          onBlur={handleBlurred}
        />

        <TextField
          label="Observaciones generales"
          multiline
          InputProps={{
            readOnly: true,
          }}
          rows={3}
          defaultValue={solicitudAbierta.observacionesGenerales}
          variant="standard"
        />
      </Box>

      <Modal open={openPartir} onClose={() => setOpenPartir(false)}>
        <PreguntarPartirSolicitudSinProgramar
          onNoPartir={() => onNoPartir()}
          onSiPartir={() => onSiPartir()}
        />
      </Modal>
    </BasicModal>
  );
};

export default DetallesSolicitud;
