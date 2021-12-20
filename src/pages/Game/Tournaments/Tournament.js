import { PATHS } from 'common/constants/paths';
import { useApproveFunctions } from 'common/hooks/useApproveFunctions';
import { useRequest } from 'common/hooks/useRequest';
import { useTournamentFunctions } from 'common/hooks/useTournamentFunctions';
import Button from 'components/Button';
import Modal from 'components/Modal/Modal';
import { Typography } from 'components/Typography';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from "./Tournament.module.scss";


const Tournament = ({ tournament, setAttendedTournamentId, attendedTournamentId }) => {

    const { getTournamentStatus } = useTournamentFunctions()
    const getTournamentStatusReq = useRequest(getTournamentStatus);
    const [tournamentStatus, setTournamentsStatus] = useState();

    const { address } = useSelector(state => state.account);

    const { approveCoachForTournament } = useApproveFunctions();
    const { joinTournament } = useTournamentFunctions();
    const joinTournamentReq = useRequest(joinTournament, {
        onFinished: () => {
          window.localStorage.setItem("attendedTournamentId", tournament.id);
          setAttendedTournamentId(tournament.id);
        }
    });

    const game = useSelector(state => state.game);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    //console.log(tournament.id);

    useEffect(() => {
        async function fetchData() {
            const res = await getTournamentStatusReq.exec(tournament.id);
            console.log(res);
            setTournamentsStatus(res);
        }
        fetchData();
    }, []);

    const enterTournament = async (e) => {
        //console.log(typeof tournamentId);
        if (game.defaultFive?.includes("0")) {
          setIsErrorModalOpen(true);
          return;
        }
        try {
          await approveCoachForTournament();
          await joinTournamentReq.exec(tournament.id);
        }
        catch (err) {
          //toast("Error joining the tournament")
          console.log(err);
        }
      };
      
    return (<React.Fragment>
        <Modal isOpen={isErrorModalOpen} closeOutside={true} close={() => setIsErrorModalOpen(false)}>
          <p className={styles["modal-p"]}>
            You need to set your default five players to join the tournament. <Link to={PATHS.team}>Set your default five players</Link>
          </p>
        </Modal>
        <div className={styles.container}>
            <Typography variant="body2">{tournament.currentTeamCount} players attended</Typography>
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
      </React.Fragment>);
}

export default Tournament;
