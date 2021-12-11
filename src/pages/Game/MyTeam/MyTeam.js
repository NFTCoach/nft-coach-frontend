import Button from "components/Button";
import { Typography } from "components/Typography";
import { useEffect, useState } from "react";
import styles from "./MyTeam.module.scss";
import CourtPng from "assets/images/game/court.png";
import { useSelector } from "react-redux";
import filterEvents from "common/utils/filterEvents";
import useRequestAccounts from "common/hooks/useRequestAccounts";
import { ethers } from "ethers";

function MyTeam() {
  const account = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);
  const [myTeam, setMyTeams] = useState([]);
  const [myPlayers, setMyPlayers] = useState([]);
  const { requestAccounts } = useRequestAccounts();

  useEffect(() => {
    if (!contracts.NC721 || !account.isSignedIn) {
      requestAccounts();
      return;
    }

    const getAllPlayersOf = async (address) => {
      const mintEvents = await filterEvents(
        contracts.NC721,
        "Transfer",
        ethers.constants.AddressZero,
        address
      );
      const playerIds = mintEvents.map((ev) => ev.args[2].toString());

      let players = [];
      for (let playerId of playerIds) {
        const transferEvents = await filterEvents(
          contracts.NC721,
          "Transfer",
          null,
          null,
          playerId
        );
        if (transferEvents[transferEvents.length - 1].args[1] != address)
          continue;

        if ((await contracts.Management.idToCoach(playerId)) == address)
          players.push(playerId);
      }

      if (!account.isSignedIn || !contracts.NC721) {
        return;
      }
      console.log(players);
      setMyPlayers(players);
    };

    getAllPlayersOf(account.address);
  }, [contracts, account]);

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
