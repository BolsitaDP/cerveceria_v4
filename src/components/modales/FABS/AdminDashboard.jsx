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
import postData from "../../../requests/postData";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [accion, setAccion] = useState("");

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
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

  const handleConfirmation = async (res) => {
    setConfirmacionAccion(false);

    if (res === "no") {
      return;
    }

    let respuesta;

    try {
      if (accion === "crear") {
        respuesta = await postData.postAddUsuario({
          usuNombre: nombreUsuario.toUpperCase(),
          usuCorreo: correoUsuario,
        });
      } else if (accion === "permisos") {
        respuesta = await postData.postUpdateRolUsuario({
          usuCorreo: correoUsuario,
          usuRol: tipoPermiso,
        });
      } else if (accion === "eliminar") {
        respuesta = await postData.postDesactivarUsuario({
          usuCorreo: correoUsuario,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(`Hubo un error. Intenta de nuevo más tarde ${error}`);
      return;
    }

    console.log(respuesta);
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
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <TextField
              sx={{
                width: "20vw",
                display: !accion && "none",
              }}
              label="Correo del usuario"
              variant="standard"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
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
        <ConfirmarCambioRoles
          handleConfirmation={handleConfirmation}
          accion={accion}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
