import React from "react";
import { useSelector } from "react-redux";
import BasicModal from "../MUIComponents/BasicModal";
import { Box } from "@mui/material";

import { DataGrid, esES } from "@mui/x-data-grid";

const EstadisticasDia = ({ estadisticasDia }) => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const nombreDiasDeLaSemana = useSelector(
    (state) => state.dates.nombreDiasDeLaSemana
  );

  let contenidoDia = [];

  let dias = contenedoresEstado.calendario[salonSeleccionadoEstado].dias;
  Object.values(dias).forEach((dia) => {
    if (dia.fecha === estadisticasDia) {
      dia.contenido.forEach((el) => {
        contenidoDia.push(el);
      });
    }
  });

  let columns = [
    {
      field: "producto",
      headerName: "Elemento",
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
      minWidth: 120,
      renderCell: (params) => {
        if (!params.row.cantidad) {
          return "-";
        }
      },
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        if (!params.row.tipo) {
          return "-";
        }
      },
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (!params.row.observaciones) {
          return "-";
        }
      },
    },
  ];

  return (
    <BasicModal
      titulo={`Estadísticas del día ${nombreDiasDeLaSemana[
        fechasSeleccionadas.indexOf(estadisticasDia)
      ].toLowerCase()}
        ${estadisticasDia.split("/")[0]}/${estadisticasDia.split("/")[1]} `}>
      <Box sx={{ display: "flex", minHeight: "180px", width: "100%" }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            getRowHeight={() => "auto"}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={contenidoDia}
            columns={columns}
            getRowId={(row) => row.id || row.Id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default EstadisticasDia;
