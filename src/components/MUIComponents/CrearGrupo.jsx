import React, { useState } from "react";
import BasicModal from "./BasicModal";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";

import { createGroup } from "../../redux/slices/gruposSlice";
import { toast } from "react-toastify";
import postData from "../../requests/postData";

import { v4 as uuid } from "uuid";

const CrearGrupo = ({ onClose }) => {
  const [nombreGrupo, setNombreGrupo] = useState("");

  const dispatch = useDispatch();

  const handleCrearGrupo = () => {
    if (nombreGrupo !== " " && nombreGrupo) {
      const nuevoGrupo = {
        idLocal: uuid(),
        nombre: nombreGrupo,
        members: [],
      };

      try {
        postData.postCrearGrupos(nuevoGrupo).then(() => {
          dispatch(createGroup(nuevoGrupo));
          toast.success("Grupo creado exitosamente");
          onClose();
        });
      } catch (error) {
        toast.error("Ocurrió un error al crear el grupo" + error);
      }
    } else {
      toast.error("Debes agregar un nombre de grupo válido");
    }
  };

  return (
    <BasicModal titulo="Crear grupo">
      <Box
        sx={{
          width: "40vw",
          padding: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "40px",
        }}>
        <TextField
          id="standard-basic"
          label="Nombre de grupo"
          variant="standard"
          onChange={(e) => setNombreGrupo(e.target.value)}
        />
        <Button
          onClick={handleCrearGrupo}
          sx={{ width: "50%" }}
          variant="contained">
          Crear
        </Button>
      </Box>
    </BasicModal>
  );
};

export default CrearGrupo;
