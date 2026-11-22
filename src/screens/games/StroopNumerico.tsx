"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt } from "@utils/random";
import shared from "./games.shared.module.css";

const ROUNDS = 10;
const GAME_ID = "stroop-numerico";

export function StroopNumerico() {
  const [turn, setTurn] = useState(0);
  const [mode, setMode] = useState<"count" | "value">("count");
  const [leftDigit, setLeftDigit] = useState(2);
  const [rightDigit, setRightDigit] = useState(5);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const { leftCount, rightCount, leftWin } = useMemo(() => {
    const lc = randInt(2, 4);
    const rc = randInt(2, 4);
    const lw = mode === "count" ? lc > rc : leftDigit > rightDigit;
    return { leftCount: lc, rightCount: rc, leftWin: lw };
  }, [mode, leftDigit, rightDigit, turn]);

  const leftText = Array.from({ length: leftCount }, () => leftDigit).join(" ");
  const rightText = Array.from({ length: rightCount }, () => rightDigit).join(" ");

  const newTurn = () => {
    setLeftDigit(randInt(1, 9));
    setRightDigit(randInt(1, 9));
    setMode(Math.random() > 0.5 ? "count" : "value");
    setTurn((t) => t + 1);
  };

  const pick = (side: "left" | "right") => {
    if (done) return;
    const ok = (side === "left") === leftWin;
    if (ok) {
      playCorrect();
      award(1);
    } else playWrongSoft();
    const r = turn + 1;
    if (r >= ROUNDS) {
      setDone(true);
      playWin();
      return;
    }
    newTurn();
  };

  const label = mode === "count" ? "Dove ci sono più cifre?" : "Dove il numero è più grande?";

  return (
    <GameShell title="Quanti o quanto grandi?" subtitle={label}>
      <Graph className={shared.row}>
        <ThemedButton onClick={() => pick("left")}>{leftText}</ThemedButton>
        <ThemedButton onClick={() => pick("right")}>{rightText}</ThemedButton>
      </Graph>
      {done && <p className={shared.hint}>Grande!</p>}
    </GameShell>
  );
}

function Graph({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}