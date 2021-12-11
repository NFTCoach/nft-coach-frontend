import Button from "components/Button";
import { Typography } from "components/Typography";
import { useEffect, useState } from "react";
import styles from "./MyTeam.module.scss";
import CourtPng from "assets/images/game/court.png";

function MyTeam() {
  const [myTeam, setMyTeams] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {/* placeholder*/}
        <Button className={styles.hidden} type="secondary">
          Balance: 0
        </Button>
        {/* placeholder*/}

        <Typography variant="title2" weight="semibold">
          Select Team
        </Typography>
        <Button className={styles.balance} type="secondary">
          Balance: 0
        </Button>
      </div>
      <div className={styles.courtWrapper}>
        <div className={styles.players}></div>
        <div className={styles.court}>
          <img width="600" src={CourtPng} className={styles.courtImg} />
          <div className={styles.player1}>
            <div className={styles.player}></div>
          </div>
          <div className={styles.player2}>
            <div className={styles.player}></div>
          </div>
          <div className={styles.player3}>
            <div className={styles.player}></div>
          </div>
          <div className={styles.player4}>
            <div className={styles.player}></div>
          </div>
          <div className={styles.player5}>
            <div className={styles.player}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MyTeam };
