"use client";

import { useCallback, useRef, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import shared from "./games.shared.module.css";

const COLORS = [
  { id: 0, c: "#ff8f6b" },
  { id: 1, c: "#7ec8e3" },
  { id: 2, c: "#8fd9b6" },
  { id: 3, c: "#ffc857" },
];
const MAX_LEVEL = 6;
const GAME_ID = "simon-says";

export function SimonSays() {
  const seqRef = useRef<number[]>([]);
  const [lit, setLit] = useState<number | null>(null);
  const [phase, setPhase] = useState<"play" | "input" | "done">("input");
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState(0);
  const [started, setStarted] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const flash = async (ids: number[]) => {
    for (const id of ids) {
      setLit(id);
      await new Promise((r) => setTimeout(r, 450));
      setLit(null);
      await new Promise((r) => setTimeout(r, 120));
    }
  };

  const grow = useCallback(async () => {
    const n = Math.floor(Math.random() * 4);
    seqRef.current = [...seqRef.current, n];
    setInput(0);
    setPhase("play");
    await flash(seqRef.current);
    setPhase("input");
  }, []);

  const start = () => {
    seqRef.current = [];
    setLevel(0);
    setStarted(true);
    void grow();
  };

  const tap = (id: number) => {
    if (!started || phase !== "input") return;
    const seq = seqRef.current;
    if (id !== seq[input]) {
      playWrongSoft();
      seqRef.current = [];
      setLevel(0);
      setStarted(false);
      return;
    }
    const n = input + 1;
    setInput(n);
    if (n === seq.length) {
      playCorrect();
      award(1);
      const lv = level + 1;
      setLevel(lv);
      if (lv >= MAX_LEVEL) {
        setPhase("done");
        playWin();
        return;
      }
      window.setTimeout(() => void grow(), 400);
    }
  };

  return (
    <GameShell title="Simon dice" subtitle={started ? `Livello ${level + 1}` : "Ascolta e ripeti"}>
      {!started && (
        <button type="button" className={shared.panel} onClick={start} style={{ width: "100%", border: "none" }}>
          Inizia
        </button>
      )}
      {started && (
        <div className={shared.grid4}>
          {COLORS.map((col) => (
            <button
              key={col.id}
              type="button"
              className={shared.cell}
              style={{ background: lit === col.id ? col.c : `${col.c}88`, minHeight: 72 }}
              onClick={() => tap(col.id)}
            />
          ))}
        </div>
      )}
      {phase === "done" && <p className={shared.hint}>Sequenza perfetta!</p>}
    </GameShell>
  );
}