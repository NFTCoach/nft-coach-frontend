import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Game.module.scss";
import Gameplay from "./Gameplay";
import Tournaments from "./Tournaments";
import TrainingMatch from "./TrainingMatch";

export default function Game() {

    const game = useSelector(state => state.game);

    //const account = useSelector(state => state.account);

    if (game.stage === "tournaments") {
        return <Tournaments />;
    }

    if (game.stage === "training-match") {
        return <TrainingMatch />;
    }

    return (<Gameplay />);
}