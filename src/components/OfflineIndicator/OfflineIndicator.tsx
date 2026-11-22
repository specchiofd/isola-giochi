"use client";

import { useOfflineReady } from "@hooks/useOfflineReady";
import styles from "./OfflineIndicator.module.css";

const labels: Record<ReturnType<typeof useOfflineReady>, string> = {
  unsupported: "",
  registering: "Download risorse…",
  ready: "Pronto per giocare offline",
  error: "Aggiorna la pagina",
};

export const OfflineIndicator = () => {
  const status = useOfflineReady();
  const label = labels[status];
  if (!label) return null;

  return (
    <p className={styles.indicator} role="status">
      {label}
    </p>
  );
};