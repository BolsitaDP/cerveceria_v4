import axios from "axios";
// import store from "../redux/store";

const testURL = `https://sqadccorpwapp1:4430/api_cerveceria/v1/`;

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
    const userRole = await getUserRole();

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
