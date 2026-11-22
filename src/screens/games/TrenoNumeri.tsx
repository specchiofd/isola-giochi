"use client";

import { useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt, shuffle } from "@utils/random";
import shared from "./games.shared.module.css";

const GAME_ID = "treno-numeri";
const STOPS = 4;

export function TrenoNumeri() {
  const [start] = useState(randInt(3, 8));
  const [total, setTotal] = useState(start);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [phase, setPhase] = useState<"run" | "quiz" | "done">("run");
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const applyStop = () => {
    const delta = randInt(1, 4) * (Math.random() > 0.4 ? 1 : -1);
    const nxt = Math.min(20, Math.max(0, total + delta));
    setTotal(nxt);
    const s = step + 1;
    setStep(s);
    if (s >= STOPS) {
      const w = shuffle([nxt, nxt + 1, nxt - 1, nxt + 2].filter((x) => x >= 0 && x <= 20)).slice(0, 4);
      setChoices(w);
      setPhase("quiz");
    }
  };

  const pick = (n: number) => {
    if (n === total) {
      playCorrect();
      award(2);
      playWin();
      setPhase("done");
    } else playWrongSoft();
  };

  return (
    <GameShell title="Il treno dei numeri" subtitle={`Partenza: ${start}`}>
      <div className={shared.panel}>
        {phase === "run" && (
          <>
            <p className={shared.bigEmoji}>🚃 {total}</p>
            <p>Fermata {step + 1}/{STOPS}</p>
            <ThemedButton onClick={applyStop}>Arrivo fermata</ThemedButton>
          </>
        )}
        {(phase === "quiz" || phase === "done") && (
          <>
            <p>Quanti passeggeri al capolinea?</p>
            <div className={shared.row}>
              {choices.map((c) => (
                <ThemedButton key={c} onClick={() => pick(c)}>
                  {c}
                </ThemedButton>
              ))}
            </div>
          </>
        )}
      </div>
    </GameShell>
  );
}