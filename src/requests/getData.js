import peticion from "./service";

const getData = {
  getAcciones() {
    return peticion.get("AccionController/acciones");
  },

  getAccionesProgramadas() {
    return peticion.get("AccionesProgramacionController/programacion");
  },

  getCorreos() {
    return peticion.get("CorreosController/correos");
  },

  getGrupos() {
    return peticion.get("GruposController/grupos");
  },

  getHistorial() {
    return peticion.get("HistorialController/historial");
  },

  getProgramacionPendiente() {
    return peticion.get("ProgramacionController/pendiente");
  },

  getProgramacionProgramado() {
    return peticion.get("ProgramacionController/programado");
  },

  getProgramacionArchivado() {
    return peticion.get("ProgramacionController/archivado");
  },

  getSalones() {
    return peticion.get("SalonController/salones");
  },

  getValidarCantidadProgramada({ idPadre, cantidad }) {
    return peticion.get(
      `ProgramacionController/validateSchedule?idPadre=${idPadre}&cantProducir=${cantidad}`
    );
  },

  getArchivosPDF() {
    return peticion.get("EmailController/files");
  },
};
export default getData;
