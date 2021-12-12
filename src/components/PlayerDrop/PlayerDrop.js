import styles from "./PlayerDrop.module.scss";
import { useDrop } from "react-dnd";
import { PlayerCard } from "components/PlayerCard";
import { clsnm } from "common/utils/clsnm";
import { ReactComponent as DownloadIcon } from "assets/icons/basic/download.svg";
import Icon from "components/Icon/Icon";
import { setDefaultFiveIndex } from "store/reducers/game";
import { useDispatch } from "react-redux";
import { PlayerAvatar } from "components/PlayerAvatar";

const PlayerDrop = ({ index, id, className }) => {
  const dispatch = useDispatch();

  const [{ isOver, droppable }, drop] = useDrop({
    accept: "1",
    drop: (item, monitor) => {
      const { playerId } = item;
      dispatch(setDefaultFiveIndex({ index: index, id: playerId }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={className}>
      <div className={clsnm(styles.player, isOver && styles.over)}>
        {id != "0" ? (
          <PlayerAvatar size={"128px"} id={id} />
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
