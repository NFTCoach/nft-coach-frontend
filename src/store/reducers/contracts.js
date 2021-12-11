import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    RNG: null,
    NC1155: null,
    NC721: null,
    COACH: null,
    CoreRegistry: null,
    Management: null,
    Marketplace: null,
    Tournaments: null,
    TrainingMatches: null
};



export const contractSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {
        setContractData(state, action) {
            //console.log("setContract data");
            //state.RNG = action.payload.RNG;
            state.NC1155 = action.payload.NC1155;
            state.NC721 = action.payload.NC721;
            state.COACH = action.payload.COACH;
            //state.CoreRegistry = action.payload.CoreRegistry;
            state.Management = action.payload.Management;
            state.Marketplace = action.payload.Marketplace;
            state.Tournaments = action.payload.Tournaments;
            state.TrainingMatches = action.payload.TrainingMatches;
        }
    }
})

export const {
    setContractData
} = contractSlice.actions;

export default contractSlice.reducer;
