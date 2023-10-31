import { Box, Card } from "@mui/material";
import React from "react";

const BasicModal = ({ titulo, children }) => {
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
      <Card variant="contenedor">
        <Card variant="tiulo" sx={{ justifyContent: "center" }}>
          <p>{titulo}</p>
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
