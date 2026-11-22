import { gameCatalog } from "@data/gameCatalog";
import { gameRegistry } from "@screens/games/registry";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return gameCatalog.map((g) => ({ slug: g.slug }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Game = gameRegistry[slug];
  if (!Game) notFound();
  return <Game />;
}