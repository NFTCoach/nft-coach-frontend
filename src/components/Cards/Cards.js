import { Header } from "components/Header";
import styles from "./Cards.module.scss";

const Cards = () => {
  return (
    <div className={styles.cards}>
      <Header>Player Cards</Header>
      <Header className={styles.sub} sub>
        Genetics determine the rarity of players. Rarity consists of 5 offensive
        & 5 defensive attributes.
      </Header>
    </div>
  );
};

export { Cards };
