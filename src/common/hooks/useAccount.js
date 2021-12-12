import { useDispatch, useSelector } from "react-redux";
import { setBalance, setSignedIn } from "store/reducers/account";
import useRequestAccounts from "common/hooks/useRequestAccounts";
import { useRequest } from "./useRequest";
import { useEffect } from "react";
import { useGeneralFunctions } from "./useGeneralFunctions";
import { ethers } from "ethers";

export default function useAccount({ directSignIn } = { directSignIn: true }) {
  const dispatch = useDispatch();
  const { requestAccounts } = useRequestAccounts();
  const { getCoachBalanceOf } = useGeneralFunctions();
  const { isSignedIn, address } = useSelector((state) => state.account);
  const { NC1155 } = useSelector((state) => state.contracts);

  async function getIsSignedIn() {
    const res = await window.ethereum.request({ method: "eth_accounts" });

    if (directSignIn === true || res.length > 0) {
      requestAccounts();
    } else {
      dispatch(setSignedIn(false));
    }

    return res.length;
  }

  const balanceReq = useRequest(getCoachBalanceOf);

  useEffect(() => {
    const getReq = async () => {
      if (isSignedIn && NC1155) {
        const res = await balanceReq.exec(address);
        dispatch(setBalance(ethers.utils.formatEther(res)));
      }
    };
    getReq();
  }, [isSignedIn, NC1155]);

  return { getIsSignedIn };
}
