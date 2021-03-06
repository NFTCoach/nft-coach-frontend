import { useDispatch, useSelector } from "react-redux";
import { Team, Player, CardListing, Tournament, Listing } from "./classes";
import { ethers } from "ethers";
import { setPlayers, setTeam } from "store/reducers/account";
import { setPlayers as setGamePlayers } from "store/reducers/game";
import { prodlog } from "../prodlog";
import addresses from "contract/addresses";
import { toast } from "react-toastify";
import { checkIfRightNetwork } from "../checkIfRightNetwork";
import { useEffect } from "react";

const getArgs = async (txn, event) => {
  const receipt = await txn.wait();

  return receipt.events?.filter((x) => x.event === event)?.[0]?.args;
};

const showAlert = (msg) => {
  toast(msg || "Handling transaction...", { autoClose: 6000 });
};

export const parseCoach = (n) => {
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
    TrainingMatches,
    RNG,
  } = useSelector((state) => state.contracts);

  const { signer, address } = useSelector((state) => state.account);

  const checkNetwork = async () => {
    const res = await checkIfRightNetwork();
    return res;
  };

  useEffect(() => {
    const res = checkNetwork();
    if (res === true) {
      window.location.reload(0);
    }
  }, []);

  const getAllPlayersOf = async (address) => {
    const mintEvents = await filterEvents(NC721, "Transfer", null, address);
    const playerIds = [
      ...new Set(mintEvents.map((ev) => ev.args[2].toString())),
    ];

    let players = [];
    for (let playerId of playerIds) {
      const transferEvents = await filterEvents(
        NC721,
        "Transfer",
        null,
        null,
        ethers.BigNumber.from(playerId)
      );

      if (transferEvents[transferEvents.length - 1].args[1] != address)
        continue;

      // TODO: Redundant code
      if ((await Management.idToCoach(playerId)) == address)
        players.push(playerId);
    }

    const rentEvents = await filterEvents(Marketplace, "PlayerRented");
    const rentedIds = rentEvents.map((ev) => ev.args[0].toString());

    for (let playerId of rentedIds) {
      if ((await Management.idToCoach(playerId)) == address) {
        players.push(playerId);
      } else if (players.includes(playerId)) {
        const idx = players.indexOf(playerId);
        players.splice(idx, 1);
      }
    }

    dispatch(setGamePlayers(players));
    dispatch(setPlayers(players));
    return players;
  };

  const randSeed = () => Math.floor(Math.random() * 1000000);

  const getStats = async (players) => {
    const listEvents = await filterEvents(Marketplace, "PlayerListed");
    let listedIds = listEvents.map((ev) => ev.args[0]);
    const listings = await Promise.all(
      listedIds.map((id) =>
        Marketplace.idToListing(id).then((l) => new Listing(id, l))
      )
    );

    const checkListed = async (playerId) => {
      let isListed = false;

      for (let listing of listings) {
        if (isListed) break;

        isListed = listing.active && listing.id == playerId;
      }

      return isListed;
    };

    const playerReqs = players.map(
      async (id, i) =>
        new Player(
          id,
          await Management.idToPlayer(id),
          await Management.getStats(id),
          await checkListed(id)
        )
    );

    return await Promise.all(playerReqs);
  };

  const approveCoachForTournament = async () => {
    const txn = await COACH.connect(signer).approve(
      Tournaments.address,
      parseCoach(ethers.constants.MaxUint256)
    );
    await txn.wait();
  };

  const approveCoachForMarketplace = async () => {
    const txn = await COACH.connect(signer).approve(
      addresses.Marketplace,
      ethers.constants.MaxUint256
    );

    await txn.wait();
  };

  const approveCardsForMarket = async () => {
    const txn = await NC1155.connect(signer).setApprovalForAll(
      addresses.Marketplace,
      true
    );
    await txn.wait();
  };

  const approvePlayersForMarket = async () => {
    await NC721.connect(signer).setApprovalForAll(addresses.Marketplace, true);
  };

  const getCoachBalanceOf = async (address) => {
    return await COACH.balanceOf(address);
  };

  const getPlayerBalanceOf = async (address) => {
    return await NC721.balanceOf(address);
  };

  const getCardBalanceOf = async (address, type) => {
    return await NC1155.balanceOf(address, type);
  };

  const getDefaultFive = async (address) => {
    const defFiveBn = await Management.getDefaultFive(address);
    return defFiveBn.map((element) => element.toString());
  };

  const registerTeam = async () => {
    const txn = await Management.connect(signer).registerTeam();
    showAlert("Initializing team...");
    await txn.wait();
  };

  const requestOpenPack = async () => {
    const txn = await Management.connect(signer).requestOpenPackRandomness();
    await txn.wait();

    await new Promise((res, rej) => {
      RNG.on("ChainlinkRandomFulfilled", (addr) => {
        if (addr == signer.address) res();
      });

      //setTimeout(() => rej("Timeout"), 20000);
    });
  };

  const openPack = async () => {
    const txn = await Management.connect(signer).openPack();
    await txn.wait();
  };

  const setDefaultFive = async (playerList) => {
    if (playerList.length > 5) throw new Error("More than 5 players");

    if (playerList.length != [...new Set(playerList)].length)
      throw new Error("Duplicate players");

    const txn = await Management.connect(signer).setDefaultFive(playerList);
    showAlert();
    await txn.wait();
  };

  const requestTraining = async (address) => {
    await TrainingMatches.connect(signer).requestTrainingRandomness(address);
  };

  /** @returns {Promise<number>} score */
  const train = async () => {
    const txn = await TrainingMatches.connect(signer).train();
    const [_caller, score] = await getArgs(txn, "MatchFinished");

    return score;
  };

  const joinTournament = async (tournamentId) => {
    await Tournaments.connect(signer).joinTournament(tournamentId);
  };

  const isTournamentFinished = async (tournamentId) => {
    const finishEvents = await filterEvents(
      Tournaments,
      "TournamentFinished",
      tournamentId
    );
    return finishEvents.length > 0;
  };

  const getTournamentPlayerList = async (tournamentId) => {
    const [_core, matchCount] = await Tournaments.idToTournament(tournamentId);
    const playerCount = 2 ** matchCount;

    const addressesInTournament = [];
    for (let i = 0; i < playerCount; i++) {
      const playerAddress = await Tournaments.tournamentToPlayers(
        tournamentId,
        i
      );
      if (playerAddress != ethers.constants.AddressZero)
        addressesInTournament.push(playerAddress);
    }

    return addressesInTournament;
  };

  const getWinnersOfTournament = async (tournamentId) => {
    const [_core, matchCount] = await Tournaments.idToTournament(tournamentId);
    const playerCount = 2 ** matchCount;
    const totalSize = playerCount * 2 - 1;

    const retObj = {};

    retObj["first"] = await Tournaments.tournamentToPlayers(
      tournamentId,
      totalSize - 1
    );
    if (playerCount > 2) {
      retObj["second"] = await Tournaments.tournamentToPlayers(
        tournamentId,
        totalSize - 2
      );
    }
    if (playerCount > 4) {
      retObj["thirdA"] = await Tournaments.tournamentToPlayers(
        tournamentId,
        totalSize - 3
      );
      retObj["thirdB"] = await Tournaments.tournamentToPlayers(
        tournamentId,
        totalSize - 4
      );
    }
    return retObj;
  };

  const getAllPlayerListings = async () => {
    const listEvents = await filterEvents(Marketplace, "PlayerListed");
    let listedIds = [...new Set(listEvents.map((ev) => ev.args[0]))];

    async function getListingDetails(id) {
      const det = await Marketplace.idToListing(id);
      const sta = await Management.getStats(id);
      return { det, sta };
    }

    const listings = await Promise.all(
      listedIds.map((id) =>
        getListingDetails(id).then(({ det, sta }) => new Listing(id, det, sta))
      )
    );

    return listings.filter((l) => l.active && l.rentDuration == 0);
  };

  const getAllCardListings = async () => {
    const listEvents = await filterEvents(Marketplace, "CardListed");
    let listedIds = listEvents.map((ev) => ev.args[0]);

    const listings = await Promise.all(
      listedIds.map((id) => async () => {
        return new CardListing(await Marketplace.idToCardListing(id));
      })
    );

    return listings.filter((l) => l.active && l.rentDuration == 0);
  };

  const getAllRentedListings = async () => {
    const listEvents = await filterEvents(Marketplace, "PlayerListed");
    let listedIds = [...new Set(listEvents.map((ev) => ev.args[0].toString()))];

    async function getListingDetails(id) {
      const det = await Marketplace.idToListing(id);
      const sta = await Management.getStats(id);
      return { det, sta };
    }

    const listings = await Promise.all(
      listedIds.map((id) =>
        getListingDetails(id).then(({ det, sta }) => new Listing(id, det, sta))
      )
    );

    return listings.filter((l) => l.active && l.rentDuration > 0);
  };

  /**
   * @param {string} playerId
   * @param {string} price
   */
  const listPlayer = async (playerId, price) => {
    const txn = await Marketplace.connect(signer).listPlayer(
      playerId,
      parseCoach(price)
    );
    showAlert();
    await txn.wait();
  };

  /**
   * @param {string} playerId
   */
  const delistPlayer = async (playerId) => {
    const txn = await Marketplace.connect(signer).delistPlayer(
      ethers.BigNumber.from(playerId)
    );
    showAlert();
    await txn.wait();
  };

  /**
   * @param {string} playerId
   * @param {string} price
   */
  const listCard = async (amount, cardType, price) => {
    await Marketplace.connect(signer).listCard(
      amount,
      cardType,
      parseCoach(price)
    );
  };

  /**
   * @param {string} listingId
   */
  const delistCard = async (listingId) => {
    await Marketplace.connect(signer).delistCard(listingId);
  };

  /**
   * @param {string} playerId
   * @param {string} price
   * @param {number} rentDuration in seconds
   */
  const listPlayerForRent = async (playerId, price, rentDuration) => {
    const txn = await Marketplace.connect(signer).listPlayerForRent(
      playerId,
      parseCoach(price),
      rentDuration
    );
    await txn.wait();
  };

  /**
   * @param {number} playerId
   * @param {string} newPrice
   */
  const changeListingPrice = async (playerId, newPrice) => {
    await Marketplace.connect(signer).changeListingPrice(
      playerId,
      parseCoach(newPrice)
    );
  };

  /**
   * @param {string} listingId
   * @param {string} newPrice
   */
  const changeCardListingPrice = async (listingId, newPrice) => {
    await Marketplace.connect(signer).changeCardListingPrice(
      listingId,
      parseCoach(newPrice)
    );
  };

  /**
   * @param {string} listingId
   */
  const buyCard = async (listingId) => {
    const txn = await Marketplace.connect(signer).buyCard(listingId);
    await txn.wait();
  };

  /**
   * @param {string} playerId
   */
  const buyPlayer = async (playerId) => {
    console.log(Marketplace, playerId);
    const txn = await Marketplace.connect(signer).buyPlayer(playerId);
    await txn.wait();
  };

  /**
   * @param {string} playerId
   */
  const rentPlayer = async (playerId) => {
    const txn = await Marketplace.connect(signer).rentPlayer(playerId);
    await txn.wait();
  };

  const getTeamStats = async (address) => {
    const calcAtkDef = (arr) => {
      let atk = 0,
        def = 0;
      for (let i = 0; i < 5; i++) atk += arr[i];
      for (let i = 5; i < 10; i++) def += arr[i];

      return [atk, def];
    };

    let atkSum = 0,
      defSum = 0;

    const defaultFive = await Management.getDefaultFive(address);

    await Promise.all(
      Object.values(defaultFive).map((id) =>
        Management.getStats(id).then((stats) => {
          const [a, d] = calcAtkDef(stats);
          atkSum += a;
          defSum += d;
        })
      )
    );

    return new Team(
      address,
      await Management.userToTeam(address),
      defaultFive,
      [atkSum / 5, defSum / 5]
    );
  };

  const getOngoingTournaments = async () => {
    const createEvents = await filterEvents(Tournaments, "TournamentCreated");
    const createdIds = createEvents.map((ev) => ev.args[0]);

    const startEvents = await filterEvents(Tournaments, "TournamentStarted");
    /** @type {string[]} */
    const startedIds = startEvents.map((ev) => ev.args[0]);

    return createdIds.filter((id) => !startedIds.includes(id));
  };

  const testMintCard = async (to, id, amt) => {
    const txn = await NC1155.mint(to, id, amt, []);
    await txn.wait();
  };

  const testCreateTournament = async (details) => {
    const txn = await Tournaments.createDefaultTournament(details);
    const tournamentId = (await getArgs(txn, "TournamentCreated"))[0];

    return tournamentId;
  };

  const get10RandomTeams = async () => {
    const registerEvents = await filterEvents(Management, "TeamRegistered");
    const usersWithTeamsUnshuffled = registerEvents.map((ev) => ev.args[0]);
    const usersWithTeams = usersWithTeamsUnshuffled.sort(
      () => 0.5 - Math.random()
    );

    const teamList = [];
    for (let i = 0; i < usersWithTeams.length; i++) {
      if (teamList.length == 10) break;

      if (usersWithTeams[i] == address) continue;

      const defFive = await getDefaultFive(usersWithTeams[i]);
      let emptyPlayer = false;
      for (let player of defFive) {
        if (player.toString() === "0") {
          emptyPlayer = true;
          break;
        }
      }

      if (!emptyPlayer) teamList.push(usersWithTeams[i]);
    }

    const stats = await Promise.all(teamList.map((addr) => getTeamStats(addr)));

    return teamList.reduce((p, v, i) => {
      const obj = Object.assign(p, {});
      obj[v] = stats[i];
      return obj;
    }, {});
  };

  const getChainlinkRandomOf = async (address) => {
    return await RNG.getChainlinkRandom(address);
  };

  const getBlockRandomOf = async (address) => {
    return await RNG.getBlockRandom(address);
  };

  const testOpenPack = async () => {
    const txn = await Management.connect(signer).testOpenPack(randSeed());
    await txn.wait();
  };

  const shuffleArray = (originArr) => {
    const array = originArr;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  const testTrain = async (address) => {
    const txn = await TrainingMatches.connect(signer).testTraining(
      address,
      randSeed(),
      { gasLimit: 500000 }
    );
    showAlert();
    const [_caller, score] = await getArgs(txn, "MatchFinished");

    const shoots = [...Array(score).fill(0), ...Array(7 - score).fill(1)];

    await txn.wait();

    return {
      score,
      shoots: shuffleArray(shoots),
    };
  };

  const isCoachApprovedForMarket = async () => {
    const allowance = await COACH.allowance(address, addresses.Marketplace);
    return allowance.gt(ethers.utils.parseEther("1000000000"));
  };

  const isCoachApprovedForTournaments = async () => {
    const allowance = await COACH.allowance(
      signer.address,
      Tournaments.address
    );
    return allowance.gt(ethers.utils.parseEther("1000000000"));
  };

  const areCardsApprovedForMarket = async () => {
    return await NC1155.connect(signer).isApprovedForAll(
      address,
      addresses.Marketplace
    );
  };

  const arePlayersApprovedForMarket = async () => {
    return await NC721.connect(signer).isApprovedForAll(
      address,
      addresses.Marketplace
    );
  };

  const claimAllRentedPlayers = async () => {
    // Get all players
    const transferEvents = await filterEvents(NC721, "Transfer", null, address);
    const playerIds = [
      ...new Set(transferEvents.map((ev) => ev.args[2].toString())),
    ];

    let rentedPlayers = [];
    for (let playerId of playerIds) {
      // Get all transfers related to the playerId
      const transferEvents = await filterEvents(
        NC721,
        "Transfer",
        null,
        null,
        ethers.BigNumber.from(playerId)
      );

      // Not mine if last transfer is not to me
      if (transferEvents[transferEvents.length - 1].args[1] != address)
        continue;

      if ((await Management.idToCoach(playerId)) != address)
        rentedPlayers.push(playerId);
    }

    for (let rentedPlayerId of rentedPlayers) {
      const rentFinish = (await Management.idToPlayer(rentedPlayerId))[4];
      const rentPeriodOver = rentFinish === 0 || Date.now() > rentFinish * 1000;

      if (rentPeriodOver) {
        await Management.connect(signer).claimRented(rentedPlayerId, address);
      }
    }

    if (rentedPlayers.length === 0) {
      toast("You don't have any rented player");
      return false;
    }
  };

  return {
    getTeamStats,
    isCoachApprovedForMarket,
    areCardsApprovedForMarket,
    arePlayersApprovedForMarket,
    isCoachApprovedForTournaments,
    isCoachApprovedForMarket,
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
    //getTournamentDetails,
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
    getCardBalanceOf,
    testMintCard,
    testCreateTournament,
    get10RandomTeams,
    getChainlinkRandomOf,
    getBlockRandomOf,
    testTrain,
    testOpenPack,
    claimAllRentedPlayers,
  };
}
