import React from "react";
import { useSelector } from "react-redux";
import BasicModal from "../MUIComponents/BasicModal";
import { Box } from "@mui/material";

import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import convertirFecha from "../../helpers/convertirFechaLegible";

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
          return "Producción";
        } else {
          return (
            params.row.tipo.charAt(0).toUpperCase() + params.row.tipo.slice(1)
          );
        }
      },
    },
    {
      field: "tiempo",
      headerName: "Tiempo",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        if (params.row.nombreDeLaAccion) {
          return `${params.row.duracion || params.row.tiempo || "N/A"} 
          ${
            !params.row.duracion && !params.row.tiempo
              ? ""
              : params.row.duracion === 1 || params.row.tiempo === 1
              ? "hora"
              : "horas"
          } `;
        } else {
          let cantidad = params.row.cantidad;
          let velocidades = params.row.velocidadesSalonProducto;
          let velocidad;
          velocidades.forEach((vel) => {
            if (vel.Linea === salonSeleccionadoEstado) {
              velocidad = cantidad / vel.Velocidad;
            }
          });

          return `${velocidad.toFixed(2)} horas`;
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

  let fechaLegible = convertirFecha(
    `${estadisticasDia.split("/")[0]}/${estadisticasDia.split("/")[1]}`
  );

  return (
    <BasicModal
      titulo={`Estadísticas del día ${nombreDiasDeLaSemana[
        fechasSeleccionadas.indexOf(estadisticasDia)
      ].toLowerCase()}
       ${fechaLegible} en el salón ${salonSeleccionadoEstado} `}>
      <Box
        sx={{
          display: "flex",
          minHeight: "180px",
          height: "50vh",
          width: "100%",
        }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            // getRowHeight={() => "auto"}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={contenidoDia}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={columns}
            getRowId={(row) => row.idDnd || row.id || row.Id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default EstadisticasDia;
