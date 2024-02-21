import { BarChart } from "@mui/x-charts";
import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { useSelector } from "react-redux";

import { Box, Tooltip } from "@mui/material";

const EstadisticasGenerales = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  let fechasSliced = fechasSeleccionadas.slice(0, 7);

  let salones = contenedoresEstado.calendario;
  let produccionGeneral = new Array(7).fill(0);
  let nombresSalones = [];

  let keysSalones = Object.keys(salones);

  keysSalones.forEach((key, index) => {
    let salon = salones[key];
    nombresSalones.push(salon.id);

    let dias = salon.dias;
    let horasT = 0;
    Object.values(dias).forEach((dia, i) => {
      if (i >= 7) return;

      if (fechasSliced.includes(dia.fecha)) {
        dia.contenido.forEach((el) => {
          if (el.codigoNombre) {
          }
        });

        let contenidoDia = dia.contenido;

        let sumaDelDia = 0;

        contenidoDia.forEach((sol) => {
          if (sol.codigoNombre) {
            let cantidad = sol.cantidad;
            let velocidad;

            sol.velocidadesSalonProducto.forEach((x) => {
              if (x.Linea === salonSeleccionado) {
                velocidad = x.Velocidad;
              }
            });

            sumaDelDia += cantidad / velocidad;
          } else {
            sumaDelDia += sol.duracion;
          }
        });

        horasT += sumaDelDia;
      }
    });

    produccionGeneral[index] = horasT.toFixed(2);
  });

  // let diasContenido = Object.values(
  //   contenedoresEstado.calendario[salonSeleccionado].dias
  // );
  // let soliciudes = [];
  // diasContenido.forEach((dia) => {
  //   let cont = dia.contenido;
  //   cont.forEach((sol) => {
  //     if (sol.idDnd) {
  //       soliciudes.push(sol.idDnd);
  //     }
  //   });
  // });

  // console.log(soliciudes);

  return (
    <BasicModal titulo={"Estadísticas generales"}>
      <Box sx={{ fontSize: "18px", marginTop: "10px" }}>Horas de ocupación</Box>
      <Box sx={{ width: "100%", height: "100%", padding: "20px" }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: nombresSalones }]}
          series={[{ data: produccionGeneral }]}
          width={600}
          height={300}
          colors={["#007aff"]}
        />
      </Box>
    </BasicModal>
  );
};

export default EstadisticasGenerales;
