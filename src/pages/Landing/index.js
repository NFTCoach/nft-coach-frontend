import { Typography } from "components/Typography";
import styles from "./Landing.module.scss";
import Button from "components/Button";
import Navbar from "components/Navbar";
import PlayerImage from "assets/images/landing/player.png";
import { Fragment } from "react";
import { Info } from "components/Info";
import Numbers from "components/Numbers/Numbers";
import { Cards } from "components/Cards";
import { Concept } from "components/Concept";
import { Roadmap } from "components/Roadmap";
import useAccount from "common/hooks/useAccount";
import React, { useEffect } from "react";

const Landing = () => {

  const { getIsSignedIn } = useAccount({ directSignIn: false });

  useEffect(() => {
    getIsSignedIn();
  }, []);

  return (
    <Fragment>
      <div className={styles.wrapper}>
        <Navbar />
        <div data-aos="fade-in" className={styles.hero}>
          <Typography
            header
            className={styles.header}
            variant="title1"
            weight="semibold"
          >
            NFT COACH
          </Typography>
          <Typography
            className={styles.subheader}
            variant="title5"
            weight="regular"
          >
            New generation basketball manager game that gives you an opportunity
            to have a life time income. Create your team and join the game!
          </Typography>
          <div className={styles.buttons}>
            <Button size="large">Get Started</Button>
            <Button type="secondary" size="large">
              Buy Token
            </Button>
          </div>
        </div>
      </div>
      <Info />
      <Concept />
      <Cards />
      <Roadmap />
    </Fragment>
  );
};

export { Landing };
