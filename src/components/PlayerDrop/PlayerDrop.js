import styles from "./PlayerDrop.module.scss";
import { useDrag, useDrop } from "react-dnd";
import { clsnm } from "common/utils/clsnm";
import { ReactComponent as DownloadIcon } from "assets/icons/basic/download.svg";
import Icon from "components/Icon/Icon";
import { setDefaultFiveIndex } from "store/reducers/game";
import { useDispatch } from "react-redux";
import { PlayerAvatar } from "components/PlayerAvatar";

const PlayerDrop = ({ index, id, className, player }) => {
  const dispatch = useDispatch();

  const [{ isOver, droppable }, drop] = useDrop({
    accept: "1",
    drop: (item, monitor) => {
      const { playerId, clearIndex, clear } = item;
      if (clear) {
        dispatch(setDefaultFiveIndex({ index: clearIndex, id: "0" }));
      }
      dispatch(setDefaultFiveIndex({ index: index, id: playerId }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{}, drag] = useDrag({
    type: "1",
    item: { playerId: id, clearIndex: index, clear: true },
  });

  return (
    <div ref={drop} className={className}>
      <div className={clsnm(styles.player, isOver && styles.over)}>
        {id != "0" && id != null ? (
          <PlayerAvatar player={player} ref={drag} size={"128px"} id={id} />
        ) : (
          <Icon>
            <DownloadIcon />
          </Icon>
        )}
      </div>
    </div>
  );
};

export { PlayerDrop };
