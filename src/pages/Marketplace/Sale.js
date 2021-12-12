import { useListingFunctions } from "common/hooks/useListingFunctions";
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
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
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

  const { getAllPlayerListings } = useListingFunctions();
  const { buyPlayer } = useContractFunction();

  const buyPlayerReq = useRequest(buyPlayer);
  const getPlayerListingReq = useRequest(getAllPlayerListings, {
    errorMsg: "Could not load marketplace",
  });

  useEffect(() => {
    if (myOwnPlayers === null) {
      return;
    }

    const getPlayerReq = async () => {
      if (contracts.Marketplace) {
        const res = await getPlayerListingReq.exec();
        setAllPlayerListing(res);
      }
    };

    getPlayerReq();
  }, [contracts.Marketplace, myOwnPlayers]);

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
            <PlayerAvatar id={modalItem?.id} />
            <Typography variant="body2">{modalItem?.price}</Typography>
            <Button
              type="secondary"
              onClick={() => {
                buyPlayerReq.exec(modalItem?.id);
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
            <PlayerCard key={index} size="128px" playerId={item.id}>
              <Typography>{item.price}</Typography>
              <Button
                className={styles.button}
                onClick={() => {
                  console.log(item);
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
