export type DdaLevel = {
  maxOperand: number;
  choiceCount: number;
};

export const defaultDdaLevel: DdaLevel = { maxOperand: 10, choiceCount: 3 };

export const adjustDda = (
  level: DdaLevel,
  streakCorrect: number,
  streakWrong: number,
): DdaLevel => {
  let next = { ...level };
  if (streakCorrect >= 3) {
    next = {
      maxOperand: Math.min(20, next.maxOperand + 2),
      choiceCount: Math.min(4, next.choiceCount + 1),
    };
  }
  if (streakWrong >= 2) {
    next = {
      maxOperand: Math.max(6, next.maxOperand - 2),
      choiceCount: Math.max(3, next.choiceCount - 1),
    };
  }
  return next;
};