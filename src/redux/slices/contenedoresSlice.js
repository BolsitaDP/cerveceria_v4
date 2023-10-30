import { createSlice } from "@reduxjs/toolkit";

import { v4 as uuid } from "uuid";
import postData from "../../requests/postData";
import { toast } from "react-toastify";
import obtenerDiaSiguienteNombre from "../../helpers/obtenerDiaSiguienteNombre";
import obtenerDiaSiguienteFecha from "../../helpers/obtenerDiaSiguienteFecha";

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
      });
    },
    setSolicitudes: (state, action) => {
      state.solicitudes = [];
      action.payload.forEach((solicitud) => {
        state.solicitudes.push(solicitud);
      });
    },
    setSolicitudesProgramadas: (state, action) => {
      action.payload.forEach((solicitud) => {
        let fecha = solicitud.fecha;
        let salon = solicitud.salonProgramado;
        solicitud.idDnd = uuid();
        state.calendario[salon].dias[fecha]?.contenido?.push(solicitud);

        console.log(fecha);
        console.log(salon);

        let capacidadSalon;
        solicitud.velocidadesSalonProducto.forEach((linea) => {
          if (linea.Linea === salon) {
            // let minutosRestar = elementoArrastrado.cantidad / linea.Velocidad;
            capacidadSalon = linea.Velocidad * 60;
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
        state.calendario[salon].dias[fecha].horas -= accion.duracion / 60;
      });

      // Ordenar las solicitudes según la propiedad "orden" Creo qeues e se peude quoitar
      // Object.values(state.calendario).forEach((salon) => {
      //   Object.values(salon.dias).forEach((dia) => {
      //     dia.contenido?.sort((a, b) => a.orden - b.orden);
      //   });
      // });
    },
    createAccion: (state, action) => {
      let exists = state.acciones.find(
        (accion) => JSON.stringify(accion) === JSON.stringify(action.payload)
      );
      if (!exists) {
        try {
          postData
            .postCrearAccion(action.payload)
            .then((res) => state.acciones.push(action.payload));
        } catch (error) {
          toast.error("Ha ocurrido un error: " + error);
        }
      }
    },
    deteleAccionCalendario: (state, action) => {
      let dia = action.payload.dia[0];
      let salon = action.payload.salon[0];
      // let contenidoContenido = action.payload.contenidoContenido;
      let contenidoId = action.payload.contenidoId;

      try {
        postData
          .postEliminarAccionesProgramadas({
            Id: action.payload.contenidoContenido.Id,
            nombreDeLaAccion:
              action.payload.contenidoContenido.nombreDeLaAccion,
            salonProgramado: action.payload.salon[0],
            fecha: action.payload.dia[0],
          })
          .then(
            (res) =>
              (state.calendario[salon].dias[dia].contenido = state.calendario[
                salon
              ].dias[dia].contenido.filter(
                (accion) => accion.idDnd !== contenidoId
              ))
          );
      } catch (error) {
        toast.error("Ha ocurrido un error: " + error);
      }
    },
    deleteAccionAcciones: (state, action) => {
      const index = state.acciones.findIndex(
        (k) => JSON.stringify(k) === JSON.stringify(action.payload)
      );

      try {
        postData
          .postEliminarAcciones(action.payload)
          .then((res) => state.acciones.splice(index, 1))
          .then(() => toast.success("Tarea eliminada correctamente"));
      } catch (error) {
        toast.error("Ha ocurrido un error: " + error);
      }
    },
    setSalones: (state, action) => {
      state.calendario = action.payload;
    },
    setSalonesInicial: (state, action) => {
      action.payload.forEach((salon) => {
        let nombreSalon = `salon_${salon.Nombre}`;
        state.calendario[nombreSalon] = {
          id: salon.Nombre,
          dias: {},
          capacidadHora: salon.capacidadHora,
        };
      });
    },
    setDias: (state, action) => {
      Object.values(state.calendario).forEach((salon) => {
        action.payload.forEach((dia) => {
          let [, fecha] = dia.split("&");
          salon.dias[dia] = {
            contenido: [],
            horas: 24,
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
        let exists2 = solicitudesUpdatear.find(
          (x) => x.id === action.payload.elementoArrastrado.id
        );

        if (!exists2) {
          solicitudesUpdatear.push({
            id: action.payload.elementoArrastrado.id,
            estado: action.payload.destino[1] ? "Programado" : "",
            salonProgramado: action.payload.destino[1]
              ? action.payload.destino[0]
              : "",
            fecha: action.payload.destino[1] ? action.payload.destino[1] : "",
            orden: action.payload.index,
            cantidad: action.payload.elementoArrastrado.cantidad,
          });
        }

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
      solicitudesUpdatear.length >= 1 &&
        postData.postActualizarEstadoProducto(solicitudesUpdatear); //Creo que faltaría el trycatch
      accionesUpdatear.length >= 1 &&
        postData.postActualizarEstadoAcciones(accionesUpdatear);
    },
    updatePropiedadesSolicitud: (state, action) => {
      const { codigoNombre } = action.payload;
      state.solicitudes = state.solicitudes.map((solicitud) => {
        if (solicitud.codigoNombre === codigoNombre) {
          return action.payload;
        }
        return solicitud;
      });

      let solicitudActualizada = state.solicitudes.find(
        (solicitud) => solicitud.codigoNombre === codigoNombre
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
        let capacidadSalon =
          state.calendario[action.payload.salonProgramado].capacidadHora;

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

        let diferencia =
          solicitudActualizada.cantidad - action.payload.cantidad;

        state.calendario[action.payload.salonProgramado].dias[
          action.payload.fecha
        ].horas += diferencia / capacidadSalon;

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

      let capacidadSalon = state.calendario[salonOriginal].capacidadHora;

      state.calendario[salonOriginal].dias[fechaOriginal].horas -=
        elementoOriginal.cantidad / capacidadSalon;

      state.calendario[salonCopia].dias[fechaCopia].horas -=
        elementoArrastradoCopia.cantidad / capacidadSalon;
    },
    creacionMasDeUnaCopia: (state, action) => {
      console.log(action.payload);
      action.payload.respuestas.forEach((el) => {
        let elEdit = JSON.parse(JSON.stringify(el));
        elEdit.idDnd = uuid();
        if (el.codigoNombre.split(" ")[1]) {
          state.calendario[elEdit.salonProgramado].dias[
            elEdit.fecha
          ].contenido.push(elEdit);
        } else {
          let solIndex = state.solicitudes.findIndex(
            (x) => x.codigoNombre === el.codigoNombre
          );

          const updatedContenido = [...state.solicitudes];
          updatedContenido.splice(solIndex, 1);
          state.solicitudes = updatedContenido;

          state.calendario[elEdit.salonProgramado].dias[
            elEdit.fecha
          ].contenido.splice(elEdit.orden, 0, elEdit);
        }
        let capacidadSalon = state.calendario[el.salonProgramado].capacidadHora;
        state.calendario[el.salonProgramado].dias[el.fecha].horas -=
          el.cantidad / capacidadSalon;
      });
    },
    particionSolicitudSinProgramar: (state, action) => {
      console.log(action.payload);
      state.solicitudes.push(action.payload);
    },
  },
});

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
} = contenedoresSlice.actions;
export default contenedoresSlice.reducer;