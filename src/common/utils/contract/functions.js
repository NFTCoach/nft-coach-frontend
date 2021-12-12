import { useDispatch, useSelector } from "react-redux";
import { Team } from "./classes";
import { ethers } from "ethers";
import { setPlayers, setTeam } from "store/reducers/account";
import { setPlayers as setGamePlayers } from "store/reducers/game";

const getArgs = async (txn, event) => {
  const receipt = await txn.wait();

  return receipt.events?.filter((x) => x.event === event)?.[0]?.args;
};

export const filterEvents = async (ctc, eventName, ...args) => {
  const eventFilter = ctc.filters[eventName]?.(...args);
  return await ctc.queryFilter(eventFilter);
};

export function useContractFunction() {
  const dispatch = useDispatch();
  const { Management, Tournaments, NC721 } = useSelector(
    (state) => state.contracts
  );

  const getAllPlayersOf = async (address) => {
    const mintEvents = await filterEvents(
      NC721,
      "Transfer",
      ethers.constants.AddressZero,
      address
    );
    const playerIds = mintEvents.map((ev) => ev.args[2].toString());

    let players = [];
    for (let playerId of playerIds) {
      const eventFilter = NC721.filters["Transfer"](
        null,
        null,
        ethers.BigNumber.from(playerId)
      );
      const transferEvents = await NC721.queryFilter(eventFilter);

      if (transferEvents[transferEvents.length - 1].args[1] != address)
        continue;

      if ((await Management.idToCoach(playerId)) == address)
        players.push(playerId);
    }

    dispatch(setGamePlayers(players));
    dispatch(setPlayers(players));
  };

  const getOngoingTournaments = async () => {
    const createEvents = await filterEvents(Tournaments, "TournamentCreated");
    const createdIds = createEvents.map((ev) => ev.args[0]);

    const startEvents = await filterEvents(Tournaments, "TournamentStarted");
    /** @type {string[]} */
    const startedIds = startEvents.map((ev) => ev.args[0]);

    return createdIds.filter((id) => !startedIds.includes(id));
  };

  const getTeamStats = async (address) => {
    dispatch(
      setTeam(
        new Team(
          address,
          await Management.userToTeam(address),
          await Management.getDefaultFive(address)
        )
      )
    );
  };

  return {
    getTeamStats,
    getAllPlayersOf,
    getOngoingTournaments,
  };
}
