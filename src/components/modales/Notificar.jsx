import React, { useState } from "react";
import BasicModal from "../MUIComponents/BasicModal";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import CrearGrupo from "../MUIComponents/CrearGrupo";
import CrearMiembros from "../MUIComponents/CrearMiembros";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateVersion } from "../../redux/slices/historySlice";
import enviarPDFPorCorreo from "../../helpers/enviarPDFPorCorreo";
import obtenerDiasDeLaSemana from "../../helpers/obtenerDiasDeLaSemana";

import AddIcon from "@mui/icons-material/Add";
import ModificarGrupo from "../MUIComponents/ModificarGrupo";
import EliminarGrupo from "../MUIComponents/EliminarGrupo";

const Notificar = ({ exportar, columns, rows, titulo, origen }) => {
  const [grupoANotificar, setGrupoANotificar] = useState([]);

  const [openModal, setOpenModal] = useState(null);

  const gruposCreadosEstado = useSelector((state) => state.grupos.groups);
  const versionEstado = useSelector((state) => state.history.version);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  const handleOpenModal = (modal) => {
    setOpenModal(modal);
  };

  const dispatch = useDispatch();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGrupoANotificar(typeof value === "string" ? value.split(",") : value);
  };

  const handleEnviarCambiosDeVersion = () => {
    dispatch(updateVersion());
  };

  const handleEnviarProgramacion = () => {};

  let miembrosDeLosGrupos = new Set();

  grupoANotificar.forEach((grupo) => {
    if (gruposCreadosEstado.hasOwnProperty(grupo)) {
      let miembrosGrupo = gruposCreadosEstado[grupo].members;
      miembrosGrupo.forEach((miembro) => {
        miembrosDeLosGrupos.add(miembro.correo);
      });
    } else {
      console.error(`El grupo "${grupo}" no existe en gruposCreadosEstado`);
    }
  });

  miembrosDeLosGrupos = Array.from(miembrosDeLosGrupos);

  const handleEnviarPDF = async () => {
    try {
      await Promise.all(
        grupoANotificar.map(async (grupo) => {
          if (gruposCreadosEstado.hasOwnProperty(grupo)) {
            let idGrupo = gruposCreadosEstado[grupo].idLocal;
            await enviarPDFPorCorreo(columns, rows, origen, titulo, idGrupo);
          }
        })
      );
      console.log("Todas las notificaciones han sido enviadas correctamente.");
    } catch (error) {
      console.error("Ocurrió un error al enviar las notificaciones:", error);
    }
  };

  let sieteDias = fechasSeleccionadas.slice(0, 7);
  let fechasSemanaCompletas = obtenerDiasDeLaSemana(sieteDias);
  let semanaString = fechasSemanaCompletas.join("¬");

  const handleDescargarProgramacion = async () => {
    await enviarPDFPorCorreo(
      columns,
      rows,
      origen,
      titulo,
      "",
      "",
      semanaString,
      versionEstado
    );

    dispatch(updateVersion());
  };

  return (
    <>
      <BasicModal titulo="Notificar">
        <Box
          sx={{
            width: "50vw",
            padding: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "40px",
          }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "40px",
            }}>
            <ButtonGroup variant="contained">
              <Button
                onClick={() => handleOpenModal("crearGrupo")}
                sx={{ fontSize: "1.5vh" }}>
                Crear grupo
              </Button>

              <Button
                sx={{ fontSize: "1.5vh" }}
                onClick={() => handleOpenModal("modificarGrupo")}>
                Modificar grupo
              </Button>
              <Button
                sx={{ fontSize: "1.5vh" }}
                onClick={() => handleOpenModal("eliminarGrupo")}>
                Eliminar grupo
              </Button>
            </ButtonGroup>

            <Button
              sx={{ fontSize: "1.5vh" }}
              variant="contained"
              onClick={() => handleOpenModal("miembros")}>
              Crear miembro
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "40px",
            }}>
            <FormControl>
              <InputLabel>Grupos a notificar</InputLabel>
              <Select
                multiple
                value={grupoANotificar}
                sx={{ width: 250 }}
                onChange={handleChange}
                input={<OutlinedInput label="Grupos a notificar" />}>
                {Object.keys(gruposCreadosEstado).map((grupo) => (
                  <MenuItem key={grupo} value={grupo}>
                    {grupo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {grupoANotificar ? <Box>{miembrosDeLosGrupos.join(", ")}</Box> : ""}
          </Box>
          {exportar ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Button
                variant="contained"
                onClick={handleEnviarPDF}
                sx={{ fontSize: "1.5vh" }}>
                Enviar pdf
              </Button>

              <Button
                variant="contained"
                onClick={handleDescargarProgramacion}
                sx={{ fontSize: "1.5vh" }}>
                Descargar pdf
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Button variant="contained" onClick={handleEnviarProgramacion}>
                Enviar programación
              </Button>

              <Button
                variant="contained"
                onClick={handleEnviarCambiosDeVersion}>
                Enviar cambios de versión
              </Button>
            </Box>
          )}
        </Box>

        <Modal
          open={openModal === "crearGrupo"}
          onClose={() => setOpenModal(null)}>
          <CrearGrupo onClose={() => setOpenModal(null)} />
        </Modal>
        <Modal
          open={openModal === "modificarGrupo"}
          onClose={() => setOpenModal(null)}>
          <ModificarGrupo onClose={() => setOpenModal(null)} />
        </Modal>
        <Modal
          open={openModal === "eliminarGrupo"}
          onClose={() => setOpenModal(null)}>
          <EliminarGrupo onClose={() => setOpenModal(null)} />
        </Modal>
        <Modal
          open={openModal === "miembros"}
          onClose={() => setOpenModal(null)}>
          <CrearMiembros onClose={() => setOpenModal(null)} />
        </Modal>
      </BasicModal>
    </>
  );
};

export default Notificar;
