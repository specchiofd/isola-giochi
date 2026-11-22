"use client";

import { useCallback, useMemo, useState } from "react";
import { BackToHub } from "@components/BackToHub/BackToHub";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useProgressStore } from "@state/progress/progress.store";
import { adjustDda, defaultDdaLevel, type DdaLevel } from "@utils/dda";
import { buildQuestion, type Question } from "./CalcoloLampo.utils";
import styles from "./CalcoloLampo.module.css";

const ROUND_SIZE = 10;
const GAME_ID = "palloncini-bersaglio";

export const CalcoloLampo = () => {
  const [level, setLevel] = useState<DdaLevel>(defaultDdaLevel);
  const [streakOk, setStreakOk] = useState(0);
  const [streakBad, setStreakBad] = useState(0);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(() => buildQuestion(defaultDdaLevel));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const awardStars = useProgressStore((s) => s.awardStars);

  const progressLabel = useMemo(
    () => `${Math.min(index, ROUND_SIZE)} / ${ROUND_SIZE}`,
    [index],
  );

  const nextQuestion = useCallback(
    (nextLevel: DdaLevel) => {
      setQuestion(buildQuestion(nextLevel));
      setFeedback(null);
    },
    [],
  );

  const handleAnswer = (choice: number) => {
    if (done || feedback) return;

    if (choice === question.correct) {
      void playCorrect();
      const ok = streakOk + 1;
      setStreakOk(ok);
      setStreakBad(0);
      const nextLevel = adjustDda(level, ok, 0);
      setLevel(nextLevel);
      setFeedback("Bella!");
      awardStars(GAME_ID, 1);

      const nextIndex = index + 1;
      setTimeout(() => {
        if (nextIndex >= ROUND_SIZE) {
          setDone(true);
          void playWin();
          setIndex(nextIndex);
          return;
        }
        setIndex(nextIndex);
        nextQuestion(nextLevel);
        setStreakOk(0);
      }, 700);
      return;
    }

    void playWrongSoft();
    const bad = streakBad + 1;
    setStreakBad(bad);
    setStreakOk(0);
    const nextLevel = adjustDda(level, 0, bad);
    setLevel(nextLevel);
    setFeedback(`Quasi! Era ${question.correct}`);

    setTimeout(() => {
      nextQuestion(nextLevel);
      setStreakBad(0);
    }, 1200);
  };

  const restart = () => {
    setLevel(defaultDdaLevel);
    setIndex(0);
    setDone(false);
    setStreakOk(0);
    setStreakBad(0);
    nextQuestion(defaultDdaLevel);
  };

  return (
    <main className={styles.main}>
      <BackToHub />
      <header className={styles.header}>
        <h1 className={styles.title}>Scoppia i palloncini giusti</h1>
        <p className={styles.progress}>{progressLabel}</p>
      </header>

      {done ? (
        <div className={styles.done}>
          <p className={styles.doneText}>Hai finito il giro! Vuoi farne un altro?</p>
          <ThemedButton onClick={restart}>Gioca ancora</ThemedButton>
        </div>
      ) : (
        <>
          <p className={styles.prompt}>
            Quanto fa <strong>{question.prompt}</strong>?
          </p>
          {feedback && (
            <p className={styles.feedback} role="status">
              {feedback}
            </p>
          )}
          <div className={styles.choices}>
            {question.choices.map((c) => (
              <ThemedButton
                key={c}
                className={styles.choice}
                onClick={() => handleAnswer(c)}
              >
                {c}
              </ThemedButton>
            ))}
          </div>
        </>
      )}
    </main>
  );
};