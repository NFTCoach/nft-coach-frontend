import {
  CardListing,
  Listing,
  Tournament,
} from "common/utils/contract/classes";
import { filterEvents } from "common/utils/contract/functions";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

export const useListingFunctions = () => {
  const contracts = useSelector((state) => state.contracts);

  const getAllPlayerListings = async () => {
    const listEvents = await filterEvents(contracts.Marketplace, "PlayerListed");
    let listedIds = listEvents.map(ev => ev.args[0]);

    const listings = await Promise.all(listedIds.map(id =>
        contracts.Marketplace.idToListing(id).then((l) => new Listing(id, l))
    ));

    return listings.filter(l => l.active);
  };

  const getAllCardListings = async () => {
    const listEvents = await filterEvents(contracts.Marketplace, "CardListed");
    let listedIds = listEvents.map(ev => ev.args[0]);

    const listings = await Promise.all(listedIds.map(id => async () => {
        return new CardListing(await contracts.Marketplace.idToCardListing(id));
    }));

    return listings.filter(l => l.active);
  };

  const getAllRentedListings = async () => {
    const listEvents = await filterEvents(contracts.Marketplace, "PlayerListedForRent");
    let listedIds = listEvents.map(ev => ev.args[0]);

    const listings = await Promise.all(listedIds.map(id => async () => {
        return new Listing(await contracts.Marketplace.idToListing(id));
    }));

    return listings.filter(l => l.active);
  };

  const getAllPlayersOf = async (address) => {
    const mintEvents = await filterEvents(contracts.NC721, "Transfer", ethers.constants.AddressZero, address);
    const playerIds = mintEvents.map(ev => ev.args[2].toString());

    let players = [];
    for (let playerId of playerIds) {
        const eventFilter = contracts.NC721.filters["Transfer"](null, null, ethers.BigNumber.from(playerId));
        const transferEvents = await contracts.NC721.queryFilter(eventFilter);

        if (transferEvents[transferEvents.length - 1].args[1] != address)
            continue;

        if (await contracts.Management.idToCoach(playerId) == address)
            players.push(playerId);
    }
    return players;
  };

  return {
    getAllCardListings,
    getAllPlayerListings,
    getAllRentedListings,
    getAllPlayersOf,
  };
};
