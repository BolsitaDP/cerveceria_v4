import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import getFechaHoraActual from "../../helpers/getFechaHoraActual";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Modal,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import PreguntarProgramarDiferencia from "./PreguntarProgramarDiferencia";
import ArchiveIcon from "@mui/icons-material/Archive";

import PreguntarPartirSolicitudSinProgramar from "./PreguntarPartirSolicitudSinProgramar";
import HistorialSolicitud from "./HistorialSolicitud";
import BasicModal from "../MUIComponents/BasicModal";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import {
  agregarSolicitudesAlState,
  archivarSolicitud,
  deleteSolicitud,
  particionSolicitudSinProgramar,
  updatePropiedadesSolicitud,
} from "../../redux/slices/contenedoresSlice";
import { toast } from "react-toastify";
import postData from "../../requests/postData";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addToHistory } from "../../redux/slices/historySlice";

import { v4 as uuid } from "uuid";
import FormattedInputTypeNumber from "../FormattedInputTypeNumber";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import getData from "../../requests/getData";
import formatearFechaAFormatoDate from "../../helpers/fromatearFechaAFormatoDate";
import PreguntarBorrarSolicitud from "./PreguntarBorrarSolicitud";

const DetallesSolicitud = ({ solicitudAbierta, calendario, onClose }) => {
  console.log(solicitudAbierta);

  // Se crea una copia de la solicitud abierta
  let solicitudAbiertaEditable = JSON.parse(JSON.stringify(solicitudAbierta));

  // Creación de instancias
  const dispatch = useDispatch();
  const theme = useTheme();

  // Parseo de la fecha en string a ser legible para el componente de datepicker
  let fechaRequiereParseada = parse(
    solicitudAbiertaEditable.fechaRequiere,
    "dd/MM/yyyy",
    new Date()
  );

  // UseStates utilizados para los inputs y modales
  const [fechaRequeridoPara, setFechaRequeridoPara] = useState(
    fechaRequiereParseada
  );

  const [observacionesInput, setObservacionesInput] = useState(
    solicitudAbiertaEditable.observaciones
  );
  const [cantidadInput, setCantidadInput] = useState(
    solicitudAbiertaEditable.cantidad
  );
  const [valorPrevio, setValorPrevio] = useState(null);
  const [valueAPartir, setValueAPartir] = useState(null);
  const [editedPropertyState, setEditedPropertyState] = useState(null);
  const [openPartir, setOpenPartir] = useState(false);
  const [openBorrar, setOpenBorrar] = useState(false);
  const [solicitudAEliminar, setSolicitudAEliminar] = useState({});
  const [openHistory, setOpenHistory] = useState(false);
  const [openProgramarDiferencia, setOpenProgramarDiferencia] = useState(false);
  const [diferenciaAProgramar, setDiferenciaAProgramar] = useState(null);
  const [codigoSolicitud, setCodigoSolicitud] = useState(null);
  const [solNacional, setSolNacional] = useState(
    solicitudAbiertaEditable.tipoRequerimiento === "PRODUCCIÓN LOCAL"
      ? true
      : false
  );
  const [cantidadProducida, setCantidadProducida] = useState(
    solicitudAbiertaEditable.datosReales
  );

  // Son los datos obtenidos desde el state global
  const versionEstado = useSelector((state) => state.history.version);
  const editorEstado = useSelector((state) => state.history.editor);
  const destino = useSelector((state) => state.history.destino);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );
  const contenedoresEstado = useSelector((state) => state.contenedores);

  // Obtiene la fecha y hora actual
  let fechaHoraActual = getFechaHoraActual();

  // Setteadores de los useState utilizados para los inputs
  const handleCantidadChange = (e) => {
    let { value } = e.target;
    setCantidadInput(value);
  };
  const handleObservacionesChange = (e) => {
    let { value } = e.target;
    setObservacionesInput(value);
  };
  const handleNuevoProducido = (e) => {
    let { value } = e.target;
    setCantidadProducida(value);
  };

  // Controladores de modales
  const handleNoReprogramarLoFaltante = () => {
    console.log(diferenciaAProgramar);

    let { solicitudFaltante } = diferenciaAProgramar;

    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    let editedProperty = {
      codigo: solicitudAbiertaEditable.codigoNombre,
      tipoDeCambio: "No reprogramado",
      propiedad: "",
      valorPrevio: 0,
      valorNuevo: solicitudFaltante.cantidad,
      notificado: 0,
      fechaDelCambio: fechaActual,
      horaDelCambio: horaActual,
      version: versionEstado,
      editor: editorEstado,
      idElemento: solicitudAbiertaEditable.idDnd,
    };

    dispatch(addToHistory(editedProperty));

    setDiferenciaAProgramar(null);
    onClose();
  };

  // Función que muestra u oculta el historial de cambios de la solicitud
  const handleMostrarHistorial = (cod) => {
    setOpenHistory(!openHistory);
    setCodigoSolicitud(cod);
  };

  // Switch que controla el cambio de solicitud nacional o de exportación
  const handleChangeNacionalInternacional = (sol) => {
    setSolNacional(!solNacional);
    let solTIpoRequerimientoCambiado = {
      ...sol,
      tipoRequerimiento: solNacional ? "EXPORTACIÓN" : "PRODUCCIÓN LOCAL",
    };

    try {
      dispatch(updatePropiedadesSolicitud(solTIpoRequerimientoCambiado));
    } catch (error) {
      toast.error(
        "Ha ocurrido un error modificando el destino de la solicitud: " + error
      );
    }
  };

  // Función que elimina las solicitudes
  const handleBorrarSolicitud = (obj) => {
    setSolicitudAEliminar(obj);
    setOpenBorrar(true);
  };

  const onSiBorrar = () => {
    try {
      postData
        .postDeleteSolicitud(solicitudAEliminar)
        .then((res) => {
          dispatch(deleteSolicitud(solicitudAEliminar));
        })
        .then(() => {
          toast.success("Solicitud borrada exitosamente");
          onClose();

          let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

          let editedProperty = {
            codigo: solicitudAEliminar.codigoNombre,
            tipoDeCambio: "Eliminar solicitud",
            propiedad: "",
            valorPrevio:
              solicitudAEliminar.fecha === ""
                ? "solicitudes"
                : `${solicitudAEliminar.salonProgramado} ${solicitudAEliminar.fecha}`,
            valorNuevo: "Eliminada",
            notificado: 0,
            fechaDelCambio: fechaActual,
            horaDelCambio: horaActual,
            version: versionEstado,
            editor: editorEstado,
            idElemento: solicitudAEliminar.idDnd,
          };

          dispatch(addToHistory(editedProperty));
        });
    } catch (error) {
      toast.error("Ha ocurrido un error: " + error);
    }
  };
  const onNoBorrar = () => {
    setSolicitudAEliminar({});
    onClose();
  };

  // Función que devuelve lo que no se alcanzó a producir a la izquierda; esto dependiendo del input de «Producido»
  const handleReprogramarLoFaltante = () => {
    console.log(diferenciaAProgramar);

    let { solicitudFaltante } = diferenciaAProgramar;

    postData
      .postActualizarEstadoCopia(solicitudFaltante)
      .then((res) => {
        dispatch(agregarSolicitudesAlState(res.data));

        toast.success(
          `Se agregó una solicitud de ${res.data.cantidad.toLocaleString()} CJS a pendientes por programar`
        );

        let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

        let editedProperty = {
          codigo: solicitudAbiertaEditable.codigoNombre,
          tipoDeCambio: "Reprogramar faltante",
          propiedad: "",
          valorPrevio: 0,
          valorNuevo: res.data.cantidad,
          notificado: 0,
          fechaDelCambio: fechaActual,
          horaDelCambio: horaActual,
          version: versionEstado,
          editor: editorEstado,
          idElemento: solicitudAbiertaEditable.idDnd,
        };

        dispatch(addToHistory(editedProperty));
      })
      .then(() => {
        setDiferenciaAProgramar(null);
        onClose();
      })
      .catch((err) => {
        toast.error("No se ha podido agregar la solicitud: " + err);
      });
  };

  const onNoPartir = () => {
    // setCantidadInput(Number(valorPrevio) || solicitudAbierta.cantidad);
    // dispatch(addToHistory(editedPropertyState));
    // solicitudAbiertaEditable.cantidad = valueAPartir;
    // setValorPrevio(solicitudAbiertaEditable.cantidad);
    // dispatch(updatePropiedadesSolicitud(solicitudAbiertaEditable));
    setOpenPartir(false);
  };

  const onSiPartir = () => {
    let solicitudPartidaCopia = JSON.parse(
      JSON.stringify(solicitudAbiertaEditable)
    );
    let solicitudPartidaOrig = JSON.parse(
      JSON.stringify(solicitudAbiertaEditable)
    );
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

    // dispatch(particionSolicitudSinProgramar(solicitudAbiertaEditable));
    solicitudPartidaOrig.cantidad =
      solicitudAbiertaEditable.cantidad - valueAPartir;
    dispatch(updatePropiedadesSolicitud(solicitudPartidaOrig));
    setOpenPartir(false);

    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    let editedProperty = {
      codigo: solicitudAbiertaEditable.codigoNombre,
      tipoDeCambio: "División",
      propiedad: "cantidad",
      valorPrevio: solicitudAbiertaEditable.cantidad,
      valorNuevo: valueAPartir,
      notificado: 0,
      fechaDelCambio: fechaActual,
      horaDelCambio: horaActual,
      version: versionEstado,
      editor: editorEstado,
      idElemento: solicitudAbiertaEditable.idDnd,
    };

    dispatch(addToHistory(editedProperty));
  };

  // Función que obtiene de parámetro el objeto Date de JavaScript y lo convierte a un string con formato dd/mm/aaaa
  const formatearFecha = (date) => {
    return format(date, "dd/MM/yyyy");
  };

  const compararCantidadInicial = (cantidadSinComas) => {
    getData
      .getValidarCantidadProgramada({
        idPadre: solicitudAbiertaEditable.idPadre,
        cantidad: cantidadSinComas,
        idProducto: solicitudAbiertaEditable.id,
      })
      .then((res) => {
        if (res.data.status !== "ERROR") {
          return "OK";
        } else {
          // Expresión regular para encontrar todos los números en el mensaje
          const numeros = res.data.msg.match(/\d+/g);

          // Asignar los números a variables
          const cantidadOriginal = parseInt(numeros[0]);
          const cantidadActual = parseInt(numeros[1]);
          // const cantidadProducir = parseInt(numeros[2]);

          toast.error(
            `No puedes superar la cantidad inicial de la solicitud: ${Number(
              cantidadOriginal
            ).toLocaleString()} porque ya hay ${Number(
              cantidadActual
            ).toLocaleString()} programada`
          );
          return false;
        }
      });
    // .finally(() => onClose());
  };

  // Función para guardar las propiedades editadas
  const handleGuardarProp = ({ name, value }) => {
    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    let valueFechaFormateada;
    if (name === "fechaRequiere") {
      valueFechaFormateada = formatearFecha(value);
    }

    let editedProperty = {
      codigo: solicitudAbiertaEditable.codigoNombre,
      tipoDeCambio: "Propiedad",
      propiedad: name,
      valorPrevio: solicitudAbiertaEditable[name],
      valorNuevo: name === "fechaRequiere" ? valueFechaFormateada : value,
      notificado: 0,
      fechaDelCambio: fechaActual,
      horaDelCambio: horaActual,
      version: versionEstado,
      editor: editorEstado,
      idElemento: solicitudAbiertaEditable.idDnd,
    };

    if (name === "cantidad") {
      var cantidadSinComas = value.replace(/,/g, "");
    }

    if (
      name === "cantidad" &&
      Number(cantidadSinComas) - Number(solicitudAbiertaEditable.cantidad) >
        cantidadExtraPosible
    ) {
      toast(
        "No puedes superar la cantidad máxima restante para este día: " +
          parseInt(
            Number(solicitudAbiertaEditable.cantidad) +
              Number(cantidadExtraPosible)
          )
      );
    } else {
      if (
        !calendario &&
        name === "cantidad"
        // && compararCantidadInicial(cantidadSinComas)
      ) {
        if (Number(cantidadSinComas) < solicitudAbiertaEditable[name]) {
          setOpenPartir(true);
        } else {
          setCantidadInput(Number(cantidadSinComas));

          const updatedSolicitudEditada = { ...solicitudAbiertaEditable };
          updatedSolicitudEditada[name] = Number(cantidadSinComas);

          setValorPrevio(updatedSolicitudEditada[name]);
          dispatch(updatePropiedadesSolicitud(updatedSolicitudEditada));

          dispatch(addToHistory(editedProperty));
        }

        setValueAPartir(Number(cantidadSinComas));
        setEditedPropertyState(editedProperty);

        toast.success(
          `Cantidad modificada exitosamente de ${solicitudAbierta.cantidad} a ${cantidadInput}`
        );

        //TODO: Modificar la solicitudAbierta por la solicitudAbiertaEditable en el state
      } else if (
        calendario &&
        name === "cantidad" &&
        compararCantidadInicial(cantidadSinComas) === "OK"
      ) {
        setCantidadInput(Number(cantidadSinComas));

        const updatedSolicitudEditada = { ...solicitudAbiertaEditable };
        updatedSolicitudEditada[name] = Number(cantidadSinComas);

        setValorPrevio(updatedSolicitudEditada[name]);
        dispatch(updatePropiedadesSolicitud(updatedSolicitudEditada));

        dispatch(addToHistory(editedProperty));
      }
      if (name === "cantidad") {
      } else {
        if (name === "datosReales") {
          if (Number(solicitudAbiertaEditable.cantidad) > Number(value)) {
            let solicitudFaltante = JSON.parse(
              JSON.stringify(solicitudAbiertaEditable)
            );
            solicitudFaltante = {
              ...solicitudFaltante,
              cantidad: solicitudAbiertaEditable.cantidad - value,
              estado: "",
              salonProgramado: "",
              fecha: "",
            };

            setOpenProgramarDiferencia(true);
            setDiferenciaAProgramar({
              solicitudFaltante,
              solicitudAbiertaEditable,
            });
          }
        }

        dispatch(addToHistory(editedProperty));

        if (name === "fechaRequiere") {
          solicitudAbiertaEditable[name] = valueFechaFormateada;
        } else if (name === "datosReales") {
          solicitudAbiertaEditable[name] = value;
          solicitudAbiertaEditable.cantidad = value;
        } else {
          solicitudAbiertaEditable[name] = value;
        }

        // setValorPrevio(solicitudAbiertaEditable[name]);
        dispatch(updatePropiedadesSolicitud(solicitudAbiertaEditable));
      }

      // setValorPrevio(solicitudAbiertaEditable[name]);
    }
  };

  if (calendario) {
    if (destino && destino.length >= 1) {
      var [salonDest, diaDest] = destino;
    }

    var salon = null;
    if (solicitudAbiertaEditable.salonProgramado !== "") {
      salon = solicitudAbiertaEditable.salonProgramado;
    } else {
      salon = salonDest;
    }

    var dia = null;
    if (solicitudAbiertaEditable.fecha !== "") {
      dia = solicitudAbiertaEditable.fecha;
    } else {
      dia = diaDest;
    }

    let horasRestantesDia =
      contenedoresEstado.calendario[salon].dias[dia].horas;

    // let capacidadSalon = contenedoresEstado.calendario[ salon ].capacidadHora; -----
    let capacidadSalon;

    solicitudAbiertaEditable.velocidadesSalonProducto.forEach((linea) => {
      if (linea.Linea === salonSeleccionadoEstado) {
        // let minutosRestar = elementoArrastrado.cantidad / linea.Velocidad;
        capacidadSalon = linea.Velocidad;
      }
    });

    var cantidadExtraPosible = parseInt(
      capacidadSalon * (horasRestantesDia + 0.5)
    );
  }

  let fechaHoy = new Date();
  let fechaProgramada;

  if (solicitudAbiertaEditable.fecha !== "") {
    fechaProgramada = formatearFechaAFormatoDate(
      solicitudAbiertaEditable.fecha
    );
  }

  const handleArchivarSolicitud = (sol) => {
    let solicitudUpdatear = [];

    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    let objeto = {
      id: sol.id,
      estado: "Archivado",
      salonProgramado: "",
      fecha: "",
      orden: sol.orden,
      cantidad: sol.cantidad,
    };
    solicitudUpdatear.push(objeto);

    postData
      .postActualizarEstadoProducto(solicitudUpdatear)
      .then((res) => {
        dispatch(archivarSolicitud(sol));

        toast.success(`Solicitud ${sol.codigoNombre} archivada exitosamente`);

        let editedProperty = {
          codigo: sol.codigoNombre,
          tipoDeCambio: "Archivar",
          propiedad: "",
          valorPrevio: "solicitudes",
          valorNuevo: "Archivo",
          notificado: 0,
          fechaDelCambio: fechaActual,
          horaDelCambio: horaActual,
          version: versionEstado,
          editor: editorEstado,
          idElemento: sol.idDnd,
        };

        dispatch(addToHistory(editedProperty));
      })
      .catch((err) => {
        toast.error(
          `Ha ocurrido un error archivando la solicitud ${sol.codigoNombre}: ${err}`
        );
      })
      .finally(() => onClose());
  };

  return (
    <BasicModal
      titulo={
        <Box sx={{ width: "55vw", display: "flex" }}>
          <Box>
            <FormControlLabel
              label={solNacional ? "Local" : "Exportación"}
              control={
                <Switch
                  checked={solNacional}
                  color="secondary"
                  onChange={() =>
                    handleChangeNacionalInternacional(solicitudAbiertaEditable)
                  }
                />
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
            {solicitudAbiertaEditable.codigoNombre}
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: "20px",
              top: "5px",
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}>
            {!calendario && (
              <Tooltip title="Archivar solicitud" arrow>
                <IconButton
                  sx={{ color: theme.palette.primary.contrast }}
                  onClick={() =>
                    handleArchivarSolicitud(solicitudAbiertaEditable)
                  }
                  edge="end">
                  <ArchiveIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Mostrar historial de cambios" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() =>
                  handleMostrarHistorial(solicitudAbiertaEditable.codigoNombre)
                }
                edge="end">
                <HistoryIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar solicitud" arrow>
              <IconButton
                sx={{
                  color: theme.palette.primary.contrast,
                }}
                onClick={() => handleBorrarSolicitud(solicitudAbiertaEditable)}
                edge="end">
                <DeleteIcon
                  sx={{ color: solNacional ? "#FF5E5E" : "#5B7FDB" }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      }
      tipo={solNacional ? "nacional" : "internacional"}>
      {openHistory ? (
        <HistorialSolicitud solicitud={codigoSolicitud} />
      ) : (
        <Box
          sx={{
            width: "60vw",
            height: "70vh",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px 50px",
            overflow: "auto",
          }}>
          <TextField
            InputProps={{
              readOnly: true,
            }}
            label="Nombre"
            defaultValue={solicitudAbiertaEditable.producto}
            variant="standard"
          />

          <FormControl
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "row",
              gap: "0 5%",
              alignItems: "center",
            }}>
            <FormattedInputTypeNumber
              input={cantidadInput}
              handleInputChange={handleCantidadChange}
              label="Cantidad"
              name="cantidad"
            />
            <Tooltip title="Guardar" arrow>
              <IconButton
                // eslint-disable-next-line
                disabled={solicitudAbiertaEditable.cantidad == cantidadInput}
                sx={{
                  color: theme.palette.primary.main,
                }}
                onClick={() =>
                  handleGuardarProp({ name: "cantidad", value: cantidadInput })
                }
                edge="end">
                <SaveIcon />
              </IconButton>
              <span></span>
            </Tooltip>
          </FormControl>

          <TextField
            InputProps={{
              readOnly: true,
            }}
            label="País destino"
            defaultValue={solicitudAbiertaEditable.paisDestino}
            variant="standard"
          />

          <FormControl
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "row",
              gap: "0 5%",
              alignItems: "center",
            }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <DatePicker
                sx={{ width: "80%" }}
                label="Requerido para"
                value={fechaRequeridoPara}
                onChange={(newValue) => {
                  setFechaRequeridoPara(newValue);
                }}
                name="fechaRequiere"
                format="dd/MM/yyyy"
              />
            </LocalizationProvider>
            <Tooltip title="Guardar" arrow>
              <IconButton
                disabled={
                  // eslint-disable-next-line
                  solicitudAbiertaEditable.fechaRequiere ==
                  formatearFecha(fechaRequeridoPara)
                }
                sx={{
                  color: theme.palette.primary.main,
                }}
                onClick={() =>
                  handleGuardarProp({
                    name: "fechaRequiere",
                    value: fechaRequeridoPara,
                  })
                }
                edge="end">
                <SaveIcon />
              </IconButton>
              <span></span>
            </Tooltip>
          </FormControl>

          <TextField
            InputProps={{
              readOnly: true,
            }}
            label="Programado"
            defaultValue={solicitudAbiertaEditable.cantidad.toLocaleString()}
            variant="standard"
          />

          <FormControl
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "row",
              gap: "0 5%",
              alignItems: "center",
            }}>
            <FormattedInputTypeNumber
              input={cantidadProducida}
              handleInputChange={handleNuevoProducido}
              label="Producido"
              name="datosReales"
              InputProps={{
                readOnly: !calendario,
                disabled: !calendario || fechaProgramada > fechaHoy,
              }}
            />
            <Tooltip title="Guardar" arrow>
              <IconButton
                disabled={
                  // eslint-disable-next-line
                  solicitudAbiertaEditable.datosReales == cantidadProducida
                }
                sx={{
                  color: theme.palette.primary.main,
                }}
                onClick={() =>
                  handleGuardarProp({
                    name: "datosReales",
                    value: cantidadProducida,
                  })
                }
                edge="end">
                <SaveIcon />
              </IconButton>
              <span></span>
            </Tooltip>
          </FormControl>

          <TextField
            label="Observaciones generales"
            multiline
            InputProps={{
              readOnly: true,
            }}
            rows={3}
            defaultValue={solicitudAbiertaEditable.observacionesGenerales}
            variant="standard"
          />

          <FormControl
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "row",
              gap: "0 5%",
              alignItems: "center",
            }}>
            <TextField
              label="Observaciones"
              multiline
              rows={3}
              sx={{ width: "80%" }}
              name="observaciones"
              onChange={handleObservacionesChange}
              value={observacionesInput}
            />
            <Tooltip title="Guardar" arrow>
              <IconButton
                disabled={
                  // eslint-disable-next-line
                  solicitudAbiertaEditable.observaciones == observacionesInput
                }
                sx={{
                  color: theme.palette.primary.main,
                }}
                onClick={() =>
                  handleGuardarProp({
                    name: "observaciones",
                    value: observacionesInput,
                  })
                }
                edge="end">
                <SaveIcon />
              </IconButton>
              <span></span>
            </Tooltip>
          </FormControl>

          <Accordion
            sx={{
              width: "90%",
            }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header">
              Más información
            </AccordionSummary>
            <AccordionDetails
              sx={{
                justifyContent: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px 50px",
              }}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Cantidad original"
                defaultValue={Number(
                  solicitudAbiertaEditable.cantidadOriginal
                ).toLocaleString()}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Marca"
                defaultValue={solicitudAbiertaEditable.marca}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Fórmula"
                defaultValue={solicitudAbiertaEditable.formula}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Volumen"
                defaultValue={solicitudAbiertaEditable.volumen}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Envase"
                defaultValue={solicitudAbiertaEditable.envase}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Empaque"
                defaultValue={solicitudAbiertaEditable.empaque}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Tapa"
                defaultValue={solicitudAbiertaEditable.tapa}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Fecha de producción"
                defaultValue={solicitudAbiertaEditable.fechaProduccion}
                variant="standard"
              />

              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Fecha de expiración"
                defaultValue={solicitudAbiertaEditable.fechaExpiración}
                variant="standard"
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <Modal open={openPartir} onClose={() => setOpenPartir(false)}>
        <PreguntarPartirSolicitudSinProgramar
          onNoPartir={() => onNoPartir()}
          onSiPartir={() => onSiPartir()}
        />
      </Modal>

      <Modal open={openBorrar} onClose={() => setOpenBorrar(false)}>
        <PreguntarBorrarSolicitud
          onNoBorrar={() => onNoBorrar()}
          onSiBorrar={() => onSiBorrar()}
        />
      </Modal>

      <Modal
        open={openProgramarDiferencia}
        onClose={() => setOpenProgramarDiferencia(false)}>
        <PreguntarProgramarDiferencia
          onNoProgramar={() => handleNoReprogramarLoFaltante()}
          onSiProgramar={() => handleReprogramarLoFaltante()}
          diferenciaAProgramar={diferenciaAProgramar}
        />
      </Modal>
    </BasicModal>
  );
};

export default DetallesSolicitud;
