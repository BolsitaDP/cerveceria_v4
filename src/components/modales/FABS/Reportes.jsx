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
import { DataGrid, esES } from "@mui/x-data-grid";

const Reportes = () => {
  const [productoABuscar, setProductoABuscar] = useState([]);

  const [elementosEnGrid, setElementosEnGrid] = useState([]);

  // const [productosSelect, setProductosSelect] = useState([]);

  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const contenedoresEstado = useSelector((state) => state.contenedores);
  console.log(contenedoresEstado);

  const theme = useTheme();

  let productosNombres = [];

  Object.values(contenedoresEstado.calendario).forEach((salon) => {
    Object.values(salon.dias).forEach((dia) => {
      if (fechasSeleccionadas.includes(dia.fecha)) {
        if (dia.contenido.length > 0) {
          let contenidoDia = dia.contenido;
          contenidoDia.forEach((el) => {
            if (!productosNombres.includes(el.producto)) {
              productosNombres.push(el.producto);
            }
          });
        }
      }
    });
  });

  const handleChangeProduct = (newValue) => {
    console.log(newValue);

    let newRows = [];

    Object.values(contenedoresEstado.calendario).forEach((salon) => {
      Object.values(salon.dias).forEach((dia) => {
        if (fechasSeleccionadas.includes(dia.fecha)) {
          if (dia.contenido.length > 0) {
            let contenidoDia = dia.contenido;
            contenidoDia.forEach((el) => {
              if (productoABuscar.includes(el.producto)) {
                newRows.push(el);
              }
            });
          }
        }
      });
    });

    // TODO: El valor se settea en dos ticks, quizá haciendo que la lectura y discriminación se haga desde arriba (?)
    setElementosEnGrid(newRows);
  };

  useEffect(() => {
    handleChangeProduct(productoABuscar);
  }, [productoABuscar]);

  console.log(elementosEnGrid);

  let columns = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "salonProgramado",
      headerName: "Salón programado",
      flex: 1,
      minWidth: 250,
    },
  ];

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
          maxHeight: "70px",
          backgroundColor: theme.palette.primary.main,
        }}>
        <Autocomplete
          disablePortal
          multiple
          value={productoABuscar}
          onChange={(event, newValue) => {
            setProductoABuscar(newValue);
            handleChangeProduct(newValue);
          }}
          id="combo-box-demo"
          options={productosNombres}
          sx={{
            minWidth: "50%",
            "& .MuiAutocomplete-tag": { flexWrap: "nowrap" },
          }}
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
          display: "flex",
          minHeight: "180px",
          height: "50vh",
          width: "100%",
          // height: "60vh",
          // width: "60vw",
        }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={elementosEnGrid}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Reportes;
