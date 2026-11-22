"use client";

import { useCallback, useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt } from "@utils/random";
import shared from "./games.shared.module.css";

const GAME_ID = "talpa-selettiva";
const ROUNDS = 15;

type Mole = { hat: "red" | "blue"; num: number };

export function TalpaSelettiva() {
  const [hole, setHole] = useState<Mole | null>(null);
  const [rule, setRule] = useState<"red" | "gt5">("red");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const pop = useCallback(() => {
    setHole({
      hat: Math.random() > 0.5 ? "red" : "blue",
      num: randInt(1, 9),
    });
    setRule(Math.random() > 0.5 ? "red" : "gt5");
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (round >= ROUNDS) return;
      pop();
    }, 1800);
    pop();
    return () => clearInterval(t);
  }, [pop, round]);

  const tap = () => {
    if (!hole || done) return;
    const ok =
      rule === "red" ? hole.hat === "red" : hole.num > 5;
    if (ok) {
      playCorrect();
      setScore((s) => s + 1);
      award(1);
    } else playWrongSoft();
    const r = round + 1;
    setRound(r);
    if (r >= ROUNDS) {
      setDone(true);
      playWin();
    }
  };

  const ruleText =
    rule === "red" ? "Solo cappello rosso!" : "Solo numeri > 5";

  return (
    <GameShell title="Colpisci la talpa" subtitle={ruleText}>
      <div className={shared.panel} onClick={tap} role="presentation">
        <p className={shared.bigEmoji}>
          {hole ? `${hole.hat === "red" ? "🎩" : "🧢"} ${hole.num}` : "…"}
        </p>
        <p className={shared.hint}>Tocca quando è giusto! ({score} ok)</p>
        {done && <p>Tempo finito!</p>}
      </div>
    </GameShell>
  );
}