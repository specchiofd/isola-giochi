"use client";

import { useRouter } from "next/navigation";
import { ThemedButton } from "@components/ThemedButton/ThemedButton";
import styles from "./BackToHub.module.css";

export const BackToHub = () => {
  const router = useRouter();

  return (
    <ThemedButton
      variant="ghost"
      className={styles.back}
      onClick={() => router.push("/")}
    >
      ← Torna ai giochi
    </ThemedButton>
  );
};