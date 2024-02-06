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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";

const Reportes = () => {
  const [productoABuscar, setProductoABuscar] = useState([]);

  const [elementosEnGrid, setElementosEnGrid] = useState([]);

  const [checkedTotales, setCheckedTotales] = useState(false);

  // const [productosSelect, setProductosSelect] = useState([]);

  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const contenedoresEstado = useSelector((state) => state.contenedores);
  console.log(contenedoresEstado);

  const theme = useTheme();

  let productosNombres = [];

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  Object.values(contenedoresEstado.calendario).forEach((salon) => {
    Object.values(salon.dias).forEach((dia) => {
      if (sieteDias.includes(dia.fecha)) {
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
    let newRows = [];

    Object.values(contenedoresEstado.calendario).forEach((salon) => {
      Object.values(salon.dias).forEach((dia) => {
        if (sieteDias.includes(dia.fecha)) {
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

    setElementosEnGrid(newRows);
  };

  useEffect(() => {
    handleChangeProduct(productoABuscar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productoABuscar]);

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

  let columnsTotalesActivo = [
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
  ];

  const handleCheckedTotales = () => {
    setCheckedTotales(!checkedTotales);
  };

  const totales = [];

  elementosEnGrid.forEach((prod) => {
    const existingProduct = totales.find(
      (x) => x.codigoNombre === prod.codigoNombre
    );

    if (existingProduct) {
      existingProduct.cantidad += prod.cantidad;
    } else {
      totales.push({ ...prod });
    }
  });

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
          // backgroundColor: theme.palette.primary.main,
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
        <FormControlLabel
          control={
            <Switch checked={checkedTotales} onChange={handleCheckedTotales} />
          }
          label="Totales"
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
            slots={{ toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={checkedTotales ? totales : elementosEnGrid}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={checkedTotales ? columnsTotalesActivo : columns}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Reportes;
