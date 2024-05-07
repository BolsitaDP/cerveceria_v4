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

  let data = [];

  if (origen === "historialGeneral") {
    data = rows.map((row) => {
      const rowData = [];
      columns.forEach((column) => {
        let cellValue = row[column.field];
        if (column.field === "valorNuevo") {
          let [, date] = cellValue.split(" ");
          let [dia, fecha] = date.split("&");

          cellValue = `${dia} ${fecha}`;
        }
        rowData.push(cellValue);
      });
      return rowData;
    });
  }

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
