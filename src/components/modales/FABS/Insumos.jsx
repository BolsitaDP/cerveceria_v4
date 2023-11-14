import React, { useEffect, useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { useSelector } from "react-redux";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import postData from "../../../requests/postData";
import { toast } from "react-toastify";

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);

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
          soliciudes.push(el.codigoNombre);
        });
      }
    });
  });

  useEffect(() => {
    let solicitudesAEnviar = soliciudes.toString();

    if (solicitudesAEnviar) {
      try {
        postData
          .postEnviarInsumos({
            codigoProductos: solicitudesAEnviar,
          })
          .then((res) => {
            setInsumos(res.data);
          });
      } catch (error) {
        toast.error("Ha ocurrido un error: " + error);
      }
    }
  }, []);

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

  let rows = Object.values(insumosOrganizados);

  let columns = [
    {
      field: "insumoNombre",
      headerName: "Insumo",
      flex: 1,
      minWidth: 300,
    },
    {
      field: "codigoInsumo",
      headerName: "Código",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "unidadMedida",
      headerName: "Unidad medida",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <BasicModal titulo={"Insumos salón " + salonSeleccionadoEstado}>
      <Box
        sx={{
          height: "60vh",
          width: "60vw",
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
            getRowId={(row) => row.codigoInsumo}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Insumos;
