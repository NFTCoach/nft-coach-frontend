import styles from "./Numbers.module.scss";

const Numbers = () => {
  const items = [
    { name: "Teams", count: 140 },
    { name: "Players", count: 140 },
    { name: "Challenges", count: 140 },
    { name: "Marketplace sales", count: 180 },
  ];

  return (
    <div className={styles.numbers}>
      <div className={styles.items}></div>
    </div>
  );
};

export default Numbers;
