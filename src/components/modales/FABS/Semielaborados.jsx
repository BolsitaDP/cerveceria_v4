import React, { useEffect, useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const Semielaborados = () => {
  const [checkedTotales, setCheckedTotales] = useState(false);
  const [productoABuscar, setProductoABuscar] = useState([]);
  const [elementosEnGrid, setElementosEnGrid] = useState([]);
  const [diasSeleccionado, setDiasSeleccionado] = useState([]);

  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const nombreDiasDeLaSemana = useSelector(
    (state) => state.dates.nombreDiasDeLaSemana
  );
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

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
    let uniqueRows = new Set();

    // Iteramos sobre cada salón y sus días
    Object.values(contenedoresEstado.calendario).forEach((salon) => {
      Object.values(salon.dias).forEach((dia) => {
        // Verifica si la fecha está en sieteDias (fechas seleccionadas)
        if (sieteDias.includes(dia.fecha)) {
          if (dia.contenido.length > 0) {
            let contenidoDia = dia.contenido;

            contenidoDia.forEach((el) => {
              // Comprueba si el producto coincide con productoABuscar
              if (productoABuscar.includes(el.producto)) {
                diasSeleccionado.forEach((diaSel) => {
                  nombreDiasDeLaSemana.forEach((nombre) => {
                    if (
                      diaSel === nombre &&
                      el.fecha.split("&")[0] === diaSel
                    ) {
                      uniqueRows.add(el);
                    }
                  });
                });
              }
            });
          }
        }
      });
    });

    // Convertimos el Set a un array y actualizamos el estado
    setElementosEnGrid(Array.from(uniqueRows));
  };

  const handleCheckedTotales = () => {
    setCheckedTotales(!checkedTotales);
  };

  useEffect(() => {
    handleChangeProduct(productoABuscar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productoABuscar, diasSeleccionado]);

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

  const uniqueRows = new Set();

  diasSeleccionado.forEach((dia) => {
    nombreDiasDeLaSemana.forEach((nombre) => {
      if (dia === nombre) {
        let diasDelSalon =
          contenedoresEstado.calendario[salonSeleccionadoEstado].dias;
        Object.values(diasDelSalon).forEach((diaDelSalon) => {
          sieteDias.forEach((fecha) => {
            if (diaDelSalon.fecha === fecha) {
              let cont = diaDelSalon.contenido;
              cont.forEach((c) => {
                if (c.fecha.split("&")[0] === dia) {
                  uniqueRows.add(c);
                }
              });
            }
          });
        });
      }
    });
  });

  let columns = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 450,
      renderCell: (params) => {
        if (params.row.codigoNombre) {
          return `${params.row.codigoNombre} - ${params.row.producto}`;
        }
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (params.row.cantidad) {
          return `${params.row.cantidad.toLocaleString("en-US")}`;
        }
      },
    },
    {
      field: "codigoFormula",
      headerName: "Semielaborado",
      flex: 1,
      minWidth: 250,
    },
  ];

  let columnsTotalesActivo = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 450,
      renderCell: (params) => {
        if (params.row.codigoNombre) {
          return `${params.row.codigoNombre} - ${params.row.producto}`;
        }
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (params.row.cantidad) {
          return `${params.row.cantidad.toLocaleString("en-US")}`;
        }
      },
    },
    {
      field: "codigoFormula",
      headerName: "Semielaborado",
      flex: 1,
      minWidth: 250,
    },
  ];

  return (
    <BasicModal titulo={"Reportes de semielaborados"}>
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
          getOptionLabel={(option) => option}
          sx={{
            minWidth: "30%",
            "& .MuiAutocomplete-tag": { flexWrap: "nowrap" },
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                sx={{ width: "100%" }}
                color="secondary"
                variant="standard"
                label="Producto"
              />
            );
          }}
        />

        <FormControl
          sx={{
            m: 1,
            minWidth: 200,
          }}
          size="small">
          <InputLabel id="seleccionDeDiaLabel">Selecciona los días</InputLabel>
          <Select
            labelId="seleccionDeDiaLabel"
            id="demo-multiple-name"
            multiple
            value={diasSeleccionado}
            onChange={(e) => setDiasSeleccionado(e.target.value)}
            input={<OutlinedInput label="Selecciona los días" />}
            // MenuProps={MenuProps}
          >
            {nombreDiasDeLaSemana.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          padding: "5px",
          // height: "60vh",
          // width: "60vw",
        }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={checkedTotales ? totales : elementosEnGrid}
            // rows={[]}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={checkedTotales ? columnsTotalesActivo : columns}
            // columns={[]}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Semielaborados;
