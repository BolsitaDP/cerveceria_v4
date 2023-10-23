import { Box, Card, IconButton } from "@mui/material";
import React from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTheme } from "@emotion/react";

const Acciones = () => {
  const theme = useTheme();
  return (
    <Box sx={{ height: "34%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Actividades</p>
          <IconButton
            sx={{ color: theme.palette.primary.contrast }}
            aria-label="delete filter search"
            // onClick={handleMostrarFiltro}
            edge="end">
            <AddRoundedIcon />
          </IconButton>
        </Card>
      </Card>
    </Box>
  );
};

export default Acciones;
