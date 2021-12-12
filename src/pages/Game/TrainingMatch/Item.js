import { clsnm } from "common/utils/clsnm";
import React, { useEffect, useRef } from "react";
import styles from "./TrainingMatch.module.scss";

const Item = ({
  item,
  index,
  randomOpponents,
  setFocused,
  focused,
  setSelected,
  selected,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (focused === index) {
      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focused, selected]);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(index);
      }}
      key={index}
      className={clsnm(styles.item, selected === index && styles.selected)}
    >
      <h4>Team {index + 1}</h4>
    </div>
  );
};

export default Item;
