"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { pick } from "@utils/random";
import shared from "./games.shared.module.css";

const ING = ["🍞", "🧀", "🥬", "🍅"];
const GAME_ID = "cuoco-pasticcere";

export function CuocoPasticcere() {
  const [recipe, setRecipe] = useState<string[]>([]);
  const [picked, setPicked] = useState(0);
  const [boiling, setBoiling] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const newRecipe = () => {
    setRecipe([pick(ING), pick(ING)]);
    setPicked(0);
  };

  useEffect(() => {
    newRecipe();
    const t = setInterval(() => setBoiling(Math.random() > 0.75), 2000);
    return () => clearInterval(t);
  }, []);

  const tapIng = (e: string) => {
    if (e !== recipe[picked]) {
      playWrongSoft();
      return;
    }
    const n = picked + 1;
    setPicked(n);
    if (n === recipe.length) {
      playCorrect();
      award(2);
      playWin();
      newRecipe();
    }
  };

  const coolPot = () => {
    playCorrect();
    award(1);
    setBoiling(false);
  };

  return (
    <GameShell title="Il cuoco pasticcere" subtitle="Segui la ricetta">
      <div className={shared.panel}>
        <p>Ricetta: {recipe.join(" ")}</p>
        <p>🍳 Pentola {boiling ? "bolle! 🔥" : "ok"}</p>
        <div className={shared.row}>
          {ING.map((i) => (
            <ThemedButton key={i} onClick={() => tapIng(i)}>
              {i}
            </ThemedButton>
          ))}
        </div>
        {boiling && (
          <ThemedButton onClick={coolPot} style={{ marginTop: "0.75rem" }}>
            Abbassa fuoco
          </ThemedButton>
        )}
      </div>
    </GameShell>
  );
}