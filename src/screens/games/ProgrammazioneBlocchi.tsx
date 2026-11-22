"use client";

import { useState } from "react";
import { GameShell } from "@components/GameShell/GameShell";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useAudio } from "@hooks/useAudio";
import { useGameStars } from "@hooks/useGameStars";
import shared from "./games.shared.module.css";

type Cmd = "A" | "G";
const GAME_ID = "programmazione-blocchi";

export function ProgrammazioneBlocchi() {
  const [plan, setPlan] = useState<Cmd[]>([]);
  const [pos, setPos] = useState(0);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { playCorrect, playWrongSoft, playWin } = useAudio();
  const award = useGameStars(GAME_ID);
  const goal = 4;

  const add = (c: Cmd) => {
    if (running) return;
    if (plan.length < 8) setPlan((p) => [...p, c]);
  };

  const run = async () => {
    setRunning(true);
    setMsg(null);
    let p = 0;
    for (const c of plan) {
      await new Promise((r) => setTimeout(r, 400));
      if (c === "A") p += 1;
      setPos(p);
    }
    if (p === goal) {
      playCorrect();
      award(2);
      playWin();
      setMsg("Sei arrivata!");
    } else {
      playWrongSoft();
      setMsg("Quasi! Riprova i passi.");
    }
    setRunning(false);
  };

  return (
    <GameShell title="Robot a comandi" subtitle="Obiettivo: 4 passi avanti">
      <div className={shared.panel}>
        <p>
          Posizione: {pos} / {goal}
        </p>
        <p>
          Comandi: {plan.map((c) => (c === "A" ? "Avanti" : "Gira")).join(" · ") || "—"}
        </p>
        <div className={shared.row}>
          <ThemedButton variant="secondary" onClick={() => add("A")} disabled={running}>
            Avanti
          </ThemedButton>
          <ThemedButton variant="secondary" onClick={() => add("G")} disabled={running}>
            Gira
          </ThemedButton>
          <ThemedButton onClick={() => void run()} disabled={!plan.length || running}>
            Play
          </ThemedButton>
          <ThemedButton
            variant="ghost"
            onClick={() => {
              setPlan([]);
              setPos(0);
            }}
            mutedTap
          >
            Cancella
          </ThemedButton>
        </div>
        {msg && <p className={shared.hint}>{msg}</p>}
      </div>
    </GameShell>
  );
}