import Button from "components/Button";
import { Typography } from "components/Typography";
import { useEffect } from "react";
import styles from "./MyTeam.module.scss";
import CourtPng from "assets/images/game/court.png";
import { useDispatch, useSelector } from "react-redux";
import { useContractFunction } from "common/utils/contract/functions";
import useRequestAccounts from "common/hooks/useRequestAccounts";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { setDefaultFive, setPlayerStats } from "store/reducers/game";
import { useRequest } from "common/hooks/useRequest";
import { Spinner } from "components/Spinner";
import { PlayerCard } from "components/PlayerCard";
import { PlayerDrop } from "components/PlayerDrop";
import useAccount from "common/hooks/useAccount";
import { Headline } from "components/Headline";
import { Link } from "react-router-dom";

function MyTeam() {
  const { isSignedIn, address } = useSelector((state) => state.account);
  const { players, playerStats, defaultFive } = useSelector(
    (state) => state.game
  );
  const contracts = useSelector((state) => state.contracts);
  const {
    getStats,
    getDefaultFive,
    setDefaultFive: setDefaultFiveR,
  } = useGameFunctions();
  const { getAllPlayersOf } = useContractFunction();
  const dispatch = useDispatch();
  const { getIsSignedIn } = useAccount();
  const statReq = useRequest(getStats);
  const defaultFiveReq = useRequest(getDefaultFive);
  const setDefaultFiveReq = useRequest(setDefaultFiveR);
  const getAllPlayersReq = useRequest(getAllPlayersOf);

  useEffect(() => {
    if (!contracts.NC721 || !isSignedIn) {
      getIsSignedIn();
      return;
    }
    getAllPlayersReq.exec(address);
  }, [contracts, isSignedIn]);

  useEffect(() => {
    const getReq = async () => {
      if (players?.length > 0) {
        const res = await statReq.exec(players);
        dispatch(setPlayerStats(res));
      }
    };
    const getDefaultFive = async () => {
      if (!address) {
        return;
      }
      const res = await defaultFiveReq.exec(address);
      dispatch(setDefaultFive(res));
    };
    getReq();
    getDefaultFive();
  }, [players]);

  return (
    <div className={styles.wrapper}>
      <Headline title="Select Team" />
      <div className={styles.courtWrapper}>
        <div className={styles.players}>
          <Link to="/market">
            <Button>Buy new players</Button>
          </Link>

          {!defaultFiveReq.loading && defaultFive?.includes?.("0") && (
            <Typography className={styles.notReady}>
              Your team is not ready for the match. Please set your starting
              team.
            </Typography>
          )}

          {statReq?.loading || getAllPlayersReq.loading ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.cards}>
              {playerStats
                ?.filter((item) => !defaultFive?.includes(item.id))
                ?.map?.((item, index) => (
                  <PlayerCard
                    draggable
                    key={index}
                    size="128px"
                    playerId={item.id}
                  />
                ))}
            </div>
          )}
        </div>
        <div className={styles.court}>
          <img src={CourtPng} className={styles.courtImg} />
          {defaultFive?.map((item, index) => (
            <PlayerDrop
              id={item}
              index={index}
              className={styles[`player${index + 1}`]}
            />
          ))}
          {defaultFive?.filter((item) => item != "0")?.length === 5 && (
            <Button
              loading={setDefaultFiveReq.loading}
              onClick={() => setDefaultFiveReq.exec(defaultFive)}
              className={styles.save}
            >
              Save Team
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { MyTeam };
