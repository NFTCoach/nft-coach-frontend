import Button from "components/Button";
import { Typography } from "components/Typography";
import { useSelector } from "react-redux";
import styles from "./Headline.module.scss";
import { ReactComponent as Sun } from "assets/icons/experimental/sun.svg";
import { ReactComponent as Moon } from "assets/icons/experimental/moon.svg";
import Icon from "components/Icon/Icon";
import { useState } from "react";

const Headline = ({ title, children }) => {
  const { balance } = useSelector((state) => state.account);

  const [theme, setTheme] = useState("dark");

  const returnTheme = () => {
    const body = document.getElementById("body");

    if (body.classList.contains("dark")) {
      return "dark";
    } else {
      return "light";
    }
  };

  const handleTheme = () => {
    const body = document.getElementById("body");

    if (returnTheme() === "dark") {
      body.classList.remove("dark");
      body.classList.add("light");
      setTheme("light");
    } else {
      body.classList.add("dark");
      body.classList.remove("light");
      setTheme("dark");
    }
  };

  return (
    <div className={styles.header}>
      {children ? (
        children
      ) : (
        <Button className={styles.hidden} type="secondary">
          Balance: {balance} ETH
        </Button>
      )}

      <Typography className={styles.title} variant="title2" weight="semibold">
        {title}
      </Typography>
      <div className={styles.right}>
        <Button
          onClick={handleTheme}
          className={styles.balance}
          type="secondary"
        >
          <Icon>{theme === "dark" ? <Moon /> : <Sun />}</Icon>
        </Button>
        <Button className={styles.balance} type="secondary">
          Balance: {balance} ETH
        </Button>
      </div>
    </div>
  );
};

export { Headline };
