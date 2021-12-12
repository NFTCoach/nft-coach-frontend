import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useSetUserInformation() {
    // set user information to redux state like name and starting five
    const dispatch = useDispatch();
    
    async function setUserDetails() {
        // get user details and dispatch it
        
    }

    return { setUserDetails };
};