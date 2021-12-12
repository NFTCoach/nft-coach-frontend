import useAccount from "common/hooks/useAccount";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { useRequest } from "common/hooks/useRequest";
import useSetUserInformation from "common/hooks/useSetUserInformation";
import { Headline } from "components/Headline";
import Navbar from "components/Navbar";
import { Spinner } from "components/Spinner";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Tournaments.module.scss";

export function Tournaments() {

  const [ongoingTournaments, setOngoingTournaments] = useState(null);
  const [attendedTournament, setAttendedTournament] = useState(null);

  const { getDefaultFive } = useGameFunctions();
  const getDefaultFiveRef = useRequest(getDefaultFive);

  const { setUserDetails } = useSetUserInformation();

  const account = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);

  const { getIsSignedIn } = useAccount({
    directSignIn: false,
  });

  const { getOngoingTournaments } = useGameFunctions();

  useEffect(() => {
    getIsSignedIn();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await getOngoingTournaments();
      console.log(res);
      setOngoingTournaments(res);
    }
    // if user is not signed in and is not attend any tournament
    if (attendedTournament === false) {
      fetchData();
    }
    else {
      // show user the attended tournament
    }

  }, [attendedTournament]);

  useEffect(() => {
    if (account.isSignedIn === false || !contracts.Tournaments) {
      return;
    }
    async function fetchData() {
      // get user attend any tournament information
      // if there is an attended tournament then setAttendedTournament(attendedTournament)
      // else setAttendedTournament(false);
      //** for right now this informations will be fetched from localStorage 
      //** because there no function in contracts related to this logic

      const attendedTournament = window.localStorage.getItem("attendedTournament");
      setAttendedTournament(attendedTournament ?? false);
      
    }
    fetchData();
  }, [account.isSignedIn, contracts.Tournaments]);

  useEffect(() => {
    if (!account.isSignedIn) return;
    setUserDetails();
  }, [account.isSignedIn]);

  if (attendedTournament === null) {
    return <Spinner />
  }

  if (attendedTournament) {
    // show ongoing tournaments
    return (
      <div className={styles.container}>
        <Navbar />
      </div>
    );
  }

  if (account.team?.players?.length < 5) {
    // show CreateTeam page
  } else {
    // enter the tournament and pay fee
  }

  return (
    <div className={styles.container}>
      <Headline title="Tournaments" />
    </div>
  );
}
