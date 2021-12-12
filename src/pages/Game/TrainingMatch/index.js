import useAccount from "common/hooks/useAccount";
import Button from "components/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContractFunction } from "common/utils/contract/functions";
import CreateTeam from "pages/Game/CreateTeam";
import styles from "./TrainingMatch.module.scss";
import { useNavigate } from "react-router";
import { PATHS } from "common/constants/paths";
import { useRequest } from "common/hooks/useRequest";
import { toast } from "react-toastify";
import { Spinner } from "components/Spinner";
import { Typography } from "components/Typography";
import { Headline } from "components/Headline";
import { Link } from "react-router-dom";
import { useRouting } from "common/hooks/useRouting";
import { ReactComponent as RightIcon } from "assets/icons/arrow/chevron_big_right.svg";
import { ReactComponent as LeftIcon } from "assets/icons/arrow/chevron_big_left.svg";
import Icon from "components/Icon/Icon";
import Item from "./Item";

export default function TrainingMatch() {
  const account = useSelector((state) => state.account);
  const { team } = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);
  let navigate = useNavigate();
  const {
    getAllPlayersOf,
    getTeamStats,
    getDefaultFive,
    get10RandomTeams,
    requestTraining,
  } = useContractFunction();
  const getDefaultFiveReq = useRequest(getDefaultFive);
  const getRandomTeamsReq = useRequest(get10RandomTeams);
  const requestTrainingReq = useRequest(
    requestTraining,
    {},
    { timeout: 10000, message: "Training goes on" }
  );

  const [randomOpponents, setRandomOpponents] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [focused, setFocused] = useState(0);

  const { getIsSignedIn } = useAccount({
    directSignIn: true,
  });

  const submitAddressToMatchForm = (e, data) => {
    e.preventDefault();
    // match
  };

  useEffect(() => {
    if (!account.isSignedIn || !contracts.NC721) {
      getIsSignedIn();
      return;
    }
    getAllPlayersOf(account.address);
    getTeamStats(account.address);
    async function fetchData() {
      const res = await getDefaultFiveReq.exec(account.address);
      if (res?.includes("0") && !account.team?.initialized) {
        navigate(PATHS.team);
        toast("Please set your default five");
      }
    }
    fetchData();

    const fetchTeams = async () => {
      const res = await getRandomTeamsReq.exec();
      setRandomOpponents(res);
    };
    fetchTeams();
    //contracts.COACH.balanceOf(account.address).then(res => console.log(res.toNumber()));
  }, [contracts, account.isSignedIn]);

  useRouting();

  useEffect(() => {
    if (account.players?.length < 5) {
      return;
    }
    function fetchData() {
      // list random 10 opponents
      // setRandomOpponents(opponents);
    }
    fetchData();
  }, [account.team]);

  if (account.isSignedIn === false) {
    // show sign in button
    return <Button onClick={getIsSignedIn}>Sign in with Metamask</Button>;
  }

  if (account.players === null) {
    // players loading
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
        <Typography variant="body1">Getting team information</Typography>
      </div>
    );
  }

  const handleFocused = (position) => {
    if (position === "increment") {
      if (focused >= 8) {
        setFocused(0);
      } else if (focused <= 4) {
        setFocused(focused + 5);
      } else {
        setFocused(focused + 1);
      }
    } else {
      if (focused <= 0) {
        setFocused(8);
      } else {
        setFocused(focused - 1);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Headline title="Training & Match" />
      <div className={styles.wrapper}>
        <div className={styles.opponents}>
          {getRandomTeamsReq.loading ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.enemies}>
              <Typography variant="title4" weight="medium">
                Choose Enemy
              </Typography>
              <div className={styles.carouselWrapper}>
                <Icon
                  onClick={() => handleFocused("decrement")}
                  size={40}
                  className={styles.icon}
                >
                  <LeftIcon />
                </Icon>
                <div className={styles.carousel}>
                  {randomOpponents.map((item, index) => (
                    <Item
                      setSelected={setSelected}
                      selected={selected}
                      focused={focused}
                      item={item}
                      index={index}
                      randomOpponents={randomOpponents}
                      setFocused={setFocused}
                    />
                  ))}
                </div>
                <Icon
                  onClick={() => handleFocused("increment")}
                  size={40}
                  className={styles.icon}
                >
                  <RightIcon />
                </Icon>
              </div>
              <div className={styles.match}>
                {selected !== -1 && (
                  <Fragment>
                    <Typography variant="title4" weight="medium">
                      Team {selected + 1} is selected
                    </Typography>
                    <Button
                      loading={requestTrainingReq.loading}
                      className={styles.button}
                      onClick={async () => {
                        await requestTrainingReq.exec(
                          randomOpponents[selected]
                        );
                      }}
                    >
                      Match with team
                    </Button>
                  </Fragment>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.stats}>
          <Typography variant="title4" weight="medium">
            Team Stats
          </Typography>
          <div className={styles.inner}>
            <Typography variant="body2" weight="medium">
              Morale: {team?.morale}
            </Typography>
            <Typography variant="body2" weight="medium">
              Wins: {team?.wins}
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
