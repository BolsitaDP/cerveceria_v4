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
  deleteSolicitud,
} from "../../redux/slices/contenedoresSlice";
import { addToHistory } from "../../redux/slices/historySlice";
import BasicModal from "../MUIComponents/BasicModal";
import { CardActions, Card, Button, CardContent } from "@mui/material";
// import { Card, CardActions, Button, CardContent } from "@mui/material";

const PreguntaCrearCopia = ({ data, onClose }) => {
  const contenedores = useSelector((state) => state.contenedores);

  const [loaderVisible, setLoaderVisible] = useState(false);

  const handleRespuesta = (r) => {
    if (r === "si") {
      crearCopia();
    } else {
      onClose();
    }
  };

  const editorEstado = useSelector((state) => state.history.editor);
  const versionEstado = useSelector((state) => state.history.version);
  const salonSeleccionadoEstado = useSelector(
    (state) => state.history.salonSeleccionado
  );

  const dispatch = useDispatch();

  let { reparticion, elementoOriginal } = data;

  // ---------------------------

  async function procesarElementos(elementosParaProcesar) {
    try {
      await Promise.all(
        elementosParaProcesar.map(async (elementoCopia, index) => {
          try {
            const respuesta = await postData.postActualizarEstadoProducto([
              elementoCopia,
            ]);

            console.log(respuesta);
            return respuesta; // Retorna la respuesta para Promise.all
          } catch (error) {
            toast.error(
              `Hubo un error en la creación de solicitudes. ${error}`
            );
          }
        })
      ).then(() => {
        onClose();
        setLoaderVisible(false);
      });
    } catch (error) {
      console.log(error);
      toast(`Hubo un error en la creación de solicitudes. ${error}`);
    }
  }

  const crearCopia = () => {
    setLoaderVisible(true);

    let elementosParaProcesar = [];
    let copias = [];

    let fechaHoraActual = getFechaHoraActual();
    let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

    // Utilizar Promise.all para manejar operaciones asincrónicas
    Promise.all(
      reparticion.map((el) =>
        postData
          .postActualizarEstadoCopia(el)
          .then((res) => {
            let objResuesta = JSON.parse(JSON.stringify(res.data));
            objResuesta.idDnd = uuid();
            elementosParaProcesar.push({
              id: objResuesta.id,
              estado: "Programado",
              salonProgramado: objResuesta.salonProgramado,
              fecha: objResuesta.fecha,
              orden: objResuesta.orden,
              cantidad: parseInt(objResuesta.cantidad),
              velocidadesSalonProducto: objResuesta.velocidadesSalonProducto,
              idPadre: objResuesta.idPadre,
            });

            dispatch(
              addToHistory({
                codigo: objResuesta.codigoNombre,
                tipoDeCambio: "Asignación a programación",
                valorPrevio: "Solicitudes",
                valorNuevo: `${objResuesta.salonProgramado} ${objResuesta.fecha}`,
                notificado: 0,
                fechaDelCambio: fechaActual,
                horaDelCambio: horaActual,
                propiedad: null,
                editor: editorEstado,
                id: uuid(),
                version: versionEstado,
                // orden: posicionDestino,
                tipo: "solicitud",
                elemento: objResuesta,
                idElemento: objResuesta.idDnd,
              })
            );

            copias.push(objResuesta);
          })
          .catch((error) => {
            toast.error(
              "Ha ocurrido un error creando las copias de la solicitud: " +
                error
            );
          })
      )
    )
      .then(() => {
        postData.postDeleteSolicitud(elementoOriginal).then(() => {
          dispatch(deleteSolicitud(elementoOriginal));
        });
        // Luego de que todas las promesas se resuelven
        procesarElementos(elementosParaProcesar);
        dispatch(creacionMasDeUnaCopia(copias));

        toast("Se dividió exitosamente la producción");
      })
      .catch((error) => {
        toast.error("Ha ocurrido un error " + error);
      })
      .finally(() => onClose());

    // -------------
  };

  let salonId = reparticion[0].salonProgramado;
  let velocidadDeLaLineaParaElProducto = {};
  let horasConsumidasDelElementoOriginal;
  let horasDisponiblesPrimerDia;

  reparticion[0].velocidadesSalonProducto.forEach((vel) => {
    if (vel.Linea === salonSeleccionadoEstado) {
      velocidadDeLaLineaParaElProducto = vel;
    }
  });

  horasConsumidasDelElementoOriginal =
    elementoOriginal.cantidad / velocidadDeLaLineaParaElProducto.Velocidad;

  horasDisponiblesPrimerDia =
    contenedores.calendario[salonSeleccionadoEstado].dias[reparticion[0].fecha]
      .horas;

  console.log(contenedores);

  return (
    <BasicModal titulo={"Dividir solicitud"}>
      <Card>
        <CardContent>
          <strong>
            {reparticion[0].producto} ({reparticion[0].codigoNombre})
          </strong>{" "}
          tiene una velocidad para esta línea ({salonSeleccionadoEstado}) de{" "}
          <strong>{velocidadDeLaLineaParaElProducto.Velocidad} CJS/h</strong> lo
          que implicaría{" "}
          <strong>{parseInt(horasConsumidasDelElementoOriginal)}</strong> horas,
          pero el día <strong>{reparticion[0].fecha.split("&")[0]}</strong> solo
          dispone de{" "}
          <strong>{parseInt(horasDisponiblesPrimerDia)} horas</strong>, ¿desea
          crear una copia en el salón {salonId} los días
          {/*  eslint-disable-next-line array-callback-return */}
          {reparticion.map((element, index, array) => {
            if (typeof element === "object") {
              let [dia] = element?.fecha?.split("&");
              if (index === array.length - 1) {
                return ` y ${dia} con ${element.cantidad.toLocaleString()} CJS`;
              } else {
                return ` ${dia} con ${element.cantidad.toLocaleString()} CJS, `;
              }
            }
          })}
          ?
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleRespuesta("si")}>
            Sí
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleRespuesta("no")}>
            No
          </Button>
        </CardActions>
      </Card>
    </BasicModal>
  );
};

export default PreguntaCrearCopia;
