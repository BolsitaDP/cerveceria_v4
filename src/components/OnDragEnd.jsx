import { toast } from "react-toastify";
import getFechaHoraActual from "../helpers/getFechaHoraActual";
import obtenerDiaSiguienteFecha from "../helpers/obtenerDiaSiguienteFecha";
import obtenerDiaSiguienteNombre from "../helpers/obtenerDiaSiguienteNombre";

import { v4 as uuid } from "uuid";

const onDragEnd = (
  result,
  dispatcher,
  contenedores,
  editorEstado,
  versionEstado
) => {
  let sourceIndex = -1;

  // Creamos una copia del estado actual de la aplicación.
  const contenedoresActualizados = JSON.parse(JSON.stringify(contenedores));

  // Creamos un objeto vacío para asignarle valor después y no usar "VAR".
  let elementoArrastrado = {};

  // Definir el elemento arrastrado.
  const crearElementoArrastrado = () => {
    if (fuente[0] === "solicitudes") {
      sourceIndex = contenedoresActualizados.solicitudes.findIndex(
        (item) => item.idDnd === draggableId
      );

      elementoArrastrado = contenedoresActualizados.solicitudes[sourceIndex];
    } else if (fuente[0] === "acciones") {
      sourceIndex = source.index;

      elementoArrastrado = contenedoresActualizados.acciones[sourceIndex];
    } else {
      sourceIndex = source.index;

      elementoArrastrado =
        contenedoresActualizados.calendario[fuente[0]].dias[fuente[1]]
          .contenido[sourceIndex];
    }
  };

  // Función para crear el elemento arrastrado en el destino
  const crearElementoArrastradoDestino = () => {
    if (destino[1]) {
      contenedoresActualizados.calendario[destino[0]].dias[
        destino[1]
      ].contenido.splice(posicionDestino, 0, elementoArrastrado);
    } else {
      if (elementoArrastrado.codigoNombre) {
        let elementoSinFechaNiSalonProgramado = JSON.parse(
          JSON.stringify(elementoArrastrado)
        );
        elementoSinFechaNiSalonProgramado.fecha = "";
        elementoSinFechaNiSalonProgramado.salonProgramado = "";
        contenedoresActualizados[destino[0]].splice(
          posicionDestino,
          0,
          elementoSinFechaNiSalonProgramado
        );
      } else {
        let updatedContenido = [...contenedoresActualizados[fuente[0]]];
        updatedContenido.splice(posicionDestino, 0, elementoArrastrado);
        contenedoresActualizados[fuente[0]] = updatedContenido;
      }
    }
  };

  // Función para eliminar el elemento arrastrado de la fuente
  const eliminarElementoArrastradoFuente = () => {
    if (fuente[1]) {
      const updatedContenido = [
        ...contenedoresActualizados.calendario[fuente[0]].dias[fuente[1]]
          .contenido,
      ];
      updatedContenido.splice(sourceIndex, 1);
      contenedoresActualizados.calendario[fuente[0]].dias[fuente[1]].contenido =
        updatedContenido;
    } else {
      let updatedContenido = [...contenedoresActualizados[fuente[0]]];
      updatedContenido.splice(sourceIndex, 1);
      contenedoresActualizados[fuente[0]] = updatedContenido;
      // contenedoresActualizados[fuente[0]].splice(sourceIndex, 1);
    }
  };

  // Función para obtener el día fuente
  const getDiaFuente = () => {
    if (fuente[1]) {
      return contenedoresActualizados.calendario[fuente[0]].dias[fuente[1]];
    }
  };

  // Función para obtener el día destino
  const getDiaDestino = () => {
    if (destino[1]) {
      return contenedoresActualizados.calendario[destino[0]].dias[destino[1]];
    }
  };

  // Función para obtener las horas del día correspondiente
  const getHorasDisponiblesEnElDia = (destino) => {
    if (destino[1]) {
      let horasIniciales =
        contenedoresActualizados.calendario[destino[0]].dias[destino[1]].horas;

      return horasIniciales;
    }
  };

  // Función para obtener el contenedor destino
  const getElementoArrastradoDestino = (destino) => {
    if (destino[1]) {
      return contenedoresActualizados.calendario[destino[0]].dias[destino[1]]
        .contenido;
    } else {
      return contenedoresActualizados[destino[0]];
    }
  };

  // Función para obtener el día siguiente de determinada fecha
  const getDiaSiguienteDe = (destino) => {
    let [nombre, fecha] = destino[1].split("&");
    let diaSiguienteFecha = obtenerDiaSiguienteFecha(fecha);
    let diaSiguienteNombre = obtenerDiaSiguienteNombre(nombre);

    return `${diaSiguienteNombre}&${diaSiguienteFecha}`;
  };

  // Obtención de fechay hora actual
  let fechaHoraActual = getFechaHoraActual();
  let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

  // Extraemos la información necesaria del objeto "result".
  const { destination, source, draggableId } = result;

  // Verificamos si se soltó el elemento fuera de cualquier lista, si es así, no sucede nada.
  if (!destination) {
    return;
  }

  // Verificamos si el elemento se soltó en su posición original.
  if (
    destination.droppableId === source.droppableId &&
    destination.index === sourceIndex
  ) {
    return;
  }

  // Creamos variables de destino y fuente.
  let destino = destination.droppableId.split("|");
  let fuente = source.droppableId.split("|");
  let posicionDestino = destination.index;

  // Se crea el elemento arrastrado
  crearElementoArrastrado();

  // Definir el tipo de elemento arrastrado
  let solicitud = elementoArrastrado.codigoNombre;
  let accion = elementoArrastrado.nombreDeLaAccion;

  // Obtenemos el día fuente y el día destino
  let diaFuente = getDiaFuente();
  let diaDestino = getDiaDestino();

  // Obtenemos las horas disponibles en el dia
  let horasDisponiblesEnElDia = getHorasDisponiblesEnElDia(destino);

  let reparticion = [];

  // Creamos variable para validar posteriormente
  let tiempoARestarEnElDia = 0;

  let idLinea;
  if (destino[0] === "solicitudes") {
    idLinea = fuente[0];
  } else {
    idLinea = destino[0];
  }

  let capacidadSalonPorDia;

  // Si el solicitud, el tiempo a restar es la cantidad a producir dividido la capacidad del salon por día.
  if (solicitud) {
    elementoArrastrado.velocidadesSalonProducto.forEach((linea) => {
      if (linea.Linea === idLinea) {
        capacidadSalonPorDia = linea.Velocidad * 24;
      }
    });
    tiempoARestarEnElDia = Math.round(
      elementoArrastrado.cantidad / capacidadSalonPorDia
    );
  }

  // Si es acción, el tiempo a restar es la duración de la acción dividido 60 minutos.
  else if (accion) {
    tiempoARestarEnElDia = elementoArrastrado.duracion;
  }

  // Si el elemento es arrastrado dentro de los contenedores de solicitudes o de acciones.
  if (destino[0] === fuente[0] && !destino[1]) {
    eliminarElementoArrastradoFuente();
    crearElementoArrastradoDestino();
    // elementoArrastrado.orden = posicionDestino;
  }

  // Si el elemento es accion y se arrastra a solicitudes o es solicitud y se arrastra a acciones.
  else if (
    (accion && destino[0] === "solicitudes") ||
    (solicitud && destino[0] === "acciones") ||
    (accion && destino[0] === "acciones")
  ) {
    toast.error("No puedes arrastrar este elemento aquí");

    return;
  } else {
    // Si el destino está en calendario
    if (destino[1]) {
      // Si viene de solicitudes o acciones
      if (!fuente[1]) {
        // Se compara las horas disponibles del día con las horas a restar
        if (horasDisponiblesEnElDia >= tiempoARestarEnElDia) {
          // Disparadores
          dispatcher("addToHistory", {
            codigo: solicitud ? solicitud : accion,
            tipoDeCambio: "Asignación a programación",
            valorPrevio: fuente[0],
            valorNuevo: `${destino[0]} ${destino[1]}`,
            notificado: 0,
            fechaDelCambio: fechaActual,
            horaDelCambio: horaActual,
            propiedad: null,
            editor: editorEstado,
            id: uuid(),
            versionDelCambio: versionEstado,
            orden: posicionDestino,
            tipo: solicitud ? "solicitud" : "accion",
            elemento: elementoArrastrado,
          });

          // Se restan las horas en el día destino
          diaDestino.horas -= tiempoARestarEnElDia;

          let elementoArrastradoCopia = JSON.parse(
            JSON.stringify(elementoArrastrado)
          );
          let elementoArrastradoEditable = JSON.parse(
            JSON.stringify(elementoArrastrado)
          );

          elementoArrastradoEditable.fecha = destino[1];
          elementoArrastradoEditable.salonProgramado = destino[0];

          if (elementoArrastrado.codigoNombre) {
            let [cod, dif] = elementoArrastradoCopia.codigoNombre.split(" ");
            if (dif) {
              elementoArrastradoCopia.codigoNombre = `${cod}_${dif}`;
            }
          }

          contenedoresActualizados.calendario[destino[0]].dias[
            destino[1]
          ].contenido.splice(posicionDestino, 0, elementoArrastradoEditable);

          // Se elimina el elemento arrastrado en la fuente
          eliminarElementoArrastradoFuente();

          dispatcher("statusUpdaters", {
            elementoArrastrado,
            destino,
            contenidoDia:
              contenedoresActualizados.calendario[destino[0]].dias[destino[1]]
                .contenido,
            tipo: solicitud ? "solicitud" : "accion",
            index: posicionDestino,
          });

          // Si es acción se debe crear una copia en su lugar
          if (accion) {
            let elementoArrastradoCopia = JSON.parse(
              JSON.stringify(elementoArrastrado)
            );
            if (elementoArrastradoCopia.idDnd) {
              elementoArrastradoCopia.idDnd = uuid();
            } else {
              elementoArrastradoCopia.idDnd = uuid();
            }

            contenedoresActualizados.acciones.splice(
              sourceIndex,
              0,
              elementoArrastradoCopia
            );
          }
        }
        // Si el tiempo a restar es mayor al tiempo disponible
        else {
          // Si directamente no hay horas disponibles, se notifica que no hay capacidad
          if (horasDisponiblesEnElDia <= 0) {
            let [dia, fecha] = destino[1].split("&");
            let [fechaDia, fechaMes] = fecha.split("/");
            toast(`El ${dia} ${fechaDia}/${fechaMes} ya no tiene capacidad.`);

            return;
          }

          if (solicitud) {
            // Obtenemos el día siguiente, nombre y fecha
            let diaSiguiente = getDiaSiguienteDe(destino);

            let salon = destino[0];

            let reparticion = [];

            let elementoCopia = JSON.parse(JSON.stringify(elementoArrastrado));

            diaSiguiente = destino[1];

            while (
              elementoCopia.cantidad / capacidadSalonPorDia >
              horasDisponiblesEnElDia
            ) {
              reparticion.push({
                ...elementoCopia,
                cantidad: capacidadSalonPorDia * horasDisponiblesEnElDia,
                fecha: diaSiguiente,
                salonProgramado: salon,
                idDnd: uuid(),
              });

              elementoCopia.cantidad -=
                capacidadSalonPorDia * horasDisponiblesEnElDia;

              horasDisponiblesEnElDia = getHorasDisponiblesEnElDia([
                salon,
                diaSiguiente,
              ]);
              diaSiguiente = getDiaSiguienteDe([salon, diaSiguiente]);
            }

            reparticion.push({
              ...elementoCopia,
              fecha: diaSiguiente,
              salonProgramado: salon,
              idDnd: uuid(),
            });

            console.log(reparticion);

            dispatcher("Creación elemento copia", {
              reparticion,
            });
          }
          // Si es acción y se está intentando asignar a un día sin la capacidad necesaria.
          else {
            toast("La capacidad del salón está llena este día");

            return;
          }
        }
      }
      // Si la solicitud viene desde algún día de calendario
      else {
        // Si el día no es el mismo
        if (destino[1] !== fuente[1]) {
          // Si hay horas disponibles en el día
          if (horasDisponiblesEnElDia >= tiempoARestarEnElDia) {
            // Se agregan horas al día fuente cuando el elemento se quita
            diaFuente.horas += parseInt(tiempoARestarEnElDia);

            // Se settea el orden con el destination.index
            elementoArrastrado.orden = posicionDestino;

            elementoArrastrado.salonProgramado = destino[0];
            elementoArrastrado.fecha = destino[1];

            // Se elimina y se crea el elemento respectivamente
            eliminarElementoArrastradoFuente();
            crearElementoArrastradoDestino();

            // Dispatchers
            dispatcher("addToHistory", {
              codigo: solicitud ? solicitud : accion,
              tipoDeCambio: "Cambio de día",
              valorPrevio: `${fuente[0]} ${fuente[1]}`,
              valorNuevo: `${destino[0]} ${destino[1]}`,
              notificado: 0,
              fechaDelCambio: fechaActual,
              horaDelCambio: horaActual,
              propiedad: null,
              editor: editorEstado,
              id: uuid(),
              versionDelCambio: versionEstado,
              orden: posicionDestino,
              tipo: solicitud ? "solicitud" : "accion",
              elemento: elementoArrastrado,
            });

            dispatcher("statusUpdaters", {
              elementoArrastrado,
              destino,
              contenidoDia:
                contenedoresActualizados.calendario[destino[0]].dias[destino[1]]
                  .contenido,
              tipo: solicitud ? "solicitud" : "accion",
              index: posicionDestino,
            });

            // Se le quitan horas al día destino
            diaDestino.horas -= parseInt(tiempoARestarEnElDia);
          } else {
            toast.error("La capacidad del salón está llena este día");
          }
        }
        // Si el día sí es el mismo
        else {
          // Se elimina y se crea el elemento respectivamente
          eliminarElementoArrastradoFuente();
          crearElementoArrastradoDestino();

          dispatcher("statusUpdaters", {
            elementoArrastrado,
            destino,
            contenidoDia:
              contenedoresActualizados.calendario[destino[0]].dias[destino[1]]
                .contenido,
            tipo: solicitud ? "solicitud" : "accion",
            index: posicionDestino,
          });
        }
      }
    } // Si el destino es solicitudes o acciones
    else {
      if (
        elementoArrastrado.codigoNombre.split(" ")[1] ||
        elementoArrastrado.codigoNombre.split("_")[1]
      ) {
        toast("No puedes arrastrar un elemento copia fuera del calendario");
        return;
      }
      // Se elimina y se crea el elemento respectivamente
      eliminarElementoArrastradoFuente();
      crearElementoArrastradoDestino();

      // Dispatchers
      dispatcher("addToHistory", {
        codigo: solicitud ? solicitud : accion,
        tipoDeCambio: "Devolución a planeación",
        valorPrevio: `${fuente[0]} ${fuente[1]}`,
        valorNuevo: `${destino[0]}`,
        notificado: 0,
        fechaDelCambio: fechaActual,
        horaDelCambio: horaActual,
        propiedad: null,
        editor: editorEstado,
        id: uuid(),
        versionDelCambio: versionEstado,
        orden: posicionDestino,
        tipo: solicitud ? "solicitud" : "accion",
        elemento: elementoArrastrado,
      });

      dispatcher("statusUpdaters", {
        elementoArrastrado,
        destino,
        contenidoDia:
          contenedoresActualizados.calendario[fuente[0]].dias[fuente[1]]
            .contenido,
        tipo: solicitud ? "solicitud" : "accion",
        fuente,
        index: posicionDestino,
      });

      // Se le agregan las horas del elemento quitado
      diaFuente.horas += parseInt(tiempoARestarEnElDia);
    }
  }

  // Se mandan los contenedores actualizados
  dispatcher("setSolicitudes", contenedoresActualizados.solicitudes);
  dispatcher("setAcciones", contenedoresActualizados.acciones);
  dispatcher("setSalones", contenedoresActualizados.calendario);
};

export default onDragEnd;
