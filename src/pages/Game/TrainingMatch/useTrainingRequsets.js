import { useRequest } from "common/hooks/useRequest";
import { useContractFunction } from "common/utils/contract/functions";

export const useTrainingRequests = () => {
  const { getDefaultFive, get10RandomTeams, testTrain } = useContractFunction();

  const getDefaultFiveReq = useRequest(getDefaultFive);
  const getRandomTeamsReq = useRequest(get10RandomTeams);
  const requestTrainingReq = useRequest(testTrain);

  return { getDefaultFiveReq, getRandomTeamsReq, requestTrainingReq };
};
