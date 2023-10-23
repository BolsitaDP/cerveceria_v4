import { configureStore } from "@reduxjs/toolkit";

import contenedoresReducer from "./slices/contenedoresSlice";
import historyReducer from "./slices/historySlice";

const store = configureStore({
  reducer: {
    history: historyReducer,
    contenedores: contenedoresReducer,
    // dates: datesReducer,
    // grupos: groupsReducer,
    // pdfData: pdfDataReducer,
  },
});

export default store;
