import postData from "../requests/postData";
import jsPDF from "jspdf";

const enviarPDFPorCorreo = async (columns, rows, type, pdfTitle, grupoId) => {
  let blob = null;
  const doc = new jsPDF();

  if (type === "dataGridPDF") {
    doc.text("DataGrid Export", 10, 10);
    doc.autoTable({
      head: [columns.map((column) => column.headerName)],
      body: rows.map((row) => columns.map((column) => row[column.field])),
    });
  } else if (type === "otherType") {
    // Handle other types of PDF generation based on your requirements
  }

  // Save PDF
  blob = doc.output("blob");
  const formData = new FormData();
  formData.append("pdfFile", blob);

  let nameToMail = "";
  if (type === "dataGridPDF") {
    nameToMail = `Reporte-${pdfTitle}`;
  } else if (type === "otherType") {
    // Set appropriate names for other types
  }
  formData.append("grupoID", grupoId);
  formData.append("subject", "Adjunto PDF");

  try {
    // Send PDF via API
    await postData.postEnviarPDF(formData);
  } catch (error) {
    console.error(error);
  }
};

export default enviarPDFPorCorreo;
