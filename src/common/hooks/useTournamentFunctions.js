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

    const leaveTournament = async (tournamentId) => {
        const txn = await Tournaments.connect(signer).leaveTournament(tournamentId);
        await txn.wait();
    }

    const getTournamentStatus = async (tournamentId) => {
        /** @type {Tournament} */
        const tournament = await getTournamentDetails(tournamentId);
        console.log("Got tournament");
        // Needs to be checked for last round
        const pointerDelta = tournament.k - tournament.j;
        const remainingRounds = pointerDelta > 0 ? Math.log2(pointerDelta) : 0;
        const playedRounds = tournament.matchCount - remainingRounds;
        console.log({ remainingRounds, playedRounds });

        const roundData = {}
        let nextOpponent = null;
        for (let i = 0; i < playedRounds + 1; i++) {
            let playedMatches = 0;
            for (let r = 0; r < i; r++)
                playedMatches += 2 ** (tournament.matchCount - r)

            let roundPlayers = [];
            let matches = []

            for (let j = playedMatches; j < 2 ** (tournament.matchCount - i); j++) {
                roundPlayers.push(
                    (await Tournaments.tournamentToPlayers(tournamentId, j)).toString()
                );
            }

            for (let j = 0; j < roundPlayers.length; j += 2) {
                matches[j / 2] = [
                    roundPlayers[j],
                    roundPlayers[j + 1]
                ];
            }

            const pIndex = matches[(roundPlayers.length - 2) / 2].indexOf(signer.address);
            if (pIndex != -1)
                nextOpponent = matches[(roundPlayers.length - 2) / 2][pIndex ^ 1]

            roundData[i] = matches;
        }

        const nextMatchTimestamp = tournament.start.getTime() + (
            playedRounds === 0
                ? 0
                : tournament.interval * 1000 * (playedRounds + 1)
        );

        const timeDelta = Date.now() - nextMatchTimestamp;
        const timeUntilNextMatch = timeDelta > 0
            ? timeDelta / 1000
            : 0;

        return {
            totalRounds: 2 ** tournament.matchCount,
            currentRound: playedRounds,
            matches: roundData,
            timeUntilNextMatch,
            nextOpponent
        }

    }

    const adminFinishTournament = async (tournamentId) => {
        const txn = await Tournaments.connect(signer).finishTournament(tournamentId);
        await txn.wait();
    }

    return { getOngoingTournaments, joinTournament, getTournamentDetails, leaveTournament, getTournamentStatus, adminFinishTournament };
}
