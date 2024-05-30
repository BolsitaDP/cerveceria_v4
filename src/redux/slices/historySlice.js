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
    salonSeleccionado: "1A",
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
      // const cambiosRealizados = state.cambios.filter((cambio) => {
      //   const exists = state.cambiosSinNotificar.find(
      //     (x) => JSON.stringify(x) === JSON.stringify(cambio)
      //   );
      //   return exists;
      // });

      // if (cambiosRealizados.length > 0) {
      //   state.version++;
      //   cambiosRealizados.forEach((cambio) => {
      //     const index = state.cambiosSinNotificar.findIndex(
      //       (k) => JSON.stringify(k) === JSON.stringify(cambio)
      //     );
      //     cambio.notificado = 1;
      //     state.cambiosSinNotificar.splice(index, 1);
      //   });
      //   toast.success(
      //     `Cambios de versión ${
      //       parseInt(state.version) - 1
      //     } notificados correctamente`
      //   );
      // } else {
      //   toast("No hay cambios a notificar");
      // }

      state.version++;
    },
    setDestino: (state, action) => {
      state.destino = action.payload.destino;
    },
  },
});

export const {
  addToHistory,
  setSalonSeleccionado,
  setHistorialInicial,
  updateVersion,
  setDestino,
} = historySlice.actions;
export default historySlice.reducer;
