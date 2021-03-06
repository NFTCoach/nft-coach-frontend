import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  provider: null,
  signer: null,
  isSignedIn: null,
  name: null,
  team: null,
  players: null,
  balance: 0,
  attendedTournament: null,
};

export const accountSlicer = createSlice({
  name: "account",
  initialState,
  reducers: {
    setSignedIn(state, action) {
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
    },
    setPlayers(state, action) {
      state.players = action.payload;
    },
    setTeam(state, action) {
      state.team = action.payload;
    },
    setBalance(state, action) {
      state.balance = action.payload;
    },
  },
});

export const {
  setSignedIn,
  setProvider,
  setSigner,
  setAddress,
  setAccountData,
  setPlayers,
  setTeam,
  setBalance,
} = accountSlicer.actions;

export default accountSlicer.reducer;
