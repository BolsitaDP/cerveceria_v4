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

  getSalones() {
    return peticion.get("SalonController/salones");
  },
};
export default getData;
