import useAccount from "common/hooks/useAccount";
import { useListingFunctions } from "common/hooks/useListingFunctions";
import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";
import Button from "components/Button";
import { Headline } from "components/Headline";
import { PlayerCard } from "components/PlayerCard";
import { Typography } from "components/Typography";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setType } from "store/reducers/market";
import { Filters } from "./Filters";
import styles from "./Marketplace.module.scss";
import Modal from "components/Modal/Modal";
import { PlayerAvatar } from "components/PlayerAvatar";
import { Sale } from "./Sale";
import { Rent } from "./Rent";
import { Loader } from "components/Loader";
import { Contract } from "@ethersproject/contracts";
import { Spinner } from "components/Spinner";
import { useApproveFunctions } from "common/hooks/useApproveFunctions";

export default function Marketplace() {
  const [modalItemType, setModalItemType] = useState();
  const [allCardListings, setAllCardListings] = useState();
  /**
   * modalItemType = "buyPlayer" | "rentPlayer"
   */

  const { type } = useSelector((state) => state.market);
  const { isSignedIn, address } = useSelector((state) => state.account);

  const { getIsSignedIn } = useAccount();
  const contracts = useSelector((state) => state.contracts);
  const { getAllCardListings, getAllRentedListings } = useListingFunctions();

  const { getAllPlayersOf } = useListingFunctions();

  const dispatch = useDispatch();

  const { buyPlayer, rentPlayer } = useContractFunction();
  const { approvePlayersForMarket } = useApproveFunctions()
  const buyPlayerReq = useRequest(async () => {
    await approvePlayersForMarket();
    await buyPlayer();
  });
  const rentPlayerReq = useRequest(rentPlayer);

  const [myOwnPlayers, setMyOwnPlayers] = useState(null);

  const getCardListingsReq = useRequest(getAllCardListings, {
    errorMsg: "Could not load marketplace",
  });

  const getAllPlayersOfReq = useRequest(getAllPlayersOf, {
    errorMsg: "Could not load marketplace",
  });

  useEffect(() => {
    if (!isSignedIn) {
      getIsSignedIn();
      return;
    }
    if (!address) return;
    const _getAllPlayersOfReq = async () => {
      if (contracts.NC721) {
        const res = (await getAllPlayersOfReq.exec(address)) || [];
        setMyOwnPlayers(res);
      }
    };
    _getAllPlayersOfReq();
  }, [address]);

  useEffect(() => {
    if (myOwnPlayers === null) {
      return;
    }
    const getReq = async () => {
      if (contracts.Marketplace) {
        const res = await getCardListingsReq.exec();
        setAllCardListings(res);
      }
    };
    getReq();
  }, [contracts.Marketplace, myOwnPlayers]);

  if (!isSignedIn) {
    return <Loader />;
  }

  return (
    <div data-aos="fade-in" className={styles.container}>
      <Headline title="Marketplace">
        <Link to="/game/team">
          <Button>Sell players</Button>
        </Link>
      </Headline>
      <div className={styles.wrapper}>
        <div className={styles.market}>
          {type === "sale" ? (
            <Sale
              getAllPlayersOfReq={getAllPlayersOf}
              modalItemType={modalItemType}
              setModalItemType={setModalItemType}
              myOwnPlayers={myOwnPlayers}
              loading={getAllPlayersOfReq.loading}
            />
          ) : (
            <Rent
              myOwnPlayers={myOwnPlayers}
              modalItemType={modalItemType}
              setModalItemType={setModalItemType}
            />
          )}

          {/* {allCardListing.map((item, index) => {
            console.log(item);
            return <span key={index}>{item.id}</span>;
          })} */}
        </div>
        <div className={styles.filter}>
          <Typography variant="title4" weight="semibold">
            Filters
          </Typography>
          <div className={styles.filters}>
            <Filters />
          </div>
          <Typography variant="title4" weight="semibold">
            Type
          </Typography>
          <div className={styles.types}>
            <Button
              onClick={() => dispatch(setType("sale"))}
              type={type != "sale" ? "secondary" : "primary"}
            >
              Sale
            </Button>
            <Button
              onClick={() => dispatch(setType("rent"))}
              type={type != "rent" ? "secondary" : "primary"}
            >
              Rent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
