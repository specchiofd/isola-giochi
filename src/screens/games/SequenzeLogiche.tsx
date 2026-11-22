"use client";

import { useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { shuffle } from "@utils/random";
import shared from "./games.shared.module.css";

const GAME_ID = "sequenze-logiche";

const patterns = [
  { seq: ["🔴", "🔵", "🔴", "?"], answer: "🔴", opts: ["🔴", "🔵", "🟢"] },
  { seq: ["⭐", "⭐", "🌙", "⭐", "?"], answer: "🌙", opts: ["⭐", "🌙", "☀️"] },
];

export function SequenzeLogiche() {
  const [idx, setIdx] = useState(0);
  const [opts, setOpts] = useState<string[]>(patterns[0]!.opts);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const cur = patterns[idx % patterns.length]!;

  const answer = (o: string) => {
    if (o === cur.answer) {
      playCorrect();
      award(1);
      const n = idx + 1;
      setIdx(n);
      if (n >= patterns.length * 3) {
        playWin();
        return;
      }
      const next = patterns[n % patterns.length]!;
      setOpts(shuffle(next.opts));
    } else playWrongSoft();
  };

  return (
    <GameShell title="Completa la sequenza">
      <div className={shared.panel}>
        <p className={shared.bigEmoji}>{cur.seq.join(" ")}</p>
        <div className={shared.row}>
          {opts.map((o) => (
            <ThemedButton key={o} onClick={() => answer(o)}>
              {o}
            </ThemedButton>
          ))}
        </div>
      </div>
    </GameShell>
  );
}