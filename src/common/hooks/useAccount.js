import { useDispatch } from "react-redux";
import { setSignedIn } from "store/reducers/account";
import useRequestAccounts from "common/hooks/useRequestAccounts";

export default function useAccount({ directSignIn = false }) {
  const dispatch = useDispatch();
  const { requestAccounts } = useRequestAccounts();

  async function getIsSignedIn() {
    const res = await window.ethereum.request({ method: "eth_accounts" });

    console.log(directSignIn);

    if (directSignIn === true || res.length > 0) {
      requestAccounts();
    } else {
      dispatch(setSignedIn(false));
    }

    return res.length;
  }

  return { getIsSignedIn };
}
