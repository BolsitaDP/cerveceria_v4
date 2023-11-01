import { createSlice } from "@reduxjs/toolkit";

const dataPDFSlice = createSlice({
  name: "pdfData",
  initialState: {
    title: null,
    selectedProperty: null,
    productos: null,
    salon: null,
    diaSeleccionado: null,
    pdfTitle: null,
  },
  reducers: {
    setTitleState: (state, action) => {
      state.title = action.payload;
    },
    setSelectedPropertyState: (state, action) => {
      state.selectedProperty = action.payload;
    },
    setProductosState: (state, action) => {
      state.productos = action.payload;
    },
    setSalonState: (state, action) => {
      state.salon = action.payload;
    },
    setDiaSeleccionadoState: (state, action) => {
      state.diaSeleccionado = action.payload;
    },
    setPdfTitleState: (state, action) => {
      state.pdfTitle = action.payload;
    },
  },
});

export const {
  setTitleState,
  setSelectedPropertyState,
  setProductosState,
  setSalonState,
  setDiaSeleccionadoState,
  setPdfTitleState,
} = dataPDFSlice.actions;
export default dataPDFSlice.reducer;
