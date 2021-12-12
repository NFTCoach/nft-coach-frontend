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
import { setType, toggleFilter } from "store/reducers/market";
import { Filters } from "./Filters";
import styles from "./Marketplace.module.scss";
import Modal from "components/Modal/Modal";
import { PlayerAvatar } from "components/PlayerAvatar";
import { Contract } from "@ethersproject/contracts";
import { Spinner } from "components/Spinner";

export default function Marketplace() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState();
  const [modalItemType, setModalItemType] = useState();
  /**
   * modalItemType = "buyPlayer" | "rentPlayer"
   */

  const { type, filters } = useSelector((state) => state.market);
  const { isSignedIn, address } = useSelector((state) => state.account);
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

  const { getAllPlayersOf } = useListingFunctions();

  const dispatch = useDispatch();

  const { buyPlayer, rentPlayer } = useContractFunction();
  const buyPlayerReq = useRequest(buyPlayer);
  const rentPlayerReq = useRequest(rentPlayer);

  const [myOwnPlayers, setMyOwnPlayers] = useState(null);

  const getCardListingsReq = useRequest(getAllCardListings, {
    errorMsg: "Could not load marketplace",
  });
  const getPlayerListingReq = useRequest(getAllPlayerListings, {
    errorMsg: "Could not load marketplace",
  });
  const getAllRentedListingReq = useRequest(getAllRentedListings, {
    errorMsg: "Could not load marketplace"
  });
  const getAllPlayersOfReq = useRequest(getAllPlayersOf, {
    errorMsg: "Could not load marketplace"
  })

  useEffect(() => {
    if (!isSignedIn) {
      getIsSignedIn();
      return;
    }
    if (!address)
      return;
    const _getAllPlayersOfReq = async () => {
      if (contracts.NC721) {
        const res = await getAllPlayersOfReq.exec(address) || [];
        console.log(res);
        setMyOwnPlayers(res);
      }
    }
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
  }, [contracts.Marketplace, myOwnPlayers]);

  return (
    <div data-aos="fade-in" className={styles.container}>
      <Modal isOpen={isModalOpen} opacity={0.5} close={() => {
        setIsModalOpen(false);
        setModalItem(null);
      }} closeOutside={false}>
        {modalItemType == "buyPlayer" && 
        <div className={styles["modal-container"]}>
          <Typography variant="title6" weight="medium">Buy Player</Typography>
            <PlayerAvatar
              id={modalItem?.id}
            />
            <Typography variant="body2">
              {modalItem?.price}
            </Typography>
            <Button type="secondary" onClick={() => {
              buyPlayerReq.exec(modalItem?.id);
            }}
              loading={buyPlayerReq.loading}>
              Buy Player
           </Button>
        </div>
        }
        {modalItemType === "rentPlayer" &&
          <div className={styles["modal-container"]}>
          <Typography variant="title6">Rent Player</Typography>
            <PlayerAvatar
              id={modalItem?.id}
            />
            <Button type="secondary" onClick={() => {
                rentPlayerReq.exec(modalItem?.id);
              }}
              loading={rentPlayerReq.loading}>
              Rent Player
            </Button>
          </div>
        }
      </Modal>
      <Headline title="Marketplace">
        <Link to="/game/team">
          <Button>Sell players</Button>
        </Link>
      </Headline>
      <div className={styles.wrapper}>
        <div className={styles.market}>
          {getAllPlayersOfReq.loading && <Spinner />}
          {type === "sale" && allPlayerListing.filter(item => !myOwnPlayers?.includes(item.id)).map((item, index) => {
            return (<PlayerCard
                      key={index}
                      size="128px"
                      playerId={item.id}
                    >
              <Button
                onClick={() => {
                  console.log(item);
                  setModalItem(item);
                  setModalItemType("buyPlayer")
                  setIsModalOpen(true);
                }}
                size="xsmall"
                type="secondary"
              >
                Buy
              </Button>
            </PlayerCard>)
          })}
          {type === "rent" && allRentedListing.filter(item => !myOwnPlayers?.includes(item.id)).map((item, index) => {
            return (<PlayerCard
                      key={index}
                      size="128px"
                      playerId={item.id}
                    >
              <Button
                onClick={() => {
                  rentPlayerReq.exec(item.id);
                }}
                size="xsmall"
                type="secondary"
                onClick={() => {
                  setModalItem(item);
                  setModalItemType("rentPlayer");
                  setIsModalOpen(true);
                }}
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
