import { useTheme } from "@emotion/react";
import React, { useState } from "react";
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
import PreguntarPartirSolicitudSinProgramar from "./PreguntarPartirSolicitudSinProgramar";
import HistorialSolicitud from "./HistorialSolicitud";
import BasicModal from "../MUIComponents/BasicModal";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";
import {
  agregarSolicitudesAlState,
  deleteSolicitud,
  particionSolicitudSinProgramar,
  updatePropiedadesSolicitud,
} from "../../redux/slices/contenedoresSlice";
import { toast } from "react-toastify";
import postData from "../../requests/postData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { addToHistory } from "../../redux/slices/historySlice";

import { v4 as uuid } from "uuid";
import { NumericFormat } from "react-number-format";
import FormattedInputTypeNumber from "../FormattedInputTypeNumber";

const DetallesSolicitud = ({ solicitudAbierta, calendario, onClose }) => {
  console.log(solicitudAbierta);

  // Creación de instancias
  const dispatch = useDispatch();
  const theme = useTheme();

  // UseStates utilizados para los inputs y modales
  const [fechaRequeridoPara, setFechaRequeridoPara] = useState(
    solicitudAbierta.fechaRequiere
  );
  const [observacionesInput, setObservacionesInput] = useState(
    solicitudAbierta.observaciones
  );
  const [cantidadInput, setCantidadInput] = useState(solicitudAbierta.cantidad);
  const [valorPrevio, setValorPrevio] = useState(null);
  const [valueAPartir, setValueAPartir] = useState(null);
  const [editedPropertyState, setEditedPropertyState] = useState(null);
  const [openPartir, setOpenPartir] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openProgramarDiferencia, setOpenProgramarDiferencia] = useState(false);
  const [diferenciaAProgramar, setDiferenciaAProgramar] = useState(null);
  const [codigoSolicitud, setCodigoSolicitud] = useState(null);
  const [solNacional, setSolNacional] = useState(
    solicitudAbierta.tipoRequerimiento === "PRODUCCIÓN LOCAL" ? true : false
  );
  const [cantidadProducida, setCantidadProducida] = useState(
    solicitudAbierta.datosReales
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

  // Se crea una copia de la solicitud abierta
  const solicitudEditada = JSON.parse(JSON.stringify(solicitudAbierta));

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
    try {
      postData
        .postDeleteSolicitud(obj)
        .then((res) => {
          dispatch(deleteSolicitud(obj));
        })
        .then(() => {
          toast.success("Solicitud borrada exitosamente");
          onClose();
        });
    } catch (error) {
      toast.error("Ha ocurrido un error: " + error);
    }
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
    // solicitudEditada.cantidad = valueAPartir;
    // setValorPrevio(solicitudEditada.cantidad);
    // dispatch(updatePropiedadesSolicitud(solicitudEditada));
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

  const handleBlurred = () => {};

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
                  onChange={() =>
                    handleChangeNacionalInternacional(solicitudAbierta)
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
            {solicitudAbierta.codigoNombre}
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
            <Tooltip title="Mostrar historial de cambios" arrow>
              <IconButton
                sx={{ color: theme.palette.primary.contrast }}
                onClick={() =>
                  handleMostrarHistorial(solicitudAbierta.codigoNombre)
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
                onClick={() => handleBorrarSolicitud(solicitudAbierta)}
                edge="end">
                <DeleteIcon />
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
            defaultValue={solicitudAbierta.producto}
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
                sx={{
                  color: theme.palette.primary.main,
                }}
                // onClick={() => handleBorrarSolicitud(solicitudAbierta)}
                edge="end">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </FormControl>

          <TextField
            InputProps={{
              readOnly: true,
            }}
            label="País destino"
            defaultValue={solicitudAbierta.paisDestino}
            variant="standard"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Requerido para"
              value={dayjs(fechaRequeridoPara)}
              onBlur={handleBlurred}
              // variant="standard"
              onChange={(newValue) => {
                setValorPrevio(fechaRequeridoPara);
                setFechaRequeridoPara(newValue);
              }}
            />
          </LocalizationProvider>

          <TextField
            InputProps={{
              readOnly: true,
            }}
            label="Programado"
            defaultValue={solicitudAbierta.cantidad.toLocaleString()}
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
              }}
            />
            <Tooltip title="Guardar" arrow>
              <IconButton
                sx={{
                  color: theme.palette.primary.main,
                }}
                // onClick={() => handleBorrarSolicitud(solicitudAbierta)}
                edge="end">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </FormControl>

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

          <TextField
            label="Observaciones"
            multiline
            rows={3}
            name="observaciones"
            onChange={handleObservacionesChange}
            value={observacionesInput}
            onBlur={handleBlurred}
          />

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
