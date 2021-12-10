import React, { useEffect, useRef } from "react";
import styles from "./Navbar.module.scss";
import logo from "./logo-240.png";
import Button from "components/Button";
import { Typography } from "components/Typography";
import { useSelector } from "react-redux";
import useRequestAccounts from "common/hooks/useRequestAccounts";
import { ReactComponent as UserIcon } from "assets/icons/user/user.svg";
import { Link } from "react-router-dom";

export default function Navbar() {
  const ref = useRef(null);

  const account = useSelector((state) => state.account);
  const { requestAccounts } = useRequestAccounts();

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
        {account.isSignedIn === false && (
          <Button type="secondary" onClick={requestAccounts}>
            Sign In
          </Button>
        )}
        {account.isSignedIn && (
          <div className={styles.iconContainer}>
            <UserIcon />
            <span>
              {account.address.substring(0, 5)}...
              {account.address.substring(
                account.address.length - 5,
                account.address.length
              )}
            </span>
          </div>
        )}
        <div>
          <Link to="/game">
            <Button>Launch Game</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
