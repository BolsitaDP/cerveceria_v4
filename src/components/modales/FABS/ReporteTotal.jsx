import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import generarColores from "../../../helpers/generadorColores";

const ReporteTotal = () => {
  const [switchColoresPorProductos, setSwitchColoresPorProductos] =
    useState(false);
  const [switchTamanoPequeno, setSwitchTamanoPequeno] = useState(false);

  const [sinAcciones, setSinAcciones] = useState(false);

  const contenedoresEstado = useSelector((state) => state.contenedores);

  const todosLosColores = generarColores();

  let salones = contenedoresEstado.calendario;

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
      width: switchTamanoPequeno ? 90 : 150,
      renderCell: ({ row }) => {
        if (row.dia) {
          let [nombre, fecha] = row.dia.split("&");
          let [dia, mes] = fecha.split("/");

          return (
            <span
              style={{
                fontSize: switchTamanoPequeno ? "8px" : "12px",
              }}>{`${nombre} ${dia}/${mes}`}</span>
          );
        } else {
          return (
            <span
              style={{
                fontSize: switchTamanoPequeno ? "8px" : "12px",
              }}>
              TOTAL
            </span>
          );
        }
      },
    },
    ...Object.keys(salones).map((salon, index) => ({
      field: salon,
      headerName: salon,
      width: switchTamanoPequeno ? 90 : 150,
      renderCell: (row) => {
        let salon = row.field;
        let contenido = row.row[salon];
        if (!contenido) {
          let totalXProducto = [];
          Object.keys(salones[salon].dias).forEach((key) => {
            salones[salon].dias[key].contenido.forEach((item) => {
              const codigoNombre = item.codigoNombre || "Acción";
              const itemExistente = encontrarItem(totalXProducto, codigoNombre);

              if (itemExistente) {
                itemExistente.cantidad += item.cantidad;
              } else {
                totalXProducto.push({ ...item });
              }
            });
          });

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                margin: "5px 0",
                fontSize: switchTamanoPequeno ? "8px" : "12px",
              }}>
              {totalXProducto.map((sol, index) =>
                sinAcciones ? (
                  sol.codigoNombre ? (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "rgba(0, 122, 255, 0.4)",
                        padding: "5px",
                        borderRadius: "5px",
                      }}>
                      {sol.producto} ({sol.codigoNombre})
                      <br />
                      <strong>
                        {sol.cantidad} {sol.unidadMedida}
                      </strong>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(0, 122, 255, 0.4)",
                      padding: "5px",
                      borderRadius: "5px",
                    }}>
                    {sol.producto || sol.nombreDeLaAccion} (
                    {sol.codigoNombre || sol.tipo})
                    <br />
                    <strong>
                      {sol.cantidad} {sol.unidadMedida}
                    </strong>
                  </div>
                )
              )}
            </div>
          );
        }

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              margin: "5px 0",
              fontSize: switchTamanoPequeno ? "8px" : "12px",
            }}>
            {contenido.map((sol, index) => {
              let colorBySol =
                row.row.prodsConColor[sol.codigoNombre || sol.nombreDeLaAccion]
                  .color;
              return sinAcciones ? (
                sol.codigoNombre ? (
                  <div
                    key={index}
                    style={{
                      backgroundColor: switchColoresPorProductos
                        ? colorBySol && colorBySol
                        : sol.tipoRequerimiento === "PRODUCCIÓN LOCAL"
                        ? "rgba(92, 101, 192, 0.4)"
                        : "rgba(240, 93, 103, 0.4)",
                      padding: "5px",
                      borderRadius: "5px",
                    }}>
                    {sol.producto || sol.nombreDeLaAccion} (
                    {sol.codigoNombre || sol.tipo})
                    <br />
                    <strong>
                      {sol.cantidad} {sol.unidadMedida}
                    </strong>
                  </div>
                ) : (
                  ""
                )
              ) : (
                <div
                  key={index}
                  style={{
                    backgroundColor: switchColoresPorProductos
                      ? colorBySol && colorBySol
                      : sol.tipoRequerimiento === "PRODUCCIÓN LOCAL"
                      ? "rgba(92, 101, 192, 0.4)"
                      : "rgba(240, 93, 103, 0.4)",
                    padding: "5px",
                    borderRadius: "5px",
                  }}>
                  {sol.producto || sol.nombreDeLaAccion} (
                  {sol.codigoNombre || sol.tipo})
                  <br />
                  <strong>
                    {sol.cantidad} {sol.unidadMedida}
                  </strong>
                </div>
              );
            })}
          </div>
        );
      },
    })),
    {
      field: "total",
      headerName: "Total",
      width: switchTamanoPequeno ? 90 : 150,
      renderCell: ({ row }) => {
        let cont = row.totalXProducto;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              margin: "5px 0",
              fontSize: switchTamanoPequeno ? "8px" : "12px",
            }}>
            {cont?.map((sol, index) =>
              sinAcciones ? (
                sol.codigoNombre ? (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(0, 122, 255, 0.4)",
                      padding: "5px",
                      borderRadius: "5px",
                    }}>
                    {sol.producto} ({sol.codigoNombre})
                    <br />
                    <strong>
                      {sol.cantidad} {sol.unidadMedida}
                    </strong>
                  </div>
                ) : (
                  ""
                )
              ) : (
                <div
                  key={index}
                  style={{
                    backgroundColor: "rgba(0, 122, 255, 0.4)",
                    padding: "5px",
                    borderRadius: "5px",
                  }}>
                  {sol.producto || sol.nombreDeLaAccion} (
                  {sol.codigoNombre || sol.tipo})
                  <br />
                  <strong>
                    {sol.cantidad} {sol.unidadMedida}
                  </strong>
                </div>
              )
            )}
          </div>
        );
      },
    },
  ];

  function encontrarItem(items, codigoNombre) {
    return items.find((i) => i.codigoNombre === codigoNombre);
  }

  function obtenerColorAleatorio() {
    return todosLosColores[Math.floor(Math.random() * todosLosColores.length)];
  }

  let rows7 = new Array(8);

  rows7 = diasFechas.map((dia, index) => {
    let prodsConColor = {};

    let fullData = {
      dia,
      index,
      total: 0,
      totalXProducto: [],
      prodsConColor,
    };

    //Construcción de productos por día por salón
    nombreSalones.forEach((salon) => {
      let dataXSalonXDia = salones[salon].dias[dia].contenido;

      dataXSalonXDia.forEach((sol) => {
        let x = sol.codigoNombre || sol.nombreDeLaAccion;
        prodsConColor[x] = { color: obtenerColorAleatorio() };
      });

      fullData[salon] = dataXSalonXDia;
    });

    //Construcción de total por día
    Object.keys(salones).forEach((key) => {
      salones[key].dias[dia].contenido.forEach((item) => {
        const codigoNombre = item.codigoNombre || "Acción";
        const itemExistente = encontrarItem(
          fullData.totalXProducto,
          codigoNombre
        );

        if (itemExistente) {
          itemExistente.cantidad += item.cantidad;
        } else {
          fullData.totalXProducto.push({ ...item });
        }

        fullData.total += item.cantidad;
      });
    });

    return fullData;
  });

  rows7.push("TOTAL");

  const handleCheckedTotales = () => {
    setSwitchTamanoPequeno(!switchTamanoPequeno);
  };

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
          flexDirection: "column",
        }}>
        <Box sx={{ width: "100%", marginTop: "25px" }}>
          <FormControlLabel
            control={
              <Switch
                checked={switchTamanoPequeno}
                onChange={handleCheckedTotales}
              />
            }
            label="Tamaño reducido"
          />

          <FormControlLabel
            control={
              <Switch
                checked={sinAcciones}
                onChange={() => setSinAcciones(!sinAcciones)}
              />
            }
            label="Sin actividades"
          />

          <FormControlLabel
            control={
              <Switch
                checked={switchColoresPorProductos}
                onChange={() =>
                  setSwitchColoresPorProductos(!switchColoresPorProductos)
                }
              />
            }
            label="Color por producto"
          />
        </Box>
        <Box sx={{ width: "100%", height: "90%" }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={rows7}
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

export default ReporteTotal;