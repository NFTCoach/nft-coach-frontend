import { useApproveFunctions } from 'common/hooks/useApproveFunctions';
import { useRequest } from 'common/hooks/useRequest';
import { useTournamentFunctions } from 'common/hooks/useTournamentFunctions';
import Button from 'components/Button';
import { Typography } from 'components/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from "./Tournament.module.scss";

const Tournament = ({ tournament, setAttendedTournamentId, attendedTournamentId }) => {
    console.log(tournament);

    const { address } = useSelector(state => state.account);

    const { approveCoachForTournament } = useApproveFunctions();
    const { joinTournament } = useTournamentFunctions();
    const joinTournamentReq = useRequest(joinTournament);

    const enterTournament = async (tournamentId) => {
        console.log(typeof tournamentId);
        try {
          await approveCoachForTournament();
          await joinTournamentReq.exec(tournamentId);
          window.localStorage.setItem("attendedTournamentId", tournamentId);
          setAttendedTournamentId(tournamentId);
        }
        catch (err) {
          //toast("Error joining the tournament")
          console.log(err);
        }
      };
      console.log(attendedTournamentId, tournament.id, tournament.id === attendedTournamentId);
    return (
        <div className={styles.container}>
            <Typography variant="title3">Rookie League</Typography>
            <Typography variant="body2">Power Level 0 - 25</Typography>
            <Typography variant="body2">3 / 4 Slots</Typography>
            <ul>
                <li>Entrance Fee: {tournament.entranceFee.toNumber()}</li>
                <li>Prize pool: {tournament.prizePool.toNumber()}</li>
            </ul>
            {address && attendedTournamentId === false && <Button onClick={enterTournament}>Enter Tournament</Button>}
            <div className={styles.information}>
                {address && attendedTournamentId && (attendedTournamentId === tournament.id ? "Entered" : "Already in tournament")}
                {!address && "Connect wallet to join tournament"}
                </div>
        </div>
    );
}

export default Tournament;
