import React from "react";
import styles from "./Navbar.module.scss";
import logo from "./logo-240.png";
import Button from "components/Button";

export default function Navbar() {

  return (<nav className={styles.navbar}>
    <img src={logo} alt="logo" />
    <div className={styles.navigationBar}>
        <a>Home</a>
        <a>How It Works</a>
        <a>Pricing</a>
        <a>Team</a>
        <a>Contact</a>
        <div>
          <Button>Launch Game</Button>
        </div>
    </div>
    </nav>);
};

