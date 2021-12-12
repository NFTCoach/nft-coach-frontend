import React from "react";
import { useDispatch } from "react-redux";
import {
  TournamentABI,
  TrainingABI,
  MarketplaceABI,
  NC721ABI,
  NC1155ABI,
  COACHABI,
  ManagementABI,
  RNGABI
} from "contract/ext-abi";
import contractAddresses from "contract/addresses";
import { ethers } from "ethers";
import { setContractData } from "store/reducers/contracts";

export default function useContracts(provider) {
  const dispatch = useDispatch();

  const setContracts = (provider) => {
    const Tournaments = new ethers.Contract(
      contractAddresses.Tournaments,
      TournamentABI,
      provider
    );

    const TrainingMatches = new ethers.Contract(
      contractAddresses.TrainingMatches,
      TrainingABI,
      provider
    );

    const Marketplace = new ethers.Contract(
      contractAddresses.Marketplace,
      MarketplaceABI,
      provider
    );

    const NC721 = new ethers.Contract(
      contractAddresses.NC721,
      NC721ABI,
      provider
    );

    const NC1155 = new ethers.Contract(
      contractAddresses.NC1155,
      NC1155ABI,
      provider
    );

    const COACH = new ethers.Contract(
      contractAddresses.COACH,
      COACHABI,
      provider
    );

    const Management = new ethers.Contract(
      contractAddresses.Management,
      ManagementABI,
      provider
    );

    const RNG = new ethers.Contract(
      contractAddresses.RNG,
      RNGABI,
      provider
    );

    dispatch(
      setContractData({
        Tournaments,
        TrainingMatches,
        Marketplace,
        NC721,
        NC1155,
        COACH,
        Management,
        RNG
      })
    );
  }

  return { setContracts }
}
