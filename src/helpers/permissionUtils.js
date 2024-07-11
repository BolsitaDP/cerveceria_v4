import { changeRole } from "../redux/slices/userSlice";
import store from "../redux/store";
import peticion from "../requests/service";

const setPermiso = () => {
  //Cuando el back funcione
  // let usuNombre = window.parent.dataUsu.usu_nombre;
  // let permiso = peticion.get("RolesController/getRol", {
  //   usuNombre: usuNombre,
  // });

  let permiso = "administrador";

  store.dispatch(changeRole(permiso));
};

export const getUserRole = () => {
  setPermiso();

  let state = store.getState();

  return state.user.role;
};

export const checkPermissionForRole = (role) => {
  if (role === "administrador") {
    // Si es administrador, puede hacer peticiones
    return true;
  } else {
    // Si no es administrador no puede hacer peticiones
    return false;
  }
};
