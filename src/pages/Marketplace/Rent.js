import { useListingFunctions } from "common/hooks/useListingFunctions";
import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";
import Button from "components/Button";
import Modal from "components/Modal/Modal";
import { PlayerAvatar } from "components/PlayerAvatar";
import { PlayerCard } from "components/PlayerCard";
import { Spinner } from "components/Spinner";
import { Typography } from "components/Typography";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Marketplace.module.scss";

const Rent = ({
  modalItemType,
  myOwnPlayers,
  setModalItemType,
  getAllPlayersOfReq,
}) => {
  const contracts = useSelector((state) => state.contracts);
  const { balance } = useSelector((state) => state.account);
  const [allRentedListing, setAllRentedListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState();
  const {
    rentPlayer,
    getAllRentedListings,
    isCoachApprovedForMarket,
    approveCoachForMarketplace,
  } = useContractFunction();
  const isApprovedReq = useRequest(isCoachApprovedForMarket);
  const approveReq = useRequest(approveCoachForMarketplace);

  const getAllRentedListingReq = useRequest(getAllRentedListings, {
    errorMsg: "Could not load marketplace",
  });

  const rentPlayerReq = useRequest(rentPlayer, {
    onFinished: () => {
      setIsModalOpen(false);
      setModalItem(null);
      toast("Player rented successfully!");
      getRentedReq();
    },
  });

  const getRentedReq = async () => {
    if (contracts.Marketplace) {
      const res = await getAllRentedListingReq.exec();
      setAllRentedListings(res);
    }
  };

  useEffect(() => {
    if (myOwnPlayers === null) {
      return;
    }

    getRentedReq();
  }, [contracts.Marketplace, myOwnPlayers]);

  return (
    <Fragment>
      <Modal
        isOpen={isModalOpen}
        opacity={0.5}
        close={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        closeOutside={false}
      >
        {modalItemType === "rentPlayer" && (
          <div className={styles["modal-container"]}>
            <Typography variant="title6">Rent Player</Typography>
            <PlayerAvatar
              player={{ stats: modalItem?.stats || new Array(10).fill(0) }}
              id={modalItem?.id}
            />
            <Typography variant="body2">{modalItem?.price}</Typography>
            <Button
              type="secondary"
              disabled={
                parseFloat(balance) <
                parseFloat(modalItem?.price?.split(" ")?.[0] || "0")
              }
              onClick={async () => {
                const isApproved = await isApprovedReq.exec();
                if (isApproved) {
                  await rentPlayerReq.exec(modalItem?.id);
                } else {
                  await approveReq.exec();
                  await rentPlayerReq.exec(modalItem?.id);
                }
              }}
              loading={rentPlayerReq.loading}
            >
              Rent Player
            </Button>
          </div>
        )}
      </Modal>
      {allRentedListing
        .filter((item) => !myOwnPlayers?.includes(item.id))
        .map((item, index) => {
          return (
            <PlayerCard
              player={{ stats: item.stats }}
              key={index}
              size="128px"
              playerId={item.id}
            >
              <Typography>{item?.price}</Typography>
              <Button
                disabled={
                  parseFloat(balance) <
                  parseFloat(item?.price?.split(" ")?.[0] || "0")
                }
                className={styles.button}
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
            </PlayerCard>
          );
        })}
      {(getAllRentedListingReq.loading || getAllPlayersOfReq.loading) && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </Fragment>
  );
};

export { Rent };
