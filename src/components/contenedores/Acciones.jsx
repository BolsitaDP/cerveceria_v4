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
import Accion from "../MUIComponents/Accion";

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
        <Card variant="tiulo" sx={{ fontSize: "17px" }}>
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
            <Box
              sx={{
                padding: "10px",
                gap: "10px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                height: "26vh",
                overflow: "auto",
                transition: "0.3s ease all",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {acciones.map((accion, index) => {
                return (
                  <Draggable
                    draggableId={accion.idDnd}
                    index={index}
                    key={accion.idDnd}>
                    {(provided, snapshot) => (
                      <Box
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <Accion
                          key={index}
                          accion={accion}
                          index={index}
                          handleOpenDetalles={handleOpenDetalles}
                          handleDeleteAccion={handleDeleteAccion}
                        />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
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
