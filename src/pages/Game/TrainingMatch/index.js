import useAccount from "common/hooks/useAccount";
import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoForm from "react-auto-form";
import { ethers } from "ethers";
import filterEvents from "common/utils/filterEvents";
import { setPlayers } from "store/reducers/account";
import CreateTeam from "pages/Game/CreateTeam";

export default function TrainingMatch() {

    const account = useSelector(state => state.account);
    const contracts = useSelector(state => state.contracts);

    const dispatch = useDispatch();

    const [randomOpponents, setRandomOpponents] = useState([]);

    const getAllPlayersOf = async (address) => {
        const mintEvents = await filterEvents(contracts.NC721, "Transfer", ethers.constants.AddressZero, address);
        const playerIds = mintEvents.map(ev => ev.args[2].toString());
    
        let players = [];
        for (let playerId of playerIds) {
            const transferEvents = await filterEvents(contracts.NC721, "Transfer", null, null, playerId);
            if (transferEvents[transferEvents.length - 1].args[1] != address)
                continue;
    
            if (await contracts.Management.idToCoach(playerId) == address)
                players.push(playerId);
        }

        dispatch(setPlayers(players))
    }
    

    const { getIsSignedIn } = useAccount({
        directSignIn: true
    });

    const submitAddressToMatchForm = (e, data) => {
        e.preventDefault();
        // match
    }

    useEffect(() => {
        if (!account.isSignedIn || !contracts.NC721) {
            return
        }
        getAllPlayersOf(account.address)
        //contracts.COACH.balanceOf(account.address).then(res => console.log(res.toNumber()));
        
    }, [contracts, account]);

    useEffect(() => {
        getIsSignedIn();
    }, []);

    useEffect(() => {
        if (account.team?.players.length < 5) {
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

    if (account.players.length < 5) {
        // redirect user 5 selection page
        return (<CreateTeam />);
    }

    return null;
}