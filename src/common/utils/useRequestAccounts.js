import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { checkIfRightNetwork } from "common/utils/checkIfRightNetwork";
import { setAccountData, signIn } from "store/reducers/account";

const AVALANCHE_NETWORK = {
    id: "0xa869",
    name: "Avalanche Fuji C Chain",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    nativeCurrency: { name: "AVAX", decimals: 18, symbol: "AVAX" }
};
  

export default function useRequestAccounts() {

    const dispatch = useDispatch();

    const requestAccounts = async () => {
        try {
            await checkIfRightNetwork(AVALANCHE_NETWORK);
            const provider = new ethers.providers.Web3Provider(
                window.ethereum,
                "any"
            );

            await provider.send("eth_requestAccounts", []);
            let signer = await provider.getSigner();
            const address = await signer.getAddress();

            dispatch(
                setAccountData({
                    address: address,
                    signedIn: true,
                    provider: provider,
                    signer
                })
            );

            return signer;
        }
        catch {
            dispatch(signIn(false));
            return false;
        }
    }

    return { requestAccounts };
}