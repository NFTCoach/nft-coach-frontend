import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: [],
};

export const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {},
});

export const {} = marketSlice.actions;

export default marketSlice.reducer;
