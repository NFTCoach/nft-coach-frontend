import useAccount from "common/hooks/useAccount";
import { useGameFunctions } from "common/hooks/useGameFunctions";
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
import { setType, toggleFilter } from "store/reducers/market";
import { Filters } from "./Filters";
import styles from "./Marketplace.module.scss";

export default function Marketplace() {
  const { type, filters } = useSelector((state) => state.market);
  const { isSignedIn } = useSelector((state) => state.account);
  const [allCardListing, setAllCardListings] = useState([]);
  const [allRentedListing, setAllRentedListings] = useState([]);
  const [allPlayerListing, setAllPlayerListing] = useState([]);
  const { getIsSignedIn } = useAccount();
  const contracts = useSelector((state) => state.contracts);
  const {
    getAllCardListings,
    getAllPlayerListings,
    getAllRentedListings
  } = useListingFunctions();
  const dispatch = useDispatch();

  const { buyPlayer, rentPlayer } = useContractFunction();
  const buyPlayerReq = useRequest(buyPlayer);
  const rentPlayerReq = useRequest(rentPlayer);

  const getCardListingsReq = useRequest(getAllCardListings, {
    errorMsg: "Could not load marketplace",
  });
  const getPlayerListingReq = useRequest(getAllPlayerListings, {
    errorMsg: "Could not load marketplace",
  });
  const getAllRentedListingReq = useRequest(getAllRentedListings, {
    errorMsg: "Could not load marketplace"
  });

  useEffect(() => {
    if (!isSignedIn) {
      getIsSignedIn();
      return;
    }
  }, []);

  useEffect(() => {
    const getReq = async () => {
      if (contracts.Marketplace) {
        const res = await getCardListingsReq.exec();
        setAllCardListings(res);
      }
    };

    const getPlayerReq = async () => {
      if (contracts.Marketplace) {
        const res = await getPlayerListingReq.exec();
        setAllPlayerListing(res);
      }
    };
    const getRentedReq = async () => {
      if (contracts.Marketplace) {
        const res = await getAllRentedListingReq.exec();
        setAllRentedListings(res);
      }
    }
    getReq();
    getPlayerReq();
    getRentedReq();
  }, [contracts.Marketplace]);

  return (
    <div data-aos="fade-in" className={styles.container}>
      <Headline title="Marketplace">
        <Link to="/game/team">
          <Button>Sell players</Button>
        </Link>
      </Headline>
      <div className={styles.wrapper}>
        <div className={styles.market}>
          {type === "sale" && allPlayerListing.map((item, index) => {
            return (<PlayerCard
                      key={index}
                      size="128px"
                      playerId={item.id}
                    >
              <Button
                onClick={() => {
                  buyPlayerReq.exec(item.id);
                  //dispatch(setSellingPlayer(item));
                  //setIsSelling(true);
                }}
                size="xsmall"
                type="secondary"
                loading={buyPlayerReq.loading}
              >
                Buy
              </Button>
            </PlayerCard>)
          })}
          {type === "rent" && allRentedListing.map((item, index) => {
            return (<PlayerCard
                      key={index}
                      size="128px"
                      playerId={item.id}
                    >
              <Button
                onClick={() => {
                  rentPlayerReq.exec(item.id);
                  //dispatch(setSellingPlayer(item));
                  //setIsSelling(true);
                }}
                size="xsmall"
                type="secondary"
                loading={rentPlayerReq.loading}
              >
                Rent
              </Button>
            </PlayerCard>)
          })}
          {allCardListing.map((item, index) => {
            console.log(item);
            return <span key={index}>
              {item.id}
            </span>
          })}
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
