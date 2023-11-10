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
} from "@mui/material";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";

const PDFs = () => {
  const [tipoDeReporte, setTipoDeReporte] = useState("");

  const [diasSeleccionado, setDiasSeleccionado] = useState([]);
  const [salonesSeleccionados, setSalonesSeleccionados] = useState([]);

  const nombreDiasDeLaSemana = useSelector(
    (state) => state.dates.nombreDiasDeLaSemana
  );
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  let rows = [];

  let columns = [];

  let columnasReporteDiario = [
    {
      field: "producto",
      headerName: "Código",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "prod2ucto",
      headerName: "Producto",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "produ4cto",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "produ1cto",
      headerName: "Fecha programada",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "produ1scto",
      headerName: "Salón",
      flex: 1,
      minWidth: 150,
    },
  ];

  console.log(diasSeleccionado);
  console.log(contenedoresEstado);

  diasSeleccionado.forEach((dia) => {
    nombreDiasDeLaSemana.forEach((nombre, index) => {
      if (dia === nombre) {
        let diasDelSalon =
          contenedoresEstado.calendario[salonSeleccionadoEstado].dias;
        diasDelSalon.forEach((diaDelSalon) => {
          if (diaDelSalon.fecha === fechasSeleccionadas[index]) {
            console.log(fechasSeleccionadas[index]);
            let cont = diaDelSalon.contenido;
            cont.forEach((c) => {
              console.log(c);

              rows.push(c);
            });
          }
        });
      }
    });
  });

  console.log(rows);

  return (
    <BasicModal titulo={"Creación de PDF"}>
      <Box
        sx={{
          padding: "10px",
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
            onChange={(e) => setTipoDeReporte(e.target.value)}>
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            <MenuItem value="Diario">Diario</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, minWidth: 200 }}
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
          sx={{ m: 1, minWidth: 210 }}
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

        <Button variant="contained" disableElevation>
          Generar reporte
        </Button>
      </Box>

      <Box sx={{ height: "40vh", width: "100%", padding: "10px" }}>
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
              rows={rows}
              pageSizeOptions={[10]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              columns={
                tipoDeReporte === "Diario" ? columnasReporteDiario : columns
              }
              // getRowId={(row) => row.id || row.Id}
            />
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default PDFs;
