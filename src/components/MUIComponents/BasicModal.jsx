import { useTheme } from "@emotion/react";
import { Box, Card } from "@mui/material";
import React from "react";

const BasicModal = ({ titulo, children, tipo = null }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        // height: "50%",
        // width: "50%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
      <Card
        variant="contenedor"
        sx={{
          borderColor: tipo
            ? tipo === "nacional"
              ? theme.palette.primary.nacional
              : theme.palette.primary.internacional
            : "",
        }}>
        <Card
          variant="tiulo"
          sx={{
            justifyContent: "center",
            backgroundColor: tipo
              ? tipo === "nacional"
                ? theme.palette.primary.nacional
                : theme.palette.primary.internacional
              : "",
          }}>
          <div>{titulo}</div>
        </Card>
        <Box
          sx={{
            width: "100%",
            height: "calc(100% - (1ch + 10%))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}>
          {children}
        </Box>
      </Card>
    </Box>
  );
};

export default BasicModal;
