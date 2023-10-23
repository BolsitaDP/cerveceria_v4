import { createTheme } from "@mui/material/styles";

const temaFw7 = "#007aff";
const blanco = "#fff";

const TemaClaro = createTheme({
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
          props: { variant: "iconContainer" },
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            color: temaFw7,
            borderRadius: "150px",
            padding: "1%",
            height: "4vh",
            width: "4vh",
          },
        },
      ],
    },
  },
});

export default TemaClaro;
