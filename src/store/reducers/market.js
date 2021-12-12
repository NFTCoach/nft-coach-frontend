import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: ["players"],
  type: "sale",
};

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    toggleFilter: (state, action) => {
      const filter = action.payload;
      if (state.filters.includes(filter)) {
        if (state.filters.length === 1) {
          return;
        }
        state.filters = state.filters.filter((item) => item !== filter);
      } else {
        state.filters.push(filter);
      }
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { toggleFilter, setType } = marketSlice.actions;

export default marketSlice.reducer;
