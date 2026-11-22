"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import shared from "./games.shared.module.css";

const GAME_ID = "pilota-astronave";
const DURATION = 60000;

export function PilotaAstronave() {
  const [ship, setShip] = useState(1);
  const [rocks, setRocks] = useState(1);
  const [gem, setGem] = useState(false);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      setLeft(DURATION - (Date.now() - start));
      setRocks((r) => (Math.random() > 0.85 ? r : Math.floor(Math.random() * 3)));
      setGem(Math.random() > 0.92);
    }, 700);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (left <= 0) playWin();
  }, [left, playWin]);

  const move = (d: -1 | 1) => {
    setShip((s) => Math.min(2, Math.max(0, s + d)));
    if (rocks === ship) playWrongSoft();
  };

  const collect = () => {
    if (!gem) return;
    playCorrect();
    setScore((s) => s + 1);
    award(1);
    setGem(false);
  };

  return (
    <GameShell title="Pilota dell'astronave" subtitle={`${Math.ceil(left / 1000)}s · Gemme ${score}`}>
      <div className={shared.panel}>
        <p aria-live="polite">
          {["⬜️", "🚀", "⬜️"].map((cell, i) => (i === ship ? "🚀" : rocks === i ? "☄️" : "·")).join(" ")}
        </p>
        <div className={shared.row}>
          <ThemedButton onClick={() => move(-1)}>←</ThemedButton>
          <ThemedButton onClick={() => move(1)}>→</ThemedButton>
        </div>
        {gem && (
          <ThemedButton onClick={collect} style={{ marginTop: "0.75rem" }}>
            💎 RACCOGLI
          </ThemedButton>
        )}
      </div>
    </GameShell>
  );
}