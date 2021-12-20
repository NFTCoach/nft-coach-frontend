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
import { Typography } from "components/Typography";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setDefaultFive } from "store/reducers/game";
import Tournament from "./Tournament";
import styles from "./Tournaments.module.scss";
import { clsnm } from "common/utils/clsnm";
import moment from "moment";
import { useRouting } from "common/hooks/useRouting";
import { PATHS } from "common/constants/paths";
import { Link } from "react-router-dom";
import { useContractFunction } from "common/utils/contract/functions";

export function Tournaments() {
  const dispatch = useDispatch();

  const [ongoingTournamentIds, setOngoingTournamentIds] = useState(null);
  const [ongoingTournaments, setOngoingTournaments] = useState(null);
  const [attendedTournamentId, setAttendedTournamentId] = useState(null);
  const [tournamentStatus, setTournamentsStatus] = useState(null);
  const [teamStats, setTeamStats] = useState(null);

  const [timeUntilNextMatch, setTimeUntilNextMatch] = useState(null);

  //const { getDefaultFive } = useGameFunctions();
  //const getDefaultFiveReq = useRequest(getDefaultFive);

  //const { setUserDetails } = useSetUserInformation();

  const account = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);

  const { getIsSignedIn } = useAccount({
    directSignIn: false,
  });

  const {
    getOngoingTournaments,
    getTournamentDetails,
    leaveTournament,
    getTournamentStatus,
  } = useTournamentFunctions();
  const { getDefaultFive } = useGameFunctions();

  const getOngoingTournamentsReq = useRequest(getOngoingTournaments);

  const leaveTournamentReq = useRequest(leaveTournament);

  const getTournamentStatusReq = useRequest(getTournamentStatus);

  const { getTeamStats } = useContractFunction()

  useRouting();
  useEffect(() => {
    getIsSignedIn();
  }, []);

  useEffect(() => {
    if (!account.address && !attendedTournamentId)
      return;

    async function fetchData() {
      const _teamStats = await getTeamStats(account.address);
      setTeamStats(_teamStats);
    }
    fetchData();
  }, [account.address, attendedTournamentId]);

  useEffect(() => {
    if (attendedTournamentId === null) {
      return;
    }
    async function _getOngoingTournaments() {
      const res = await getOngoingTournamentsReq.exec().then((res) => {
        return res.map((i) => {
          return i.toString();
        });
      });
      console.log(res);

      setOngoingTournamentIds(res || false);
    }
    async function fetchData() {
      if (attendedTournamentId === false) {
        _getOngoingTournaments();
      } else {
        _getOngoingTournaments();
        const res = await getTournamentDetails(attendedTournamentId);
          console.log(res);
        if (attendedTournamentId === null) return;
        try {
          const _tournamentStatus = await getTournamentStatusReq.exec(
            attendedTournamentId
          );
          console.log(tournamentStatus);
          setTournamentsStatus(_tournamentStatus);
          setTimeUntilNextMatch(_tournamentStatus.timeUntilNextMatch);
        } catch (err) {
          console.log(err);
        }
      }
    }
    // if user is not signed in and is not attend any tournament
    fetchData();
  }, [attendedTournamentId]);

    useEffect(() => {

        if (!tournamentStatus)
            return;
      const interval = setTimeout(() => {
          setTimeUntilNextMatch(timeUntilNextMatch - 1);
      }, 1000);

      return () => {
          clearTimeout(interval);
      }
    }, [timeUntilNextMatch]);

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

      const _attendedTournamentId = window.localStorage.getItem(
        "attendedTournamentId"
      );
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
    console.log(account, contracts);
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
        <div className={styles["loading-container"]}>
          <Spinner />
          <Typography variant="body1">Tournaments loading...</Typography>
        </div>
      </div>
    );
  }

  if (ongoingTournaments) {
    return (
      <div className={styles.container}>
        <Headline title="All Tournaments"></Headline>
        {/** Show user the ongoing tournaments */}
        <div className={styles.tournaments}>
          {ongoingTournaments.map((tournament, index) => {
            //console.log(tournament);
            return (
              <Tournament
                setAttendedTournamentId={setAttendedTournamentId}
                tournament={tournament}
                attendedTournamentId={attendedTournamentId}
                key={index}
              ></Tournament>
            );
          })}
        </div>
          <div className={clsnm(styles["attended-tournament--container"])}>
          {tournamentStatus?.nextOpponent != null && (<Fragment>
            <Typography variant="title1">
              Next Match{" "}
              {moment(
                new Date(
                  new Date().getTime() +
                    timeUntilNextMatch * 1000
                )
              ).from(new Date())}
            </Typography>
          </Fragment>)}
          <Button
              onClick={async () => {
                try {
                  await leaveTournamentReq.exec(
                    window.localStorage.getItem("attendedTournamentId")
                  );
                  window.localStorage.removeItem("attendedTournamentId");
                  setTournamentsStatus(null);
                  setAttendedTournamentId(false);
                } catch (err) {
                  console.log(err);
                }
              }}
              loading={leaveTournamentReq.loading}
            >
              Quit tournament
            </Button>
            {tournamentStatus && tournamentStatus?.nextOpponent === null &&
              <Fragment>You don't have any match</Fragment>
            }
            <div className={styles["teams-container"]}>
              {/** if we have a match */}
              <div className={styles["opponent-container"]}>Your opponent</div>

              <div className={styles["team-stats--container"]}>
                <Typography variant="body1">Team Stats</Typography>
                <div className={styles["team-info"]}>
                  <label>Attack</label>
                  {teamStats?.atkAvg.toString().slice(0, 2)}
                  <progress max="100" value={teamStats?.atkAvg.toString().slice(0, 2)}></progress>
                </div>
                <div className={styles["team-info"]}>
                  <label>Defence</label>
                  {teamStats?.defAvg.toString().slice(0, 2)}
                  <progress max="100" value={teamStats?.defAvg.toString().slice(0, 2)}></progress>
                </div>
              </div>
              <div className={styles["my-team--container"]}>Your team</div>
            </div>
            <div className={styles["tournament-matches"]}>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
              <div className={styles.team}></div>
            </div>
            <div className={styles.buttons}>
              <Button type="primary">Use Upgrade Cards</Button>
              <Link to={PATHS.team}>
                <Button type="secondary">Change Starter Five</Button>
              </Link>
            </div>
          </div>
        {getTournamentStatusReq.loading && <div style={{height: "30vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20}}>
                <Spinner />
                <Typography>Tournament content loading</Typography>
            </div>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Headline title="All Tournaments" />
      <div className={styles["loading-container"]}>
        <Spinner />
        <Typography variant="body1">Tournaments loading...</Typography>
      </div>
    </div>
  );
}
