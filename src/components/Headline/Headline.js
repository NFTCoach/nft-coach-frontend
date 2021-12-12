import Button from "components/Button";
import { Typography } from "components/Typography";
import { useSelector } from "react-redux";
import styles from "./Headline.module.scss";

const Headline = ({ title }) => {
  const { balance } = useSelector((state) => state.account);

  return (
    <div className={styles.header}>
      {/* placeholder*/}
      <Button className={styles.hidden} type="secondary">
        Balance: {balance} ETH
      </Button>
      {/* placeholder*/}

      <Typography variant="title2" weight="semibold">
        {title}
      </Typography>
      <Button className={styles.balance} type="secondary">
        Balance: {balance} ETH
      </Button>
    </div>
  );
};

export { Headline };
