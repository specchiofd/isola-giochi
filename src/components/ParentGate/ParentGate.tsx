"use client";

import { useState } from "react";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import { useProgressStore } from "@state/progress/progress.store";
import styles from "./ParentGate.module.css";

export const ParentGate = () => {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const audioEnabled = useProgressStore((s) => s.audioEnabled);
  const setAudioEnabled = useProgressStore((s) => s.setAudioEnabled);

  const tryOpen = () => {
    if (Number.parseInt(answer, 10) === 12) {
      setOpen(true);
      setError(false);
      setAnswer("");
      return;
    }
    setError(true);
  };

  const clearCacheAndReload = async () => {
    if (!window.confirm("Svuotare la cache e ricaricare l'app?")) return;
    const registrations = await navigator.serviceWorker?.getRegistrations();
    await Promise.all(registrations?.map((r) => r.unregister()) ?? []);
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    window.location.reload();
  };

  const checkUpdates = async () => {
    const reg = await navigator.serviceWorker?.getRegistration();
    await reg?.update();
    alert("Controllo aggiornamenti completato.");
  };

  if (!open) {
    return (
      <div className={styles.bar}>
        <label className={styles.gateLabel}>
          Area genitori: 7 + 5 =
          <input
            className={styles.input}
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryOpen()}
          />
        </label>
        <ThemedButton variant="secondary" mutedTap onClick={tryOpen}>
          OK
        </ThemedButton>
        {error && <span className={styles.error}>Riprova</span>}
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <ThemedButton variant="ghost" mutedTap onClick={() => setOpen(false)}>
        Chiudi
      </ThemedButton>
      <p className={styles.instructions}>
        <strong>iPad:</strong> Condividi → Aggiungi a schermata Home.
      </p>
      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={audioEnabled}
          onChange={(e) => setAudioEnabled(e.target.checked)}
        />
        Suoni attivi
      </label>
      <div className={styles.actions}>
        <ThemedButton variant="secondary" onClick={() => void checkUpdates()}>
          Controlla aggiornamenti
        </ThemedButton>
        <ThemedButton variant="secondary" onClick={() => void clearCacheAndReload()}>
          Svuota cache
        </ThemedButton>
      </div>
    </div>
  );
};