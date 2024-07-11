import { changeEditor } from "../redux/slices/historySlice";
import { changeRole } from "../redux/slices/userSlice";
import store from "../redux/store";
import peticion from "../requests/service";

const testURL = `/api_cerveceria/v1/`;

const headers = {
  Authorization: `Basic Q2VydmVjZXJpYUludGVncmF0aW9uOkJQTWNvJDAkMjAyMw==`,
  "Content-Type": "application/json",
};

const setPermiso = () => {
  //Cuando el back funcione

  let usuNombre = "Luisa Valey";

  fetch(`${testURL}RolesController/getRol?usuNombre=${usuNombre}`, {
    method: "GET",
    headers: headers,
  }).then((res) => {
    // store.dispatch(changeRole(res.usuRol));
    store.dispatch(changeEditor(res.usuNombre));
  });

  store.dispatch(changeRole("administrador"));

  // let usuNombre = window.parent.dataUsu.usu_nombre;
  // let permiso = peticion.get("RolesController/getRol", {
  //   usuNombre: usuNombre,
  // });

  // let permiso = "administrador";

  // store.dispatch(changeRole(permiso));
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
