"use client";

import { useCallback, useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { pick } from "@utils/random";
import shared from "./games.shared.module.css";

const EMOJIS = ["🐱", "🐶", "🦊", "🐸", "⭐", "🍎"];
const ROUNDS = 10;
const GAME_ID = "memory-n-back";

export function MemoryNBack() {
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("…");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const showNext = useCallback(() => {
    const e = pick(EMOJIS);
    setHistory((h) => [...h, e]);
    setCurrent(e);
    setMsg(null);
  }, []);

  useEffect(() => {
    showNext();
  }, [showNext]);

  const answer = (saidUguale: boolean) => {
    if (done) return;
    if (history.length < 2) {
      setRound(1);
      showNext();
      return;
    }
    const isUguale = history[history.length - 1] === history[history.length - 2];
    const ok = saidUguale === isUguale;
    if (ok) {
      playCorrect();
      setScore((s) => s + 1);
      award(1);
      setMsg("Bella!");
    } else {
      playWrongSoft();
      setMsg(isUguale ? "Era uguale!" : "Era diverso!");
    }
    const n = round + 1;
    setRound(n);
    if (n >= ROUNDS) {
      setDone(true);
      playWin();
      return;
    }
    setTimeout(showNext, 600);
  };

  return (
    <GameShell title="Memory dinamico" subtitle={`Round ${Math.min(round, ROUNDS)}/${ROUNDS}`}>
      <div className={shared.panel}>
        <p>È uguale a quello di prima?</p>
        <p className={shared.bigEmoji}>{current}</p>
        {msg && <p className={shared.hint}>{msg}</p>}
        {!done && (
          <div className={shared.row}>
            <ThemedButton onClick={() => answer(true)}>Uguale!</ThemedButton>
            <ThemedButton variant="secondary" onClick={() => answer(false)}>
              Diverso
            </ThemedButton>
          </div>
        )}
        {done && <p className={shared.hint}>Fine! {score} buone risposte</p>}
      </div>
    </GameShell>
  );
}