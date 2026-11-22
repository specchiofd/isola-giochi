"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { GameCatalogEntry } from "@data/gameCatalog.models";
import { useAudio } from "@hooks/useAudio";
import { useProgressStore } from "@state/progress/progress.store";
import styles from "./GameCard.module.css";

type GameCardProps = {
  game: GameCatalogEntry;
  onSoonTap?: () => void;
};

export const GameCard = ({ game, onSoonTap }: GameCardProps) => {
  const router = useRouter();
  const { playTap, playTapMuted } = useAudio();
  const stars = useProgressStore((s) => s.starsByGameId[game.id] ?? 0);
  const isAvailable = game.status === "available";

  const handleClick = () => {
    if (isAvailable) {
      void playTap();
      router.push(`/games/${game.slug}/`);
      return;
    }
    void playTapMuted();
    onSoonTap?.();
  };

  return (
    <button
      type="button"
      className={[styles.card, !isAvailable && styles.soon].filter(Boolean).join(" ")}
      onClick={handleClick}
    >
      <div className={styles.previewWrap}>
        <Image
          src={game.previewSrc}
          alt=""
          width={96}
          height={96}
          className={styles.preview}
        />
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{game.title}</h2>
        <p className={styles.description}>{game.description}</p>
        {stars > 0 && (
          <p className={styles.stars} aria-label={`${stars} stelle`}>
            {"★".repeat(Math.min(stars, 5))}
            {stars > 5 ? ` +${stars - 5}` : ""}
          </p>
        )}
        {!isAvailable && <span className={styles.badge}>Presto</span>}
      </div>
    </button>
  );
};