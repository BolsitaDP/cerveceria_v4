import { BarChart } from "@mui/x-charts";
import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { useSelector } from "react-redux";

const EstadisticasGenerales = () => {
  const contenedoresEstado = useSelector((state) => state.contenedores);
  const fechasSeleccionadas = useSelector((state) => state.dates.selectedDates);
  const salonSeleccionado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  let diasContenido = Object.values(
    contenedoresEstado.calendario[salonSeleccionado].dias
  );
  let soliciudes = [];
  diasContenido.forEach((dia) => {
    let cont = dia.contenido;
    cont.forEach((sol) => {
      if (sol.idDnd) {
        soliciudes.push(sol.idDnd);
      }
    });
  });

  console.log(soliciudes);

  return (
    <BasicModal titulo={"Estadísticas generales"}>
      <BarChart
        xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
        series={[{ data: [4, 3, 5] }]}
        width={500}
        height={300}
        colors={["#007aff"]}
      />
    </BasicModal>
  );
};

export default EstadisticasGenerales;
