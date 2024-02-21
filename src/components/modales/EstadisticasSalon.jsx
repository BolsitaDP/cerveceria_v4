import React from "react";
import { useSelector } from "react-redux";
import BasicModal from "../MUIComponents/BasicModal";
import { BarChart } from "@mui/x-charts";
import { Box } from "@mui/material";

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

  let ocupacion = Array(7).fill(0);

  let sieteDias = fechasSeleccionadas.slice(0, 7);

  sieteDias.forEach((fecha, index) => {
    diasContenido.forEach((dia) => {
      if (dia.fecha === fecha) {
        let ocupacionDia = 0;

        let sumaDelDia = 0;

        let contenidoDia = dia.contenido;

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

        ocupacionDia = sumaDelDia.toFixed(2);

        // let cantidadDia = 0;
        // dia.contenido.forEach((sol) => {
        //   if (sol.cantidad) {
        //     cantidadDia += sol.cantidad;
        //   }
        // });

        const index = sieteDias.indexOf(dia.fecha);
        if (index !== -1) {
          ocupacion[index] += parseFloat(ocupacionDia);
        }
      }
    });

    labelsXAxis.push(
      `${nombreDiasDeLaSemana[index]} ${fecha.split("/")[0]}/${
        fecha.split("/")[1]
      }`
    );
  });

  return (
    <BasicModal titulo={"Estadísticas del salón " + estadisticasSalon}>
      <Box sx={{ fontSize: "18px", marginTop: "10px" }}>Horas de ocupación</Box>
      <Box sx={{ width: "100%", height: "100%", padding: "0 20px 20px 20px" }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: labelsXAxis }]}
          series={[{ data: ocupacion }]}
          width={800}
          height={300}
          colors={["#007aff"]}
        />
      </Box>
    </BasicModal>
  );
};

export default EstadisticasSalon;
