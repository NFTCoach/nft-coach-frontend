import Button from "components/Button";
import { Typography } from "components/Typography";
import { useEffect, useState } from "react";
import styles from "./MyTeam.module.scss";
import CourtPng from "assets/images/game/court.png";
import { useDispatch, useSelector } from "react-redux";
import { useContractFunction } from "common/utils/contract/functions";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import {
  setDefaultFive,
  setPlayerStats,
  setRentingPlayer,
  setSellingPlayer,
} from "store/reducers/game";
import { useRequest } from "common/hooks/useRequest";
import { Spinner } from "components/Spinner";
import { PlayerCard } from "components/PlayerCard";
import { PlayerDrop } from "components/PlayerDrop";
import useAccount from "common/hooks/useAccount";
import { Headline } from "components/Headline";
import { Link } from "react-router-dom";
import { ReactComponent as MinusIcon } from "assets/icons/edit/minus_circle_outline.svg";
import { ReactComponent as PlusIcon } from "assets/icons/edit/plus_circle_outline.svg";
import Icon from "components/Icon/Icon";
import Modals from "./Modals";
import CreateTeam from "../CreateTeam";
import { Loader } from "components/Loader";
import { PATHS } from "common/constants/paths";
import { useNavigate } from "react-router";
import { useRouting } from "common/hooks/useRouting";
import Modal from "components/Modal/Modal";
import { useGeneralFunctions } from "common/hooks/useGeneralFunctions";
import { setPlayers } from "store/reducers/account";
import { useListingFunctions } from "common/hooks/useListingFunctions";

function MyTeam() {
  const [forceUpdateChange, setForceUpdateChange] = useState(true);

  const [isSelling, setIsSelling] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [isPlayerPackOpen, setIsPlayerPackOpen] = useState(false);

  const [cardBalance, setCardBalance] = useState(0);

  //const [playerPacks, setPlayerPacks] = useState();

  const { isSignedIn, address } = useSelector((state) => state.account);
  const { players, playerStats, defaultFive } = useSelector(
    (state) => state.game
  );
  const navigate = useNavigate();
  const contracts = useSelector((state) => state.contracts);
  const {
    getStats,
    getDefaultFive,
    setDefaultFive: setDefaultFiveR,
  } = useGameFunctions();
  const { getAllPlayersOf, testOpenPack } = useContractFunction();
  const { getTeamStats } = useGameFunctions();
  const { getCardBalanceOf } = useGeneralFunctions();

  const dispatch = useDispatch();
  const { getIsSignedIn } = useAccount();
  const statReq = useRequest(getStats);
  const defaultFiveReq = useRequest(getDefaultFive);
  const setDefaultFiveReq = useRequest(
    setDefaultFiveR,
    {},
    { timeout: 5000, message: "Saving..." }
  );
  const getTeamStatsReq = useRequest(getTeamStats);
  const getAllPlayersReq = useRequest(getAllPlayersOf);

  const getReq = async () => {
    if (players?.length > 0) {
      const res = await statReq.exec(players);
      dispatch(setPlayerStats(res));
    }
  };

  const openPackReq = useRequest(
    async () => {
      await testOpenPack();
    },
    {
      onFinished: async () => {
        setIsPlayerPackOpen(false);
        setForceUpdateChange(!forceUpdateChange);
      },
    }
  );

  const [adding, setAdding] = useState(false);

  useRouting();
  useEffect(() => {
    if (!contracts.NC721 || !isSignedIn) {
      getIsSignedIn();
      return;
    }

    const fetchData = async () => {
      let res = await getTeamStatsReq.exec(address);
      if (!res.initialized) {
        navigate(PATHS.create_team);
      }
      const cardBalanceRes = await getCardBalanceOf(address, 10);
      setCardBalance(cardBalanceRes.toNumber());
      console.log(cardBalanceRes.toNumber());
    };
    getAllPlayersReq.exec(address);
    fetchData();
  }, [contracts, isSignedIn, forceUpdateChange]);

  useEffect(() => {
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

  if (!isSignedIn) {
    return <Loader />;
  }

  return (
    <div className={styles.wrapper}>
      <Modals
        isSelling={isSelling}
        setIsSelling={setIsSelling}
        isRenting={isRenting}
        setIsRenting={setIsRenting}
      />
      <Modal
        isOpen={isPlayerPackOpen}
        close={() => {
          setIsPlayerPackOpen(false);
        }}
      >
        <Button
          type="secondary"
          onClick={() => {
            openPackReq.exec();
          }}
          loading={openPackReq.loading}
        >
          Open Pack
        </Button>
      </Modal>
      <Headline title="Team">
        {!defaultFive.includes("0") && (
          <Link to={PATHS.training}>
            <Button>Go To Matching</Button>
          </Link>
        )}
      </Headline>
      <div className={styles.courtWrapper}>
        <div className={styles.players}>
          <div className={styles.buttons}>
            <Link to="/market">
              <Button>Buy new players</Button>
            </Link>
            <Button
              onClick={() => {
                setAdding(!adding);
              }}
              type="secondary"
            >
              <Icon>{adding ? <MinusIcon /> : <PlusIcon />}</Icon>
              Add to marketplace
            </Button>
            {cardBalance.length > 0 && (
              <Button
                type="secondary"
                onClick={() => {
                  setIsPlayerPackOpen(true);
                }}
              >
                Open pack
              </Button>
            )}
          </div>

          {!defaultFiveReq.loading && defaultFive?.includes?.("0") && (
            <Typography className={styles.notReady}>
              Your team is not ready for the match. Please set your starting
              team by dragging players to court.
            </Typography>
          )}

          {statReq?.loading || getAllPlayersReq.loading ? (
            <div className={styles.loading}>
              <Spinner />
            </div>
          ) : (
            <div className={styles.cards}>
              {defaultFive &&
                playerStats
                  ?.filter((item) => !defaultFive?.includes(item.id))
                  ?.map?.((item, index) => (
                    <PlayerCard
                      draggable={!adding}
                      key={index}
                      size="128px"
                      playerId={item.id}
                    >
                      {adding && (
                        <div
                          data-aos-duration="500"
                          data-aos="fade-in"
                          className={styles.meta}
                        >
                          <Button
                            onClick={() => {
                              dispatch(setRentingPlayer(item));
                              setIsRenting(true);
                            }}
                            size="xsmall"
                            type="secondary"
                            disabled={item.locked}
                          >
                            Rent
                          </Button>
                          <Button
                            onClick={() => {
                              dispatch(setSellingPlayer(item));
                              setIsSelling(true);
                            }}
                            size="xsmall"
                            type="tertiary"
                            disabled={item.locked}
                          >
                            Sell
                          </Button>
                        </div>
                      )}
                    </PlayerCard>
                  ))}
            </div>
          )}
        </div>
        <div data-aos="fade-in" className={styles.court}>
          <img src={CourtPng} className={styles.courtImg} />
          {defaultFive?.map((item, index) => (
            <PlayerDrop
              key={index}
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
