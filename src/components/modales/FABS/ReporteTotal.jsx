import React from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const ReporteTotal = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);

  let salones = contenedoresEstado.calendario;

  let rows = [];

  let diasFechas = [];

  Object.keys(Object.values(salones)[0].dias)
    .slice(0, 7)
    .forEach((x) => {
      diasFechas.push(x);
    });

  let columns = [
    {
      field: "dia",
      headerName: "Día de la semana",
      width: 150,
      renderCell: ({ row }) => {
        let [nombre, fecha] = row.dia.split("&");
        let [dia, mes] = fecha.split("/");

        return `${nombre} ${dia}/${mes}`;
      },
    },
    ...Object.keys(salones).map((salon, index) => ({
      field: salon,
      headerName: salon,
      width: 100,
      renderCell: (row) => {
        let salon = row.field;
        row[salon];
      },
    })),
    {
      field: "total",
      headerName: "Total",
      width: 150,
    },
  ];

  let rows7 = new Array(7);

  let nombreSalones = [];

  Object.keys(salones).forEach((salon) => {
    nombreSalones.push(salon);
  });

  rows7 = diasFechas.map((dia) => {
    let fullData = {
      dia,
      salones: nombreSalones.map((salon) => salon),
    };

    nombreSalones.forEach((salon) => {
      let dataXSalonXDia = salones[salon].dias[dia].contenido;

      fullData[salon] = dataXSalonXDia;
    });

    return fullData;
  });

  console.log(rows7);
  console.log(nombreSalones);
  console.log(columns);
  console.log(salones);

  return (
    <BasicModal titulo={"Reporte total"}>
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          height: "60vh",
          width: "max-content",
          maxWidth: "80vw",
        }}>
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={rows7}
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 7 },
            },
          }}
          columns={columns}
          getRowId={(row) => uuid()}
        />
      </Box>
    </BasicModal>
  );
};

export default ReporteTotal;
