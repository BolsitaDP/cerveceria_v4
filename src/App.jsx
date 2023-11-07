import { Box, ThemeProvider } from "@mui/material";
import "./App.css";
import { DragDropContext } from "react-beautiful-dnd";
import Solicitudes from "./components/contenedores/Solicitudes";
import Acciones from "./components/contenedores/Acciones";
import Calendario from "./components/contenedores/Calendario";
import { ToastContainer, toast } from "react-toastify";

import TemaClaro from "./components/temas/TemaClaro.jsx";
import { useEffect, useState } from "react";
import getData from "./requests/getData";
import { useDispatch } from "react-redux";
import {
  setAcciones,
  setAccionesInicial,
  setAccionesProgramadas,
  setSalones,
  setSalonesInicial,
  setSolicitudes,
  setSolicitudesInicial,
  setSolicitudesProgramadas,
  updateEstadoSolicitud,
} from "./redux/slices/contenedoresSlice";

import "react-toastify/dist/ReactToastify.css";
import MUIFloatingButton from "./components/MUIComponents/MUIFloatingButton";
import onDragEnd from "./components/OnDragEnd";
import { useSelector } from "react-redux";
import { addToHistory, setDestino } from "./redux/slices/historySlice";

function App() {
  const dispatch = useDispatch();

  const [crearCopia, setCrearCopia] = useState(false);
  const [data, setData] = useState(null);

  // Data de estado global
  const contenedores = useSelector((state) => state.contenedores);
  const editorEstado = useSelector((state) => state.history.editor);
  const versionEstado = useSelector((state) => state.history.version);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  useEffect(() => {
    const setInitialData = async () => {
      try {
        const [
          solicitudesSinProgramar,
          acciones,
          salones,
          historial,
          grupos,
          correos,
        ] = await Promise.all([
          getData.getProgramacionPendiente(),
          getData.getAcciones(),
          getData.getSalones(),
          getData.getHistorial(),
          getData.getGrupos(),
          getData.getCorreos(),
        ]);

        dispatch(setSolicitudesInicial(solicitudesSinProgramar.data));
        dispatch(setAccionesInicial(acciones.data));
        dispatch(setSalonesInicial(salones.data));
        // dispatch(setHistorialInicial(historial));
        // dispatch(setGruposInicial(grupos));
        // dispatch(setMiembrosInicial(correos));
      } catch (error) {
        toast.error("Error consultando los datos." + error);
      }
    };

    setInitialData().then((data) => console.log(data));
    // .then(() => setAppCargada(true))
    // .catch((error) => console.error("Error setting initial data:", error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatcher = (accion, data) => {
    if (accion === "addToHistory") {
      if (data.tipoDeCambio !== "Cambio de orden") {
        dispatch(addToHistory(data));
      }
    } else if (accion === "setSolicitudes") {
      dispatch(setSolicitudes(data));
      data = null;
    } else if (accion === "setAcciones") {
      dispatch(setAcciones(data));
      data = null;
    } else if (accion === "setSalones") {
      dispatch(setSalones(data));
      data = null;
    } else if (accion === "statusUpdaters") {
      dispatch(updateEstadoSolicitud(data));
      dispatch(setDestino(data));
    } else if (accion === "Creación elemento copia") {
      setCrearCopia(true);
      setData(data);
    }
  };

  useEffect(() => {
    getData.getProgramacionProgramado().then((response) => {
      let solicitudesFiltradas = [];
      response.data.forEach((sol) => {
        let [, solFecha] = sol.fecha.split("&");
        fechasSeleccionadas.forEach((fecha) => {
          if (fecha === solFecha) {
            solicitudesFiltradas.push(sol);
          }
        });
      });
      dispatch(setSolicitudesProgramadas(solicitudesFiltradas));
    });
    getData.getAccionesProgramadas().then((response) => {
      let accionesFiltradas = [];
      response.data.forEach((acc) => {
        let [, accFecha] = acc.fecha.split("&");
        fechasSeleccionadas.forEach((fecha) => {
          if (fecha === accFecha) {
            accionesFiltradas.push(acc);
          }
        });
      });
      dispatch(setAccionesProgramadas(accionesFiltradas));
      // as
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechasSeleccionadas]);

  const handleDragEnd = (result) => {
    onDragEnd(result, dispatcher, contenedores, editorEstado, versionEstado);
  };

  return (
    <div className="App">
      <ThemeProvider theme={TemaClaro}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}>
            <Box
              sx={{
                width: "35%",
                height: "100%",
                padding: "1%",
                display: "flex",
                flexDirection: "column",
                gap: "1%",
              }}>
              <Solicitudes />
              <Acciones />
            </Box>
            <Box
              sx={{
                width: "65%",
                height: "100%",
                padding: "1%",
              }}>
              <Calendario />
            </Box>
          </Box>
        </DragDropContext>

        <MUIFloatingButton />

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
