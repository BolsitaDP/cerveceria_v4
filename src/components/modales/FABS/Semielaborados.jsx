import React, { useState } from "react";
import BasicModal from "../../MUIComponents/BasicModal";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";

const Semielaborados = () => {
  const [checkedTotales, setCheckedTotales] = useState(false);

  const handleCheckedTotales = () => {
    setCheckedTotales(!checkedTotales);
  };

  let columns = [
    {
      field: "producto",
      headerName: "Producto",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "semielaborado",
      headerName: "Semielaborado",
      flex: 1,
      minWidth: 250,
    },
  ];

  let columnsTotalesActivo = [
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "semielaborado",
      headerName: "Semielaborado",
      flex: 1,
      minWidth: 250,
    },
  ];

  return (
    <BasicModal titulo={"Reportes de semielaborados"}>
      <Box
        sx={{
          padding: "10px",
          width: "100%",
          minWidth: "max-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          maxHeight: "70px",
          // backgroundColor: theme.palette.primary.main,
        }}>
        <FormControlLabel
          control={
            <Switch checked={checkedTotales} onChange={handleCheckedTotales} />
          }
          label="Totales"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          minHeight: "180px",
          height: "50vh",
          width: "100%",
          padding: "5px",
          // height: "60vh",
          // width: "60vw",
        }}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            // rows={checkedTotales ? totales : elementosEnGrid}
            rows={[]}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            columns={checkedTotales ? columnsTotalesActivo : columns}
            // columns={[]}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

export default Semielaborados;
