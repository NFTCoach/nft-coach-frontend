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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDefaultFive } from "store/reducers/game";
import Tournament from "./Tournament";
import styles from "./Tournaments.module.scss";

export function Tournaments() {

  const dispatch = useDispatch();

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

  const { getOngoingTournaments, getTournamentDetails, leaveTournament } = useTournamentFunctions();
  const { getDefaultFive } = useGameFunctions();

  const getOngoingTournamentsReq = useRequest(getOngoingTournaments);

  const leaveTournamentReq = useRequest(leaveTournament);

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
    console.log(account, contracts)
    if (!account.isSignedIn || !contracts.Management) return;
    async function fetchData() {
      const defaultFive = await getDefaultFive(account.address);
      dispatch(setDefaultFive(defaultFive));
    }
    fetchData();
    //setUserDetails();
  }, [account.isSignedIn, contracts]);

  if (attendedTournamentId === null) {
    return (
      <div className={styles.container}>
        <Headline title="Tournaments"></Headline>
        <Spinner />
      </div>
    );
  }

  if (ongoingTournaments) {
    return (<div className={styles.container}>
      <Headline title="All Tournaments"></Headline>
      {/** Show user the ongoing tournaments */}
      <div className={styles.tournaments}>
        {ongoingTournaments.map((tournament, index) => {
          //console.log(tournament);
          return (<Tournament setAttendedTournamentId={setAttendedTournamentId}
            tournament={tournament}
            attendedTournamentId={attendedTournamentId}
            key={index}></Tournament>);
        })}
      </div>
    </div>);
  }

  if (attendedTournamentId) {
    // show attended tournaments
    return (
      <div className={styles.container}>
        <Headline title="Continue Tournament"></Headline>
        <span>You're in a tournament. You can quit the tournament</span>
        <Button onClick={async () => {
            try {
                await leaveTournamentReq.exec(window.localStorage.getItem("attendedTournamentId"));
                window.localStorage.removeItem("attendedTournamentId");
            }
            catch (err) {
                console.log(err);
            }
        }} loading={leaveTournamentReq.loading}>Quit tournament</Button>
      </div>
    );
  }
  

  return null;
}
