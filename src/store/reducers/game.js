import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myPlayers: [], // players with coordinates, attack, defence power or sommething like that
    enemyPlayers: [],
    stage: "",
};


export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setStage(state, action) {
            state.stage = action.payload;
        }
    }
});

export const {
    setStage
} = gameSlice.actions;


export default gameSlice.reducer;

