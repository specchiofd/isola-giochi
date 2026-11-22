"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import shared from "./games.shared.module.css";

const ROUNDS = 12;
const GAME_ID = "sole-luna";

export function SoleLuna() {
  const [icon, setIcon] = useState<"sun" | "moon">("sun");
  const [sky, setSky] = useState<"day" | "night">("day");
  const [mode, setMode] = useState<"see" | "time">("see");
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const newTurn = () => {
    setIcon(Math.random() > 0.5 ? "sun" : "moon");
    setSky(Math.random() > 0.5 ? "day" : "night");
    setMode(Math.random() > 0.5 ? "see" : "time");
  };

  useEffect(() => {
    newTurn();
  }, []);

  const answer = (choice: "sun" | "moon" | "day" | "night") => {
    if (done) return;
    const want = mode === "see" ? icon : sky === "day" ? "day" : "night";
    const ok = choice === want;
    if (ok) {
      playCorrect();
      award(1);
    } else playWrongSoft();
    const r = round + 1;
    setRound(r);
    if (r >= ROUNDS) {
      setDone(true);
      playWin();
      return;
    }
    newTurn();
  };

  const bg = sky === "day" ? "#b8e4f5" : "#2d3a4a";
  const fg = sky === "day" ? "#2d3a4a" : "#fff";

  return (
    <GameShell title="Sole e luna" subtitle={mode === "see" ? "Cosa vedi?" : "Che momento è?"}>
      <div className={shared.panel} style={{ background: bg, color: fg }}>
        <p className={shared.bigEmoji}>{icon === "sun" ? "☀️" : "🌙"}</p>
        {mode === "see" ? (
          <div className={shared.row}>
            <ThemedButton onClick={() => answer("sun")}>Sole</ThemedButton>
            <ThemedButton onClick={() => answer("moon")}>Luna</ThemedButton>
          </div>
        ) : (
          <div className={shared.row}>
            <ThemedButton onClick={() => answer("day")}>Giorno</ThemedButton>
            <ThemedButton onClick={() => answer("night")}>Notte</ThemedButton>
          </div>
        )}
        {done && <p className={shared.hint}>Super!</p>}
      </div>
    </GameShell>
  );
}