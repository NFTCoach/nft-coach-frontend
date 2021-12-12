/* eslint-disable */
import { useDrag } from "react-dnd";

import { PlayerAvatar } from "components/PlayerAvatar";
import styles from "./PlayerCard.module.scss";

const PlayerCard = ({ size, className, playerId, draggable, children }) => {
  const [{ isDragging, isDraggable }, drag] = useDrag({
    type: "1",
    item: { playerId: playerId },
    collect: () => ({
      isDraggable: draggable,
    }),
  });

  return (
    <div className={styles.wrapper}>
      <PlayerAvatar
        ref={isDraggable ? drag : null}
        id={playerId}
        className={className}
        size={size}
      />
      {children}
    </div>
  );
};

export { PlayerCard };
