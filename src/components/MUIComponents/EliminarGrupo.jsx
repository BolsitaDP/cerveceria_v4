import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "./BasicModal";
import postData from "../../requests/postData";
import { useDispatch } from "react-redux";
import { deleteGroup } from "../../redux/slices/gruposSlice";
import { toast } from "react-toastify";

const EliminarGrupo = ({ onClose }) => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

  const dispatch = useDispatch();

  const gruposCreadosEstado = useSelector((state) => state.grupos.groups);

  const handleSelectedGroup = (e) => {
    setGrupoSeleccionado(e.target.value);
  };

  const handleDeletegroup = () => {
    postData
      .postEliminarGrupo({
        idLocal: grupoSeleccionado.idLocal,
        nombre: grupoSeleccionado.nombre,
      })
      .then(() => {
        dispatch(deleteGroup(grupoSeleccionado.nombre));
        toast.success(
          `Grupo ${grupoSeleccionado.nombre} eliminado correctamente`
        );
        onClose();
      })
      .catch((err) => {
        toast.error(
          `Ocurrió un error al eliminar el grupo ${grupoSeleccionado.nombre}: ${err}`
        );
      });
  };
  return (
    <BasicModal titulo="Eliminar grupo">
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
              {Object.values(gruposCreadosEstado).map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleDeletegroup}>
            Eliminar
          </Button>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default EliminarGrupo;
