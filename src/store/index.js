import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "store/reducers/theme";
import contractSlice from "./reducers/contracts";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    contract: contractSlice
  },
});
