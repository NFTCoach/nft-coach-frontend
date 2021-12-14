import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";
import Button from "components/Button";
import Input from "components/Input";
import Modal from "components/Modal/Modal";
import { PlayerCard } from "components/PlayerCard";
import { Slider } from "components/Slider";
import { Typography } from "components/Typography";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRentingPlayer, setSellingPlayer } from "store/reducers/game";
import styles from "./MyTeam.module.scss";

const Modals = ({ isSelling, setIsSelling, isRenting, setIsRenting }) => {
  const dispatch = useDispatch();
  const { rentingPlayer, sellingPlayer } = useSelector((state) => state.game);
  const [sellingPrice, setSellingPrice] = useState("");
  const [rentingPrice, setRentingPrice] = useState("");
  const [rentingDuration, setRentingDuration] = useState(1);

  const {
    listPlayer,
    listPlayerForRent,
    approvePlayersForMarket,
    arePlayersApprovedForMarket,
  } = useContractFunction();
  const listPlayerReq = useRequest(listPlayer, {
    onFinished: () => {
      setIsSelling(false);
    },
  });
  const listPlayerForRentReq = useRequest(listPlayerForRent, {
    onFinished: () => {
      setIsRenting(false);
    },
  });

  const isApprovedReq = useRequest(arePlayersApprovedForMarket);
  const approveReq = useRequest(
    approvePlayersForMarket,
    {},
    { timeout: 4000, message: "Approving cards" }
  );

  const _listPlayerForRentReq = async () => {
    if (!rentingPrice) {
      return;
    }

    try {
      await listPlayerForRentReq.exec(
        rentingPlayer?.id,
        rentingPrice,
        rentingDuration
      );
    } catch (err) {
      console.log(err);
    }
  };

  const sellPlayer = async () => {
    if (!sellingPrice) {
      return;
    }

    try {
      const isApproved = await isApprovedReq.exec();
      if (isApproved) {
        await listPlayerReq.exec(sellingPlayer?.id, sellingPrice);
      } else {
        await approveReq.exec();
        await listPlayerReq.exec(sellingPlayer?.id, sellingPrice);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Modal
        opacity={0.5}
        className={styles.modal}
        isOpen={isSelling}
        close={() => {
          dispatch(setSellingPlayer(null));
          setIsSelling(false);
        }}
      >
        <div className={styles.modalInner}>
          <Typography weight="medium" className={styles.title} variant="title3">
            Sell Player
          </Typography>
          <PlayerCard size={"156px"} playerId={sellingPlayer?.id} />
          <Input
            type="number"
            onChange={(e) => setSellingPrice(e.target.value)}
            value={sellingPrice}
            placeholder="Price"
          />
          <Button
            type="tertiary"
            loading={listPlayerReq.loading}
            onClick={sellPlayer}
            disabled={sellingPrice == ""}
          >
            List item
          </Button>
        </div>
      </Modal>
      <Modal
        opacity={0.5}
        className={styles.modal}
        isOpen={isRenting}
        close={() => {
          dispatch(setRentingPlayer(null));
          setRentingDuration(1);
          setIsRenting(false);
        }}
      >
        <div className={styles.modalInner}>
          <Typography weight="medium" className={styles.title} variant="title3">
            Rent Player
          </Typography>
          <PlayerCard size={"156px"} playerId={rentingPlayer?.id} />
          <Input
            type="number"
            onChange={(e) => setRentingPrice(e.target.value)}
            value={rentingPrice}
            placeholder="Price"
          />
          <div className={styles.slider}>
            <Slider
              value={rentingDuration}
              onChange={(e) => setRentingDuration(e)}
              label={"Duration (days)"}
            />
          </div>

          <Button
            type="tertiary"
            disabled={rentingPrice == "" || rentingDuration == 0}
            loading={listPlayerForRentReq.loading}
            onClick={_listPlayerForRentReq}
          >
            List item
          </Button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Modals;
