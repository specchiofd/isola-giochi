"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useAudio } from "@hooks/useAudio";
import styles from "./ThemedButton.module.css";

type ThemedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  mutedTap?: boolean;
};

export const ThemedButton = ({
  children,
  variant = "primary",
  mutedTap = false,
  onClick,
  className,
  type = "button",
  ...rest
}: ThemedButtonProps) => {
  const { playTap, playTapMuted } = useAudio();

  return (
    <button
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(" ")}
      onClick={(e) => {
        if (mutedTap) void playTapMuted();
        else void playTap();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};