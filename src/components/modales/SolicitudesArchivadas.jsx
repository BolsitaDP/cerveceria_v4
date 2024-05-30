import React from "react";
import BasicModal from "../MUIComponents/BasicModal";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";
import postData from "../../requests/postData";
import { toast } from "react-toastify";
import { desarchivarSolicitud } from "../../redux/slices/contenedoresSlice";
import getFechaHoraActual from "../../helpers/getFechaHoraActual";
import { addToHistory } from "../../redux/slices/historySlice";

const SolicitudesArchivadas = ({ onClose }) => {
  const solicitudesArchivadas = useSelector(
    (state) => state.contenedores.solicitudesArchivadas
  );
  const versionEstado = useSelector((state) => state.history.version);
  const editorEstado = useSelector((state) => state.history.editor);

  console.log(solicitudesArchivadas);

  let fechaHoraActual = getFechaHoraActual();

  const dispatch = useDispatch();

  const handleDesarchivarSolicitud = (sol) => {
    let solicitudUpdatear = [];

    let objeto = {
      id: sol.id,
      estado: "",
      salonProgramado: "",
      fecha: "",
      orden: sol.orden,
      cantidad: sol.cantidad,
    };
    solicitudUpdatear.push(objeto);

    postData
      .postActualizarEstadoProducto(solicitudUpdatear)
      .then((res) => {
        dispatch(desarchivarSolicitud(sol));

        toast.success(
          `Solicitud ${sol.codigoNombre} desarchivada exitosamente`
        );

        let [fechaActual, horaActual] = fechaHoraActual.split(" - ");

        let editedProperty = {
          codigo: sol.codigoNombre,
          tipoDeCambio: "Desarchivar",
          propiedad: "",
          valorPrevio: "Archivo",
          valorNuevo: "solicitudes",
          notificado: 0,
          fechaDelCambio: fechaActual,
          horaDelCambio: horaActual,
          version: versionEstado,
          editor: editorEstado,
          idElemento: sol.idDnd,
        };

        dispatch(addToHistory(editedProperty));
      })
      .catch((err) => {
        toast.error(
          `Ha ocurrido un error desarchivando la solicitud ${sol.codigoNombre}: ${err}`
        );
      })
      .finally(() => onClose());
  };

  return (
    <BasicModal titulo={"Solicitudes archivadas"}>
      <Box
        sx={{
          width: "60vw",
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "30px 10px",
          gap: "10px",
          overflow: "auto",
        }}>
        {solicitudesArchivadas.map((sol, index) => {
          let solNacional = sol.tipoRequerimiento === "PRODUCCIÓN LOCAL";
          let salonesEnDondeEstaDisponible = [];
          sol.velocidadesSalonProducto.forEach((salon) => {
            salonesEnDondeEstaDisponible.push(salon.Linea);
          });
          return (
            <Box
              sx={{
                border: `2px solid ${solNacional ? "#5c65c0" : "#f05d67"}`,
                borderRadius: "10px",
                padding: "0 10px 10px 10px",
                display: "flex",
                flexDirection: "column",
                width: "30%",
              }}
              key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                {sol.codigoNombre}
                <Tooltip title="Desarchivar solicitud" arrow>
                  <IconButton
                    sx={{ color: `${solNacional ? "#5c65c0" : "#f05d67"}` }}
                    onClick={() => handleDesarchivarSolicitud(sol)}
                    edge="end">
                    <UnarchiveIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>{sol.producto}</Box>
              <Box>
                <strong>{sol.cantidad.toLocaleString()} CJ</strong>
              </Box>
              <Box>Requerido para: {sol.fechaRequiere}</Box>
              <Box>
                Salones donde está disponible:{" "}
                <strong>{salonesEnDondeEstaDisponible.join("-")}</strong>
              </Box>
            </Box>
          );
        })}
      </Box>
    </BasicModal>
  );
};

export default SolicitudesArchivadas;
