import useAccount from "common/hooks/useAccount";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { useListingFunctions } from "common/hooks/useListingFunctions";
import { useRequest } from "common/hooks/useRequest";
import { Headline } from "components/Headline";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Marketplace.module.scss";

export default function Marketplace() {
  const { players } = useSelector((state) => state.account);
  const { isSignedIn } = useSelector((state) => state.account);
  const [allPlayers, setAllPlayers] = useState([]);
  const [allCardListing, setAllCardListings] = useState([]);
  const [allPlayerListing, setAllPlayerListing] = useState([]);
  const { getIsSignedIn } = useAccount();
  const contracts = useSelector((state) => state.contracts);

  const { getAllCardListings, getAllPlayerListings } = useListingFunctions();

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
      if (contracts.Marketplace && contracts.Tournaments) {
        const res = await getCardListingsReq.exec();
        setAllCardListings(res);
      }
    };

    const getPlayerReq = async () => {
      console.log(contracts.Marketplace, contracts.Tournaments);
      if (contracts.Marketplace && contracts.Tournaments) {
        const res = await getPlayerListingReq.exec();
        setAllPlayerListing(res);
      }
    };

    getReq();
    /* getPlayerReq(); */
  }, [contracts.Marketplace, contracts.Tournaments]);

  return (
    <div className={styles.container}>
      <Headline title="Marketplace" />
    </div>
  );
}
