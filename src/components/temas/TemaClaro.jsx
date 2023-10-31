import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/x-date-pickers/locales";

const temaFw7 = "#007aff";
const blanco = "#fff";

const TemaClaro = createTheme(
  {
    palette: {
      type: "light",
      primary: {
        main: "#007aff",
        contrast: blanco,
      },
      secondary: {
        main: "#ff6f61",
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
              backgroundColor: "#5c65c0",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "80px",
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
              backgroundColor: "#f05d67",
              fontSize: "2vh",
              transition: "0.3s ease all",
              minHeight: "80px",
              borderRadius: "5px",
            },
          },
        ],
      },
    },
  },
  esES
);

export default TemaClaro;
