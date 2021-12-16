import Button from "components/Button";
import Modal from "components/Modal/Modal";
import { Typography } from "components/Typography";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./TrainingMatch.module.scss";

const ExtraContent = ({
  shoots,
  won,
  setScore,
  setShoots,
  setIsMatchOver,
  setWon,
  fetchMyTeam,
  fetchTeams,
}) => {
  const [modalScore, setModalScore] = useState([0, 0]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let score = [0, 0];

    shoots.forEach((item, index) => {
      setTimeout(() => {
        if (item === 0) {
          score = [score[0] + 1, score[1]];
          setModalScore(score);
        } else {
          score = [score[0], score[1] + 1];
          setModalScore(score);
        }
      }, (index + 1) * 1200);
    });

    setTimeout(() => {
      setShow(true);
    }, 7 * 1200);
  }, []);

  return (
    <div data-aos-duration="2000" className={styles.winner}>
      <Typography weight="semibold" variant="title1">
        Match {show ? "over!" : "is live!"}
      </Typography>
      {show && (
        <Fragment>
          {won ? (
            <Typography variant="title5" weight="medium" className={styles.won}>
              You won the match!
            </Typography>
          ) : (
            <Typography
              variant="title5"
              weight="medium"
              className={styles.lost}
            >
              You lost the match!
            </Typography>
          )}
        </Fragment>
      )}
      <Typography variant="title1" weight="semibold" className={styles.score}>
        {modalScore[0]} - {modalScore[1]}
      </Typography>
      {show && (
        <Button
          className={styles.continue}
          type="primary"
          onClick={() => {
            fetchMyTeam?.();
            fetchTeams?.();
            setShow(false);
            setModalScore([0, 0]);
            setScore([]);
            setShoots([]);
            setIsMatchOver(false);
            setWon(false);
          }}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

const Match = ({
  fetchMyTeam,
  selected,
  requestTrainingReq,
  randomArray,
  fetchTeams,
}) => {
  const [score, setScore] = useState([]);
  const [shoots, setShoots] = useState([]);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [won, setWon] = useState(false);

  return (
    <div className={styles.match}>
      {isMatchOver && (
        <Modal
          closeOutside={false}
          extraContent={
            <ExtraContent
              fetchMyTeam={fetchMyTeam}
              fetchTeams={fetchTeams}
              setScore={setScore}
              setShoots={setShoots}
              setIsMatchOver={setIsMatchOver}
              setWon={setWon}
              won={won}
              shoots={shoots}
            />
          }
          hideContent
          isOpen={true}
          opacity={0.8}
        />
      )}

      {selected !== -1 && (
        <Fragment>
          <Typography variant="title4" weight="medium">
            Team {selected + 1} is selected
          </Typography>
          <Button
            loading={requestTrainingReq.loading}
            className={styles.button}
            onClick={async () => {
              const res = await requestTrainingReq.exec(
                randomArray[selected]?.owner
              );
              if (res) {
                setScore([res.score, 7 - res.score]);
                setShoots(res.shoots);
                if (res.score >= 4) {
                  setWon(true);
                } else {
                  setWon(false);
                }
                setIsMatchOver(true);
                fetchMyTeam();
              }
            }}
          >
            Match with team
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export { Match };
