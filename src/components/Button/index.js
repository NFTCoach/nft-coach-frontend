import {clsnm} from "common/utils/clsnm";
import React from "react";
import styles from "./Button.module.scss";
import { Typography } from "components/Typography";

/**
 * type = "primary" | "secondary"
 * size = "small" | "medium" | "large" | "xlarge"
 * laading = true | false
 */


const Button = React.forwardRef(({
    children,
    type = "secondary",
    size = "medium",
    loading = false,
    ...rest
}, ref) => {
    const variant = ["small", "medium"].includes(size) ? "body2" : "body1";

    return (<button className={clsnm(styles["button"],
                    styles[type], styles[size],
                    loading && styles["loading"])}
                    ref={ref}
                    {...rest}>
    <Typography
        variant={variant}
        className={clsnm(styles.content, loading && styles.loading)}
    >
        {children}
    </Typography>
    <div className={styles.loadingIndicator}>{loading && "Sending..."}</div>
    </button>);
});


export default Button;