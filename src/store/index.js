import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "store/reducers/theme";
import contractSlice from "./reducers/contracts";
import accountSlicer from "./reducers/account";
import gameSlicer from "./reducers/game";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    contracts: contractSlice,
    account: accountSlicer,
    game: gameSlicer
  },
  middleware: (getDefaultMiddleware) => {
    const customizedMiddleware = getDefaultMiddleware({
      serializableCheck: false
    });
    return customizedMiddleware;
  }
});
