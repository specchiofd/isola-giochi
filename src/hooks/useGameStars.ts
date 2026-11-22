"use client";

import { useCallback } from "react";
import { useProgressStore } from "@state/progress/progress.store";

export const useGameStars = (gameId: string) => {
  const awardStars = useProgressStore((s) => s.awardStars);

  return useCallback(
    (count = 1) => {
      awardStars(gameId, count);
    },
    [awardStars, gameId],
  );
};