export const PATHS = process.env.NODE_ENV === "development" ? {
  landing: "/",
  game: "/game",
  team: "/game/team",
  market: "/market",
  tournaments: "/tournaments",
  create_team: "/team/create",
  training: "/training",
} : {
  landing: "/nft-coach-frontend/",
  game: "/nft-coach-frontend/game",
  team: "/nft-coach-frontend/game/team",
  market: "/nft-coach-frontend/market",
  tournaments: "/nft-coach-frontend/tournaments",
  create_team: "/nft-coach-frontend/team/create",
  training: "/nft-coach-frontend/training"
}