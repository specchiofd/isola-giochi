export type GameStatus = "available" | "coming_soon";

export type GameArea =
  | "memoria"
  | "velocita"
  | "procedurale"
  | "calcolo"
  | "inibitorio"
  | "attenzione";

export interface GameCatalogEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  area: GameArea;
  previewSrc: string;
  status: GameStatus;
  sortOrder: number;
}