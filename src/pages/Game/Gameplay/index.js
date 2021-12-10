import React from "react";
import styles from "./Gameplay.module.scss";
import Marketplace from "assets/images/game/marketplace.png";
import TrainingMatch from "assets/images/game/training-match.png";
import Tournaments from "assets/images/game/tournaments.png";
import { clsnm } from "common/utils/clsnm";

export default function Gameplay() {


    return (<div className={styles.container}>
        <div className={clsnm(styles["gameplay-hero"])}>
            <h1>Trade, Train, Compete, Earn, Repeat</h1>
            <p>
                Create a team with 5 player NFT’s. 
                Challenge other teams in PvP games to improve your team. 
                Compete in tournaments and earn rewards.
                Trade & Rent players in the marketplace.
            </p>
        </div>
        <div className={clsnm(styles["marketplace-wrapper"], styles["grid-item"])}>
            <div className={styles.marketplace}>
                <img src={Marketplace} />
                <h3>Marketplace</h3>
            </div>
        </div>
        <div className={clsnm(styles["training-match--wrapper"], styles["grid-item"])}>
            <div className={styles["training-match"]}>
                <img src={TrainingMatch} />
                <h3>PvP Training Games</h3>
            </div>
        </div>
        <div className={clsnm(styles["tournaments-wrapper"], styles["grid-item"])}>
            <div className={styles["tournaments"]}>
                <img src={Tournaments} />
                <h3>PvP Tournaments</h3>
            </div>
        </div>
    </div>);
}