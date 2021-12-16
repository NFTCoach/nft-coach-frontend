import { PATHS } from "common/constants/paths";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import useAccount from "./useAccount";
import { useGameFunctions } from "./useGameFunctions";
import { useRequest } from "./useRequest";

export const useRouting = () => {
  const { getTeamStats } = useGameFunctions();
  const getTeamStatsReq = useRequest(getTeamStats);
  const { isSignedIn, address } = useSelector((state) => state.account);
  const navigate = useNavigate();

  const { getIsSignedIn } = useAccount();

  useEffect(() => {
    if (!isSignedIn) {
      getIsSignedIn();
      return;
    }
    const fetchData = async () => {
      const res = await getTeamStatsReq.exec(address);
      if (!res.initialized) {
        navigate(PATHS.create_team);
      }
    };
    fetchData();
  }, [isSignedIn]);
};
