import React, { useState } from "react";
import BasicModal from "../MUIComponents/BasicModal";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import CrearGrupo from "../MUIComponents/CrearGrupo";
import CrearMiembros from "../MUIComponents/CrearMiembros";
import { useSelector } from "react-redux";

const Notificar = () => {
  const [nombreGrupo, setNombreGrupo] = useState(null);
  const [correoMiembro, setCorreoMiembro] = useState(null);

  const [grupoANotificar, setGrupoANotificar] = useState([]);

  const [openModal, setOpenModal] = useState(null);

  const gruposCreadosEstado = useSelector((state) => state.grupos.groups);

  const handleOpenModal = (modal) => {
    setOpenModal(modal);
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGrupoANotificar(typeof value === "string" ? value.split(",") : value);
  };

  const handleEnviarNotificacion = () => {};

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
            <Button
              variant="contained"
              onClick={() => handleOpenModal("grupos")}>
              Crear grupo
            </Button>
            <Button
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
            {/*  */}

            {/* <FormControl>
              <InputLabel>Grupos a notificar</InputLabel>
              <Select
                multiple
                value={grupoANotificar}
                sx={{ width: 250 }}
                onChange={handleChange}
                input={<OutlinedInput label="Grupos a notificar" />}>
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Box>
          <Button
            variant="contained"
            sx={{ width: "50%" }}
            onClick={handleEnviarNotificacion}>
            Notificar
          </Button>
        </Box>

        <Modal open={openModal === "grupos"} onClose={() => setOpenModal(null)}>
          <CrearGrupo onClose={() => setOpenModal(null)} />
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
