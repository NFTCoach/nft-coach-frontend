import { clsnm } from "common/utils/clsnm";
import { parseScore } from "common/utils/parseScore";
import { Typography } from "components/Typography";
import React, { useEffect, useRef } from "react";
import styles from "./TrainingMatch.module.scss";

const Item = ({ item, index, focused, setSelected, selected }) => {
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
      <div className={styles.powers}>
        <div className={styles.row}>
          <Typography weight="semibold">Attack</Typography>
          <Typography weight="semibold">Defence</Typography>
        </div>
        <div className={styles.row}>
          <Typography
            weight="semibold"
            className={styles.attack}
            variant="title4"
          >
            {parseScore(item.atkAvg)}
          </Typography>
          <Typography
            weight="semibold"
            className={styles.defence}
            variant="title4"
          >
            {parseScore(item.defAvg)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Item;
