import { configureStore } from "@reduxjs/toolkit";

import contenedoresReducer from "./slices/contenedoresSlice";
import historyReducer from "./slices/historySlice";
import utilsSlice from "./slices/utilsSlice";

const store = configureStore({
  reducer: {
    history: historyReducer,
    contenedores: contenedoresReducer,
    utils: utilsSlice,
    // dates: datesReducer,
    // grupos: groupsReducer,
    // pdfData: pdfDataReducer,
  },
});

export default store;
