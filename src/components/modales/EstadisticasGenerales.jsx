import { BarChart } from "@mui/x-charts";
import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { useSelector } from "react-redux";

import { Box } from "@mui/material";

const EstadisticasGenerales = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  console.log(contenedoresEstado);

  let salones = contenedoresEstado.calendario;
  let cantidadesPorSalon = new Array(7).fill(0);
  let nombresSalones = [];

  let keysSalones = Object.keys(salones);

  keysSalones.forEach((key, index) => {
    let salon = salones[key];
    nombresSalones.push(salon.id);

    let dias = salon.dias;
    let cant = 0;
    Object.values(dias).forEach((dia) => {
      if (fechasSeleccionadas.includes(dia.fecha)) {
        dia.contenido.forEach((el) => {
          if (el.codigoNombre) {
            cant += el.cantidad;
          }
        });
      }
    });
    cantidadesPorSalon[index] = cant;
  });

  console.log(cantidadesPorSalon);

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
      <Box sx={{ width: "100%", height: "100%", padding: "20px" }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: nombresSalones }]}
          series={[{ data: cantidadesPorSalon }]}
          width={600}
          height={300}
          colors={["#007aff"]}
        />
      </Box>
    </BasicModal>
  );
};

export default EstadisticasGenerales;
