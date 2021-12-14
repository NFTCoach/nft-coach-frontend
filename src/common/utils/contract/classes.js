import { ethers } from "ethers";

const fmtCoach = (n) => ethers.utils.formatEther(n) + " COACH";

const parseCoach = (n) => {
  const interm = n * 10 ** 6;
  const parser = ethers.BigNumber.from(10).pow(12);
  return ethers.BigNumber.from(interm).mul(parser);
};

export class Player {
  constructor(id, struct, stats) {
    this.id = id.toString();

    const [
      locked,
      playerStatus,
      academyType,
      potential,
      rentFinish,
      lastChallenge,
      leftToExpire,
    ] = struct;

    this.locked = locked;
    this.playerStatus = playerStatus;
    this.academyType = academyType;
    this.potential = potential;
    this.rentFinish = new Date(rentFinish * 1000);
    this.lastChallenge = new Date(lastChallenge * 1000);
    this.leftToExpire =
      playerStatus == 0 ? new Date(leftToExpire * 1000) : leftToExpire;

    this.stats = stats;
  }
}

export class Team {
  constructor(owner, struct, defaultFive, avgs) {
    this.owner = owner;

    const [initialized, morale, wins, lastChallenge] = struct;

    this.initialized = initialized;
    this.morale = morale;
    this.wins = wins;
    this.lastChallenge = new Date(lastChallenge * 1000);

    this.defaultFive = defaultFive;

    this.atkAvg = avgs[0];
    this.defAvg = avgs[1];
  }
}

export class Tournament {
  constructor(id, struct) {
    this.id = id;

    const [
      core,
      matchCount,
      j,
      k,
      winnerPoolPercent,
      currentTeamCount,
      start,
      interval,
      owner,
      entranceFee,
      prizePool,
    ] = struct;

    this.core = core;
    this.matchCount = matchCount;
    this.j = j;
    this.k = k;
    this.winnerPoolPercent = winnerPoolPercent;
    this.currentTeamCount = currentTeamCount;
    this.start = start * 1000 + " secs";
    this.interval = interval;
    this.owner = owner;
    this.entranceFee = entranceFee;
    this.prizePool = prizePool;
  }
}

export class Listing {
  constructor(id, struct) {
    const [active, rentDuration, price] = struct;

    this.id = id.toString();

    this.active = active;
    this.rentDuration = rentDuration;
    this.price = fmtCoach(price);
  }
}

export class CardListing {
  constructor(struct) {
    const [active, amount, cardType, owner, price] = struct;

    this.active = active;
    this.amount = amount;
    this.cardType = cardType;
    this.owner = owner;
    this.price = fmtCoach(price);
  }
}
