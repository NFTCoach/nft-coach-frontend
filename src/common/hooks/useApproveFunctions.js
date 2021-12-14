import { parseCoach } from "common/utils/contract/functions";
import { ethers } from "ethers";
import { useSelector } from "react-redux";


export const useApproveFunctions = () => {

    const { COACH, NC1155, NC721, Marketplace, Tournaments } = useSelector(state => state.contracts);
    const { signer } = useSelector(state => state.account);

    const approveCoachForTournament = async () => {
        await COACH.connect(signer).approve(Tournaments.address, ethers.constants.MaxUint256);
    }

    const approveCoachForMarketplace = async () => {
        await COACH.connect(signer).approve(Marketplace.address, ethers.constants.MaxUint256);
    }

    const approveCardsForMarket = async () => {
        await NC1155.connect(signer).setApprovalForAll(Marketplace.address, true);
    }

    const approvePlayersForMarket = async () => {
        await NC721.connect(signer).setApprovalForAll(Marketplace.address, true)
    }

    return {
        approveCardsForMarket,
        approveCoachForMarketplace,
        approveCoachForTournament,
        approvePlayersForMarket
    };
}