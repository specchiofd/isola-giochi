export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)]!;

export const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);