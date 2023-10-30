import { Box, Card, IconButton, Tooltip } from "@mui/material";
import React from "react";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useTheme } from "@emotion/react";

const Calendario = () => {
  const theme = useTheme();
  return (
    <Box sx={{ height: "100%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Calendario</p>
          <Tooltip title="Seleccionar fecha" arrow>
            <IconButton
              sx={{ color: theme.palette.primary.contrast }}
              // onClick={handleMostrarFiltro}
              edge="end">
              <CalendarTodayRoundedIcon />
            </IconButton>
          </Tooltip>
        </Card>
      </Card>
    </Box>
  );
};

export default Calendario;
