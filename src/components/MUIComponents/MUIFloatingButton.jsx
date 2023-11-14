import { Box, Fab, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import BallotRoundedIcon from "@mui/icons-material/BallotRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import HistorialGeneral from "../modales/FABS/HistorialGeneral";
import Insumos from "../modales/FABS/Insumos";
import PDFs from "../modales/FABS/PDFs";
import Reportes from "../modales/FABS/Reportes";
import ProgramadoProducido from "../modales/FABS/ProgramadoProducido";

const FABS = [
  {
    icon: <HistoryRoundedIcon />,
    tooltip: "Historial",
  },
  {
    icon: <BallotRoundedIcon />,
    tooltip: "Insumos",
  },
  {
    icon: <PictureAsPdfRoundedIcon />,
    tooltip: "PDF",
  },
  // {
  //   icon: <AssessmentRoundedIcon />,
  //   tooltip: "Reportes",
  // },
  // {
  //   icon: <DonutLargeRoundedIcon />,
  //   tooltip: "Programado y producido",
  // },
];

const MUIFloatingButton = () => {
  const [modalAbierto, setModalAbierto] = useState(null);

  const [FABOpen, setFABOpen] = useState(false);

  const handleOpenFAB = () => {
    setFABOpen(!FABOpen);
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          backdropFilter: FABOpen ? "blur(2px)" : "blur(0px)",
          transition: "0.3s ease all",
          zIndex: FABOpen ? "99" : "-1",
        }}
        onClick={() => setFABOpen(false)}></Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          zIndex: "999",
        }}>
        <Tooltip title="Opciones" arrow placement="left">
          <Fab
            disableElevation
            color="primary"
            aria-label="add"
            onClick={handleOpenFAB}
            sx={{
              transform: FABOpen ? "rotate(0deg)" : "rotate(270deg)",
              transition: "0.3s ease all",
              zIndex: "9999",
            }}>
            <SettingsRoundedIcon />
          </Fab>
        </Tooltip>

        {FABS.map((btn, index) => {
          return (
            <Tooltip key={index} title={btn.tooltip} arrow placement="left">
              <Fab
                key={index}
                disableElevation
                sx={{
                  position: "absolute",
                  transform: `translateY(${
                    !FABOpen ? 0 : (index + 1) * -65
                  }px)`,
                  transition: "0.3s ease all",
                  left: "0",
                }}
                onClick={() => setModalAbierto(btn.tooltip)}>
                {btn.icon}
              </Fab>
            </Tooltip>
          );
        })}
      </Box>

      <Modal
        open={modalAbierto === "Historial"}
        onClose={() => setModalAbierto(null)}>
        <HistorialGeneral />
      </Modal>

      <Modal
        open={modalAbierto === "Insumos"}
        onClose={() => setModalAbierto(null)}>
        <Insumos />
      </Modal>

      <Modal
        open={modalAbierto === "PDF"}
        onClose={() => setModalAbierto(null)}>
        <PDFs />
      </Modal>

      <Modal
        open={modalAbierto === "Reportes"}
        onClose={() => setModalAbierto(null)}>
        <Reportes />
      </Modal>

      <Modal
        open={modalAbierto === "Programado y producido"}
        onClose={() => setModalAbierto(null)}>
        <ProgramadoProducido />
      </Modal>
    </Box>
  );
};

export default MUIFloatingButton;
