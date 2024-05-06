import { useTheme } from "@emotion/react";
import { Box, Card, IconButton, Tooltip } from "@mui/material";
import React from "react";
import ShareIcon from "@mui/icons-material/Share";

const BasicModal = ({
  titulo,
  children,
  tipo = null,
  exportar,
  funcionAlDarClickExportar,
}) => {
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
            position: "relative",
          }}>
          <div>{titulo}</div>
          {exportar && (
            <div style={{ position: "absolute", right: "20px" }}>
              <Tooltip title="Exportar" arrow>
                <IconButton
                  onClick={funcionAlDarClickExportar}
                  sx={{
                    color: theme.palette.primary.contrast,
                  }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
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
