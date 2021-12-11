import styles from "./Roadmap.module.scss";
import { Typography } from "components/Typography";
import { Header } from "components/Header";
import { clsnm } from "common/utils/clsnm";
import AvalancheLogo from "assets/images/landing/avalanche.png";
import ChainlinkLogo from "assets/images/landing/chainlink.png";

const Roadmap = () => {
  return (
    <div className={styles.roadmap}>
      <Header>Roadmap</Header>
      <Header className={styles.sub} sub>
        Here is our roadmap & schedule
      </Header>
      <div className={styles.items}>
        <div data-aos="fade-up" className={clsnm(styles.item)}>
          <Typography weight="semibold" variant="body1">
            June 2021
          </Typography>
          <ul className={styles.list}>
            <li>MVP Alpha version</li>
            <li>Alpha Game Design</li>
            <li>Early Smart Contracts </li>
            <li>Tokenomics Design</li>
          </ul>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className={clsnm(styles.item)}
        >
          <Typography weight="semibold" variant="body1">
            September 2021
          </Typography>
          <ul className={styles.list}>
            <li>Smart Contracts V1 </li>
            <li>PvP Match System</li>
            <li>Marketplace</li>
            <li>Tournament System</li>
          </ul>
          <img alt="" className={styles.image} src={AvalancheLogo} />
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className={clsnm(styles.item)}
        >
          <Typography weight="semibold" variant="body1">
            November 2021
          </Typography>
          <ul className={styles.list}>
            <li>Partnership & Sponsorship deals with Exchanges / DEX’s</li>
            <li>Avatar and Game Concept Design</li>
          </ul>
        </div>
      </div>
      <div className={styles.items}>
        <div
          data-aos="fade-up"
          data-aos-delay="600"
          className={clsnm(styles.item)}
        >
          <Typography weight="semibold" variant="body1">
            December 2021
          </Typography>
          <ul className={styles.list}>
            <li>Seed Fund Tour</li>
            <li>Private Fund Tour</li>
            <li>Game Frontend</li>
            <li>Community Building</li>
          </ul>
          <img alt="" className={styles.image} src={ChainlinkLogo} />
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="800"
          className={clsnm(styles.item)}
        >
          <Typography weight="semibold" variant="body1">
            January 2022
          </Typography>
          <ul className={styles.list}>
            <li>Game Launch</li>
            <li>Coach Token Sale</li>
            <li> Player Packs Sale </li>
            <li>Design</li>
          </ul>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="1000"
          className={clsnm(styles.item)}
        >
          <Typography weight="semibold" variant="body1">
            Future roadmap
          </Typography>
          <ul className={styles.list}>
            <li>2D Animations for Gameplay</li>
            <li>3D Character Concepts</li>
            <li>Staking Mechanisms</li>
            <li>Other Game Asset Integrations (planet,land etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { Roadmap };
