import { Header } from "components/Header";
import { Typography } from "components/Typography";
import styles from "./Team.module.scss";
import { ReactComponent as LinkedinIcon } from "assets/icons/brand/LinkedIn.svg";

import HamzaPhoto from "assets/images/landing/team/hamza.jpeg";
import UlasPhoto from "assets/images/landing/team/ulas.jpeg";
import EnginPhoto from "assets/images/landing/team/engin.jpeg";
import GurkanPhoto from "assets/images/landing/team/gurkan.jpeg";
import Pera from "assets/images/landing/team/pera.jpeg";

const Team = () => {
  const items = [
    {
      name: "Ulaş Erdoğan",
      position: "Game Design",
      photo: UlasPhoto,
      linkedin: "https://www.linkedin.com/in/ulaserdogan/",
    },
    {
      name: "Hamza Karabag",
      position: "Smart Contract Developer",
      photo: HamzaPhoto,
      linkedin: "https://www.linkedin.com/in/hamza-karaba%C4%9F-7061221b4/",
    },
    {
      name: "Engin Çetin",
      position: "UI/UX Designer",
      photo: EnginPhoto,
      linkedin: "https://www.linkedin.com/in/engincetin/",
    },
    {
      name: "Gürkan Ketenciler",
      position: "Business Development",
      photo: GurkanPhoto,
      linkedin: "https://www.linkedin.com/in/gurkanketenciler/",
    },
    {
      name: "Pera Finance",
      position: "Partner",
      photo: Pera,
      linkedin: "https://www.linkedin.com/company/pera-finance/",
    },
  ];

  return (
    <div className={styles.team}>
      <Header>Team & Partners</Header>

      <div className={styles.members}>
        {items.map((item) => (
          <div className={styles.item}>
            <img className={styles.image} src={item.photo} />

            <Typography variant="body1" weight="semibold">
              {item.name}
            </Typography>
            <Typography variant="caption" weight="medium">
              {item.position}
            </Typography>

            <a href={item.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Team };
