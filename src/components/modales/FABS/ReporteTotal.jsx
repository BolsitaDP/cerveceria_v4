import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box, FormControlLabel, Modal, Switch } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  esES,
} from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import generarColores from "../../../helpers/generadorColores";
import obtenerDiasDeLaSemana from "../../../helpers/obtenerDiasDeLaSemana";
import Notificar from "../Notificar";

const CustomToolbarWithoutExport = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const ReporteTotal = () => {
  const [switchColoresPorProductos, setSwitchColoresPorProductos] =
    useState(false);
  const [switchTamanoPequeno, setSwitchTamanoPequeno] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(null);
  const [sinAcciones, setSinAcciones] = useState(false);

  const contenedoresEstado = useSelector((state) => state.contenedores);
  const versionEstado = useSelector((state) => state.history.version);

  const todosLosColores = generarColores();

  let salones = contenedoresEstado.calendario;

  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  let fechasSemanaCompletas = obtenerDiasDeLaSemana(sieteDias);

  let diasFechas = [];

  let fechasSoloDiaMes = [];
  fechasSeleccionadas.forEach((fecha) => {
    let arrFecha = fecha.split("/");
    fechasSoloDiaMes.push(`${arrFecha[0]}/${arrFecha[1]}`);
  });

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
        if (typeof row.row == "string") {
          return;
        }
        let contenido = row.row[salon];
        if (!contenido) {
          let totalXProducto = [];
          Object.keys(salones[salon].dias).forEach((key) => {
            if (!fechasSemanaCompletas.includes(key)) return;
            salones[salon].dias[key].contenido.forEach((item) => {
              const codigoNombre = item.codigoNombre || item.tipo;
              const itemExistente = encontrarItem(totalXProducto, codigoNombre);

              let velocidad;
              let horasOcupadas;
              if (item.velocidadesSalonProducto) {
                item.velocidadesSalonProducto?.forEach((linea) => {
                  if (linea.Linea === salon) {
                    velocidad = linea.Velocidad;
                  }
                });
                horasOcupadas = item.cantidad / velocidad;
              } else {
                horasOcupadas = item.duracion;
              }

              if (itemExistente) {
                itemExistente.cantidad += item.cantidad;
                if (item.velocidadesSalonProducto) {
                  itemExistente.horasOcupadas += horasOcupadas;
                } else {
                  itemExistente.horasOcupadas += item.duracion;
                }
              } else {
                totalXProducto.push({ ...item, horasOcupadas });
              }
            });
          });

          let totalXProductoOrdenado = totalXProducto.sort(
            (a, b) => a.orden - b.orden
          );

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                margin: "5px 0",
                fontSize: switchTamanoPequeno ? "8px" : "12px",
              }}>
              {totalXProductoOrdenado.map((sol, index) =>
                sinAcciones ? (
                  sol.codigoNombre ? (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "rgba(0, 122, 255, 0.4)",
                        padding: "5px",
                        borderRadius: "5px",
                      }}>
                      <strong>
                        {sol.cantidad.toLocaleString()}{" "}
                        {sol.unidadMedida === "UN" ? "CJ" : sol.unidadMedida}{" "}
                        <br />
                        {sol.horasOcupadas.toFixed(2) + " horas"}
                      </strong>
                      <br />
                      {sol.producto} ({sol.codigoNombre})
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
                    <strong>
                      {!sol.tipo && sol.cantidad.toLocaleString()}
                      {!sol.tipo &&
                        (sol.unidadMedida === "UN" ? "CJ" : sol.unidadMedida)}
                      {/* {sol.cantidad} {sol.unidadMedida} */}
                      <br />
                      {sol.horasOcupadas.toFixed(2) + " horas"}
                    </strong>
                    <br />
                    {sol.producto || sol.nombreDeLaAccion} (
                    {sol.codigoNombre || sol.tipo})
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
                row.row.prodsConColor[sol.codigoNombre || sol.tipo].color;

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
                    <strong>
                      {sol.cantidad.toLocaleString()}{" "}
                      {sol.unidadMedida === "UN" ? "CJ" : sol.unidadMedida}
                    </strong>
                    <br />
                    {sol.producto || sol.nombreDeLaAccion}
                    {sol.codigoNombre && `(${sol.codigoNombre})`}
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
                      : sol.codigoNombre
                      ? "rgba(240, 93, 103, 0.4)"
                      : `#${sol.hexa}`,
                    padding: "5px",
                    borderRadius: "5px",
                  }}>
                  <strong>
                    {sol.codigoNombre
                      ? `${sol.cantidad.toLocaleString()} ${
                          sol.unidadMedida === "UN" ? "CJ" : sol.unidadMedida
                        }`
                      : ""}
                  </strong>
                  <br />
                  {sol.producto || sol.nombreDeLaAccion}{" "}
                  {sol.codigoNombre && `(${sol.codigoNombre})`}
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
            {cont
              ? cont.map((sol, index) => {
                  return sinAcciones ? (
                    sol.codigoNombre ? (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "rgba(0, 122, 255, 0.4)",
                          padding: "5px",
                          borderRadius: "5px",
                        }}>
                        <strong>
                          {sol.cantidad.toLocaleString()}{" "}
                          {sol.unidadMedida === "UN" ? "CJ" : sol.unidadMedida}
                          <br />
                          {sol.horasOcupadas.toFixed(2) + " horas"}
                        </strong>
                        <br />
                        {sol.producto} ({sol.codigoNombre})
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
                      <strong>
                        {sol.codigoNombre
                          ? `${sol.cantidad.toLocaleString()} ${
                              sol.unidadMedida === "UN"
                                ? "CJ"
                                : sol.unidadMedida
                            }`
                          : ""}
                        <br />
                        {sol.horasOcupadas.toFixed(2) + " horas"}
                      </strong>
                      <br />
                      {sol.producto || sol.nombreDeLaAccion}
                      {sol.codigoNombre && `(${sol.codigoNombre})`}
                    </div>
                  );
                })
              : ""}
          </div>
        );
      },
    },
  ];

  const columnsSinTotal = columns.filter((item) => item.field !== "total");

  function encontrarItem(items, codigoNombre) {
    return items.find(
      (i) => i.codigoNombre === codigoNombre || i.tipo === codigoNombre
    );
  }

  function obtenerColorAleatorio() {
    return todosLosColores[Math.floor(Math.random() * todosLosColores.length)];
  }

  let rows7 = new Array(8);

  let prodsConColor = {};

  rows7 = fechasSemanaCompletas.map((dia, index) => {
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

      // Filtrar y ordenar solo los objetos que tienen la propiedad "orden"
      const dataXSalonXDiaOrdenado = dataXSalonXDia
        .filter((sol) => sol.hasOwnProperty("orden")) // Filtrar solo los que tienen "orden"
        .sort((a, b) => a.orden - b.orden); // Ordenar por "orden"

      dataXSalonXDia.forEach((sol) => {
        let x = sol.codigoNombre || sol.tipo;
        prodsConColor[x] = { color: obtenerColorAleatorio() };
      });

      // Asignar el array ordenado a fullData
      fullData[salon] = dataXSalonXDiaOrdenado;
    });

    //Construcción de total por día
    Object.keys(salones).forEach((key) => {
      salones[key].dias[dia].contenido.forEach((item) => {
        const codigoNombre = item.codigoNombre || "Acción";
        const itemExistente = encontrarItem(
          fullData.totalXProducto,
          codigoNombre
        );

        let velocidad;
        let horasOcupadas;
        if (item.velocidadesSalonProducto) {
          item.velocidadesSalonProducto?.forEach((linea) => {
            if (linea.Linea === key) {
              velocidad = linea.Velocidad;
            }
          });
          horasOcupadas = item.cantidad / velocidad;
        } else {
          horasOcupadas = item.duracion;
        }

        if (itemExistente) {
          itemExistente.cantidad += item.cantidad;
          itemExistente.horasOcupadas += horasOcupadas;
        } else {
          fullData.totalXProducto.push({ ...item, horasOcupadas });
        }

        fullData.total += item.cantidad;
      });
    });

    return fullData;
  });

  // rows7.push("TOTAL");

  const handleCheckedTotales = () => {
    setSwitchTamanoPequeno(!switchTamanoPequeno);
  };

  const handleExportar = () => {
    setModalAbierto("exportar");
  };

  const getRowClassName = (params) => {
    // console.log(params);
    // return params.row.name.includes("inicio") ||
    //   params.row.time.includes("8:00")
    //   ? "highlight"
    //   : "";
    //     params.row.totalXProducto.forEach((el) => {
    //       if (el.nombreDeLaAccion.includes("inicio") || el.nombreDeLaAccion.includes("inicia")) {
    //     let hora = el.nombreDeLaAccion
    //   }
    // })
    // if (true) {
    //   // Con esto se aplicaría el margen arriba, pero toca determinar cuánto según la hora de inicio
    //   return "sangriaArriba";
    // }
  };

  return (
    <BasicModal
      titulo={"Reporte total"}
      exportar
      funcionAlDarClickExportar={handleExportar}>
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
            slots={{ toolbar: CustomToolbarWithoutExport }}
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
            sx={{
              "& .MuiDataGrid-cell": {
                alignItems: "flex-start",
              },
            }}
            getRowClassName={getRowClassName}
          />
        </Box>
      </Box>
      <Modal
        open={modalAbierto === "exportar"}
        onClose={() => setModalAbierto(null)}>
        <Notificar
          exportar
          columns={columnsSinTotal}
          rows={rows7}
          titulo={`Programación del ${fechasSoloDiaMes[0]} al ${fechasSoloDiaMes[6]} versión ${versionEstado}`}
          origen="reporteGeneral"
        />
      </Modal>
    </BasicModal>
  );
};

export default ReporteTotal;
