import React from "react";
import { useSelector } from "react-redux";
import BasicModal from "../MUIComponents/BasicModal";
import { BarChart } from "@mui/x-charts";

const EstadisticasSalon = ({ estadisticasSalon }) => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const nombreDiasDeLaSemana = useSelector(
    (state) => state.dates.nombreDiasDeLaSemana
  );
  const salonSeleccionado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  let diasContenido = Object.values(
    contenedoresEstado.calendario[salonSeleccionado].dias
  );

  let labelsXAxis = [];

  let solicitudes = Array(7).fill(0);

  fechasSeleccionadas.forEach((fecha, index) => {
    diasContenido.forEach((dia) => {
      if (dia.fecha === fecha) {
        let cantidadDia = 0;
        dia.contenido.forEach((sol) => {
          cantidadDia += sol.cantidad;
        });

        const index = fechasSeleccionadas.indexOf(dia.fecha);
        if (index !== -1) {
          solicitudes[index] += cantidadDia;
        }
      }
    });

    labelsXAxis.push(
      `${nombreDiasDeLaSemana[index]} ${fecha.split("/")[0]}/${
        fecha.split("/")[1]
      }`
    );
  });

  console.log(estadisticasSalon);

  return (
    <BasicModal titulo={"Estadísticas del salón " + estadisticasSalon}>
      <BarChart
        xAxis={[{ scaleType: "band", data: labelsXAxis }]}
        series={[{ data: solicitudes }]}
        width={800}
        height={300}
        colors={["#007aff"]}
      />
    </BasicModal>
  );
};

export default EstadisticasSalon;
