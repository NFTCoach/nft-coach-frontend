import useAccount from "common/hooks/useAccount";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { useListingFunctions } from "common/hooks/useListingFunctions";
import { useRequest } from "common/hooks/useRequest";
import Button from "components/Button";
import { Headline } from "components/Headline";
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
  const [allPlayerListing, setAllPlayerListing] = useState([]);
  const { getIsSignedIn } = useAccount();
  const contracts = useSelector((state) => state.contracts);
  const { getAllCardListings, getAllPlayerListings } = useListingFunctions();
  const dispatch = useDispatch();

  const getCardListingsReq = useRequest(getAllCardListings, {
    errorMsg: "Could not load marketplace",
  });
  const getPlayerListingReq = useRequest(getAllPlayerListings, {
    errorMsg: "Could not load marketplace",
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
        console.log(res);
        setAllCardListings(res);
      }
    };

    const getPlayerReq = async () => {
      console.log(contracts.Marketplace);
      if (contracts.Marketplace) {
        const res = await getPlayerListingReq.exec();
        console.log(res);
        setAllPlayerListing(res);
      }
    };
    getReq();
    getPlayerReq();
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
