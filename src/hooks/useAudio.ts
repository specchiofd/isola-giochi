"use client";

import { useCallback, useRef, useState } from "react";
import {
  playCorrect,
  playTap,
  playTapMuted,
  playWin,
  playWrongSoft,
  resumeAudio,
  setMasterVolume,
} from "@utils/audio/synth";
import { useProgressStore } from "@state/progress/progress.store";

export const useAudio = () => {
  const [unlocked, setUnlocked] = useState(false);
  const unlocking = useRef(false);
  const audioEnabled = useProgressStore((s) => s.audioEnabled);

  const unlock = useCallback(async () => {
    if (unlocking.current || unlocked) return;
    unlocking.current = true;
    try {
      await resumeAudio();
      setMasterVolume(audioEnabled);
      setUnlocked(true);
    } finally {
      unlocking.current = false;
    }
  }, [audioEnabled, unlocked]);

  const withUnlock = useCallback(
    async (fn: () => void) => {
      await unlock();
      if (audioEnabled) fn();
    },
    [unlock, audioEnabled],
  );

  return {
    unlocked,
    unlock,
    playTap: () => withUnlock(() => playTap()),
    playTapMuted: () => withUnlock(() => playTapMuted()),
    playCorrect: () => withUnlock(() => playCorrect()),
    playWrongSoft: () => withUnlock(() => playWrongSoft()),
    playWin: () => withUnlock(() => playWin()),
  };
};