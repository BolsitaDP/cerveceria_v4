import { Box, Card, IconButton, Modal, Tooltip } from "@mui/material";
import React from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTheme } from "@emotion/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import ModalDetallesAccion from "../modales/ModalDetallesAccion";
import { useState } from "react";
import CrearAccion from "../modales/CrearAccion";
import { useDispatch } from "react-redux";
import { deleteAccionAcciones } from "../../redux/slices/contenedoresSlice";
import { toast } from "react-toastify";

const Acciones = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [modalAbierto, setModalAbierto] = useState(null);
  const [accionAbierta, setAccionAbierta] = useState(false);

  const acciones = useSelector((state) => state.contenedores.acciones);

  const handleOpenCrearAccion = () => {
    setModalAbierto("crearAccion");
  };

  const handleOpenDetalles = (accion) => {
    setModalAbierto("detallesAccion");
    setAccionAbierta(accion);
  };

  const handleDeleteAccion = (accion) => {
    dispatch(deleteAccionAcciones(accion));
  };

  return (
    <Box sx={{ height: "34%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Actividades</p>
          <Tooltip title="Agregar actividad" arrow>
            <IconButton
              sx={{ color: theme.palette.primary.contrast }}
              onClick={handleOpenCrearAccion}
              edge="end">
              <AddRoundedIcon />
            </IconButton>
          </Tooltip>
        </Card>

        <Droppable droppableId="acciones" key="acciones">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {acciones.map((accion, index) => {
                let accionId = accion.idDnd;
                return (
                  <Draggable
                    draggableId={accionId}
                    index={index}
                    key={accionId}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleOpenDetalles(accion)}
                        ref={provided.innerRef}>
                        <div>
                          {accion.nombreDeLaAccion.slice(0, 11)}
                          {accion.nombreDeLaAccion.length >= 11 && "..."}
                          <Tooltip title="Eliminar actividad" arrow>
                            <IconButton
                              sx={{ color: theme.palette.primary.contrast }}
                              onClick={() => handleDeleteAccion(accion)}
                              edge="end">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div>
                          <span>{accion.duracion} minutos</span>
                          <span>{accion.tipo}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Modal
          open={modalAbierto === "detallesAccion"}
          onClose={() => setModalAbierto(null)}>
          <ModalDetallesAccion accionAbierta={accionAbierta} />
        </Modal>
        <Modal
          open={modalAbierto === "crearAccion"}
          onClose={() => setModalAbierto(null)}>
          <CrearAccion />
        </Modal>
      </Card>
    </Box>
  );
};

export default Acciones;
