import postData from "../requests/postData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const enviarPDFPorCorreo = async (columns, rows, type, pdfTitle, grupoId) => {
  let blob = null;
  const doc = new jsPDF();

  if (type === "dataGridPDF") {
    doc.text(pdfTitle, 10, 10);
    doc.autoTable({
      head: [columns.map((column) => column.headerName)],
      body: rows.map((row) => columns.map((column) => row[column.field])),
    });
  } else if (type === "otherType") {
    console.log("Otros");
  }

  const pdfUrl = URL.createObjectURL(doc.output("blob"));
  window.open(pdfUrl, "_blank");

  blob = doc.output("blob");
  const formData = new FormData();
  formData.append("pdfFile", blob);

  if (type === "dataGridPDF") {
  } else if (type === "otherType") {
    console.log("Otros");
  }
  formData.append("grupoID", grupoId);
  formData.append("subject", "Adjunto PDF");

  try {
    await postData.postEnviarPDF(formData);
  } catch (error) {
    toast.error("Ha ocurrido un error, inténtalo de nuevo más tarde");
  }
};

export default enviarPDFPorCorreo;
