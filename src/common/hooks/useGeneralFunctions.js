import { useSelector } from "react-redux";

export const useGeneralFunctions = () => {
  const { NC1155, COACH } = useSelector((state) => state.contracts);

  const getCardBalanceOf = async (address, type) => {
    return await NC1155.balanceOf(address, type);
  };

  const getCoachBalanceOf = async (address) => {
    return await COACH.balanceOf(address);
  };

  return { getCardBalanceOf, getCoachBalanceOf };
};
