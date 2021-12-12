import useAccount from "common/hooks/useAccount";
import { useApproveFunctions } from "common/hooks/useApproveFunctions";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { useRequest } from "common/hooks/useRequest";
import useSetUserInformation from "common/hooks/useSetUserInformation";
import { useTournamentFunctions } from "common/hooks/useTournamentFunctions";
import Button from "components/Button";
import { Headline } from "components/Headline";
import Navbar from "components/Navbar";
import { Spinner } from "components/Spinner";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Tournaments.module.scss";

export function Tournaments() {

  const [ongoingTournamentIds, setOngoingTournamentIds] = useState(null);
  const [ongoingTournaments, setOngoingTournaments] = useState(null);
  const [attendedTournamentId, setAttendedTournamentId] = useState(null);
  const [attendedTournament, setAttendedTournament] = useState(null);

  //const { getDefaultFive } = useGameFunctions();
  //const getDefaultFiveReq = useRequest(getDefaultFive);

  const { setUserDetails } = useSetUserInformation();

  const account = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);

  const { getIsSignedIn } = useAccount({
    directSignIn: false,
  });

  const { getOngoingTournaments, joinTournament, getTournamentDetails } = useTournamentFunctions();
  const { approveCoachForTournament } = useApproveFunctions();
  
  const joinTournamentReq = useRequest(joinTournament);
  const getOngoingTournamentsReq = useRequest(getOngoingTournaments);

  useEffect(() => {
    getIsSignedIn();
  }, []);

  useEffect(() => {
    if (attendedTournamentId === null) {
      return;
    }
    async function fetchData() {
      if (attendedTournamentId === false) {
        const res = await getOngoingTournamentsReq.exec().then(res => {
          return res.map(i => {
            return i.toString()
          });
        });
        console.log(res);
  
        setOngoingTournamentIds(res || false);
      }
      else {
        const res = await getTournamentDetails(attendedTournamentId);
        console.log(res);
      }
    }
    // if user is not signed in and is not attend any tournament
    fetchData();
  }, [attendedTournamentId]);

  useEffect(() => {
    if (account.isSignedIn === false || !contracts.Tournaments) {
      return;
    }
    async function fetchData() {
      // get user attend any tournament information
      // if there is an attended tournament then setAttendedTournamentId(attendedTournament)
      // else setAttendedTournamentId(false);
      //** for right now this informations will be fetched from localStorage
      //** because there no function in contracts related to this logic

      const _attendedTournamentId =
        window.localStorage.getItem("attendedTournamentId");
      setAttendedTournamentId(_attendedTournamentId ?? false);
    }
    fetchData();
  }, [account.isSignedIn, contracts.Tournaments]);

  useEffect(() => {
    if (ongoingTournamentIds === null) {
      return;
    }

    async function fetchData() {
      let _ongoingTournaments = [];
      for (let i = 0; i < ongoingTournamentIds.length; i++) {
        _ongoingTournaments.push(
          await getTournamentDetails(ongoingTournamentIds[i])
        );
      }
      setOngoingTournaments(_ongoingTournaments);
    }
    fetchData();
  }, [ongoingTournamentIds]);

  useEffect(() => {
    if (!account.isSignedIn) return;
    setUserDetails();
  }, [account.isSignedIn]);

  const enterTournament = async (tournamentId) => {
    try {
      await approveCoachForTournament();
      await joinTournamentReq.exec(tournamentId);
      window.localStorage.setItem("attendedTournamentId", tournamentId);
      setAttendedTournamentId(tournamentId);
    }
    catch(err) {
      //toast("Error joining the tournament")
      console.log(err);
    }
  };

  if (attendedTournamentId === null) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (attendedTournamentId) {
    // show attended tournaments
    return (
      <div className={styles.container}>
        <Navbar />
      </div>
    );
  }

  if (ongoingTournaments) {
    return (<div className={styles.container}>
      {/** Show user the ongoing tournaments */}
      {ongoingTournaments.map((tournament, index) => {
        console.log(tournament);
        return (<div key={index}>
          <Button
            onClick={() => enterTournament(tournament.id)}
            loading={joinTournamentReq.loading}
            >Enter tournament</Button>
        </div>);
      })}
    </div>);
  }

  return null;
}
