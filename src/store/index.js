import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "store/reducers/theme";
import contractSlice from "./reducers/contracts";
import accountSlicer from "./reducers/account";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    contract: contractSlice,
    account: accountSlicer
  },
  middleware: (getDefaultMiddleware) => {
    const customizedMiddleware = getDefaultMiddleware({
      serializableCheck: false
    });
    return customizedMiddleware;
  }
});
