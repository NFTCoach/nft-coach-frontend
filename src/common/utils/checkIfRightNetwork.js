const mainDetails = {
  id: "0x4",
  name: "Rinkeby",
  rpcUrls: ["https://rinkeby.infura.io/v3/5f6507414db54d61b6cfe765b8b231c1"],
  nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
};

export const checkIfRightNetwork = async (network = mainDetails) => {
  if (!window.ethereum) return;
  const networkId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (networkId != network.id) {
    alert("Only available on " + network.name + ", switching...");

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.id }],
      });
      return true;
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      const WALLET_ERROR_CODE = 4902;

      if (error.code === WALLET_ERROR_CODE) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.id,
                rpcUrls: network.rpcUrls,
                nativeCurrency: network.nativeCurrency,
                chainName: network.name,
              },
            ],
          });
        } catch (addError) {
          console.log("[DEBUG] Network Add error", addError);
          return;
        }
      }
      // handle other "switch" errors
      console.log("[DEBUG] Switch Network Error");
      return;
    }
  }
};
