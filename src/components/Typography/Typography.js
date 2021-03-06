import { clsnm } from "common/utils/clsnm";
import * as React from "react";

import styles from "./Typography.module.scss";

/* type TypographyVariants =
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "title5"
  | "headline"
  | "body1"
  | "body2"
  | "caption"; */

/* type TypographyWeights = "semibold" | "medium" | "regular";

type TypographyOwnProps = {
  as?: React.ElementType;
  variant: TypographyVariants;
  weight?: TypographyWeights;
  decor?: "underline";
}; */

/* type TypographyProps = TypographyOwnProps &
  Omit<React.ComponentProps<"span">, keyof TypographyOwnProps>; */

const Typography = React.forwardRef((props, ref) => {
  const {
    variant,
    weight,
    decor,
    as: Component = "span",
    className,
    children,
    header,
    ...rest
  } = props;

  return (
    <Component
      ref={ref}
      className={clsnm(
        styles[variant],
        styles[`${weight}`],
        styles[`${decor}`],
        header && styles.header,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

export { Typography };
