import { clsnm } from "common/utils/clsnm";
import React from "react";
import styles from "./Input.module.scss";


function Input({
    withLabel,
    type,
    children,
    inputClassName,
    labelClassName,
    spanClassName,
    placeholder,
    ...rest
}) {

    if (withLabel) {
        return <label className={clsnm(styles.label, labelClassName)}>
            <span className={styles.spanClassName}>{children}</span>
            <input type={type} className={clsnm(styles.input, inputClassName)} placeholder={placeholder || children} {...rest} />
        </label>
    }

    return <input type={type} {...rest} />
}


Input.defaultProps = {
    withLabel: true,
    type: "text",
    inputClassName: "",
    spanClassName: "",
    labelClassName: "",
}

export default Input;