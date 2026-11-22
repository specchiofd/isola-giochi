import type { DdaLevel } from "@utils/dda";

export type Question = {
  prompt: string;
  correct: number;
  choices: number[];
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const buildQuestion = (level: DdaLevel): Question => {
  const max = level.maxOperand;
  const a = randInt(0, max);
  const b = randInt(0, max);
  const add = Math.random() > 0.45;
  let correct: number;
  let prompt: string;
  if (add) {
    correct = a + b;
    if (correct > 20) return buildQuestion(level);
    prompt = `${a} + ${b}`;
  } else {
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    correct = hi - lo;
    prompt = `${hi} − ${lo}`;
  }
  const choices = new Set<number>([correct]);
  while (choices.size < level.choiceCount) {
    const wrong = randInt(0, 20);
    if (wrong !== correct) choices.add(wrong);
  }
  return {
    prompt,
    correct,
    choices: [...choices].sort(() => Math.random() - 0.5),
  };
};