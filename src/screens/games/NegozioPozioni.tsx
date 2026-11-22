"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { shuffle } from "@utils/random";
import shared from "./games.shared.module.css";

const ITEMS = ["🍎", "🍄", "⭐", "🌸", "🫐", "🥕"];
const ROUNDS = 8;
const GAME_ID = "negozio-pozioni";

export function NegozioPozioni() {
  const [order, setOrder] = useState<string[]>([]);
  const [shelf, setShelf] = useState<string[]>([]);
  const [picked, setPicked] = useState(0);
  const [phase, setPhase] = useState<"show" | "pick" | "done">("show");
  const [round, setRound] = useState(0);
  const roundRef = useRef(0);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const startRound = useCallback(() => {
    const n = 2 + Math.min(2, Math.floor(roundRef.current / 3));
    const seq = shuffle(ITEMS).slice(0, n);
    setOrder(seq);
    setPicked(0);
    setShelf(shuffle([...ITEMS]));
    setPhase("show");
    window.setTimeout(() => setPhase("pick"), 1200 + n * 350);
  }, []);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const tap = (item: string) => {
    if (phase !== "pick") return;
    if (item !== order[picked]) {
      playWrongSoft();
      window.setTimeout(startRound, 800);
      return;
    }
    const n = picked + 1;
    setPicked(n);
    if (n === order.length) {
      playCorrect();
      award(1);
      roundRef.current += 1;
      const r = round + 1;
      setRound(r);
      if (r >= ROUNDS) {
        setPhase("done");
        playWin();
        return;
      }
      window.setTimeout(startRound, 700);
    }
  };

  return (
    <GameShell title="Il negozio di pozioni" subtitle={`Ricetta ${Math.min(round + 1, ROUNDS)}/${ROUNDS}`}>
      <div className={shared.panel}>
        {phase === "show" && (
          <>
            <p>Ricorda l&apos;ordine!</p>
            <p className={shared.bigEmoji}>{order.join(" ")}</p>
          </>
        )}
        {phase === "pick" && (
          <>
            <p>Tocca sullo scaffale:</p>
            <div className={shared.row}>
              {shelf.map((it, i) => (
                <ThemedButton key={`${it}-${i}`} onClick={() => tap(it)}>
                  {it}
                </ThemedButton>
              ))}
            </div>
          </>
        )}
        {phase === "done" && <p className={shared.hint}>Bravissima pozionista!</p>}
      </div>
    </GameShell>
  );
}