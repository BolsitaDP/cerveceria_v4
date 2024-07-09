import axios from "axios";
// import store from "../redux/store";

const testURL = `/api_cerveceria/v1/`;

const peticion = axios.create({
  baseURL: testURL,
  headers: {
    Authorization: `Basic Q2VydmVjZXJpYUludGVncmF0aW9uOkJQTWNvJDAkMjAyMw==`,
    // "Content-Type": "application/json",
  },
});

peticion.interceptors.request.use(
  (config) => {
    const userRole = getUserRole();

    if (!checkPermissionForRole(userRole)) {
      return Promise.reject({ message: "Forbidden" });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const checkPermissionForRole = (role) => {
  if (role === "administrador") {
    // Si es administrador, puede hacer peticiones
    return true;
  } else {
    // Si no es administrador no puede hacer peticiones
    // return false

    return true; //Quitar esta línea cuando ya funcione la autenticación con el back bien
  }
};

const getUserRole = () => {
  // let state = store.getState();
  // return state.user.role;
};

export default peticion;
