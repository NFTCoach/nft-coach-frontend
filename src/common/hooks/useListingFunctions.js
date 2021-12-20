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
  const account = useSelector((state) => state.account);

  const getAllPlayerListings = async () => {
    const listEvents = await filterEvents(
      contracts.Marketplace,
      "PlayerListed"
    );
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) =>
        contracts.Marketplace.idToListing(id).then((l) => new Listing(id, l))
      )
    );

    return listings.filter((l) => l.active && l.rentDuration == 0);
  };

  const getAllCardListings = async () => {
    const listEvents = await filterEvents(contracts.Marketplace, "CardListed");
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) =>
        contracts.Marketplace.idToListing(id).then(
          (l) => new CardListing(id, l)
        )
      )
    );

    return listings.filter((l) => l.active && l.rentDuration == 0);
  };

  const getAllRentedListings = async () => {
    const listEvents = await filterEvents(
      contracts.Marketplace,
      "PlayerListed"
    );
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) =>
        contracts.Marketplace.idToListing(id).then((l) => new Listing(id, l))
      )
    );

    return listings.filter((l) => l.active && l.rentDuration > 0);
  };

  const getAllPlayersOf = async (address) => {
    const mintEvents = await filterEvents(
      contracts.NC721,
      "Transfer",
      null,
      address
    );
    const playerIds = mintEvents.map((ev) => ev.args[2].toString());

    let players = [];
    for (let playerId of playerIds) {
      const transferEvents = await filterEvents(
        contracts.NC721,
        "Transfer",
        null,
        null,
        ethers.BigNumber.from(playerId)
      );

      if (transferEvents[transferEvents.length - 1].args[1] != address)
        continue;

      if ((await contracts.Management.idToCoach(playerId)) == address)
        players.push(playerId);
    }

    const rentEvents = await filterEvents(
      contracts.Marketplace,
      "PlayerRented"
    );
    const rentedIds = rentEvents.map((ev) => ev.args[0].toString());
    for (let playerId of rentedIds) {
      if (
        (await contracts.Management.idToCoach(playerId)) ==
        account.signer.address
      ) {
        players.push(playerId);
      } else if (players.includes(playerId)) {
        const idx = players.indexOf(playerId);
        players.splice(idx, 1);
      }
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
