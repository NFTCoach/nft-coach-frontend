import Button from "components/Button";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "store/reducers/market";

const Filters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.market);

  const isActive = (type) => {
    const active = filters?.includes(type);
    if (active) {
      return "tertiary";
    } else {
      return "secondary";
    }
  };

  const handleToggle = (type) => {
    dispatch(toggleFilter(type));
  };
  return (
    <Fragment>
      <Button
        onClick={() => handleToggle("players")}
        type={isActive("players")}
      >
        Players
      </Button>
      <Button onClick={() => handleToggle("teams")} type={isActive("teams")}>
        Teams
      </Button>
      <Button
        onClick={() => handleToggle("player-packs")}
        type={isActive("player-packs")}
      >
        Player Packs
      </Button>
      <Button
        onClick={() => handleToggle("upgrade-packs")}
        type={isActive("upgrade-packs")}
      >
        Upgrade Packs
      </Button>
    </Fragment>
  );
};

export { Filters };
