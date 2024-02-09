import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const ReporteTotal = () => {
  const [switchColoresPorProductos, setSwitchColoresPorProductos] =
    useState(false);
  const [switchTamanoPequeno, setSwitchTamanoPequeno] = useState(false);

  const contenedoresEstado = useSelector((state) => state.contenedores);

  let salones = contenedoresEstado.calendario;

  let rows = [];

  let diasFechas = [];

  Object.keys(Object.values(salones)[0].dias)
    .slice(0, 7)
    .forEach((x) => {
      diasFechas.push(x);
    });

  let nombreSalones = [];

  Object.keys(salones).forEach((salon) => {
    nombreSalones.push(salon);
  });

  let columns = [
    {
      field: "dia",
      headerName: "Día de la semana",
      width: 150,
      renderCell: ({ row }) => {
        let [nombre, fecha] = row.dia.split("&");
        let [dia, mes] = fecha.split("/");

        return (
          <span style={{ fontSize: "8px" }}>{`${nombre} ${dia}/${mes}`}</span>
        );
      },
    },
    ...Object.keys(salones).map((salon, index) => ({
      field: salon,
      headerName: salon,
      width: 90,
      renderCell: (row) => {
        let salon = row.field;
        let contenido = row.row[salon];
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              margin: "5px 0",
              fontSize: "8px",
            }}>
            {contenido.map((sol, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    sol.tipoRequerimiento === "PRODUCCIÓN LOCAL"
                      ? "rgba(92, 101, 192, 0.4)"
                      : "rgba(240, 93, 103, 0.4)",
                  padding: "5px",
                  borderRadius: "5px",
                }}>
                {sol.producto} ({sol.codigoNombre})
                <br />
                <strong>
                  {sol.cantidad} {sol.unidadMedida}
                </strong>
              </div>
            ))}
          </div>
        );
      },
    })),
    {
      field: "total",
      headerName: "Total",
      width: 150,
      renderCell: ({ row }) => {
        // console.log(row);
      },
    },
  ];

  let rows7 = new Array(7);

  rows7 = diasFechas.map((dia, index) => {
    nombreSalones.map((salon) => console.log(salon));
    // El total se tiene que poner desde acá en un propiedad "total" que es la que se renderiza

    let fullData = {
      dia,
      salones: nombreSalones.map((salon) => salon),
      index,
      total: "s",
    };

    nombreSalones.forEach((salon) => {
      let dataXSalonXDia = salones[salon].dias[dia].contenido;

      fullData[salon] = dataXSalonXDia;
    });

    return fullData;
  });

  return (
    <BasicModal titulo={"Reporte total"}>
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          height: "80vh",
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
          getRowHeight={() => "auto"}
          columns={columns}
          getRowId={(row) => uuid()}
        />
      </Box>
    </BasicModal>
  );
};

export default ReporteTotal;
