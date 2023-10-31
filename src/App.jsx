import { Box, ThemeProvider } from "@mui/material";
import "./App.css";
import { DragDropContext } from "react-beautiful-dnd";
import Solicitudes from "./components/contenedores/Solicitudes";
import Acciones from "./components/contenedores/Acciones";
import Calendario from "./components/contenedores/Calendario";
import { ToastContainer, toast } from "react-toastify";

import TemaClaro from "./components/temas/TemaClaro.jsx";
import { useEffect } from "react";
import getData from "./requests/getData";
import { useDispatch } from "react-redux";
import {
  setAccionesInicial,
  setSalonesInicial,
  setSolicitudesInicial,
} from "./redux/slices/contenedoresSlice";

import "react-toastify/dist/ReactToastify.css";
import MUIFloatingButton from "./components/MUIComponents/MUIFloatingButton";

function App() {
  const dispatch = useDispatch();

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

  const handleDragEnd = () => {};

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
