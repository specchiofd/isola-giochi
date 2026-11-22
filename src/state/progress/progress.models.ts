export interface ProgressState {
  starsByGameId: Record<string, number>;
  audioEnabled: boolean;
  _hasHydrated: boolean;
}

export const initialProgressState: ProgressState = {
  starsByGameId: {},
  audioEnabled: true,
  _hasHydrated: false,
};