import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { useTheme } from "@emotion/react";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import { useState } from "react";
import { toast } from "react-toastify";

const CrearAccion = () => {
  const theme = useTheme();

  const [textoNombre, setTextoNombre] = useState("");
  const [minutosAccion, setMinutosAccion] = useState(null);
  const [tipoAccion, setTipoAccion] = useState(null);

  const handleChangeTextoNombre = (e) => {
    setTextoNombre(e.target.value);
  };

  const handleChangeMinutos = (e) => {
    setMinutosAccion(e.target.value);
  };

  const deleteTextoNombre = () => {
    setTextoNombre("");
  };

  const handleChange = (event) => {
    setTipoAccion(event.target.value);
  };

  const handleNuevaAccion = () => {
    if (textoNombre && textoNombre !== "" && minutosAccion > 0 && tipoAccion) {
      // dispatch(
      //   createAccion({
      //     idDnd: uuid(),
      //     duracion: parseInt(minutosAccion),
      //     estado: 1,
      //     nombreDeLaAccion: textoNombre,
      //     tipo: tipoAccion,
      //   })
      // );
    } else {
      toast("La actividad debe tener nombre, duración y tipo");
    }
  };

  return (
    <BasicModal titulo={"Crear actividad"}>
      <FormControl variant="outlined">
        <InputLabel>Nombre</InputLabel>
        <Input
          id="standard-search"
          type="text"
          value={textoNombre}
          onChange={handleChangeTextoNombre}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                sx={{ color: theme.palette.primary.main }}
                onClick={deleteTextoNombre}
                edge="end">
                {textoNombre && (
                  <BackspaceRoundedIcon onClick={deleteTextoNombre} />
                )}
              </IconButton>
            </InputAdornment>
          }
          size="small"
          label="Solicitud a filtrar"
          variant="standard"
        />
      </FormControl>

      <FormControl variant="outlined">
        <InputLabel>Duración</InputLabel>
        <Input
          id="standard-search"
          type="number"
          min="0"
          value={minutosAccion}
          onChange={handleChangeMinutos}
          inputProps={{ min: 0 }}
          endAdornment={<InputAdornment position="end">Minutos</InputAdornment>}
          size="small"
          label="Solicitud a filtrar"
          variant="standard"
        />
      </FormControl>

      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Tipo</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          onChange={handleChange}
          value={tipoAccion}
          name="row-radio-buttons-group">
          <FormControlLabel
            value="operativa"
            control={<Radio />}
            label="Operativa"
          />
          <FormControlLabel
            value="correctiva"
            control={<Radio />}
            label="Correctiva"
          />
        </RadioGroup>
      </FormControl>

      <Button variant="contained" onClick={handleNuevaAccion}>
        Crear
      </Button>
    </BasicModal>
  );
};

export default CrearAccion;
