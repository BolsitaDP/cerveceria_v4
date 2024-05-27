import React, { useState } from "react";
import BasicModal from "./BasicModal";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import postData from "../../requests/postData";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { deleteMember } from "../../redux/slices/gruposSlice";

const ModificarGrupo = ({ onClose }) => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

  const gruposCreadosEstado = useSelector((state) => state.grupos.groups);

  const dispatch = useDispatch();

  const handleSelectedGroup = (e) => {
    setGrupoSeleccionado(e.target.value);
    console.log(e.target.value);
  };

  let miembrosDeLosGrupos = new Set();

  if (grupoSeleccionado) {
    let miembrosGrupo = gruposCreadosEstado[grupoSeleccionado].members;
    miembrosGrupo.forEach((miembro) => {
      miembrosDeLosGrupos.add(miembro);
    });
  }

  miembrosDeLosGrupos = Array.from(miembrosDeLosGrupos);

  const handleDelete = (miem) => {
    postData
      .postEliminarCorreo(miem)
      .then((res) => {
        dispatch(
          deleteMember({
            grupoSeleccionado,
            miembro: miem,
          })
        );

        toast.success(`Miembro ${miem.correo} eliminado correctamente`);
        onClose();
      })
      .catch((err) => {
        toast.error(
          `Ha ocurrido un error al eliminar miembro ${miem.correo}: ${err}`
        );
      });

    console.log(miem);
  };

  return (
    <BasicModal titulo="Modificar grupo">
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
        <Box sx={{ display: "flex", gap: "20px", flexDirection: "row" }}>
          <FormControl>
            <InputLabel>Grupo</InputLabel>
            <Select
              value={grupoSeleccionado}
              sx={{ width: 100 }}
              onChange={handleSelectedGroup}
              input={<OutlinedInput label="Grupo" />}>
              {Object.keys(gruposCreadosEstado).map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <TextField
            label="Modificar nombre de grupo"
            variant="standard"
            sx={{ width: "max-content" }}
            // onChange={(e) => setNombreGrupo(e.target.value)}
          /> */}
        </Box>
        <Box>
          <Stack direction="row" spacing={1}>
            {grupoSeleccionado &&
              miembrosDeLosGrupos.map((miem) => {
                return (
                  <Chip
                    label={miem.correo}
                    onDelete={() => handleDelete(miem)}
                  />
                );
              })}
          </Stack>
        </Box>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {/* <Button
            // onClick={handleCrearGrupo}
            // sx={{ width: "50%" }}
            variant="contained">
            Cancelar
          </Button> */}
          {/* <Button
            // onClick={handleCrearGrupo}
            sx={{ width: "50%" }}
            variant="contained">
            Modificar
          </Button> */}
        </Box>
      </Box>
    </BasicModal>
  );
};

export default ModificarGrupo;
