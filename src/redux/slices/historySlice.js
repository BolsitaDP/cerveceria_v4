import { createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import postData from "../../requests/postData";

const historySlice = createSlice({
  name: "history",
  initialState: {
    version: 1,
    cambiosSinNotificar: [],
    editor: "Usuario pruebas BPMco",
    cambios: [],
    salonSeleccionado: "2",
    destino: null,
  },
  reducers: {
    setHistorialInicial: (state, action) => {
      console.log(action.payload);
      state.cambios = action.payload;
      action.payload?.forEach((cambio) => {
        if (cambio.notificado === 0) {
          state.cambiosSinNotificar.push(cambio);
        }
      });
    },
    addToHistory: (state, action) => {
      let exists = state.cambios.find(
        (cambio) =>
          cambio.valorPrevio === action.payload.valorPrevio &&
          cambio.valorNuevo === action.payload.valorNuevo &&
          cambio.codigo === action.payload.codigo
      );
      if (!exists) {
      }
      state.cambios.push(action.payload);
      state.cambiosSinNotificar.push(action.payload);
      postData.postHistorial(action.payload);
    },
    setSalonSeleccionado: (state, action) => {
      state.salonSeleccionado = action.payload;
    },
    updateVersion: (state, action) => {
      state.version++;
    },
    setDestino: (state, action) => {
      state.destino = action.payload.destino;
    },
    changeEditor: (state, action) => {
      state.editor = action.payload;
    },
  },
});

export const {
  addToHistory,
  setSalonSeleccionado,
  setHistorialInicial,
  updateVersion,
  setDestino,
  changeEditor,
} = historySlice.actions;
export default historySlice.reducer;
