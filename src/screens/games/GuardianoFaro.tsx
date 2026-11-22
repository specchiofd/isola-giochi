"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { pick } from "@utils/random";
import shared from "./games.shared.module.css";

const SHIPS = ["⛵", "🛳", "🚤", "🏴‍☠️"];
const GAME_ID = "guardiano-faro";
const DURATION = 75000;

export function GuardianoFaro() {
  const [boat, setBoat] = useState("⛵");
  const [left, setLeft] = useState(DURATION);
  const [hits, setHits] = useState(0);
  const [bad, setBad] = useState(0);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      setLeft(DURATION - (Date.now() - start));
      setBoat(pick(SHIPS));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (left <= 0) playWin();
  }, [left, playWin]);

  const lamp = () => {
    if (boat === "🏴‍☠️") {
      playCorrect();
      setHits((h) => h + 1);
      award(1);
    } else {
      playWrongSoft();
      setBad((b) => b + 1);
    }
  };

  return (
    <GameShell title="Guardiano del faro" subtitle={`Solo pirati! ${Math.ceil(left / 1000)}s`}>
      <div className={shared.panel}>
        <p className={shared.bigEmoji}>{boat}</p>
        <ThemedButton onClick={lamp}>ACCENDI FARO</ThemedButton>
        <p className={shared.hint}>
          Giusti {hits} · Ops {bad}
        </p>
      </div>
    </GameShell>
  );
}