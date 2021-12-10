import useAccount from "common/hooks/useAccount";
import React, { useEffect } from "react";
import styles from "./Game.module.scss";

export default function Game() {

    const { getIsSignedIn } = useAccount({
        directSignIn: true
    });

    useEffect(() => {
        getIsSignedIn();
    }, []);

    return (<div className={styles.container}>
    </div>);
}