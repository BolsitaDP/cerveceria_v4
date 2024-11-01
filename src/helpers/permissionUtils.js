import { changeEditor } from "../redux/slices/historySlice";
import { changeRole } from "../redux/slices/userSlice";
import store from "../redux/store";
import peticion from "../requests/service";

const testURL = `https://icasa.bpmco.co/api_cerveceria/v1/`;

const apiUrl = process.env.REACT_APP_URL;
console.log(apiUrl);

const headers = {
  Authorization: `Basic Q2VydmVjZXJpYUludGVncmF0aW9uOkJQTWNvJDAkMjAyMw==`,
  "Content-Type": "application/json",
};

const setPermiso = async () => {
  //Cuando el back funcione

  let usuNombre;
  if (window.location.href.includes("localhost")) {
    usuNombre = "Luisa Valey";
  } else {
    usuNombre = window.parent.dataUsu.usu_nombre;
  }

  await fetch(`${testURL}RolesController/getRol?usuNombre=${usuNombre}`, {
    method: "GET",
    headers: headers,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      store.dispatch(changeRole(data[0].usuRol));
      store.dispatch(changeEditor(data[0].usuNombre));
    })
    .catch((error) => {
      console.error("Hubo un problema al validar autorización", error);
    });
};

export const getUserRole = async () => {
  await setPermiso();

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
