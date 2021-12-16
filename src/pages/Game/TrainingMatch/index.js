import useAccount from "common/hooks/useAccount";
import Button from "components/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContractFunction } from "common/utils/contract/functions";
import styles from "./TrainingMatch.module.scss";
import { useNavigate } from "react-router";
import { PATHS } from "common/constants/paths";
import { toast } from "react-toastify";
import { Spinner } from "components/Spinner";
import { Typography } from "components/Typography";
import { Headline } from "components/Headline";
import { Link } from "react-router-dom";
import { useRouting } from "common/hooks/useRouting";
import Item from "./Item";
import { useTrainingRequests } from "./useTrainingRequsets";
import { Match } from "./Match";
import { useRequest } from "common/hooks/useRequest";
import { parseScore } from "common/utils/parseScore";

export default function TrainingMatch() {
  const account = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);
  const [teamStats, setTeamStats] = useState(null);
  let navigate = useNavigate();
  const { getAllPlayersOf, getTeamStats } = useContractFunction();
  const { getDefaultFiveReq, getRandomTeamsReq, requestTrainingReq } =
    useTrainingRequests();
  const { getIsSignedIn } = useAccount();

  const [randomOpponents, setRandomOpponents] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [focused, setFocused] = useState(0);

  async function fetchMyTeam() {
    const [getDefaultFiveRes, _teamStats] = await Promise.all([
      getDefaultFiveReq.exec(account.address),
      getTeamStats(account.address),
    ]);
    if (getDefaultFiveRes?.includes("0") && _teamStats?.initialized) {
      navigate(PATHS.team);
      toast("Please set your default five");
    }

    setTeamStats(_teamStats);
  }

  const fetchTeams = async () => {
    const res = await getRandomTeamsReq.exec();
    setRandomOpponents(res);
    setSelected(-1);
  };

  useEffect(() => {
    if (!account.isSignedIn) {
      getIsSignedIn();
      return;
    }
    getAllPlayersOf(account.address);
    fetchMyTeam();

    fetchTeams();
  }, [contracts, account.isSignedIn]);
  useRouting();

  if (account.isSignedIn === false) {
    return <Button onClick={getIsSignedIn}>Sign in with Metamask</Button>;
  }

  if (account.players === null) {
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
        <Typography variant="body1">Getting team information</Typography>
      </div>
    );
  }

  const randomArray = Object.keys(randomOpponents || {}).map(
    (item) => randomOpponents[item]
  );

  return (
    <div className={styles.container}>
      <Headline title="Training Games" />
      <div className={styles.wrapper}>
        <div className={styles.opponents}>
          {getRandomTeamsReq.loading ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.enemies}>
              <Typography variant="title4" weight="semibold">
                Choose Enemy
              </Typography>
              <div className={styles.carousel}>
                {randomArray?.map((item, index) => (
                  <Item
                    key={index}
                    setSelected={setSelected}
                    selected={selected}
                    focused={focused}
                    item={item}
                    index={index}
                    randomOpponents={randomArray}
                    setFocused={setFocused}
                  />
                ))}
              </div>
              <Match
                fetchMyTeam={fetchMyTeam}
                fetchTeams={fetchTeams}
                randomArray={randomArray}
                requestTrainingReq={requestTrainingReq}
                fetchMyTeam={fetchMyTeam}
                selected={selected}
              />
            </div>
          )}
        </div>
        <div className={styles.stats}>
          <Typography variant="title4" weight="medium">
            Team Stats
          </Typography>
          <div className={styles.inner}>
            <Typography variant="body2" weight="medium">
              Morale: {teamStats?.morale}
            </Typography>
            <Typography variant="body2" weight="medium">
              Wins: {teamStats?.wins}
            </Typography>
            <Typography variant="body2" weight="medium">
              Attack: {parseScore(teamStats?.atkAvg)}
            </Typography>
            <Typography variant="body2" weight="medium">
              Defence: {parseScore(teamStats?.defAvg)}
            </Typography>
            <div className={styles.customize}>
              <Link to={PATHS.team}>
                <Button>Customize Team</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
