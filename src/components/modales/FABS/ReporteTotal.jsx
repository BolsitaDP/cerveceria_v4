import React from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const ReporteTotal = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  let salones = contenedoresEstado.calendario;

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  let rows = [];

  let diasFechas = [];

  Object.keys(Object.values(salones)[0].dias)
    .slice(0, 7)
    .forEach((x) => {
      diasFechas.push(x);
    });

  diasFechas.forEach((dia) => {
    Object.values(salones).forEach((salon) => {
      console.log(salon);
    });
  });

  let columns = [
    { field: "dia", headerName: "Día de la semana", width: 150 },
    ...Object.keys(salones).map((salon, index) => ({
      field: "salon_" + (index + 1),
      headerName: salon,
      width: 100,
    })),
  ];

  console.log(diasFechas);
  console.log(columns);
  console.log(rows);
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
          getRowId={(row) => row.id || row.Id}
        />
      </Box>
    </BasicModal>
  );
};

export default ReporteTotal;
