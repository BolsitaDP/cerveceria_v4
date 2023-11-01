import { createSlice } from "@reduxjs/toolkit";

const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    diasDeLaSemana: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  reducers: {},
});

export default utilsSlice.reducer;
