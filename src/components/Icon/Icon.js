import { cloneElement, forwardRef, isValidElement } from "react";
import React from "react";
import styles from "./Icon.module.scss";
import { clsnm } from "common/utils/clsnm";

const Icon = forwardRef(({ size = 20, className, children, onClick }, ref) => {
  const childrenWithProps = () => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        width: size,
        height: size,
      });
    }
    return children;
  };

  return (
    <div ref={ref} onClick={onClick} className={clsnm(styles.icon, className)}>
      {childrenWithProps?.()}
    </div>
  );
});

export default Icon;
