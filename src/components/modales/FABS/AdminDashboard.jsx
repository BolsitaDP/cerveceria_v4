import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import ConfirmarCambioRoles from "../ConfirmarCambioRoles";

const AdminDashboard = () => {
  const [accion, setAccion] = useState("");
  const [tipoPermiso, setTipoPermiso] = useState("");
  const [confirmacionAccion, setConfirmacionAccion] = useState(false);

  const handleAccion = (accion) => {
    setAccion(accion);
  };

  const handleEjecutarAccion = () => {
    setConfirmacionAccion(true);
  };

  const handleChangeTipoPermiso = (e) => {
    setTipoPermiso(e.target.value);
  };

  const handleConfirmation = (res) => {
    console.log(res);
  };

  return (
    <div>
      <BasicModal titulo={"Panel de administrador"}>
        <Box
          sx={{
            padding: "10px",
            width: "100%",
            minWidth: "max-content",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginY: "5vh",
          }}>
          <Button onClick={() => handleAccion("crear")} variant="contained">
            Crear usuario
          </Button>
          <Button onClick={() => handleAccion("permisos")} variant="contained">
            Asignar permisos
          </Button>
          <Button onClick={() => handleAccion("eliminar")} variant="contained">
            Eliminar usuario
          </Button>
        </Box>
        <Box
          sx={{
            width: "60vw",
          }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
              marginTop: "5vh",
            }}>
            <TextField
              sx={{
                width: "20vw",
                display: accion !== "crear" && "none",
              }}
              label="Nombre del usuario"
              variant="standard"
            />
            <TextField
              sx={{
                width: "20vw",
                display: !accion && "none",
              }}
              label="Correo del usuario"
              variant="standard"
            />

            <FormControl
              sx={{
                width: "20vw",
                display: accion !== "permisos" && "none",
              }}>
              <InputLabel id="demo-simple-select-label">Rol</InputLabel>
              <Select
                value={tipoPermiso}
                label="Rol"
                onChange={handleChangeTipoPermiso}>
                <MenuItem value={"usuario"}>Usuario</MenuItem>
                <MenuItem value={"administrador"}>Administrador</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
              marginY: "10vh",
            }}>
            <Button
              onClick={handleEjecutarAccion}
              sx={{
                display: !accion && "none",
              }}
              variant="contained">
              {`${
                accion === "crear"
                  ? "Crear usuario"
                  : accion === "permisos"
                  ? "Asignar permisos"
                  : "Eliminar usuario"
              }`}
            </Button>
          </Box>
        </Box>
      </BasicModal>
      <Modal
        open={confirmacionAccion}
        onClose={() => setConfirmacionAccion(false)}>
        <ConfirmarCambioRoles handleConfirmation={handleConfirmation} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
