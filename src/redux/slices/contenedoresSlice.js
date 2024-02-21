import { createSlice } from "@reduxjs/toolkit";

import { v4 as uuid } from "uuid";
import postData from "../../requests/postData";
import { toast } from "react-toastify";
import obtenerDiaSiguienteNombre from "../../helpers/obtenerDiaSiguienteNombre";
import obtenerDiaSiguienteFecha from "../../helpers/obtenerDiaSiguienteFecha";
import dayjs from "dayjs";

const contenedoresSlice = createSlice({
  name: "contenedores",
  initialState: {
    solicitudes: [],
    calendario: {},
    acciones: [],
    elementoCopia: {},
  },
  reducers: {
    setSolicitudesInicial: (state, action) => {
      action.payload.forEach((solicitud) => {
        solicitud.idDnd = uuid();
        state.solicitudes.push(solicitud);
        if (solicitud.fechaRequiere?.indexOf("000Z") !== -1) {
          let [dia, mes, anio] = solicitud.fechaRequiere.split("/");
          let fechaJs = new Date(anio, mes - 1, dia);
          let fechaDayJs = dayjs(fechaJs);
          solicitud.fechaRequiere = fechaDayJs;
        }
      });
    },
    setSolicitudes: (state, action) => {
      console.log(action.payload);
      state.solicitudes = [];
      action.payload.forEach((solicitud) => {
        state.solicitudes.push(solicitud);
      });
    },
    setSolicitudesProgramadas: (state, action) => {
      console.log(action.payload);
      action.payload.forEach((solicitud) => {
        let fecha = solicitud.fecha;
        let salon = solicitud.salonProgramado;
        solicitud.idDnd = uuid();
        state.calendario[salon].dias[fecha]?.contenido?.push(solicitud);

        let capacidadSalon;
        solicitud.velocidadesSalonProducto.forEach((linea) => {
          if (linea.Linea === salon) {
            // let minutosRestar = elementoArrastrado.cantidad / linea.Velocidad;
            capacidadSalon = linea.Velocidad;
          }
        });

        // let capacidadSalon = state.calendario[salon].capacidadHora;
        state.calendario[salon].dias[fecha].horas -=
          solicitud.cantidad / capacidadSalon;
      });

      // Ordenar las solicitudes según la propiedad "orden" Creo qeues e se peude quoitar
      // Object.values(state.calendario).forEach((salon) => {
      //   Object.values(salon.dias).forEach((dia) => {
      //     dia.contenido?.sort((a, b) => a.orden - b.orden);
      //   });
      // });
    },
    setAcciones: (state, action) => {
      state.acciones = [];
      action.payload.forEach((accion) => {
        state.acciones.push(accion);
      });
    },
    setAccionesInicial: (state, action) => {
      action.payload.forEach((accion) => {
        accion.idDnd = uuid();
        state.acciones.push(accion);
      });
    },
    setAccionesProgramadas: (state, action) => {
      console.log(action.payload);

      action.payload.forEach((accion) => {
        let fecha = accion.fecha;
        let salon = accion.salonProgramado;
        accion.idDnd = accion.Id;
        accion.duracion = Number(accion.tiempo);
        // accion.Id = accion.Id;
        state.calendario[salon].dias[fecha]?.contenido?.push(accion);
        state.calendario[salon].dias[fecha].horas -= accion.duracion;
      });

      // Ordenar las solicitudes según la propiedad "orden" Creo qeues e se peude quoitar
      // Object.values(state.calendario).forEach((salon) => {
      //   Object.values(salon.dias).forEach((dia) => {
      //     dia.contenido?.sort((a, b) => a.orden - b.orden);
      //   });
      // });
    },
    createAccion: (state, action) => {
      state.acciones.push({ ...action.payload.data, idDnd: uuid() });
    },
    deteleAccionCalendario: (state, action) => {
      console.log(action.payload);
      let dia = action.payload.fecha;
      let salon = action.payload.salonProgramado;

      try {
        postData.postEliminarAccionesProgramadas({
          Id: action.payload.idDnd,
          nombreDeLaAccion: action.payload.nombreDeLaAccion,
          salonProgramado: action.payload.salonProgramado,
          fecha: action.payload.fecha,
        });

        state.calendario[salon].dias[dia].contenido = state.calendario[
          salon
        ].dias[dia].contenido.filter(
          (accion) => accion.idDnd !== action.payload.idDnd
        );
        state.calendario[salon].dias[dia].horas += action.payload.duracion / 60;
        toast.success(`Tarea eliminada exitosamente`);
      } catch (error) {
        toast.error("Ha ocurrido un error: " + error);
      }
    },
    deleteAccionAcciones: (state, action) => {
      const index = state.acciones.findIndex(
        (k) => JSON.stringify(k) === JSON.stringify(action.payload)
      );

      try {
        postData.postEliminarAcciones(action.payload);
        state.acciones.splice(index, 1);
        toast.success("Tarea eliminada exitosamente");
      } catch (error) {
        toast.error("Ha ocurrido un error: " + error);
      }
    },
    setSalones: (state, action) => {
      state.calendario = action.payload;
    },
    setSalonesInicial: (state, action) => {
      var salones = action.payload;
      action.payload.forEach((salon) => {
        let nombreSalon = salon.Nombre;
        state.calendario[nombreSalon] = {
          id: salon.Nombre,
          dias: {},
          capacidadLunes: salon.capacidadLunes,
          capacidadMartes: salon.capacidadMartes,
          capacidadMiercoles: salon.capacidadMiercoles,
          capacidadJueves: salon.capacidadJueves,
          capacidadViernes: salon.capacidadViernes,
          capacidadSabado: salon.capacidadSabado,
          capacidadDomingo: salon.capacidadDomingo,
        };
      });
    },
    setDias: (state, action) => {
      Object.values(state.calendario).forEach((salon) => {
        action.payload.forEach((dia) => {
          let [nombre, fecha] = dia.split("&");
          let capacidad = 0;

          switch (nombre) {
            case "Lunes":
              capacidad = salon.capacidadLunes;
              break;
            case "Martes":
              capacidad = salon.capacidadMartes;
              break;
            case "Miércoles":
              capacidad = salon.capacidadMiercoles;
              break;
            case "Jueves":
              capacidad = salon.capacidadJueves;
              break;
            case "Viernes":
              capacidad = salon.capacidadViernes;
              break;
            case "Sábado":
              capacidad = salon.capacidadSabado;
              break;
            case "Domingo":
              capacidad = salon.capacidadDomingo;
              break;
            default:
              capacidad = 0;
          }

          salon.dias[dia] = {
            contenido: [],
            horas: capacidad,
            horasTotales: capacidad,
            fecha: fecha,
          };
        });
      });
    },
    updateEstadoSolicitud: (state, action) => {
      console.log(action.payload);
      let accionesUpdatear = [];
      let solicitudesUpdatear = [];

      action.payload.contenidoDia.forEach((elemento, index) => {
        if (elemento.codigoNombre) {
          let exists3 = solicitudesUpdatear.find((x) => x.id === elemento.id);

          if (!exists3) {
            let objeto = {
              id: elemento.id,
              estado: "Programado",
              salonProgramado: elemento.salonProgramado,
              fecha: elemento.fecha,
              orden: index,
              cantidad: elemento.cantidad,
            };
            solicitudesUpdatear.push(objeto);
          }
        } else if (elemento.nombreDeLaAccion) {
          let objeto = {
            Id: elemento.idDnd,
            nombreDeLaAccion: elemento.nombreDeLaAccion,
            salonProgramado: elemento.salonProgramado,
            fecha: elemento.fecha,
            orden: index,
            tipo: elemento.tipo,
            tiempo: Number(elemento.duracion),
          };
          accionesUpdatear.push(objeto);
        }
      });

      if (action.payload.contenidoDia.length < 1) {
        if (action.payload.elementoArrastrado.codigoNombre) {
          if (action.payload.elementoArrastrado.codigoNombre) {
            let objeto = {
              id: action.payload.elementoArrastrado.id,
              estado: action.payload.destino[1] ? "Programado" : "",
              salonProgramado: action.payload.destino[1]
                ? action.payload.destino[0]
                : "",
              fecha: action.payload.destino[1] ? action.payload.destino[1] : "",
              orden: action.payload.index,
              cantidad: action.payload.elementoArrastrado.cantidad,
            };
            solicitudesUpdatear.push(objeto);
          }
        } else {
          let [salon, fecha] = action.payload.fuente;
          if (action.payload.elementoArrastrado.codigoNombre) {
            let objeto = {
              id: action.payload.elementoArrastrado.id,
              estado: "Programado",
              salonProgramado: salon,
              fecha: action.payload.elementoArrastrado.fecha,
              orden: action.payload.index,
              cantidad: action.payload.elementoArrastrado.cantidad,
            };
            solicitudesUpdatear.push(objeto);
          }
        }
      }
      try {
        solicitudesUpdatear.length >= 1 &&
          postData.postActualizarEstadoProducto(solicitudesUpdatear);

        accionesUpdatear.length >= 1 &&
          postData.postActualizarEstadoAcciones(accionesUpdatear);
      } catch (error) {
        toast.error("Se ha producido un error: " + error);
      }
    },
    updatePropiedadesSolicitud: (state, action) => {
      const { codigoNombre, id } = action.payload;
      state.solicitudes = state.solicitudes.map((solicitud) => {
        if (solicitud.id === id) {
          return action.payload;
        }
        return solicitud;
      });

      let solicitudActualizada = state.solicitudes.find(
        (solicitud) => solicitud.id === id
      );

      if (solicitudActualizada) {
        postData.postActualizarPropiedades(solicitudActualizada);
      } else {
        postData.postActualizarPropiedades(action.payload);

        let [cod, dif] = codigoNombre.split(" ");
        let [nombre, fecha] = action.payload.fecha.split("&");
        let fechaSiguienteNombre = obtenerDiaSiguienteNombre(nombre);
        let fechaSiguienteFecha = obtenerDiaSiguienteFecha(fecha);
        let fechaSiguienteFormateada = `${fechaSiguienteNombre}&${fechaSiguienteFecha}`;

        let solIndex = state.calendario[action.payload.salonProgramado].dias[
          action.payload.fecha
        ].contenido.findIndex(
          (solicitud) => solicitud.codigoNombre === codigoNombre
        );
        if (solIndex === -1) {
          solIndex = state.calendario[action.payload.salonProgramado].dias[
            fechaSiguienteFormateada
          ].contenido.findIndex(
            (solicitud) => solicitud.codigoNombre === codigoNombre
          );
        }
        // let capacidadSalon =
        //   state.calendario[action.payload.salonProgramado].capacidadHora;

        let capacidadSalonPorDia;

        solicitudActualizada =
          state.calendario[action.payload.salonProgramado].dias[
            action.payload.fecha
          ].contenido[solIndex];

        if (!solicitudActualizada) {
          solicitudActualizada =
            state.calendario[action.payload.salonProgramado].dias[
              fechaSiguienteFormateada
            ].contenido[solIndex];
        }

        solicitudActualizada.velocidadesSalonProducto.forEach((linea) => {
          if (linea.Linea === solicitudActualizada.salonProgramado) {
            capacidadSalonPorDia = linea.Velocidad;
          }
        });

        let diferencia =
          solicitudActualizada.cantidad - action.payload.cantidad;

        state.calendario[action.payload.salonProgramado].dias[
          action.payload.fecha
        ].horas += parseFloat(diferencia / capacidadSalonPorDia);

        solicitudActualizada = state.calendario[
          action.payload.salonProgramado
        ].dias[action.payload.fecha].contenido[solIndex] = action.payload;
      }
    },
    creacionCopia: (state, action) => {
      let { elementoArrastradoCopia, elementoOriginal } = action.payload;
      let salonCopia = elementoArrastradoCopia.salonProgramado;
      let fechaCopia = elementoArrastradoCopia.fecha;

      let elementoArrastradoCopiaEditable = JSON.parse(
        JSON.stringify(elementoArrastradoCopia)
      );

      elementoArrastradoCopiaEditable.idDnd = uuid();

      let salonOriginal = elementoOriginal.salonProgramado;
      let fechaOriginal = elementoOriginal.fecha;

      let solIndex = state.solicitudes.findIndex(
        (x) => x.codigoNombre === elementoOriginal.codigoNombre
      );

      const updatedContenido = [...state.solicitudes];
      updatedContenido.splice(solIndex, 1);
      state.solicitudes = updatedContenido;

      state.calendario[salonCopia].dias[fechaCopia].contenido.push(
        elementoArrastradoCopiaEditable
      );

      state.calendario[salonOriginal].dias[fechaOriginal].contenido.push(
        elementoOriginal
      );

      let capacidadSalonPorDia;

      elementoOriginal.velocidadesSalonProducto.forEach((linea) => {
        if (linea.Linea === elementoOriginal.salonProgramado) {
          capacidadSalonPorDia = linea.Velocidad;
        }
      });

      state.calendario[salonOriginal].dias[fechaOriginal].horas -= parseFloat(
        elementoOriginal.cantidad / capacidadSalonPorDia
      );

      state.calendario[salonCopia].dias[fechaCopia].horas -= parseFloat(
        elementoArrastradoCopia.cantidad / capacidadSalonPorDia
      );
    },
    creacionMasDeUnaCopia: (state, action) => {
      console.log(action.payload);
      action.payload.forEach((el) => {
        let elEdit = JSON.parse(JSON.stringify(el));
        elEdit.idDnd = uuid();

        state.calendario[elEdit.salonProgramado].dias[
          elEdit.fecha
        ].contenido.push(elEdit);

        let capacidadSalonPorDia;

        el.velocidadesSalonProducto.forEach((linea) => {
          if (linea.Linea === el.salonProgramado) {
            capacidadSalonPorDia = linea.Velocidad;
          }
        });

        state.calendario[el.salonProgramado].dias[el.fecha].horas -= parseFloat(
          el.cantidad / capacidadSalonPorDia
        );
      });
    },
    particionSolicitudSinProgramar: (state, action) => {
      state.solicitudes.push(action.payload);
    },
    deleteSolicitud: (state, action) => {
      const { fecha, id, cantidad, salonProgramado, velocidadesSalonProducto } =
        action.payload;

      if (fecha) {
        const diaSalon = state.calendario[salonProgramado].dias[fecha];

        diaSalon.contenido = diaSalon.contenido.filter((sol) => sol.id !== id);

        const capacidadSalonPorDia = capacidaSalonPorDia(
          velocidadesSalonProducto,
          salonProgramado
        );

        diaSalon.horas += cantidad / capacidadSalonPorDia;
      } else {
        state.solicitudes = state.solicitudes.filter((sol) => sol.id !== id);
      }
    },
  },
});

const capacidaSalonPorDia = (velocidadesSalonProducto, salonProgramado) => {
  for (const linea of velocidadesSalonProducto) {
    if (linea.Linea === salonProgramado) {
      return linea.Velocidad;
    }
  }
};

export const {
  setSolicitudes,
  particionSolicitudSinProgramar,
  setAcciones,
  setSalones,
  setSolicitudesInicial,
  setSalonesInicial,
  setAccionesInicial,
  setAccionesProgramadas,
  setDias,
  createAccion,
  deteleAccionCalendario,
  deleteAccionAcciones,
  setSolicitudesProgramadas,
  updateEstadoSolicitud,
  updatePropiedadesSolicitud,
  removeHorasDia,
  creacionCopia,
  creacionMasDeUnaCopia,
  deleteSolicitud,
  updateTipoRequerimientoSolicitud,
} = contenedoresSlice.actions;
export default contenedoresSlice.reducer;
