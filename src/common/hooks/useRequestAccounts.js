import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { checkIfRightNetwork } from "common/utils/checkIfRightNetwork";
import { setAccountData, setSignedIn } from "store/reducers/account";
import {
  TournamentABI,
  TrainingABI,
  MarketplaceABI,
  NC721ABI,
  NC1155ABI,
  COACHABI,
  ManagementABI,
} from "contract/ext-abi";
import contractAddresses from "contract/addresses";
import { setContractData } from "store/reducers/contracts";

const RINKEBY_NETWORK = {
  id: "0xa869",
  name: "Avalanche Fuji C Chain",
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" },
};

export default function useRequestAccounts() {
  const dispatch = useDispatch();

  const requestAccounts = async () => {
    try {
      //await checkIfRightNetwork(AVALANCHE_NETWORK);
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      await provider.send("eth_requestAccounts", []);
      let signer = await provider.getSigner();
      const address = await signer.getAddress();

      const Tournaments = new ethers.Contract(
        contractAddresses.Tournaments,
        TournamentABI,
        provider
      );

      const TrainingMatches = new ethers.Contract(
        contractAddresses.TrainingMatches,
        TrainingABI,
        provider
      );

      const Marketplace = new ethers.Contract(
        contractAddresses.Marketplace,
        MarketplaceABI,
        provider
      );

      const NC721 = new ethers.Contract(
        contractAddresses.NC721,
        NC721ABI,
        provider
      );

      const NC1155 = new ethers.Contract(
        contractAddresses.NC1155,
        NC1155ABI,
        provider
      );

      const COACH = new ethers.Contract(
        contractAddresses.COACH,
        COACHABI,
        provider
      );

      const Management = new ethers.Contract(
        contractAddresses.Management,
        ManagementABI,
        provider
      );

      dispatch(
        setAccountData({
          address: address,
          isSignedIn: true,
          provider: provider,
          signer,
        })
      );

      dispatch(
        setContractData({
          Tournaments,
          TrainingMatches,
          Marketplace,
          NC721,
          NC1155,
          COACH,
          Management,
        })
      );

      return signer;
    } catch {
      dispatch(setSignedIn(false));
      return false;
    }
  };

  return { requestAccounts };
}
