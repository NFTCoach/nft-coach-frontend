import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myPlayers: [], // players with coordinates, attack, defence power or sommething like that
  enemyPlayers: [],
  stage: "",
  players: [],
  playerStats: [],
  defaultFive: ["0", "0", "0", "0", "0"],
  rentingPlayer: null,
  sellingPlayer: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setStage(state, action) {
      state.stage = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setPlayerStats: (state, action) => {
      state.playerStats = action.payload;
    },
    setDefaultFive: (state, action) => {
      state.defaultFive = action.payload;
    },
    setDefaultFiveIndex: (state, action) => {
      const { index, id } = action.payload;
      state.defaultFive[index] = id;
    },
    setSellingPlayer: (state, action) => {
      state.sellingPlayer = action.payload;
    },
    setRentingPlayer: (state, action) => {
      state.rentingPlayer = action.payload;
    },
  },
});

export const {
  setStage,
  setPlayers,
  setPlayerStats,
  setDefaultFive,
  setDefaultFiveIndex,
  setRentingPlayer,
  setSellingPlayer,
} = gameSlice.actions;

export default gameSlice.reducer;
