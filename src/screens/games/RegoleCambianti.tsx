"use client";

import { useEffect, useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import { randInt } from "@utils/random";
import shared from "./games.shared.module.css";

const ROUNDS = 12;
const GAME_ID = "regole-cambianti";

export function RegoleCambianti() {
  const [rule, setRule] = useState<"big" | "small">("big");
  const [big, setBig] = useState(randInt(3, 9));
  const [small, setSmall] = useState(randInt(1, 4));
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);

  const newTurn = () => {
    setBig(randInt(3, 9));
    setSmall(randInt(1, 4));
    if (Math.random() > 0.65) setRule((r) => (r === "big" ? "small" : "big"));
  };

  useEffect(() => {
    newTurn();
  }, []);

  const tap = (side: "big" | "small") => {
    if (done) return;
    const ok = side === rule;
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

  const bg = rule === "big" ? "#b8e4f5" : "#fff3b0";

  return (
    <GameShell title="Regole che cambiano" subtitle={rule === "big" ? "Sfondo azzurro = più grande" : "Sfondo giallo = più piccolo"}>
      <div className={shared.panel} style={{ background: bg }}>
        <div className={shared.row}>
          <button type="button" className={shared.cell} style={{ fontSize: big * 6 }} onClick={() => tap("big")}>
            ●
          </button>
          <button type="button" className={shared.cell} style={{ fontSize: small * 6 }} onClick={() => tap("small")}>
            ●
          </button>
        </div>
        {done && <p className={shared.hint}>Ottimo switching!</p>}
      </div>
    </GameShell>
  );
}