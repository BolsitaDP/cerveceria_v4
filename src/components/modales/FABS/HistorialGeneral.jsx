import React from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import moment from "moment";
import { v4 as uuid } from "uuid";

const HistorialGeneral = () => {
  const theme = useTheme();

  const historialEstado = useSelector((state) => state.history.cambios);
  const editorEstado = useSelector((state) => state.history.editor);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  let rows = historialEstado;
  let columns = [
    {
      field: "tipoDeCambio",
      headerName: "Tipo de cambio",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => {
        if (row.tipoDeCambio === "Propiedad") {
          if (row.propiedad === "reqPara") {
            return "Fecha requerido";
          } else if (row.propiedad === "cantidad") {
            return "Cantidad";
          }
        }
      },
    },
    {
      field: "codigo",
      headerName: "Elemento",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "valorPrevio",
      headerName: "Valor previo",
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => {
        if (row.valorPrevio && typeof row.valorPrevio !== "object") {
          if (typeof row.valorPrevio === "number") {
            return row.valorPrevio;
          }
          let fecha = row.valorPrevio?.split("&");
          if (fecha[1]) {
            let [, dia] = fecha[0].split(" ");
            let [dd, mm] = fecha[1].split("/");

            return `${dia} - ${dd}/${mm}`;
          } else if (
            row.valorPrevio.toLowerCase() === "solicitudes" ||
            row.valorPrevio.toLowerCase() === "acciones"
          ) {
            if (row.valorPrevio.toLowerCase() === "solicitudes") {
              return "Pendiente por programar";
            } else if (row.valorPrevio.toLowerCase() === "acciones") {
              return "Actividades";
            }
          } else if (row.valorPrevio.indexOf("000Z") !== -1) {
            return moment(row.valorPrevio).utc().format("DD-MM-YYYY");
          }
        } else if (typeof row.valorPrevio === "object") {
          let fechaMoment = moment(row.valorPrevio.$d);
          return fechaMoment.format("DD-MM-YYYY");
        }
      },
    },
    {
      field: "valorNuevo",
      headerName: "Valor nuevo",
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => {
        if (row.valorNuevo && typeof row.valorNuevo !== "object") {
          if (typeof row.valorNuevo === "number") {
            return row.valorNuevo;
          }
          let fecha = row.valorNuevo?.split("&");
          if (fecha[1]) {
            let [, dia] = fecha[0].split(" ");
            let [dd, mm] = fecha[1].split("/");

            return `${dia} - ${dd}/${mm}`;
          } else if (
            row.valorNuevo.toLowerCase() === "solicitudes" ||
            row.valorNuevo.toLowerCase() === "acciones"
          ) {
            if (row.valorNuevo.toLowerCase() === "solicitudes") {
              return "Pendiente por programar";
            } else if (row.valorNuevo.toLowerCase() === "acciones") {
              return "Actividades";
            }
          } else if (row.valorNuevo.indexOf("000Z") !== -1) {
            return moment(row.valorNuevo).utc().format("DD-MM-YYYY");
          }
        } else if (typeof row.valorNuevo === "object") {
          let fechaMoment = moment(row.valorNuevo.$d);
          return fechaMoment.format("DD-MM-YYYY");
        }
      },
    },
    {
      field: "editor",
      headerName: "Editado por",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "fechaDelCambio",
      headerName: "Fecha",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "horaDelCambio",
      headerName: "Hora",
      flex: 1,
      minWidth: 100,
    },
    // {
    //   field: "version",
    //   headerName: "Versión",
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   field: "estado",
    //   headerName: "Estado",
    //   flex: 1,
    //   minWidth: 100,
    // },
  ];

  return (
    <BasicModal titulo={"Historial general"}>
      <Box
        sx={{
          height: "60vh",
          width: "70vw",
        }}>
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
              columns={columns}
              getRowId={(row) => uuid()}
            />
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
};

export default HistorialGeneral;
