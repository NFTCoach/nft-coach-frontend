import { Typography } from "components/Typography";
import styles from "./Info.module.scss";

import Team from "../../assets/images/landing/team.png";
import Challenge from "../../assets/images/landing/challenge.png";
import Sell from "../../assets/images/landing/sell.png";
import { useEffect } from "react";
import { Header } from "components/Header";

const Info = () => {
  const items = [
    {
      title: "Create a team",
      content:
        "Create a team with a starter pack. You will get 5 players once you buy a team. You can also buy more players from the market.",
      image: Team,
    },
    {
      title: "Challenge others",
      content:
        "Select your best players to challenge your rivals. Once you win the game your players will improve. Win more improve you players more.",
      image: Challenge,
    },
    {
      title: "Earn real Money",
      content:
        "As owner of the team you can earn money by selling your players in marketplace. Improve your players more to earn more.",
      image: Sell,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Header>How it works</Header>

      <div className={styles.steps}>
        {items.map((item) => (
          <div data-aos="fade-up" className={styles.step}>
            <Typography header variant="title4" weight="semibold">
              {item.title}
            </Typography>
            <Typography variant="body1" weight="medium">
              {item.content}
            </Typography>
            <img src={item.image} className={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Info };
