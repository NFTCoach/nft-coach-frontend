import { Player, Team } from "common/utils/contract/classes";
import { filterEvents } from "common/utils/contract/functions";
import { useSelector } from "react-redux";


export const useGameFunctions = () => {
  const { Management, Tournaments } = useSelector((state) => state.contracts);
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

  const getTeamStats = async (address) => {
    const calcAtkDef = (arr) => {
        let atk = 0, def = 0;
        for (let i = 0; i < 5; i++)
            atk += arr[i];
        for (let i = 5; i < 10; i++)
            def += arr[i];

        return [atk, def];
    }

    let atkSum = 0, defSum = 0;

    const defaultFive = await Management.getDefaultFive(address);

    await Promise.all(Object.values(defaultFive).map(id =>
        Management.getStats(id).then(stats => {
            const [a, d] = calcAtkDef(stats);
            atkSum += a;
            defSum += d;
        })));

    return new Team(
        address,
        await Management.userToTeam(address),
        defaultFive,
        [atkSum / 5, defSum / 5]
    );
  }

  return {
    getStats,
    getDefaultFive,
    setDefaultFive,
    getTeamStats,
  };
};
