import styles from "./Slider.module.scss";
import ReactSlider from "react-slider";
import { Typography } from "components/Typography";

const Slider = ({ label, value, onChange, ...rest }) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <Typography variant="body2" weigth="regular">
          {label}
        </Typography>
      )}
      <ReactSlider
        value={value}
        onChange={onChange}
        className={styles.slider}
        thumbClassName={styles.thumb}
        trackClassName={styles.track}
        {...rest}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
      />
    </div>
  );
};

export { Slider };
