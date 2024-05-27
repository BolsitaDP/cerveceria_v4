import React, { useState } from "react";
import BasicModal from "./BasicModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createMember } from "../../redux/slices/gruposSlice";
import { toast } from "react-toastify";
import postData from "../../requests/postData";

import { v4 as uuid } from "uuid";

const CrearMiembros = ({ onClose }) => {
  const [correoMiembro, setCorreoMiembro] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState([]);

  const gruposCreadosEstado = useSelector((state) => state.grupos.groups);

  const dispatch = useDispatch();

  const handleCrearMiembro = () => {
    if (!correoMiembro.includes("@")) {
      toast.error("Debes agregar una dirección de correo válida");
      return;
    }

    if (grupoSeleccionado.length === 0) {
      toast.error("Debes asignar al menos un grupo");
      return;
    }

    try {
      grupoSeleccionado.forEach((grupo) => {
        let id = uuid();
        let groupId = gruposCreadosEstado[grupo].idLocal;

        postData
          .postCrearCorreos({
            groupId,
            correo: correoMiembro,
            id,
          })
          .then(() => {
            dispatch(
              createMember({
                correo: correoMiembro,
                grupos: grupoSeleccionado,
                id,
              })
            );

            toast.success("Miembro creado correctamente");
            onClose();
          });
      });
    } catch (error) {
      toast.error("Ocurrió un error creando el miembro");
      console.error(error);
    }
  };

  const handleSelectedGroup = (event) => {
    const {
      target: { value },
    } = event;
    setGrupoSeleccionado(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <BasicModal titulo="Crear miembro">
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
          label="Correo de miembro"
          variant="standard"
          onChange={(e) => setCorreoMiembro(e.target.value)}
        />
        <FormControl>
          <InputLabel>Asignar grupos</InputLabel>
          <Select
            multiple
            value={grupoSeleccionado}
            sx={{ width: 250 }}
            onChange={handleSelectedGroup}
            input={<OutlinedInput label="Asignar grupos" />}>
            {Object.keys(gruposCreadosEstado).map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleCrearMiembro}
          sx={{ width: "50%" }}
          variant="contained">
          Crear
        </Button>
      </Box>
    </BasicModal>
  );
};

export default CrearMiembros;
