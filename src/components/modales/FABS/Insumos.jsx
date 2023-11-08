import React, { useEffect, useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const Insumos = () => {
  const [insumos, setInsumos] = useState(null);

  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  let soliciudes = [];

  let dias = contenedoresEstado.calendario[salonSeleccionadoEstado].dias;
  Object.values(dias).forEach((dia) => {
    fechasSeleccionadas.forEach((fecha) => {
      if (dia.fecha === fecha) {
        dia.contenido.forEach((el) => {
          soliciudes.push(el);
        });
      }
    });
  });

  let solicitudesAEnviar = soliciudes.toString();

  // useEffect(() => {
  //   if (solicitudesAEnviar) {
  //     try {
  //       postEnviarInsumos({
  //         codigoProductos: solicitudesAEnviar,
  //       })
  //         .then((res) => setInsumos(res))
  //         .then(() => setVisibleLoader(false));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, []);

  let insumosOrganizados = {};
  insumos?.forEach((i) => {
    let nombre = i.nombreInsumo;
    insumosOrganizados[nombre] = {
      insumoNombre: nombre,
      codigoInsumo: i.codigoInsumo,
      unidadMedida: i.unidadMedida,
      cantidad: Number(i.cantidad),
    };
  });

  let rows = [];

  let columns = [
    {
      field: "producto2",
      headerName: "Insumo",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "product3o",
      headerName: "Código",
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
      headerName: "Unidad medida",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <BasicModal titulo={"Insumos salón " + salonSeleccionadoEstado}>
      <Box
        sx={{
          height: "50vh",
          width: "50vw",
        }}>
        <Box
          sx={{
            display: "flex",
            minHeight: "180px",
            height: "100%",
            width: "100%",
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
            // getRowId={(row) => row.id || row.Id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Insumos;
