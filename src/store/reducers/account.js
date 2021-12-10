import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    address: null,
    provider: null,
    signer: null,
    isSignedIn: null,
};



export const accountSlicer = createSlice({
    name: "account",
    initialState,
    reducers: {
      signIn(state, action) {
        state.isSignedIn = action.payload;
      },
      setProvider(state, action) {
        state.provider = action.payload;
      },
      setSigner(state, action) {
        state.signer = action.payload;
      },
      setAddress(state, action) {
        state.address = action.payload;
      },
      setAccountData(state, action) {
        const { address, provider, isSignedIn, signer } = action.payload;
        state.address = address;
        state.provider = provider;
        state.isSignedIn = isSignedIn;
        state.signer = signer;
      }
    }
  });
  
  export const { signIn, setProvider, setSigner, setAddress, setAccountData } =
    accountSlicer.actions;
  
  export default accountSlicer.reducer;