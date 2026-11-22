"use client";

import { useEffect, useRef, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt } from "@utils/random";
import shared from "./games.shared.module.css";

const GAME_ID = "smistamento-rapido";
const DURATION_MS = 90000;

export function SmistamentoRapido() {
  const [value, setValue] = useState(randInt(1, 20));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_MS);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const left = DURATION_MS - (Date.now() - start);
      setTimeLeft(Math.max(0, left));
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        playWin();
      }
    }, 250);
    return () => clearInterval(t);
  }, [playWin]);

  const decide = (side: "pari" | "dispari") => {
    if (timeLeft <= 0) return;
    const ok = value % 2 === (side === "pari" ? 0 : 1);
    if (ok) {
      playCorrect();
      setScore((s) => s + 1);
      if (score > 0 && score % 3 === 0) award(1);
    } else playWrongSoft();
    setValue(randInt(1, 20));
  };

  return (
    <GameShell title="Smistamento rapido" subtitle={`Pari o dispari? · ${Math.ceil(timeLeft / 1000)}s`}>
      <div className={shared.panel}>
        <p className={shared.bigEmoji}>{value}</p>
        <div className={shared.row}>
          <ThemedButton onClick={() => decide("pari")}>Pari →</ThemedButton>
          <ThemedButton onClick={() => decide("dispari")}>← Dispari</ThemedButton>
        </div>
        <p className={shared.hint}>Punti: {score}</p>
      </div>
    </GameShell>
  );
}