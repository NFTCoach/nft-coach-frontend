import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "store/reducers/theme";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
  },
});
