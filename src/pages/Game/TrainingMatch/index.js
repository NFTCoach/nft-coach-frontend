import useAccount from "common/hooks/useAccount";
import Button from "components/Button";
import React, { useEffect, useState } from "react";
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

export default function TrainingMatch() {
  const account = useSelector((state) => state.account);
  const { team } = useSelector((state) => state.account);
  const contracts = useSelector((state) => state.contracts);
  let navigate = useNavigate();

  const { getAllPlayersOf, getTeamStats, getDefaultFive } =
    useContractFunction();
  const getDefaultFiveReq = useRequest(getDefaultFive);

  const [randomOpponents, setRandomOpponents] = useState([]);

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
      if (res.includes("0") && account.team?.initialized) {
        navigate(PATHS.team);
        toast("Please set your default five");
      }
    }
    fetchData();
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

  return (
    <div className={styles.container}>
      <Headline title="Training & Match" />
      <div className={styles.wrapper}>
        <div></div>
        <div className={styles.stats}>
          <Typography variant="title4">Team Stats</Typography>
          <div className={styles.inner}>
            <Typography variant="body2" weight="medium">
              Morale: 100
            </Typography>
            <Typography variant="body2" weight="medium">
              Wins: 0
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
