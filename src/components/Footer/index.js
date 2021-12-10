import React from "react";
import styles from "./Footer.module.scss";
import logo from "assets/images/landing/logo-240.png";
import { ReactComponent as LinkedinIcon } from "assets/icons/brand/LinkedIn.svg";
import { ReactComponent as TwitterIcon } from "assets/icons/brand/twitter.svg";
import { Typography } from "components/Typography";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <img src={logo} />
      <Typography className={styles.cp} variant="caption" weight="semibold">
        All rights reserved | 2021
      </Typography>
      <div className={styles.social}>
        <a href="#">
          <LinkedinIcon />
        </a>
        <a href="#">
          <TwitterIcon />
        </a>
      </div>
    </footer>
  );
}
