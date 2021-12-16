/* eslint-disable */
import { useDrag } from "react-dnd";
import { PlayerAvatar } from "components/PlayerAvatar";
import styles from "./PlayerCard.module.scss";
import { clsnm } from "common/utils/clsnm";
import { calcPower } from "common/utils/calcPower";
import { Typography } from "components/Typography";

const PlayerCard = ({
  size,
  className,
  playerId,
  draggable,
  children,
  player,
  showPowers = true,
}) => {
  const [{ isDragging, isDraggable }, drag] = useDrag({
    type: "1",
    item: { playerId: playerId },
    collect: () => ({
      isDraggable: draggable,
    }),
  });

  const [atk, def] = calcPower(player);

  return (
    <div className={styles.wrapper}>
      <PlayerAvatar
        showPowers={false}
        ref={isDraggable ? drag : null}
        id={playerId}
        className={clsnm(isDraggable && styles.draggable, className)}
        size={size}
      />
      {showPowers && (
        <div className={styles.powers}>
          <Typography className={clsnm(styles.power, styles.att)}>
            {atk} A - {def} D{" "}
          </Typography>
        </div>
      )}

      {children}
    </div>
  );
};

export { PlayerCard };
