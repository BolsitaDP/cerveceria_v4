import React, { useEffect, useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";

const HistorialPDF = () => {
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);
  const [fechasSeleccionadas, setFechasSeleccionadas] = useState(null);
  const [pdfsDeLaSemana, setPdfsDeLaSemana] = useState([]);

  const pdfsState = useSelector((state) => state.contenedores.archivosPDF);

  console.log(pdfsState);

  const handleChangePDF = (e) => {
    setPdfSeleccionado(e.target.value);
  };

  const handleChangeSemana = (e) => {
    setFechasSeleccionadas(e.target.value);

    pdfsState.forEach((pdf) => {
      let primeraFecha = pdf.semanaPdf.split("¬")[0];

      if (e.target.value === primeraFecha) {
        setPdfsDeLaSemana((prevState) => [...prevState, pdf]);
      }
    });
  };

  console.log(pdfsDeLaSemana);

  const getMinMaxDates = (arr) => {
    return arr.map((item) => {
      const fechas = item.semanaPdf.split("¬").map((diaFecha) => {
        const [dia, fecha] = diaFecha.split("&");
        const [day, month, year] = fecha.split("/").map(Number);
        return {
          dia,
          fecha: new Date(year, month - 1, day),
          original: diaFecha,
        };
      });

      const minDateObj = fechas.reduce(
        (min, current) => (current.fecha < min.fecha ? current : min),
        fechas[0]
      );
      const maxDateObj = fechas.reduce(
        (max, current) => (current.fecha > max.fecha ? current : max),
        fechas[0]
      );

      return [minDateObj.original, maxDateObj.original];
    });
  };

  const result = getMinMaxDates(pdfsState);

  let rangoFecchas = Array.from(new Set(result.map(JSON.stringify))).map(
    JSON.parse
  );

  console.log(rangoFecchas);

  const handleAbrirPDF = () => {
    if (pdfSeleccionado.Id.length > 10) {
      const link = document.createElement("a");
      link.href = pdfSeleccionado.rutaPdf;
      window.open(pdfSeleccionado.rutaPdf, "_blank");
    } else {
      let url = `https://icasa.bpmco.co/api_cerveceria/temp/${pdfSeleccionado.rutaPdf}`;

      window.open(url, "_blank");
    }
  };

  return (
    <BasicModal titulo="Historial PDF">
      <Box
        sx={{
          width: "50vw",
          padding: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "40px",
        }}>
        <FormControl>
          <InputLabel>Semana</InputLabel>
          <Select
            // multiple
            value={fechasSeleccionadas}
            sx={{ width: 250 }}
            onChange={handleChangeSemana}
            input={<OutlinedInput label="Semana" />}>
            {rangoFecchas.map((fecha, index) => (
              <MenuItem key={index} value={`${fecha[0]}`}>
                {`${fecha[0]} - ${fecha[1]}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>PDF</InputLabel>
          <Select
            value={pdfSeleccionado}
            sx={{ width: 250 }}
            onChange={handleChangePDF}
            input={<OutlinedInput label="PDF" />}>
            {pdfsDeLaSemana.map((pdf, index) => (
              <MenuItem key={index} value={pdf}>
                {`Versión ${pdf.versionPdf}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleAbrirPDF}>
          Abrir PDF
        </Button>
      </Box>
    </BasicModal>
  );
};

export default HistorialPDF;
