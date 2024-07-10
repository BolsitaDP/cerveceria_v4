import postData from "../requests/postData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { agregarArchivoPDF } from "../redux/slices/contenedoresSlice";
import store from "../redux/store";

import { v4 as uuid } from "uuid";

const enviarPDFPorCorreo = async (
  columns,
  rows,
  origen,
  pdfTitle,
  grupoId,
  descargar,
  semana,
  version
) => {
  let blob = null;
  const doc = new jsPDF({
    orientation: "landscape",
    format: "legal",
  });
  doc.text(pdfTitle, 10, 10);

  console.log(rows);
  console.log(columns);

  let columnaKE = columns.filter((x) => x.field === "KE");
  let contenidoKE = [];
  rows.forEach((row) => {
    let cont = row.KE;
    if (cont !== undefined) {
      cont.forEach((x) => {
        contenidoKE.push(x);
      });
    }

    console.log(contenidoKE);
  });

  let parrafoKE = [];

  contenidoKE.forEach((x) => {
    if (x.nombreDeLaAccion) {
      parrafoKE.push(`${x.nombreDeLaAccion} (${x.tipo})`);
    }
  });

  columns = columns.filter((x) => x.field !== "KE");

  let observaciones = [];
  rows.forEach((row) => {
    if (row.totalXProducto) {
      row.totalXProducto.forEach((prod) => {
        if (prod.observaciones !== "") {
          observaciones.push(
            `${prod.producto} (${prod.codigoNombre}): ${prod.observaciones}`
          );
        }
      });
    }
  });

  if (origen === "reporteGeneral") {
    console.log("Origen reporte general");
  }

  const data = rows.map((row) => {
    const rowData = [];
    columns.forEach((column) => {
      let cellValue = row[column.field];
      if (origen === "historialGeneral") {
        if (column.field === "valorNuevo" && cellValue !== undefined) {
          if (cellValue.toString().includes("&")) {
            let [salon, fecha] = cellValue.split(" ");
            let [nombreDia, fechaDia] = fecha.split("&");
            let [dia, mes] = fechaDia.split("/");
            cellValue = `${salon} - ${nombreDia} ${dia}/${mes}`;
          } else if (cellValue.toString() === "solicitudes") {
            cellValue = "Pendiente por programar";
          } else if (cellValue.toString() === "acciones") {
            cellValue = "Actividades";
          }
        } else if (column.field === "valorPrevio" && cellValue !== undefined) {
          if (cellValue.toString().includes("&")) {
            let [salon, fecha] = cellValue.split(" ");
            let [nombreDia, fechaDia] = fecha.split("&");
            let [dia, mes] = fechaDia.split("/");
            cellValue = `${salon} - ${nombreDia} ${dia}/${mes}`;
          } else if (cellValue.toString() === "solicitudes") {
            cellValue = "Pendiente por programar";
          } else if (cellValue.toString() === "acciones") {
            cellValue = "Actividades";
          }
        }
      } else if (origen === "reporteGeneral" || origen === "Version") {
        if (column.field === "dia" && cellValue !== undefined) {
          let [nombre, fecha] = cellValue.split("&");
          cellValue = `${nombre} ${fecha}`;
        } else if (
          column.field !== "dia" &&
          column.field !== "total" &&
          cellValue !== undefined &&
          column.field !== "KE"
        ) {
          let arrayProdsCompletos = [];
          cellValue.forEach((sol) => {
            if (sol.codigoNombre) {
              arrayProdsCompletos.push(
                `${sol.producto} - (${sol.codigoNombre}) - ${sol.cantidad}CJ ${
                  sol.observaciones ? "*" : ""
                }`
              );
            } else {
              arrayProdsCompletos.push(
                `${sol.nombreDeLaAccion} - (${sol.tipo})${
                  sol.tipo === "notas" ? "" : ` - ${sol.duracion} horas`
                }`
              );
            }
          });
          cellValue = arrayProdsCompletos.join(",\n \n");
        }
      }
      rowData.push(cellValue);
    });
    return rowData;
  });

  doc.autoTable({
    head: [columns.map((column) => column.headerName)],
    body: data,
  });

  // Obtener la posición Y después de la tabla
  const underTable = doc.autoTable.previous.finalY || 10;

  // Agregar un párrafo después de la tabla
  doc.text(`Salón KE: \n${parrafoKE.join(", ")}`, 10, underTable + 10);

  let underKe = 20 + underTable + parrafoKE.length * 10;

  // Observaciones de los productos en el reporte
  doc.text(`Observaciones: \n${observaciones.join(", ")}`, 10, underKe + 10);

  const pdfUrl = URL.createObjectURL(doc.output("blob"));
  window.open(pdfUrl, "_blank");
  if (descargar) {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${pdfTitle}.pdf`; // Puedes cambiar el nombre del archivo como desees
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  blob = doc.output("blob");
  const formData = new FormData();
  formData.append("pdfFile", blob);

  formData.append("grupoID", grupoId);
  if (semana && version) {
    formData.append("semana", semana);
    formData.append("version", version);
  }
  formData.append("subject", "Adjunto PDF");

  try {
    await postData.postEnviarPDF(formData).then(() => {
      let tempObj = {
        Id: uuid(),
        rutaPdf: pdfUrl,
        semanaPdf: semana,
        versionPdf: version,
      };
      store.dispatch(agregarArchivoPDF(tempObj));
    });
  } catch (error) {
    toast.error("Ha ocurrido un error, inténtalo de nuevo más tarde");
  }
};

export default enviarPDFPorCorreo;
