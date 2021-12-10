import React, { useEffect, useRef } from "react";
import styles from "./Navbar.module.scss";
import logo from "./logo-240.png";
import Button from "components/Button";
import { Typography } from "components/Typography";

export default function Navbar() {
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = (e) => {
      if (ref.current) {
        if (window.scrollY > 100) {
          ref.current.classList.add(styles.scrolled);
        } else {
          ref.current.classList.remove(styles.scrolled);
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav ref={ref} className={styles.navbar}>
      <img src={logo} alt="logo" />
      <div className={styles.navigationBar}>
        <div>
          <Button>Launch Game</Button>
        </div>
      </div>
    </nav>
  );
}
