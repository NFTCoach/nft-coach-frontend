import useAccount from "common/hooks/useAccount";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Game.module.scss";
import Gameplay from "./Gameplay";
import Tournaments from "./Tournaments";
import TrainingMatch from "./TrainingMatch";

export default function Game() {

    const [stage, setStage] = useState();

    //const account = useSelector(state => state.account);

    if (stage === "tournaments") {
        return <Tournaments />;
    }

    if (stage === "training-match") {
        return <TrainingMatch />;
    }

    return (<Gameplay setStage={setStage} />);
}