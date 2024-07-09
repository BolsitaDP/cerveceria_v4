import { configureStore } from "@reduxjs/toolkit";

import contenedoresReducer from "./slices/contenedoresSlice";
import historyReducer from "./slices/historySlice";
import utilsReducer from "./slices/utilsSlice";
import datesReducer from "./slices/datesSlice";
import groupsReducer from "./slices/gruposSlice";
import pdfDataReducer from "./slices/dataPDFSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    history: historyReducer,
    contenedores: contenedoresReducer,
    utils: utilsReducer,
    dates: datesReducer,
    grupos: groupsReducer,
    pdfData: pdfDataReducer,
    user: userReducer,
  },
});

export default store;
