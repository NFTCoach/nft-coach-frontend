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
import styles from "./Marketplace.module.scss";

const Rent = ({ modalItemType, myOwnPlayers, setModalItemType }) => {
  const contracts = useSelector((state) => state.contracts);
  const [allRentedListing, setAllRentedListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState();

  const { rentPlayer } = useContractFunction();
  const { getAllRentedListings } = useListingFunctions();

  const getAllRentedListingReq = useRequest(getAllRentedListings, {
    errorMsg: "Could not load marketplace",
  });

  const rentPlayerReq = useRequest(rentPlayer);

  useEffect(() => {
    if (myOwnPlayers === null) {
      return;
    }

    const getRentedReq = async () => {
      if (contracts.Marketplace) {
        const res = await getAllRentedListingReq.exec();
        console.log(res);
        setAllRentedListings(res);
      }
    };

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
            <PlayerAvatar id={modalItem?.id} />
            <Button
              type="secondary"
              onClick={() => {
                rentPlayerReq.exec(modalItem?.id);
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
            <PlayerCard key={index} size="128px" playerId={item.id}>
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
            </PlayerCard>
          );
        })}
        {getAllRentedListingReq.loading && <Spinner />}
    </Fragment>
  );
};

export { Rent };
