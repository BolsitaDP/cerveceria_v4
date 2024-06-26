import React, { useEffect } from "react";
import BasicModal from "../MUIComponents/BasicModal";
import {
  Box,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import getFechaHoraActual from "../../helpers/getFechaHoraActual";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  agregarSolicitudesAlState,
  deleteSolicitud,
  particionSolicitudSinProgramar,
  updatePropiedadesSolicitud,
} from "../../redux/slices/contenedoresSlice";
import postData from "../../requests/postData";
import { addToHistory } from "../../redux/slices/historySlice";
import PreguntarPartirSolicitudSinProgramar from "./PreguntarPartirSolicitudSinProgramar";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { useTheme } from "@emotion/react";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { NumericFormat } from "react-number-format";
import HistorialSolicitud from "./HistorialSolicitud";
import getData from "../../requests/getData";
import PreguntarProgramarDiferencia from "./PreguntarProgramarDiferencia";

const DetallesSolicitud = ({ solicitudAbierta, calendario, onClose }) => {
  const dispatch = useDispatch();

  const theme = useTheme();

  // Crea un objeto de fecha con la fecha parseada

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

  const versionEstado = useSelector((state) => state.history.version);
  const editorEstado = useSelector((state) => state.history.editor);
  const destino = useSelector((state) => state.history.destino);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );
  const contenedoresEstado = useSelector((state) => state.contenedores);

  let fechaHoraActual = getFechaHoraActual();

  const solicitudEditada = JSON.parse(JSON.stringify(solicitudAbierta));

  // const formatoFecha = "DD/MM/YYYY";

  // console.log(dayjs(solicitudAbierta.fechaRequiere, { format: formatoFecha }));

  // useEffect(() => {
  //   setFechaRequeridoPara(
  //     dayjs(solicitudAbierta.fechaRequiere, { format: formatoFecha })
  //   );
  // }, []);

  // console.log(fechaRequeridoPara);
  // console.log(fechaRequeridoPara);
  // console.log(dayjs(solicitudAbierta.fechaRequiere));

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
      version: versionEstado,
      editor: editorEstado,
      idElemento: solicitudAbierta.idDnd,
    };

    if (name === "cantidad") {
      var numericValue = value.replace(/,/g, "");
    }

    if (
      name === "cantidad" &&
      Number(numericValue) - Number(solicitudAbierta.cantidad) >
        cantidadExtraPosible
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
          if (Number(numericValue) < Number(valorPrevio)) {
            setOpenPartir(true);
          }
        } else {
          if (Number(numericValue) < solicitudAbierta[name]) {
            setOpenPartir(true);
          } else {
            dispatch(addToHistory(editedProperty));
            solicitudEditada[name] = Number(numericValue);
            setValorPrevio(solicitudEditada[name]);
            dispatch(updatePropiedadesSolicitud(solicitudEditada));
          }
        }

        setValueAPartir(Number(numericValue));
        setEditedPropertyState(editedProperty);

        return;
      }
      dispatch(addToHistory(editedProperty));
      if (name === "cantidad") {
        getData
          .getValidarCantidadProgramada({
            idPadre: solicitudAbierta.idPadre,
            cantidad: numericValue,
          })
          .then((res) => {
            if (res.data.status !== "ERROR") {
              setCantidadInput(Number(numericValue));

              const updatedSolicitudEditada = { ...solicitudEditada };
              updatedSolicitudEditada[name] = Number(numericValue);
              // solicitudEditada[name] = Number(numericValue);

              setValorPrevio(updatedSolicitudEditada[name]);
              // if (destino && destino[1]) {
              //   solicitudEditada.fecha = destino[1];
              //   solicitudEditada.salonProgramado = destino[0];
              // }
              dispatch(updatePropiedadesSolicitud(updatedSolicitudEditada));
            } else {
              toast.error(
                "No puedes superar la cantidad inicial de la solicitud"
              );
            }
          })
          .finally(() => onClose());
      } else {
        if (name === "datosReales") {
          if (solicitudAbierta.cantidad > value) {
            let solicitudFaltante = JSON.parse(
              JSON.stringify(solicitudAbierta)
            );
            solicitudFaltante = {
              ...solicitudFaltante,
              cantidad: solicitudAbierta.cantidad - value,
              estado: "",
              salonProgramado: "",
              fecha: "",
            };

            setOpenProgramarDiferencia(true);
            setDiferenciaAProgramar({ solicitudFaltante, solicitudAbierta });
          }
        }

        solicitudEditada[name] = value;

        setValorPrevio(solicitudEditada[name]);
        // if (destino && destino[1]) {
        //   solicitudEditada.fecha = destino[1];
        //   solicitudEditada.salonProgramado = destino[0];
        // }
        dispatch(updatePropiedadesSolicitud(solicitudEditada));
      }

      setValorPrevio(solicitudEditada[name]);
      // if (destino && destino[1]) {
      //   solicitudEditada.fecha = destino[1];
      //   solicitudEditada.salonProgramado = destino[0];
      // }
      dispatch(updatePropiedadesSolicitud(solicitudEditada));
    }
  };

  const handleReprogramarLoFaltante = () => {
    console.log(diferenciaAProgramar);

    let { solicitudFaltante } = diferenciaAProgramar;

    postData
      .postActualizarEstadoCopia(solicitudFaltante)
      .then((res) => {
        console.log(res);

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

  const handleNoReprogramarLoFaltante = () => {
    setDiferenciaAProgramar(null);
    onClose();
  };

  useEffect(() => {
    if (
      (valorPrevio || solicitudAbierta.fechaRequiere) !== fechaRequeridoPara
    ) {
      let [fechaActual, horaActual] = fechaHoraActual.split(" - ");
      let editedProperty = {
        codigo: solicitudAbierta.codigoNombre,
        tipoDeCambio: "Propiedad",
        propiedad: "reqPara",
        valorPrevio: solicitudAbierta.fechaRequiere,
        valorNuevo: fechaRequeridoPara,
        notificado: 0,
        fechaDelCambio: fechaActual,
        horaDelCambio: horaActual,
        version: versionEstado,
        editor: editorEstado,
        idElemento: solicitudAbierta.idDnd,
      };
      // if (solicitudAbierta.fechaRequiere !== solicitudEditada.fechaRequiere) {
      dispatch(addToHistory(editedProperty));
      // }

      solicitudEditada.fechaRequiere = fechaRequeridoPara;
      // if (destino && destino[1]) {
      //   solicitudEditada.fecha = destino[1];
      //   solicitudEditada.salonProgramado = destino[0];
      // }

      dispatch(updatePropiedadesSolicitud(solicitudEditada));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaRequeridoPara]);

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
        capacidadSalon = linea.Velocidad;
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

  const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
    props,
    ref
  ) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          // Aquí puedes aplicar lógica adicional si es necesario
        }}
        thousandSeparator
        onBlur={handleBlurred} // Agregar el manejador onBlur personalizado
      />
    );
  });

  // const handleCalendarChange = (date) => {};

  const handleMostrarHistorial = (cod) => {
    setOpenHistory(!openHistory);
    setCodigoSolicitud(cod);
    // TODO: Recibo el id, necesito abrir el historial relacionado con ese id
  };

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

  const handleChangeNacionalInternacional = (sol) => {
    setSolNacional(!solNacional);
    let solTIpoRequerimientoCambiado = {
      ...sol,
      tipoRequerimiento: solNacional ? "EXPORTACIÓN" : "PRODUCCIÓN LOCAL",
    };

    try {
      dispatch(updatePropiedadesSolicitud(solTIpoRequerimientoCambiado));
      // postData
      //   .postActualizarPropiedades(solTIpoRequerimientoCambiado)
      //   .then((res) => {
      //   });
    } catch (error) {
      toast.error(
        "Ha ocurrido un error modificando el destino de la solicitud: " + error
      );
    }
  };

  const handleNuevoProducido = ({ e, solicitudAbierta }) => {
    let { value } = e.target;
    setCantidadProducida(Math.round(Number(value)));

    console.log(value);
    console.log(solicitudAbierta);
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
                sx={{ color: theme.palette.primary.contrast }}
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
            value={cantidadInput}
            onBlur={handleBlurred}
            onChange={handleCantidadChange}
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
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
              value={dayjs(fechaRequeridoPara)}
              onBlur={handleBlurred}
              variant="standard"
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
            label="Programado"
            defaultValue={solicitudAbierta.cantidad.toLocaleString()}
            variant="standard"
          />

          <TextField
            InputProps={{
              readOnly: !calendario,
            }}
            value={cantidadProducida}
            label="Producido"
            name="datosReales"
            defaultValue={solicitudAbierta.datosReales}
            onChange={(e) => handleNuevoProducido({ e, solicitudAbierta })}
            variant="standard"
            onBlur={handleBlurred}
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
