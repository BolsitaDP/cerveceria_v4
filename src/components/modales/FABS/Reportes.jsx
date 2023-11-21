import React, { useEffect, useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import {
  Box,
  Autocomplete,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

const Reportes = () => {
  const [productoABuscar, setProductoABuscar] = useState("");

  const [productosSelect, setProductosSelect] = useState([]);

  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const contenedoresEstado = useSelector((state) => state.contenedores);
  console.log(contenedoresEstado);

  const theme = useTheme();

  let productos = {};
  let nombresUnicos = new Set();

  useEffect(() => {
    Object.values(contenedoresEstado.calendario).forEach((salon) => {
      Object.values(salon.dias).forEach((dia) => {
        if (fechasSeleccionadas.includes(dia.fecha)) {
          dia.contenido.forEach((el) => {
            if (el.codigoNombre) {
              // TODO: Poner el array para las opciones
            }
          });
        }
      });
    });

    setProductosSelect(productos);

    console.log(productos);
  }, []);

  return (
    <BasicModal titulo={"Reportes por productos"}>
      <Box
        sx={{
          padding: "10px",
          width: "100%",
          minWidth: "max-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          backgroundColor: theme.palette.primary.main,
        }}>
        <Autocomplete
          disablePortal
          multiple
          value={productoABuscar}
          getOptionLabel={(option) => option.producto}
          onChange={(event, newValue) => {
            setProductoABuscar(newValue);
          }}
          id="combo-box-demo"
          options={productosSelect}
          sx={{ width: "50%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ width: "100%" }}
              color="secondary"
              variant="standard"
              label="Producto"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          height: "60vh",
          width: "60vw",
        }}></Box>
    </BasicModal>
  );
};

export default Reportes;
