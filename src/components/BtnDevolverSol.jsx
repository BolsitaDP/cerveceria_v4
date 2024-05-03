import React, { useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { IconButton, Tooltip, Modal } from "@mui/material";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import PreguntarDevolverSolicitudes from "./modales/PreguntarDevolverSolicitudes";

const BtnDevolverSol = ({ id }) => {
  const [openPregunta, setOpenPregunta] = useState(false);

  const theme = useTheme();

  const handleDevolverSolicitudes = (re) => {
    const partes = re.split("|");

    const fechaC = partes[1];
    const fecha = fechaC.split("&");

    const fechaObjeto = new Date(fecha[1].split("/").reverse().join("-"));

    const fechaActual = new Date();
    if (fechaObjeto < fechaActual) {
      toast.error("No puedes devolver la planeación de días anteriores a hoy");
    } else {
      setOpenPregunta(true);
    }
  };

  const handleNoDevolver = () => {
    setOpenPregunta(false);
  };

  const handleSiDevolver = () => {
    setOpenPregunta(false);
  };

  return (
    <>
      <Tooltip title="Devolver día" arrow>
        <IconButton
          sx={{
            color: theme.palette.primary.main,
          }}
          onClick={() => handleDevolverSolicitudes(id)}
          className="btnDevolverSolicitudes"
          edge="end">
          <ReplayIcon className="svgDevolverSolicitudes" />
        </IconButton>
      </Tooltip>

      <Modal open={openPregunta} onClose={() => setOpenPregunta(false)}>
        <PreguntarDevolverSolicitudes
          onNoDevolver={() => handleNoDevolver()}
          onSiDevolver={() => handleSiDevolver()}
        />
      </Modal>
    </>
  );
};

export default BtnDevolverSol;
