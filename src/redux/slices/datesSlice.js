import { createSlice } from "@reduxjs/toolkit";

const datesSlice = createSlice({
  name: "dates",
  initialState: {
    dates: [],
    owedDates: [],
    selectedDates: [],
  },
  reducers: {
    addDates: (state, action) => {
      state.dates = [...state.dates, ...action.payload];
      state.selectedDates = action.payload;
    },
  },
});

export const { addDates } = datesSlice.actions;
export default datesSlice.reducer;
