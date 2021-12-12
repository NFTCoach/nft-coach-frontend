import { useClickOutside } from "common/hooks/useOnClickOutside";
import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import styles from "./Modal.module.scss";
import { ReactComponent as CloseIcon } from "assets/icons/menu/close_big.svg";
import Icon from "components/Icon/Icon";
import { clsnm } from "common/utils/clsnm";

const Modal = ({
  isOpen,
  close,
  children,
  closeOutside = true,
  opacity = 0.3,
  className,
}) => {
  const { ref } = useClickOutside(closeOutside ? close : null);

  React.useEffect(() => {
    if (isOpen) {
      const bodyEl = document.querySelector("body");
      if (bodyEl) {
        bodyEl.style.overflow = "hidden";
      }
    } else {
      const bodyEl = document.querySelector("body");
      if (bodyEl) {
        bodyEl.style.overflow = "visible";
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") {
        close?.();
      }
    };

    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
    };
  }, []);

  const style = `rgba(0, 0, 0, ${opacity})`;

  return (
    <>
      {isOpen && (
        <div
          data-aos="fade-in"
          data-aos-duration="300"
          className={styles.modal}
        >
          <div className={clsnm(styles.content, className)} ref={ref}>
            <div onClick={close} className={styles.close}>
              <Icon>
                <CloseIcon />
              </Icon>
            </div>
            {children}
          </div>
          <div
            className={styles.overlay}
            style={{ backgroundColor: style }}
          ></div>
        </div>
      )}
    </>
  );
};

export default Modal;
