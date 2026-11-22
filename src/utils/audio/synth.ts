const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0]; // C D E G A

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastTapAt = 0;

const getContext = (): AudioContext => {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!audioContext) {
    audioContext = new Ctx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
};

export const resumeAudio = async (): Promise<void> => {
  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
};

const playTone = (
  frequency: number,
  durationMs: number,
  type: OscillatorType = "sine",
  gainPeak = 0.25,
): void => {
  const ctx = getContext();
  if (!masterGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(gainPeak, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(t);
  osc.stop(t + durationMs / 1000 + 0.05);
};

const randomPentatonic = (): number => {
  return PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] ?? 329.63;
};

export const playTap = (): void => {
  const now = Date.now();
  if (now - lastTapAt < 50) return;
  lastTapAt = now;
  playTone(randomPentatonic(), 80, "triangle", 0.2);
};

export const playTapMuted = (): void => {
  playTone(randomPentatonic(), 70, "triangle", 0.08);
};

export const playCorrect = (): void => {
  const base = PENTATONIC[2] ?? 329.63;
  [0, 1, 2].forEach((i) => {
    window.setTimeout(() => {
      playTone(base * (1 + i * 0.25), 120, "sine", 0.22);
    }, i * 70);
  });
};

export const playWrongSoft = (): void => {
  playTone(220, 140, "sine", 0.12);
};

export const playWin = (): void => {
  PENTATONIC.forEach((freq, i) => {
    window.setTimeout(() => playTone(freq, 150, "triangle", 0.2), i * 90);
  });
};

export const setMasterVolume = (enabled: boolean): void => {
  if (masterGain) {
    masterGain.gain.value = enabled ? 0.35 : 0;
  }
};