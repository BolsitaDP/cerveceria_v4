import postData from "../requests/postData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const enviarPDFPorCorreo = async (columns, rows, origen, pdfTitle, grupoId) => {
  let blob = null;
  const doc = new jsPDF({
    orientation: "landscape",
  });
  doc.text(pdfTitle, 10, 10);

  console.log(rows);
  console.log(columns);

  if (origen === "reporteGeneral") {
    console.log("Origen reporte general");
  }

  const data = rows.map((row) => {
    const rowData = [];
    columns.forEach((column) => {
      let cellValue = row[column.field];
      if (origen === "historialGeneral") {
        if (column.field === "valorNuevo") {
          //  cellValue = formatDateAndDay(cellValue);
        }
      } else if (origen === "reporteGeneral") {
        if (column.field === "dia" && cellValue !== undefined) {
          let [nombre, fecha] = cellValue.split("&");
          cellValue = `${nombre} ${fecha}`;
        } else if (
          column.field !== "dia" &&
          column.field !== "total" &&
          cellValue !== undefined
        ) {
          let arrayProdsCompletos = [];
          cellValue.forEach((sol) => {
            arrayProdsCompletos.push(
              `${sol.producto} - (${sol.codigoNombre}) - ${sol.cantidad}CJ `
            );
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

  const pdfUrl = URL.createObjectURL(doc.output("blob"));
  window.open(pdfUrl, "_blank");

  blob = doc.output("blob");
  const formData = new FormData();
  formData.append("pdfFile", blob);

  formData.append("grupoID", grupoId);
  formData.append("subject", "Adjunto PDF");

  try {
    await postData.postEnviarPDF(formData);
  } catch (error) {
    toast.error("Ha ocurrido un error, inténtalo de nuevo más tarde");
  }
};

export default enviarPDFPorCorreo;
