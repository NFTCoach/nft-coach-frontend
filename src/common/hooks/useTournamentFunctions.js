import { filterEvents } from "common/utils/contract/functions";
import { useSelector } from "react-redux";
import { Tournament } from "common/utils/contract/classes";

export const useTournamentFunctions = () => {

    const { Tournaments } = useSelector(state => state.contracts);
    const { signer } = useSelector(state => state.account);

    const getOngoingTournaments = async () => {
        const createEvents = await filterEvents(Tournaments, "TournamentCreated");
        const createdIds = createEvents.map(ev => ev.args[0]);
    
        const startEvents = await filterEvents(Tournaments, "TournamentStarted");
        /** @type {string[]} */
        const startedIds = startEvents.map(ev => ev.args[0]);
    
        return createdIds.filter(id => !startedIds.includes(id));
    };

    const joinTournament = async (tournamentId) => {
        await Tournaments.connect(signer).joinTournament(tournamentId);
    }

    const getTournamentDetails = async (tournamentId) => {
        return new Tournament(tournamentId, await Tournaments.idToTournament(tournamentId));
    }

    return { getOngoingTournaments, joinTournament, getTournamentDetails };
}