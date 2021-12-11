import { Header } from "components/Header";
import styles from "./Cards.module.scss";
import Card1 from "assets/images/landing/card1.png";
import Design from "assets/images/landing/design.png";
import Card2 from "assets/images/landing/card2.png";

const Cards = () => {
  return (
    <div className={styles.cards}>
      <Header>Player Cards</Header>
      <Header className={styles.sub} sub>
        Genetics determine the rarity of players. Rarity consists of 5 offensive
        & 5 defensive attributes.
      </Header>
      <div className={styles.cardWrapper}>
        <img alt="" data-aos="fade-up" src={Card1} />
        <img alt="" data-aos="fade-up" src={Design} />
        <img alt="" data-aos-duration="2000" data-aos="fade-up" src={Card2} />
      </div>
    </div>
  );
};

export { Cards };
