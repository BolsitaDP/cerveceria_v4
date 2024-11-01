import axios from "axios";

const apiUrl = process.env.REACT_APP_URL;

const testURL = "https://icasa.bpmco.co/api_cerveceria/v1/";

const peticion = axios.create({
  baseURL: testURL,
  headers: {
    Authorization: `Basic Q2VydmVjZXJpYUludGVncmF0aW9uOkJQTWNvJDAkMjAyMw==`,
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
