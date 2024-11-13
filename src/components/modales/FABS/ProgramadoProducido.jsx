import React from "react";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Box, FormControlLabel, Modal, Switch } from "@mui/material";
import { v4 as uuid } from "uuid";
import BasicModal from "../../MUIComponents/BasicModal";
import { useSelector } from "react-redux";

const ProgramadoProducido = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  const handleExportar = () => {};

  let newRows = [];

  let columns = [
    {
      field: "codigo",
      headerName: "Código",
      width: 100,
      renderCell: ({ row }) => {},
    },
    {
      field: "nombre",
      headerName: "Nombre producto",
      width: 250,
      renderCell: ({ row }) => {},
    },
    {
      field: "cantidadTotal",
      headerName: "Pedido total",
      width: 150,
      renderCell: ({ row }) => {
        let formattedQuant = row.cantidadTotal.toLocaleString();
        return formattedQuant;
      },
    },
    {
      field: "cantidadProgramada",
      headerName: "Programado",
      width: 150,
      renderCell: ({ row }) => {
        let formattedQuant = row.cantidadProgramada.toLocaleString();
        return formattedQuant;
      },
    },
    {
      field: "cantidadProducida",
      headerName: "Producido",
      width: 150,
      renderCell: ({ row }) => {
        let formattedQuant = row.cantidadProducida.toLocaleString();
        return formattedQuant;
      },
    },
  ];

  let mapaFilas = new Map();

  contenedoresEstado.pedidoTotal.forEach((sol) => {
    if (
      sieteDias.includes(sol.fechaRequiere) ||
      sieteDias.includes(sol.fecha.split("&")[1])
    ) {
      if (mapaFilas.has(sol.producto)) {
        let filaExistente = mapaFilas.get(sol.producto);
        filaExistente.cantidadTotal += sol.cantidad;
        filaExistente.cantidadProgramada += Number(sol.cantidadProgramada);
      } else if (mapaFilas.has(sol.codigoNombre)) {
        let filaExistente = mapaFilas.get(sol.codigoNombre);
        filaExistente.cantidadTotal += sol.cantidad;
        filaExistente.cantidadProgramada += Number(sol.cantidadProgramada);
      } else {
        let obj = {
          nombre: sol.producto,
          codigo: sol.codigoNombre,
          cantidadTotal: sol.cantidad,
          cantidadProducida: 0,
          cantidadProgramada: Number(sol.cantidadProgramada),
        };
        mapaFilas.set(sol.producto, obj);
        mapaFilas.set(sol.codigoNombre, obj);
        newRows.push(obj);
      }
    }
  });

  let contenidoTotal = [];

  Object.values(contenedoresEstado.calendario).forEach((salon) => {
    Object.values(salon.dias).forEach((dia) => {
      if (sieteDias.includes(dia.fecha)) {
        dia.contenido.forEach((sol) => {
          if (sol.codigoNombre) {
            contenidoTotal.push(sol);
          }
        });
      }
    });
  });

  newRows.forEach((row) => {
    contenidoTotal.forEach((sol) => {
      if (sol.codigoNombre === row.codigo) {
        row.cantidadPendiente =
          Number(row.cantidadPendiente) + Number(sol.cantidad);
      }
    });
  });

  return (
    <BasicModal
      titulo={"Requerido, programado y producido"}
      // exportar
      funcionAlDarClickExportar={handleExportar}>
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          height: "60vh",
          width: "60vw",
          maxWidth: "80vw",
          flexDirection: "column",
        }}>
        <Box sx={{ width: "100%", height: "90%" }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={newRows}
            pageSizeOptions={[8, 10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 8 },
              },
            }}
            getRowHeight={() => "auto"}
            columns={columns}
            getRowId={(row) => uuid()}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default ProgramadoProducido;
