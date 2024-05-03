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

const Notificar = () => {
  const [nombreGrupo, setNombreGrupo] = useState(null);
  const [correoMiembro, setCorreoMiembro] = useState(null);

  const [grupoANotificar, setGrupoANotificar] = React.useState([]);

  const [openModal, setOpenModal] = useState(null);

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

  return (
    <>
      <BasicModal titulo="Notificar">
        <Box
          sx={{
            width: "50vw",
            padding: "30px",
            display: "flex",
            justifyContent: "center",
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
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
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
            </FormControl>
          </Box>
        </Box>

        <Modal open={openModal === "grupos"} onClose={() => setOpenModal(null)}>
          <CrearGrupo />
        </Modal>
        <Modal
          open={openModal === "miembros"}
          onClose={() => setOpenModal(null)}>
          <CrearMiembros />
        </Modal>
      </BasicModal>
    </>
  );
};

export default Notificar;
