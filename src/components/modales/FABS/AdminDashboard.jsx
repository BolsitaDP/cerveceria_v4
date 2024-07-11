import React from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box } from "@mui/material";

const AdminDashboard = () => {
  return (
    <BasicModal titulo={"Panel de administrador"}>
      <Box
        sx={{
          height: "60vh",
          width: "60vw",
        }}></Box>
    </BasicModal>
  );
};

export default AdminDashboard;
