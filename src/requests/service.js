import axios from "axios";

const testURL = `/api_cerveceria/v1/`;

const peticion = axios.create({
  baseURL: testURL,
  headers: {
    Authorization: `Basic Q2VydmVjZXJpYUludGVncmF0aW9uOkJQTWNvJDAkMjAyMw==`,
    // "Content-Type": "application/json",
  },
});

export default peticion;
