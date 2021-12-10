import useAccount from "common/hooks/useAccount";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Game.module.scss";
import Gameplay from "./Gameplay";

export default function Game() {

    const [stage, setStage] = useState("my-team");

    const { getIsSignedIn } = useAccount({
        directSignIn: true
    });

    const account = useSelector(state => state.account);

    useEffect(() => {
        getIsSignedIn();
    }, []);

    if (account.isSignedIn === null) {
        return null;
    }

    if (account.isSignedIn === false) {
        return <span>You need to sign in</span>
    }

    return (<Gameplay />);
}