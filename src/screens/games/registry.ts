import type { ComponentType } from "react";
import { MemoryNBack } from "./MemoryNBack";
import { NegozioPozioni } from "./NegozioPozioni";
import { SimonSays } from "./SimonSays";
import { CacciaIntruso } from "./CacciaIntruso";
import { SmistamentoRapido } from "./SmistamentoRapido";
import { TalpaSelettiva } from "./TalpaSelettiva";
import { ProgrammazioneBlocchi } from "./ProgrammazioneBlocchi";
import { RegoleCambianti } from "./RegoleCambianti";
import { SequenzeLogiche } from "./SequenzeLogiche";
import { TrenoNumeri } from "./TrenoNumeri";
import { PallonciniBersaglio } from "./PallonciniBersaglio";
import { StroopNumerico } from "./StroopNumerico";
import { SoleLuna } from "./SoleLuna";
import { PilotaAstronave } from "./PilotaAstronave";
import { CuocoPasticcere } from "./CuocoPasticcere";
import { GuardianoFaro } from "./GuardianoFaro";
import { CacciaDifferenze } from "./CacciaDifferenze";

export const gameRegistry: Record<string, ComponentType> = {
  "memory-n-back": MemoryNBack,
  "negozio-pozioni": NegozioPozioni,
  "simon-says": SimonSays,
  "caccia-intruso": CacciaIntruso,
  "smistamento-rapido": SmistamentoRapido,
  "talpa-selettiva": TalpaSelettiva,
  "programmazione-blocchi": ProgrammazioneBlocchi,
  "regole-cambianti": RegoleCambianti,
  "sequenze-logiche": SequenzeLogiche,
  "treno-numeri": TrenoNumeri,
  "palloncini-bersaglio": PallonciniBersaglio,
  "stroop-numerico": StroopNumerico,
  "sole-luna": SoleLuna,
  "pilota-astronave": PilotaAstronave,
  "cuoco-pasticcere": CuocoPasticcere,
  "guardiano-faro": GuardianoFaro,
  "caccia-differenze": CacciaDifferenze,
};