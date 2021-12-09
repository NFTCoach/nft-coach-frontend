import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    gameContract: null
};



export const contractSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {
    }
})

export default contractSlice.reducer;
