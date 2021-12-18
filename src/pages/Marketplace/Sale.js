import { parse } from "@ethersproject/transactions";
import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";
import Button from "components/Button";
import { Loader } from "components/Loader";
import Modal from "components/Modal/Modal";
import { PlayerAvatar } from "components/PlayerAvatar";
import { PlayerCard } from "components/PlayerCard";
import { Spinner } from "components/Spinner";
import { Typography } from "components/Typography";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Marketplace.module.scss";

const Sale = ({
  myOwnPlayers,
  modalItemType,
  setModalItemType,
  getAllPlayersOfReq,
}) => {
  const [allPlayerListing, setAllPlayerListing] = useState([]);
  const contracts = useSelector((state) => state.contracts);
  const { isSignedIn } = useSelector((state) => state.account);
  const { balance } = useSelector((state) => state.account);
  const {
    buyPlayer,
    approveCoachForMarketplace,
    isCoachApprovedForMarket,
    getAllPlayerListings,
  } = useContractFunction();

  //Requests
  const approveReq = useRequest(approveCoachForMarketplace);
  const isApprovedReq = useRequest(isCoachApprovedForMarket);
  const buyPlayerReq = useRequest(buyPlayer, {
    onFinished: () => {
      setIsModalOpen(false);
      setModalItem(null);
      toast("You bought the player successfully!");
      getPlayerReq();
    },
  });
  const getPlayerListingReq = useRequest(getAllPlayerListings, {
    errorMsg: "Could not load marketplace",
  });

  const getPlayerReq = async () => {
    if (contracts.Marketplace) {
      const res = await getPlayerListingReq.exec();
      setAllPlayerListing(res);
    }
  };

  useEffect(() => {
    if (myOwnPlayers === null) {
      return;
    }
    getPlayerReq();
  }, [contracts.Marketplace, myOwnPlayers]);

  /* useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    const approve = async () => {
      const isApproved = localStorage.getItem("approvedCoachForMarketplace");
      if (!isApproved) await approveReq.exec();
    };
    approve();
  }, []); */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState();

  if (!isSignedIn) {
    return <Loader />;
  }

  return (
    <Fragment>
      {(getAllPlayersOfReq.loading || getPlayerListingReq.loading) && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        opacity={0.5}
        close={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
      >
        {modalItemType == "buyPlayer" && (
          <div className={styles["modal-container"]}>
            <Typography variant="title6" weight="medium">
              Buy Player
            </Typography>
            <PlayerAvatar
              player={{ stats: modalItem?.stats || new Array(10).fill(0) }}
              id={modalItem?.id}
              disabled={
                parseFloat(balance) <
                parseFloat(modalItem?.price?.split(" ")?.[0] || "0")
              }
            />
            <Typography variant="body2">{modalItem?.price}</Typography>
            <Button
              loading={approveReq.loading || buyPlayerReq.loading}
              type="secondary"
              onClick={async () => {
                const isApproved = await isApprovedReq.exec();
                if (isApproved) {
                  await buyPlayerReq.exec(modalItem?.id);
                } else {
                  await approveReq.exec();
                  await buyPlayerReq.exec(modalItem?.id);
                }
              }}
              loading={buyPlayerReq.loading}
            >
              Buy Player
            </Button>
          </div>
        )}
      </Modal>

      {allPlayerListing
        .filter((item) => !myOwnPlayers?.includes(item.id))
        .map((item, index) => {
          return (
            <PlayerCard
              player={{ stats: item.stats }}
              showPowers={true}
              key={index}
              size="128px"
              playerId={item.id}
            >
              <Typography>{item.price}</Typography>
              <Button
                disabled={
                  parseFloat(balance) <
                  parseFloat(item?.price?.split(" ")?.[0] || "0")
                }
                className={styles.button}
                onClick={() => {
                  setModalItem(item);
                  setModalItemType("buyPlayer");
                  setIsModalOpen(true);
                }}
                size="xsmall"
                type="secondary"
              >
                Buy
              </Button>
            </PlayerCard>
          );
        })}
    </Fragment>
  );
};

export { Sale };
