import React from "react";

import { v4 as uuid } from "uuid";

import { useDispatch, useSelector } from "react-redux";

// import postActualizarEstadoProducto from "../../requests/postActualizarEstadoProducto";
// import postActualizarEstadoCopia from "../../requests/postActualizarEstadoCopia";
import { toast } from "react-toastify";
import { useState } from "react";
import getFechaHoraActual from "../../helpers/getFechaHoraActual";
import postData from "../../requests/postData";
import {
  creacionCopia,
  creacionMasDeUnaCopia,
} from "../../redux/slices/contenedoresSlice";
import { addToHistory } from "../../redux/slices/historySlice";

const PreguntaCrearCopia = ({ responder, data }) => {
  const contenedores = useSelector((state) => state.contenedores);

  const [loaderVisible, setLoaderVisible] = useState(false);

  const handleRespuesta = (r) => {
    if (r === "si") {
      crearCopia();
    } else {
      responder();
    }
  };

  const editorEstado = useSelector((state) => state.history.editor);
  const versionEstado = useSelector((state) => state.history.version);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  const dispatch = useDispatch();

  let {
    elementoArrastrado,
    elementoArrastradoCopia,
    destino,
    destinoCopia,
    indexElementoArrastrado,
    reparticion,
  } = data;

  // ---------------------------

  async function procesarElementos({
    elementosParaProcesar,
    elementosEnteros,
  }) {
    let numDePeticionesCompletas = 0;
    let fechaHoraActual = getFechaHoraActual();
    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    try {
      const respuestas = await Promise.all(
        elementosParaProcesar.map(async (elementoCopia, index) => {
          console.log(elementoCopia);
          try {
            if (elementoCopia.codigoNombre?.split(" ")[1]) {
              const respuesta = await postData.postActualizarEstadoCopia(
                elementoCopia
              );
              console.log("Respuesta recibida:", respuesta);
              numDePeticionesCompletas++;
              dispatch(
                addToHistory({
                  codigo: elementoCopia.codigoNombre,
                  tipoDeCambio: "Asignación a programación",
                  valorPrevio: "Solicitudes",
                  valorNuevo: `${elementoCopia.salonProgramado} ${elementoCopia.fecha}`,
                  notificado: 0,
                  fechaDelCambio: fechaActual,
                  horaDelCambio: horaActual,
                  propiedad: null,
                  editor: editorEstado,
                  id: uuid(),
                  versionDelCambio: versionEstado,
                  // orden: posicionDestino,
                  tipo: "solicitud",
                  elemento: elementosEnteros[index],
                })
              );

              return respuesta; // Retorna la respuesta para Promise.all
            } else {
              const respuesta = await postData.postActualizarEstadoProducto([
                elementoCopia,
              ]);
              console.log("Respuesta recibida:", respuesta);
              numDePeticionesCompletas++;

              dispatch(
                addToHistory({
                  codigo: elementosEnteros[index].codigoNombre,
                  tipoDeCambio: "Asignación a programación",
                  valorPrevio: "Solicitudes",
                  valorNuevo: `${elementoCopia.salonProgramado} ${elementoCopia.fecha}`,
                  notificado: 0,
                  fechaDelCambio: fechaActual,
                  horaDelCambio: horaActual,
                  propiedad: null,
                  editor: editorEstado,
                  id: uuid(),
                  versionDelCambio: versionEstado,
                  // orden: posicionDestino,
                  tipo: "solicitud",
                  elemento: elementosEnteros[index],
                })
              );

              return elementosEnteros[index];
            }
          } catch (error) {
            toast.error(
              `Hubo un error en la creación de solicitudes. ${error}`
            );
          }
        })
      );

      if (numDePeticionesCompletas === elementosParaProcesar.length) {
        dispatch(
          creacionMasDeUnaCopia({
            respuestas,
          })
        );

        responder();
        setLoaderVisible(false);
      }
    } catch (error) {
      toast(`Hubo un error en la creación de solicitudes. ${error}`);
    }
  }

  const crearCopia = () => {
    setLoaderVisible(true);

    if (reparticion) {
      // Luego puedes llamar a esta función con un array de elementos que desees procesar
      let elementosParaProcesar = [];

      Object.values(reparticion[0]).forEach((el) => {
        if (el.codigoNombre?.split(" ")[1]) {
          elementosParaProcesar.push({
            id: el.id,
            cantidad: el.cantidad,
            codigoNombre: el.codigoNombre,
            estado: "Programado",
            salonProgramado: el.salonProgramado,
            fecha: el.fecha,
            orden: 0,
            velocidadesSalonProducto: el.velocidadesSalonProducto,
          });
        } else if (el.codigoNombre) {
          elementosParaProcesar.push({
            id: el.id,
            estado: "Programado",
            salonProgramado: el.salonProgramado,
            fecha: el.fecha,
            orden: el.orden,
            cantidad: el.cantidad,
            velocidadesSalonProducto: el.velocidadesSalonProducto,
          });
        }
      });

      let elementosEnteros = Object.values(reparticion[0]);

      procesarElementos({ elementosParaProcesar, elementosEnteros });
      toast(`Se dividió exitosamente la producción`);
    } else {
      let [nombre, fecha] = destino[1].split("&");

      let horasDiaActual =
        contenedores.calendario[destino[0]].dias[destino[1]].horas;
      let horasDiaSiguiente =
        contenedores.calendario[destinoCopia[0]].dias[destinoCopia[1]].horas;

      // let capacidadSalon = contenedores.calendario[destino[0]].capacidadHora;
      let capacidadSalon;

      elementoArrastrado.velocidadesSalonProducto.forEach((linea) => {
        if (linea.Linea === salonSeleccionadoEstado) {
          // let minutosRestar = elementoArrastrado.cantidad / linea.Velocidad;
          capacidadSalon = linea.Velocidad * 60;
        }
      });

      if (
        horasDiaSiguiente >=
        elementoArrastradoCopia.cantidad / capacidadSalon
      ) {
        let elementoArrastradoCopiaEditable = JSON.parse(
          JSON.stringify(elementoArrastradoCopia)
        );
        let [codigoOrg, diferenciador] =
          elementoArrastradoCopiaEditable.codigoNombre.split(" ");
        elementoArrastradoCopiaEditable.codigoNombre = `${codigoOrg} ${diferenciador}`;
        elementoArrastradoCopiaEditable.fecha = destinoCopia[1];
        elementoArrastradoCopiaEditable.salonProgramado = destinoCopia[0];
        elementoArrastradoCopiaEditable.idDnd = uuid();

        console.log(elementoArrastradoCopiaEditable);

        let elementoArrastradoEditable = JSON.parse(
          JSON.stringify(elementoArrastrado)
        );

        elementoArrastradoEditable.cantidad = horasDiaActual * capacidadSalon;
        elementoArrastradoEditable.salonProgramado = destino[0];
        elementoArrastradoEditable.fecha = destino[1];
        elementoArrastradoEditable.idDnd = uuid();

        let solicitudAUpdatear = [];
        let elementoOriginal = {
          id: elementoArrastradoEditable.id,
          estado: "Programado",
          salonProgramado: destino[0],
          fecha: destino[1],
          orden: indexElementoArrastrado,
          cantidad: elementoArrastradoEditable.cantidad,
        };
        solicitudAUpdatear.push(elementoOriginal);

        postData.postActualizarEstadoProducto(solicitudAUpdatear);

        let elementoCopia = {
          id: elementoArrastradoCopia.id,
          cantidad: elementoArrastradoCopia.cantidad,
          codigoNombre: elementoArrastradoCopiaEditable.codigoNombre,
          estado: "Programado",
          salonProgramado: destino[0],
          fecha: destinoCopia[1],
          orden:
            contenedores.calendario[destino[0]].dias[destinoCopia[1]].contenido
              .length,
          velocidadesSalonProducto:
            elementoArrastradoCopia.velocidadesSalonProducto,
        };

        postData
          .postActualizarEstadoCopia(elementoCopia)
          .then((respuesta) => {
            dispatch(
              creacionCopia({
                elementoArrastradoCopia: respuesta,
                elementoOriginal: elementoArrastradoEditable,
              })
            );

            responder();
            setLoaderVisible(false);
          })
          .catch((error) => {
            toast(`Hubo un error en la creación de solicitudes. ${error}`);
          });

        let fechaHoraActual = getFechaHoraActual();
        let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

        dispatch(
          addToHistory({
            codigo: elementoArrastradoCopia.codigoNombre,
            tipoDeCambio: "Asignación a programación",
            valorPrevio: "solicitudes",
            valorNuevo: `${destinoCopia[0]} ${destinoCopia[1]}`,
            notificado: 0,
            fechaDelCambio: fechaActual,
            horaDelCambio: horaActual,
            propiedad: null,
            editor: editorEstado,
            id: uuid(),
            versionDelCambio: versionEstado,
            // orden: posicionDestino,
            tipo: "solicitud",
            elemento: elementoArrastrado,
          })
        );

        let [, fechaCopia] = destinoCopia;
        let [nombreCopia, diaCopia] = fechaCopia.split("&");

        toast(
          `Se dividió exitosamente la producción entre ${nombre} - ${fecha} y ${nombreCopia} - ${diaCopia}`
        );
      } else {
      }
    }

    // -------------
  };
  if (reparticion) {
    let primerElementoArrastrado = reparticion[0].elementoArrastradoEditable;

    let [, salonId] = primerElementoArrastrado.salonProgramado.split("_");

    return (
      <div>
        <div>Información</div>
        <div>
          <div>
            El elemento que quiere arrastrar supera la cantidad restante del
            salón, ¿desea crear una copia en el salón {salonId} los días
            {/*  eslint-disable-next-line array-callback-return */}
            {Object.values(reparticion[0]).map((element) => {
              if (typeof element === "object") {
                let [dia, fecha] = element?.fecha?.split("&");
                return ` ${dia} ${fecha} `;
              }
            })}{" "}
            con las cantidades faltantes?
          </div>
          <div>
            <button onClick={() => handleRespuesta("si")}>Sí</button>
            <button onClick={() => handleRespuesta("no")}>No</button>
          </div>
        </div>
      </div>
    );
  } else {
    let [, idSalonOriginal] = destino[0].split("_");

    let [, fechaCopia] = destinoCopia;
    let [nombreCopia, diaCopia] = fechaCopia.split("&");

    return (
      <div>
        <div>Información</div>
        <div>
          <div>
            El elemento que quiere arrastrar supera la cantidad restante del
            salón, ¿desea crear una copia en el salón {idSalonOriginal} el día{" "}
            {nombreCopia} {diaCopia} con la cantidad faltante?
          </div>
          <div>
            <button onClick={() => handleRespuesta("si")}>Sí</button>
            <button onClick={() => handleRespuesta("no")}>No</button>
          </div>
        </div>
      </div>
    );
  }
};

export default PreguntaCrearCopia;
