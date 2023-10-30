import { Box, Card } from "@mui/material";
import React from "react";

const BasicModal = ({ titulo, children }) => {
  return (
    <Box
      sx={{
        height: "50%",
        position: "absolute",
        width: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
      <Card variant="contenedor">
        <Card variant="tiulo" sx={{ justifyContent: "center" }}>
          <p>{titulo}</p>
        </Card>
        {children}
      </Card>
    </Box>
  );
};

export default BasicModal;
