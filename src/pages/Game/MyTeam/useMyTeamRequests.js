import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";
import { toast } from "react-toastify";

export const useMyTeamRequests = ({
  setIsPlayerPackOpen,
  setForceUpdateChange,
  forceUpdateChange,
  getReq,
}) => {
  const {
    getAllPlayersOf,
    testOpenPack,
    getDefaultFive,
    getStats,
    getTeamStats,
    setDefaultFive: setDefaultFiveR,
    delistPlayer,
  } = useContractFunction();

  const statReq = useRequest(getStats);
  const defaultFiveReq = useRequest(getDefaultFive);
  const setDefaultFiveReq = useRequest(setDefaultFiveR, {
    onFinished: () => {
      toast("Team was set successfully!");
    },
  });
  const getTeamStatsReq = useRequest(getTeamStats);
  const getAllPlayersReq = useRequest(getAllPlayersOf);
  const delistPlayerReq = useRequest(delistPlayer, {
    onFinished: () => {
      toast("Player delisted succesfully!");
      getReq?.();
    },
  });

  const openPackReq = useRequest(
    async () => {
      await testOpenPack();
    },
    {
      onFinished: async () => {
        setIsPlayerPackOpen(false);
        setForceUpdateChange(!forceUpdateChange);
      },
    }
  );

  return {
    statReq,
    defaultFiveReq,
    setDefaultFiveReq,
    getTeamStatsReq,
    getAllPlayersReq,
    openPackReq,
    delistPlayerReq,
  };
};
