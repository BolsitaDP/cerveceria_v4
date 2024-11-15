import store from "../redux/store.js";

const obtenerInformacionHistorialVersiones = (semana) => {
  let state = store.getState();

  let archivosState = state.contenedores.archivosPDF;

  // Filtrar los datos que coincidan con la semana dada
  const versiones = archivosState
    .filter((item) => item.semanaPdf === semana)
    .map((item) => item.versionPdf);

  // Retornar la versión más alta, o null si no hay coincidencias
  return versiones.length > 0 ? Math.max(...versiones) : null;
};

export default obtenerInformacionHistorialVersiones;
