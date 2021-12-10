import { clsnm } from "common/utils/clsnm";
import { Typography } from "components/Typography";
import styles from "./Header.module.scss";

const Header = ({ children, sub, className }) => {
  return (
    <Typography
      weight={sub ? "medium" : "semibold"}
      header={!sub}
      className={clsnm(sub ? styles.subheader : styles.header, className)}
    >
      {children}
    </Typography>
  );
};

export { Header };
