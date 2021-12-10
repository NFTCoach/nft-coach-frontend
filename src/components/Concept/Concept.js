import styles from "./Concept.module.scss";
import ConceptPhoto from "assets/images/landing/concept.png";
import { Header } from "components/Header";

const Concept = () => {
  return (
    <div className={styles.concept}>
      <Header>Gradually Evolving NFTs</Header>
      <img
        data-aos="fade-in"
        className={styles.conceptPhoto}
        src={ConceptPhoto}
      />
    </div>
  );
};

export { Concept };
