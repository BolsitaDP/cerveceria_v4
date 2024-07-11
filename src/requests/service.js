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
  async (config) => {
    const { getUserRole, checkPermissionForRole } = await import(
      "../helpers/permissionUtils"
    );
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

export default peticion;
