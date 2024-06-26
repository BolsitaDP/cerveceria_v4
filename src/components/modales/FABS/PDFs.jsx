import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  FormControlLabel,
  Switch,
  Modal,
} from "@mui/material";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Notificar from "../Notificar";

const PDFs = () => {
  const [tipoDeReporte, setTipoDeReporte] = useState("");

  const [diasSeleccionado, setDiasSeleccionado] = useState([]);
  const [salonesSeleccionados, setSalonesSeleccionados] = useState([]);
  const [checkedTotales, setCheckedTotales] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(null);

  const nombreDiasDeLaSemana = useSelector(
    (state) => state.dates.nombreDiasDeLaSemana
  );
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  const handleChangeTipoDeReporte = (e) => {
    if (e.target.value !== "Diario") {
      setDiasSeleccionado([]);
    } else if (e.target.value !== "Semanal") {
      setSalonesSeleccionados([]);
    } else {
    }
    setTipoDeReporte(e.target.value);
  };

  let columasTotales = [
    {
      field: "codigoNombre",
      headerName: "Código",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.row.codigoNombre) {
          return "Actividad";
        }
      },
    },
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (!params.row.producto) {
          return params.row.nombreDeLaAccion;
        }
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad total",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.row.cantidad) {
          return "-";
        }
      },
    },
  ];

  let columnasReporteDiario = [
    {
      field: "codigoNombre",
      headerName: "Código",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.row.codigoNombre) {
          return "Actividad";
        }
      },
    },
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (!params.row.producto) {
          return params.row.nombreDeLaAccion;
        }
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params.row.cantidad) {
          return "-";
        }
      },
    },
    {
      field: "fecha",
      headerName: "Fecha programada",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let [nombre, fecha] = params.row.fecha.split("&");
        let [dia, mes] = fecha.split("/");
        return `${nombre} - ${dia}/${mes}`;
      },
    },
    {
      field: "salonProgramado",
      headerName: "Salón",
      flex: 1,
      minWidth: 150,
    },
  ];

  const handleCheckedTotales = () => {
    setCheckedTotales(!checkedTotales);
  };

  const uniqueRows = new Set();

  if (tipoDeReporte === "Diario") {
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
  } else if (tipoDeReporte === "Semanal") {
    salonesSeleccionados.forEach((salon) => {
      Object.values(contenedoresEstado.calendario[salon].dias).forEach(
        (dia) => {
          sieteDias.forEach((fecha) => {
            if (dia.fecha === fecha) {
              let cont = dia.contenido;
              cont.forEach((c) => {
                uniqueRows.add(c);
              });
            }
          });
        }
      );
    });
  } else if (tipoDeReporte === "General") {
    let salones = contenedoresEstado.calendario;

    Object.values(salones).forEach((salon) => {
      Object.values(salon.dias).forEach((dia) => {
        sieteDias.forEach((fecha) => {
          if (dia.fecha === fecha) {
            let cont = dia.contenido;
            cont.forEach((c) => {
              uniqueRows.add(c);
            });
          }
        });
      });
    });
  }

  const rows = Array.from(uniqueRows);

  const totales = [];

  rows.forEach((prod) => {
    const existingProduct = totales.find(
      (x) => x.codigoNombre === prod.codigoNombre
    );

    if (existingProduct) {
      existingProduct.cantidad += prod.cantidad;
    } else {
      totales.push({ ...prod });
    }
  });

  const handleExportar = () => {
    setModalAbierto("exportar");
  };

  return (
    <BasicModal
      titulo={"Creación de PDF"}
      exportar
      funcionAlDarClickExportar={handleExportar}>
      <Box
        sx={{
          padding: "10px",
          width: "70vw",
          minWidth: "max-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Reporte</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={tipoDeReporte}
            label="Reporte"
            onChange={handleChangeTipoDeReporte}>
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            <MenuItem value="Diario">Diario</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            m: 1,
            minWidth: 200,
            visibility: tipoDeReporte !== "Diario" ? "hidden" : "visible",
          }}
          size="small"
          disabled={tipoDeReporte !== "Diario"}>
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

        <FormControl
          sx={{
            m: 1,
            minWidth: 210,
            visibility: tipoDeReporte !== "Semanal" ? "hidden" : "visible",
          }}
          size="small"
          disabled={tipoDeReporte !== "Semanal"}>
          <InputLabel id="seleccionDeSalonLabel">
            Selecciona los salones
          </InputLabel>
          <Select
            labelId="seleccionDeSalonLabel"
            id="demo-multiple-name"
            multiple
            value={salonesSeleccionados}
            onChange={(e) => setSalonesSeleccionados(e.target.value)}
            input={<OutlinedInput label="Selecciona los salones" />}
            // MenuProps={MenuProps}
          >
            {Object.keys(contenedoresEstado.calendario).map((sal, index) => (
              <MenuItem
                key={index}
                value={sal}
                // style={getStyles(sal, personsal, theme)}
              >
                {sal}
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

        {/* <Button variant="contained" disableElevation>
          Generar reporte
        </Button> */}
      </Box>

      <Box sx={{ height: "50vh", width: "100%", padding: "10px" }}>
        <Box
          sx={{
            display: "flex",
            minHeight: "180px",
            height: "100%",
            width: "100%",
          }}>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              slots={{ toolbar: GridToolbar }}
              // getRowHeight={() => "auto"}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={checkedTotales ? totales : rows}
              pageSizeOptions={[10]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              columns={checkedTotales ? columasTotales : columnasReporteDiario}
              getRowId={(row) => row.id || row.Id}
            />
          </Box>
        </Box>
      </Box>
      <Modal
        open={modalAbierto === "exportar"}
        onClose={() => setModalAbierto(null)}>
        <Notificar
          exportar
          columns={checkedTotales ? columasTotales : columnasReporteDiario}
          rows={checkedTotales ? totales : rows}
          titulo="Reporte parcial"
        />
      </Modal>
    </BasicModal>
  );
};

export default PDFs;
