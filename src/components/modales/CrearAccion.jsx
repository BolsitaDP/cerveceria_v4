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
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useCallback } from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { useTheme } from "@emotion/react";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import { createAccion } from "../../redux/slices/contenedoresSlice";
import { useSelector } from "react-redux";
import postData from "../../requests/postData";

const CrearAccion = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [textoNombre, setTextoNombre] = useState("");
  const [minutosAccion, setMinutosAccion] = useState("");
  const [tipoAccion, setTipoAccion] = useState("");
  const [color, setColor] = useState("#000000");

  const acciones = useSelector((state) => state.contenedores.acciones);

  const handleChangeTextoNombre = (e) => {
    setTextoNombre(e.target.value);
  };

  const handleKeyDown = (event) => {
    // Evitar que se escriba la coma (,)
    if (event.key === "," || event.key === "Comma") {
      event.preventDefault();
    }
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
      setColor("#000000");
    }
    setTipoAccion(event.target.value);
  };

  const handleColorChange = (color) => {
    setColor(color);

    console.log(color);
  };

  const handleNuevaAccion = () => {
    if (tipoAccion !== "notas") {
      if (
        textoNombre &&
        textoNombre !== "" &&
        minutosAccion > 0 &&
        tipoAccion
      ) {
        let exists = acciones.find(
          (accion) => accion.nombreDeLaAccion === acciones.nombreDeLaAccion
        );

        if (!exists) {
          try {
            postData
              .postCrearAccion({
                idDnd: uuid(),
                duracion: parseFloat(minutosAccion),
                estado: 1,
                nombreDeLaAccion: textoNombre,
                tipo: tipoAccion,
                hexa: color.split("#")[1],
              })
              .then((res) => dispatch(createAccion(res)))
              .then(() => {
                toast.success("Actividad creada correctamente");
              });
          } catch (error) {
            toast.error("Ha ocurrido un error: " + error);
          }
        } else {
          toast.error("Ya existe una actividad con este mismo nombre");
        }
      } else {
        toast("La actividad debe tener nombre, duración y tipo");
      }
    } else {
      if (textoNombre && textoNombre !== "") {
        let exists = acciones.find(
          (accion) => accion.nombreDeLaAccion === acciones.nombreDeLaAccion
        );

        if (!exists) {
          try {
            postData
              .postCrearAccion({
                idDnd: uuid(),
                duracion: 0,
                estado: 1,
                nombreDeLaAccion: textoNombre,
                tipo: tipoAccion,
                hexa: color.split("#")[1],
              })
              .then((res) => dispatch(createAccion(res)))
              .then(() => {
                toast.success("Actividad creada correctamente");
              });
          } catch (error) {
            toast.error("Ha ocurrido un error: " + error);
          }
        } else {
          toast.error("Ya existe una actividad con este mismo nombre");
        }
      } else {
        toast("La actividad debe tener nombre");
      }
    }
  };

  const coloresPredefinidos = [
    "#FFB6C1",
    "#AEC6CF",
    "#98FF98",
    "#E6E6FA",
    "#FDFD96",
    "#FFDAB9",
    "#D8BFD8",
    "#AFEEEE",
    "#F08080",
    "#FFFDD0",
    "#E0BBE4",
    "#FFDFD3",
    "#C1E1C1",
    "#F4C2C2",
    "#B39EB5",
    "#FFCCCB",
  ];

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
        <FormControl>
          <FormLabel>Tipo</FormLabel>
          <RadioGroup
            row
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
            <FormControlLabel
              value="horario"
              control={<Radio />}
              label="Horario"
            />
          </RadioGroup>
        </FormControl>
        <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <FormControl variant="outlined">
            <InputLabel>Nombre</InputLabel>
            <Input
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
          {tipoAccion !== "notas" && (
            <FormControl variant="outlined">
              <InputLabel>Duración</InputLabel>
              <Input
                type="number"
                disabled={tipoAccion === "notas"}
                min="0"
                sx={{ maxWidth: "200px" }}
                value={minutosAccion}
                onChange={handleChangeMinutos}
                onKeyDown={handleKeyDown}
                inputProps={{ min: 0 }}
                endAdornment={
                  <InputAdornment position="end">Horas</InputAdornment>
                }
                size="small"
                label="Solicitud a filtrar"
                variant="standard"
              />
            </FormControl>
          )}
        </Box>

        {tipoAccion !== "notas" && (
          <>
            Selecciona un color para la acción
            <FormControl
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "10px",
              }}>
              {coloresPredefinidos.map((color) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5px",
                      width: "max-content",
                    }}>
                    <Button
                      sx={{
                        backgroundColor: `${color}`,
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                      }}
                      onClick={() => handleColorChange(color)}></Button>
                  </Box>
                );
              })}
            </FormControl>
          </>
        )}

        {/* 
        <TextField
          label="Selecciona un color para la acción"
          type="color"
          value={color}
          onChange={handleColorChange}
          sx={{ width: "80%" }}
          InputLabelProps={{
            shrink: true,
          }}
        /> */}

        <Button
          variant="contained"
          sx={{ backgroundColor: `${color === "#000000" ? "#007aff" : color}` }}
          onClick={handleNuevaAccion}>
          Crear
        </Button>
      </Box>
    </BasicModal>
  );
};

export default CrearAccion;
