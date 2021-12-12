import { Spinner } from "components/Spinner";
import { Typography } from "components/Typography";
import styles from "./Loader.module.scss";

const Loader = ({ children }) => {
  return (
    <div className={styles.loader}>
      <Spinner size={36} />
      <Typography variant="body1">{children}</Typography>
    </div>
  );
};

export { Loader };
