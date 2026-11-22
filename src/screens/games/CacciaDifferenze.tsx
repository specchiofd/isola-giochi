"use client";

import { useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import shared from "./games.shared.module.css";

const GAME_ID = "caccia-differenze";

const scenes = [
  { base: "🏝🌴🦜", diff: "🏝🌴", spot: 2 },
  { base: "🚂🌳🏠", diff: "🚂🌳", spot: 2 },
];

export function CacciaDifferenze() {
  const [idx, setIdx] = useState(0);
  const [found, setFound] = useState(0);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);
  const scene = scenes[idx % scenes.length]!;

  const tap = (side: "left" | "right") => {
    if (side === "right" && found < 1) {
      playCorrect();
      setFound(1);
      award(1);
      const n = idx + 1;
      setIdx(n);
      setFound(0);
      if (n >= scenes.length * 2) playWin();
    } else playWrongSoft();
  };

  return (
    <GameShell title="Caccia alle differenze" subtitle="Trova cosa manca a destra">
      <div className={shared.row}>
        <button type="button" className={shared.panel} onClick={() => tap("left")}>
          {scene.base}
        </button>
        <button type="button" className={shared.panel} onClick={() => tap("right")}>
          {scene.diff}
        </button>
      </div>
    </GameShell>
  );
}