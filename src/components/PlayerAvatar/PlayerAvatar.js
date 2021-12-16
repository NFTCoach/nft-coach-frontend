/* eslint-disable */

import React, { forwardRef } from "react";
import Avatar from "avataaars";
import styles from "./PlayerAvatar.module.scss";
import { calcPower } from "common/utils/calcPower";
import { clsnm } from "common/utils/clsnm";
import { Typography } from "components/Typography";
import Button from "components/Button";
const avatarStyle = "Circle";

const topTypeArr = [
  "Eyepatch",
  "Hat",
  "Hijab",
  "LongHairBigHair",
  "LongHairBob",
  "LongHairBun",
  "LongHairCurly",
  "LongHairCurvy",
  "LongHairDreads",
  "LongHairFrida",
  "LongHairFro",
  "LongHairFroBand",
  "LongHairMiaWallace",
  "LongHairNotTooLong",
  "LongHairShavedSides",
  "LongHairStraight",
  "LongHairStraight2",
  "LongHairStraightStrand",
  "NoHair",
  "ShortHairDreads01",
  "ShortHairDreads02",
  "ShortHairFrizzle",
  "ShortHairShaggy",
  "ShortHairShaggyMullet",
  "ShortHairShortCurly",
  "ShortHairShortFlat",
  "ShortHairShortRound",
  "ShortHairShortWaved",
  "ShortHairSides",
  "ShortHairTheCaesar",
  "ShortHairTheCaesarSidePart",
  "Turban",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
];

const accessoriesTypeArr = [
  "Blank",
  "Kurt",
  "Prescription01",
  "Prescription02",
  "Round",
  "Sunglasses",
  "Wayfarers",
];

const hairColorArr = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "PastelPink",
  "Platinum",
  "Red",
  "SilverGray",
];

const facialHairTypeArr = [
  "BeardLight",
  "BeardMajestic",
  "BeardMedium",
  "Blank",
  "MoustacheFancy",
  "MoustacheMagnum",
];

const clotheTypeArr = [
  "BlazerShirt",
  "BlazerSweater",
  "CollarSweater",
  "GraphicShirt",
  "Hoodie",
  "Overall",
  "ShirtCrewNeck",
  "ShirtScoopNeck",
  "ShirtVNeck",
];

const clotheColorArr = [
  "Black",
  "Blue01",
  "Blue02",
  "Blue03",
  "Gray01",
  "Gray02",
  "Heather",
  "PastelBlue",
  "PastelGreen",
  "PastelOrange",
  "PastelRed",
  "PastelYellow",
  "Pink",
  "Red",
  "White",
];

const eyeTypeArr = [
  "Close",
  "Cry",
  "Default",
  "Dizzy",
  "EyeRoll",
  "Happy",
  "Hearts",
  "Side",
  "Squint",
  "Surprised",
  "Wink",
  "WinkWacky",
];

const eyebrowTypeArr = [
  "Angry",
  "AngryNatural",
  "Default",
  "DefaultNatural",
  "FlatNatural",
  "RaisedExcited",
  "RaisedExcitedNatural",
  "SadConcerned",
  "SadConcernedNatural",
  "UnibrowNatural",
  "UpDown",
  "UpdownNatural",
];

const mouthTypeArr = [
  "Concerned",
  "Default",
  "Disbelief",
  "Eating",
  "Grimace",
  "Sad",
  "ScreamOpen",
  "Serious",
  "Smile",
  "Tongue",
  "Twinkle",
  "Vomit",
];

const skinColorArr = [
  "Tanned",
  "Yellow",
  "Pale",
  "Light",
  "Brown",
  "DarkBrown",
  "Black",
];

const PlayerAvatar = forwardRef(
  ({ id = "0", size, className, player, showPowers = true }, ref) => {
    const [atk, def] = calcPower(player);

    return (
      <div className={styles.wrapper} ref={ref}>
        <Avatar
          className={className}
          style={{ width: size, height: size }}
          avatarStyle={avatarStyle}
          topType={topTypeArr[parseInt(id.slice(3, 5) % topTypeArr.length)]}
          accessoriesType={
            accessoriesTypeArr[
              parseInt(id.slice(1, 2) % accessoriesTypeArr.length)
            ]
          }
          hairColor={
            hairColorArr[parseInt(id.slice(5, 7) % hairColorArr.length)]
          }
          facialHairType={
            facialHairTypeArr[
              parseInt(id.slice(2, 3) % facialHairTypeArr.length)
            ]
          }
          clotheType={
            clotheTypeArr[parseInt(id.slice(7, 8) % clotheTypeArr.length)]
          }
          clotheColor={
            clotheColorArr[parseInt(id.slice(0, 2) % clotheColorArr.length)]
          }
          eyeType={eyeTypeArr[parseInt(id.slice(8, 10) % eyeTypeArr.length)]}
          eyebrowType={
            eyebrowTypeArr[parseInt(id.slice(10, 12) % eyebrowTypeArr.length)]
          }
          mouthType={
            mouthTypeArr[parseInt(id.slice(12, 14) % mouthTypeArr.length)]
          }
          skinColor={
            skinColorArr[parseInt(id.slice(14, 16) % skinColorArr.length)]
          }
        />
        {showPowers && (
          <div className={styles.powers}>
            <div className={clsnm(styles.power)}>
              {atk} A - {def} D
            </div>
          </div>
        )}
      </div>
    );
  }
);

export { PlayerAvatar };
