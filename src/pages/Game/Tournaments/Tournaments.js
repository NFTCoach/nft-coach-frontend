import useAccount from "common/hooks/useAccount";
import useSetUserInformation from "common/hooks/useSetUserInformation";
import { Headline } from "components/Headline";
import Navbar from "components/Navbar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Tournaments.module.scss";

export function Tournaments() {
  const { setUserDetails } = useSetUserInformation();

  const account = useSelector((state) => state.account);
  const { getIsSignedIn } = useAccount({
    directSignIn: false,
  });

  useEffect(() => {
    getIsSignedIn();
  }, []);

  useEffect(() => {
    if (!account.isSignedIn) return;
    setUserDetails();
  }, [account.isSignedIn]);

  if (account.isSignedIn === false) {
    // show ongoing tournaments
    return (
      <div className={styles.container}>
        <Navbar />
      </div>
    );
  }

  if (account.attendedTournament) {
    // show attended tournament
  } else if (account.team?.players?.length < 5) {
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
