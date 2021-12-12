import { useDispatch, useSelector } from "react-redux";
import { Team, Player, CardListing, Tournament, Listing } from "./classes";
import { ethers } from "ethers";
import { setPlayers, setTeam } from "store/reducers/account";
import { setPlayers as setGamePlayers } from "store/reducers/game";

const getArgs = async (txn, event) => {
  const receipt = await txn.wait();

  return receipt.events?.filter((x) => x.event === event)?.[0]?.args;
};


const parseCoach = (n) => {
    const interm = n * 10 ** 6;
    const parser = ethers.BigNumber.from(10).pow(12);
    return ethers.BigNumber.from(interm).mul(parser);
};


export const filterEvents = async (ctc, eventName, ...args) => {
  const eventFilter = ctc.filters[eventName]?.(...args);
  return await ctc.queryFilter(eventFilter);
};

export function useContractFunction() {
    const dispatch = useDispatch();
    const {
        Management,
        Tournaments,
        NC721,
        NC1155,
        COACH,
        Marketplace,
        TrainingMatches
    } = useSelector(state => state.contracts);

    const {
        signer
    } = useSelector(state => state.account);
    
    const getAllPlayersOf = async (address) => {
        const mintEvents = await filterEvents(NC721, "Transfer", ethers.constants.AddressZero, address);
        const playerIds = mintEvents.map(ev => ev.args[2].toString());
    
        let players = [];
        for (let playerId of playerIds) {
            const eventFilter = NC721.filters["Transfer"](null, null, ethers.BigNumber.from(playerId));
            const transferEvents = await NC721.queryFilter(eventFilter);
    
            if (transferEvents[transferEvents.length - 1].args[1] != address)
                continue;
    
            if (await Management.idToCoach(playerId) == address)
                players.push(playerId);
        }
        dispatch(setGamePlayers(players));
        dispatch(setPlayers(players));
    };



    const getStats = async (players) => {
        const playerReqs = players.map(async (id, i) =>
            new Player(
                id,
                await Management.idToPlayer(id),
                await Management.getStats(id)
            )
        );

        return await Promise.all(playerReqs);
    };

    const approveCoachForTournament = async () => {
        await COACH.connect(signer).approve(Tournaments.address, parseCoach(ethers.constants.MaxUint256));
    }

    const approveCoachForMarketplace = async () => {
        await COACH.connect(signer).approve(Marketplace.address, parseCoach(ethers.constants.MaxUint256));
    }

    const approveCardsForMarket = async () => {
        await NC1155.connect(signer).setApprovalForAll(Marketplace.address, true);
    }

    const approvePlayersForMarket = async () => {
        await NC721.connect(signer).setApprovalForAll(Marketplace.address, true)
    }

    const getCoachBalanceOf = async (address) => {
        return await COACH.balanceOf(address);
    }

    const getPlayerBalanceOf = async (address) => {
        return await NC721.balanceOf(address);
    }

    const getCardBalanceOf = async (address, type) => {
        return await NC1155.balanceOf(address, type);
    }


    const getDefaultFive = async (address) => {
        const defFiveBn = await Management.getDefaultFive(address);
        return defFiveBn.map(element => element.toString());
    }

    const registerTeam = async () => {
        await Management.connect(signer).registerTeam();
    }

    const requestOpenPack = async () => {
        await Management.connect(signer).requestOpenPackRandomness();
    }

    const openPack = async () => {
        await Management.connect(signer).openPack();
    }

    const setDefaultFive = async (playerList) => {
        if (playerList.length > 5)
            throw new Error("More than 5 players");

        if (playerList.length != [...new Set(playerList)].length)
            throw new Error("Duplicate players");

        await Management.connect(signer).setDefaultFive(playerList);
    }

    const requestTraining = async (address) => {
        await TrainingMatches.connect(signer).requestTrainingRandomness(address);
    }

    /** @returns {Promise<number>} score */
    const train = async () => {
        const txn = await TrainingMatches.connect(signer).train();
        const [_caller, score] = await getArgs(txn, "MatchFinished");

        return score;
    }

    const joinTournament = async (tournamentId) => {
        await Tournaments.connect(signer).joinTournament(tournamentId);
    }

    const isTournamentFinished = async (tournamentId) => {
        const finishEvents = await filterEvents(Tournaments, "TournamentFinished", tournamentId);
        return finishEvents.length > 0;
    }

    const getTournamentPlayerList = async (tournamentId) => {
        const [_core, matchCount] = await Tournaments.idToTournament(tournamentId);
        const playerCount = 2 ** matchCount;

        const addressesInTournament = [];
        for (let i = 0; i < playerCount; i++) {
            const playerAddress = await Tournaments.tournamentToPlayers(tournamentId, i);
            if (playerAddress != ethers.constants.AddressZero)
                addressesInTournament.push(playerAddress);
        }

        return addressesInTournament;
    }

    const getWinnersOfTournament = async (tournamentId) => {
        const [_core, matchCount] = await Tournaments.idToTournament(tournamentId);
        const playerCount = 2 ** matchCount;
        const totalSize = playerCount * 2 - 1;

        const retObj = {}

        retObj["first"] = await Tournaments.tournamentToPlayers(tournamentId, totalSize - 1);
        if (playerCount > 2) {
            retObj["second"] = await Tournaments.tournamentToPlayers(tournamentId, totalSize - 2);
        }
        if (playerCount > 4) {
            retObj["thirdA"] = await Tournaments.tournamentToPlayers(tournamentId, totalSize - 3);
            retObj["thirdB"] = await Tournaments.tournamentToPlayers(tournamentId, totalSize - 4);
        }
        return retObj;
    }

    const getTournamentDetails = async (tournamentId) => {
        return new Tournament(await Tournaments.idToTournament(tournamentId));
    }

    const getAllPlayerListings = async () => {
        const listEvents = await filterEvents(Marketplace, "PlayerListed");
        let listedIds = listEvents.map(ev => ev.args[0]);

        const listings = await Promise.all(listedIds.map(id => async () => {
            return new Listing(await Marketplace.idToListing(id));
        }));

        return listings.filter(l => l.active);
    }

    const getAllCardListings = async () => {
        const listEvents = await filterEvents(Marketplace, "CardListed");
        let listedIds = listEvents.map(ev => ev.args[0]);

        const listings = await Promise.all(listedIds.map(id => async () => {
            return new CardListing(await Marketplace.idToCardListing(id));
        }));

        return listings.filter(l => l.active);
    }

    const getAllRentedListings = async () => {
        const listEvents = await filterEvents(Marketplace, "PlayerListedForRent");
        let listedIds = listEvents.map(ev => ev.args[0]);

        const listings = await Promise.all(listedIds.map(id => async () => {
            return new Listing(await Marketplace.idToListing(id));
        }));

        return listings.filter(l => l.active);
    }

    /**
     * @param {string} playerId 
     * @param {string} price 
     */
    const listPlayer = async (playerId, price) => {
        await Marketplace.connect(signer).listPlayer(playerId, parseCoach(price));
    }

    /**
     * @param {string} playerId 
     */
    const delistPlayer = async (playerId) => {
        await Marketplace.connect(signer).delistPlayer(playerId);
    }

    /**
     * @param {string} playerId 
     * @param {string} price 
     */
    const listCard = async (amount, cardType, price) => {
        await Marketplace.connect(signer).listCard(amount, cardType, parseCoach(price));
    }

    /**
     * @param {string} listingId 
     */
    const delistCard = async (listingId) => {
        await Marketplace.connect(signer).delistCard(listingId);
    }

    /**
     * @param {string} playerId 
     * @param {string} price 
     * @param {number} rentDuration in seconds
     */
    const listPlayerForRent = async (playerId, price, rentDuration) => {
        await Marketplace.connect(signer).listPlayerForRent(playerId, parseCoach(price), rentDuration);
    }

    /**
     * @param {number} playerId 
     * @param {string} newPrice 
     */
    const changeListingPrice = async (playerId, newPrice) => {
        await Marketplace.connect(signer).changeListingPrice(playerId, parseCoach(newPrice));
    }

    /**
     * @param {string} listingId
     * @param {string} newPrice 
     */
    const changeCardListingPrice = async (listingId, newPrice) => {
        await Marketplace.connect(signer).changeCardListingPrice(listingId, parseCoach(newPrice));
    }

    /**
     * @param {string} listingId 
     */
    const buyCard = async (listingId) => {
        await Marketplace.connect(signer).buyCard(listingId);
    }

    /**
     * @param {string} playerId 
     */
    const buyPlayer = async (playerId) => {
        await Marketplace.connect(signer).buyPlayer(playerId);
    }

    /**
     * @param {string} playerId 
     */
    const rentPlayer = async (playerId) => {
        await Marketplace.connect(signer).rentPlayer(playerId);
    }

    const getTeamStats = async (address) => {
        dispatch(setTeam(new Team(
            address,
            await Management.userToTeam(address),
            await Management.getDefaultFive(address)
        )))
    }

    const getOngoingTournaments = async () => {
        const createEvents = await filterEvents(Tournaments, "TournamentCreated");
        const createdIds = createEvents.map(ev => ev.args[0]);
    
        const startEvents = await filterEvents(Tournaments, "TournamentStarted");
        /** @type {string[]} */
        const startedIds = startEvents.map(ev => ev.args[0]);
    
        return createdIds.filter(id => !startedIds.includes(id));
    }

    return {
        getTeamStats,
        getAllPlayersOf,
        getOngoingTournaments,
        getStats,
        approveCoachForTournament,
        approveCardsForMarket,
        approveCoachForMarketplace,
        openPack,
        requestOpenPack,
        registerTeam,
        getDefaultFive,
        getPlayerBalanceOf,
        getCoachBalanceOf,
        approvePlayersForMarket,
        setDefaultFive,
        requestTraining,
        train,
        isTournamentFinished,
        getTournamentPlayerList,
        getWinnersOfTournament,
        getTournamentDetails,
        getAllPlayerListings,
        getAllCardListings,
        getAllRentedListings,
        joinTournament,
        listCard,
        delistCard,
        listPlayerForRent,
        changeListingPrice,
        changeCardListingPrice,
        buyPlayer,
        rentPlayer,
        listPlayer,
        delistPlayer,
        buyCard,
        getCardBalanceOf
    };
};
