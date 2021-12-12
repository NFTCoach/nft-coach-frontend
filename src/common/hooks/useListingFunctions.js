import {
  CardListing,
  Listing,
  Tournament,
} from "common/utils/contract/classes";
import { filterEvents } from "common/utils/contract/functions";
import { useSelector } from "react-redux";

export const useListingFunctions = () => {
  const contracts = useSelector((state) => state.contracts);

  const getAllPlayerListings = async () => {
    const listEvents = await filterEvents(
      contracts.Marketplace,
      "PlayerListed"
    );
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) => async () => {
        return new Listing(await contracts.Marketplace.idToListing(id));
      })
    );

    return listings.filter((l) => l.active);
  };

  const getAllCardListings = async () => {
    const listEvents = await filterEvents(contracts.Marketplace, "CardListed");
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) => async () => {
        return new CardListing(await contracts.Marketplace.idToCardListing(id));
      })
    );

    return listings.filter((l) => l.active);
  };

  const getAllRentedListings = async () => {
    const listEvents = await filterEvents(
      contracts.Marketplace,
      "PlayerListedForRent"
    );
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) => async () => {
        return new Listing(await contracts.Marketplace.idToListing(id));
      })
    );

    return listings.filter((l) => l.active);
  };

  return { getAllCardListings, getAllPlayerListings, getAllRentedListings };
};
