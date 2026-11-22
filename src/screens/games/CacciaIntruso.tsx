"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt } from "@utils/random";
import shared from "./games.shared.module.css";

const GAME_ID = "caccia-intruso";
const SIZE = 16;

export function CacciaIntruso() {
  const [cells, setCells] = useState<string[]>([]);
  const [target, setTarget] = useState("b");
  const [found, setFound] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const newBoard = () => {
    const t = Math.random() > 0.5 ? "b" : "d";
    const other = t === "b" ? "d" : "b";
    const nTarget = randInt(3, 5);
    const arr: string[] = Array.from({ length: SIZE }, () => other);
    for (let i = 0; i < nTarget; i++) arr[i] = t;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      const tmp = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = tmp;
    }
    setTarget(t);
    setCells(arr);
    setFound(0);
    setTotal(nTarget);
    setDone(false);
  };

  useEffect(() => {
    newBoard();
  }, []);

  const tap = (i: number) => {
    if (done) return;
    if (cells[i] === target) {
      playCorrect();
      const f = found + 1;
      setFound(f);
      if (f === total) {
        award(1);
        setDone(true);
        playWin();
      }
    } else {
      playWrongSoft();
    }
  };

  return (
    <GameShell title="Caccia all'intruso" subtitle={`Trova tutte le "${target}"`}>
      <p className={shared.hint}>
        Trovate {found}/{total}
      </p>
      <div className={shared.grid4}>
        {cells.map((ch, i) => (
          <button key={i} type="button" className={shared.cell} onClick={() => tap(i)}>
            {ch}
          </button>
        ))}
      </div>
      {done && (
        <div className={shared.row}>
          <ThemedButton onClick={newBoard}>Gioca ancora</ThemedButton>
        </div>
      )}
    </GameShell>
  );
}