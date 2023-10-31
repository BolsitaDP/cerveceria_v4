import { BarChart } from "@mui/x-charts";
import React from "react";
import BasicModal from "../MUIComponents/BasicModal";

const EstadisticasGenerales = () => {
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
