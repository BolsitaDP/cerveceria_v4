import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/x-date-pickers/locales";

const temaFw7 = "#007aff";
const blanco = "#fff";
const nacional = "#5c65c0";
const internacional = "#f05d67";

const TemaClaro = createTheme(
  {
    palette: {
      type: "light",
      primary: {
        main: "#007aff",
        contrast: blanco,
        nacional: nacional,
        internacional: internacional,
      },
      secondary: {
        main: blanco,
        contrast: temaFw7,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
        variants: [
          {
            props: { variant: "contenedor" },
            style: {
              width: "100%",
              height: "100%",
              borderRadius: 5,
              border: "3px solid",
              borderColor: temaFw7,
            },
          },
          {
            props: { variant: "tiulo" },
            style: {
              color: blanco,
              display: "flex",
              justifyContent: "space-between",
              padding: "1% 10% ",
              alignItems: "center",
              backgroundColor: temaFw7,
              fontSize: "2.5vh",
              transition: "0.3s ease all",
            },
          },
          {
            props: { variant: "solicitud nacional" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              alignItems: "center",
              backgroundColor: nacional,
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
            },
          },
          {
            props: { variant: "solicitud internacional" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              alignItems: "center",
              backgroundColor: internacional,
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
            },
          },
          {
            props: { variant: "accion correctiva" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              width: "200px",
              alignItems: "center",
              backgroundColor: "#6f95ff",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
              maxHeight: "100px",
            },
          },
          {
            props: { variant: "accion operativa" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              width: "200px",
              alignItems: "center",
              backgroundColor: "#faa191",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
              maxHeight: "100px",
            },
          },
          {
            props: { variant: "accion notas" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              width: "200px",
              alignItems: "center",
              backgroundColor: "#6FD673",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
              maxHeight: "100px",
            },
          },
          {
            props: { variant: "accion horario" },
            style: {
              color: blanco,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1% 10% ",
              width: "200px",
              alignItems: "center",
              backgroundColor: "#55d6c2",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "50px",
              borderRadius: "5px",
              maxHeight: "100px",
            },
          },
        ],
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            width: "40%",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
    },
  },
  esES
);

export default TemaClaro;
