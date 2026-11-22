"use client";

import { useState } from "react";
import { areaLabels, gameCatalog } from "@data/gameCatalog";
import type { GameArea } from "@data/gameCatalog.models";
import { GameCard } from "@components/GameCard/GameCard";
import { OfflineIndicator } from "@components/OfflineIndicator/OfflineIndicator";
import { ParentGate } from "@components/ParentGate/ParentGate";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import styles from "./GameHub.module.css";

const orderedAreas: GameArea[] = [
  "memoria",
  "velocita",
  "procedurale",
  "calcolo",
  "inibitorio",
  "attenzione",
];

export const GameHub = () => {
  const [soonMessage, setSoonMessage] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>L&apos;isola dei giochi</h1>
          <p className={styles.subtitle}>Scegli un gioco e divertiti!</p>
        </div>
        <OfflineIndicator />
      </header>

      {soonMessage && (
        <p className={styles.soonToast} role="status">
          {soonMessage}
          <ThemedButton variant="ghost" mutedTap onClick={() => setSoonMessage(null)}>
            OK
          </ThemedButton>
        </p>
      )}

      <div className={styles.sections}>
        {orderedAreas.map((area) => {
          const games = gameCatalog.filter((g) => g.area === area);
          if (games.length === 0) return null;
          return (
            <section key={area} className={styles.section}>
              <h2 className={styles.areaTitle}>{areaLabels[area]}</h2>
              <ul className={styles.list}>
                {games.map((game) => (
                  <li key={game.id}>
                    <GameCard
                      game={game}
                      onSoonTap={() =>
                        setSoonMessage("Lo stiamo preparando per te! Torna presto.")
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <ParentGate />
    </main>
  );
};