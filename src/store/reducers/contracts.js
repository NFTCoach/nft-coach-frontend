import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    NC1155: null,
    NC721: null,
    COACH: null,
    Management: null,
    Marketplace: null,
    Tournaments: null,
    TrainingMatches: null,
    RNG: null
};

export const contractSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {
        setContractData(state, action) {
            state.NC1155 = action.payload.NC1155;
            state.NC721 = action.payload.NC721;
            state.COACH = action.payload.COACH;
            state.Management = action.payload.Management;
            state.Marketplace = action.payload.Marketplace;
            state.Tournaments = action.payload.Tournaments;
            state.TrainingMatches = action.payload.TrainingMatches;
            state.RNG = action.payload.RNG;
        }
    }
})

export const {
    setContractData
} = contractSlice.actions;

export default contractSlice.reducer;
