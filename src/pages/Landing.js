import { Typography } from "components/Typography";
import styles from "./Landing.module.scss";

const Landing = () => {
  return (
    <div className={styles.hero}>
      <Typography className={styles.header} variant="title1" weight="semibold">
        NFT COACH
      </Typography>
      <Typography
        className={styles.subheader}
        variant="title5"
        weight="regular"
      >
        There are many variations of passages of Lorem Ipsum available, but the
        majority have suffered alteration in some form, by injected humour,
      </Typography>
    </div>
  );
};

export { Landing };
