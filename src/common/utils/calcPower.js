const { parseScore } = require("./parseScore");

export const calcPower = (player = { stats: new Array(10).fill(0) }) => {
  let atk = 0;
  let def = 0;
  for (let i = 0; i < 5; i++) atk += player.stats[i];
  for (let i = 5; i < 10; i++) def += player.stats[i];

  return [parseScore(atk), parseScore(def)];
};
