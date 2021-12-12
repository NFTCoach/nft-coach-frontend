import useAccount from "common/hooks/useAccount";
import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoForm from "react-auto-form";
import { ethers } from "ethers";
import { useContractFunction } from "common/utils/contract/functions";
import CreateTeam from "pages/Game/CreateTeam";
import styles from "./TrainingMatch.module.scss";
import { MyTeam } from "../MyTeam";

export default function TrainingMatch() {

    const account = useSelector(state => state.account);
    const contracts = useSelector(state => state.contracts);

    //const dispatch = useDispatch();
   
    const { getAllPlayersOf, getTeamStats } = useContractFunction();

    const [randomOpponents, setRandomOpponents] = useState([]);

    const { getIsSignedIn } = useAccount({
        directSignIn: true
    });

    const submitAddressToMatchForm = (e, data) => {
        e.preventDefault();
        // match
    }

    useEffect(() => {
        console.log(contracts);
        if (!account.isSignedIn || !contracts.NC721) {
            return
        }
        getAllPlayersOf(account.address);
        getTeamStats(account.address);
        //contracts.COACH.balanceOf(account.address).then(res => console.log(res.toNumber()));
        
    }, [contracts, account.isSignedIn]);

    useEffect(() => {
        getIsSignedIn();
    }, []);

    useEffect(() => {
        if (account.players?.length < 5) {
            return;
        }
        function fetchData() {
            // list random 10 opponents
            // setRandomOpponents(opponents);
        }
        fetchData();
    }, [account.team]);

    if (account.isSignedIn === false) {
        // show sign in button
        return <Button onClick={getIsSignedIn}>
            Sign in with Metamask
        </Button>
    } 

    if (account.players === null) {
        // players loading
        return "loading..";
    }

    if (account.team === null) {
        // redirect user 5 selection page
        return null;
    }

    if (account.players?.length < 5) {
        return null;
    }

    //console.log(account.players);

    return (<div className={styles.container}>
        <MyTeam />
    </div>);
}