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
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import { createAccion } from "../../redux/slices/contenedoresSlice";

const CrearAccion = () => {
  const dispatch = useDispatch();
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
    if (event.target.value === "notas") {
      setMinutosAccion(null);
    }
    setTipoAccion(event.target.value);
  };

  const handleNuevaAccion = () => {
    if (tipoAccion !== "notas") {
      if (
        textoNombre &&
        textoNombre !== "" &&
        minutosAccion > 0 &&
        tipoAccion
      ) {
        dispatch(
          createAccion({
            idDnd: uuid(),
            duracion: parseInt(minutosAccion),
            estado: 1,
            nombreDeLaAccion: textoNombre,
            tipo: tipoAccion,
          })
        );
      } else {
        toast("La actividad debe tener nombre, duración y tipo");
      }
    } else {
      if (textoNombre && textoNombre !== "") {
        dispatch(
          createAccion({
            idDnd: uuid(),
            duracion: 0,
            estado: 1,
            nombreDeLaAccion: textoNombre,
            tipo: tipoAccion,
          })
        );
      } else {
        toast("La actividad debe tener nombre");
      }
    }
  };

  return (
    <BasicModal titulo={"Crear actividad"}>
      <Box
        sx={{
          width: "30vw",
          minWidth: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: "10%",
          gap: "2vh",
        }}>
        <FormControl variant="outlined">
          <InputLabel>Nombre</InputLabel>
          <Input
            id="standard-search"
            type="text"
            value={textoNombre}
            onChange={handleChangeTextoNombre}
            sx={{ maxWidth: "200px" }}
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
            disabled={tipoAccion === "notas"}
            min="0"
            sx={{ maxWidth: "200px" }}
            value={minutosAccion}
            onChange={handleChangeMinutos}
            inputProps={{ min: 0 }}
            endAdornment={<InputAdornment position="end">Horas</InputAdornment>}
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
            <FormControlLabel value="notas" control={<Radio />} label="Notas" />
          </RadioGroup>
        </FormControl>

        <Button variant="contained" onClick={handleNuevaAccion}>
          Crear
        </Button>
      </Box>
    </BasicModal>
  );
};

export default CrearAccion;
