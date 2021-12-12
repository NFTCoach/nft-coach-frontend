import { Player } from "common/utils/contract/classes";
import { useSelector } from "react-redux";

export const useGameFunctions = () => {
  const { Management } = useSelector((state) => state.contracts);
  const { signer } = useSelector((state) => state.account);

  const getDefaultFive = async (address) => {
    const defFiveBn = await Management.getDefaultFive(address);
    return defFiveBn.map((element) => element.toString());
  };

  const getStats = async (players) => {
    const playerReqs = players.map(
      async (id, i) =>
        new Player(
          id,
          await Management.idToPlayer(id),
          await Management.getStats(id)
        )
    );

    return await Promise.all(playerReqs);
  };

  const setDefaultFive = async (playerList) => {
    if (!signer) {
      return;
    }
    if (playerList.length > 5) throw new Error("More than 5 players");

    if (playerList.length != [...new Set(playerList)].length)
      throw new Error("Duplicate players");

    await Management.connect(signer).setDefaultFive(playerList);
  };

  return { getStats, getDefaultFive, setDefaultFive };
};
