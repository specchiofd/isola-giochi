"use client";

import type { ReactNode } from "react";
import { BackToHub } from "@components/BackToHub/BackToHub";
import styles from "./GameShell.module.css";

type GameShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const GameShell = ({ title, subtitle, children }: GameShellProps) => (
  <main className={styles.main}>
    <BackToHub />
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
    {children}
  </main>
);