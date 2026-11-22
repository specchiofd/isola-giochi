"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialProgressState, type ProgressState } from "./progress.models";
import { setMasterVolume } from "@utils/audio/synth";

interface ProgressActions {
  awardStars: (gameId: string, stars: number) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...initialProgressState,
      awardStars: (gameId, stars) => {
        const prev = get().starsByGameId[gameId] ?? 0;
        set({
          starsByGameId: {
            ...get().starsByGameId,
            [gameId]: prev + stars,
          },
        });
      },
      setAudioEnabled: (enabled) => {
        setMasterVolume(enabled);
        set({ audioEnabled: enabled });
      },
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "isola-giochi:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        starsByGameId: state.starsByGameId,
        audioEnabled: state.audioEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) setMasterVolume(state.audioEnabled);
        useProgressStore.setState({ _hasHydrated: true });
      },
    },
  ),
);