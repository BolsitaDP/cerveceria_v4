import { Box, Card } from "@mui/material";
import React from "react";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

const Calendario = () => {
  return (
    <Box sx={{ height: "34%" }}>
      <Card variant="contenedor">
        <Card variant="tiulo">
          <p>Actividades</p>
          <Card variant="iconContainer">
            <CalendarTodayRoundedIcon sx={{ fontSize: "3vh" }} />
          </Card>
        </Card>
      </Card>
    </Box>
  );
};

export default Calendario;
