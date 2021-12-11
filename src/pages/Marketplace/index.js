import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Marketplace.module.scss";

export default function Marketplace() {
  const { players } = useSelector((state) => state.account);

  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    // get all listings
    async function fetchData() {
      // set listings from contracts
    }

    fetchData();
  }, []);

  return <div className={styles.container}>{/** map all listings */}</div>;
}
