import styles from "./Roadmap.module.scss";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Typography } from "components/Typography";
import { Header } from "components/Header";
import { clsnm } from "common/utils/clsnm";
import AvalancheLogo from "assets/images/landing/avalanche.png";

const Roadmap = () => {
  return (
    <div className={styles.roadmap}>
      <Header>Roadmap</Header>
      <Header className={styles.sub} sub>
        Here is our roadmap & schedule
      </Header>
      <div className={styles.items}>
        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            June 2021
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>

        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            September 2021
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
          <img src={AvalancheLogo} />
        </div>

        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            November 2021
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>
      </div>

      <div className={styles.items}>
        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            December 2021
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>

        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            January 2022
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>

        <div className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            Future roadmap
          </Typography>
          <ul className={styles.list}>
            <li> MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>
      </div>

      {/*  <OwlCarousel className="owl-theme" loop margin={10} nav>
        <div class="item">
          <img src="assets/img/1.jpg" />
        </div>
        <div class="item">
          <img src="assets/img/2.jpg" />
        </div>
        <div class="item">
          <img src="assets/img/3.jpg" />
        </div>
        <div class="item">
          <img src="assets/img/4.jpg" />
        </div>
        <div class="item">
          <img src="assets/img/5.jpg" />
        </div>
      </OwlCarousel> */}
    </div>
  );
};

export { Roadmap };
