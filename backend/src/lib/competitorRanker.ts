import { PlaceResult } from "./places";

export interface RankedCompetitor extends PlaceResult {
  priceDelta: number;
  categoryMatch: boolean;
  threatScore: number;
}

export function calculatePriceTier(priceIdr: number): number {
  if (priceIdr < 25_000) return 1;
  if (priceIdr < 75_000) return 2;
  if (priceIdr < 150_000) return 3;
  return 4;
}

export function calculateCategoryMatch(
  userProducts: string,
  competitorName: string,
  competitorTypes: string[]
): boolean {
  const keywords = userProducts.toLowerCase().split(" ").filter(k => k.length > 2);
  const compName = competitorName.toLowerCase();
  const compTypes = competitorTypes.map(t => t.toLowerCase().replace(/_/g, " "));

  const nameMatch = keywords.some(k => compName.includes(k));
  if (nameMatch) return true;

  const typeMatch = keywords.some(k => compTypes.some(t => t.includes(k)));
  if (typeMatch) return true;

  return compTypes.some(t => keywords.some(k => t.includes(k)));
}

export function rankCompetitors(
  competitors: PlaceResult[],
  userPriceTier: number,
  userProductsLabel: string
): RankedCompetitor[] {
  const ranked = competitors.map((c): RankedCompetitor => {
    const competitorPriceLevel = c.priceLevel ?? 2;
    const priceDelta = Math.abs(userPriceTier - competitorPriceLevel);
    const categoryMatch = calculateCategoryMatch(userProductsLabel, c.name, c.allTypes);
    
    const threatScore =
      (1 / (priceDelta + 1)) * 100 +
      (categoryMatch ? 75 : 0) +
      (1 / (c.distanceMeters + 1)) * 1000 +
      (c.rating ? c.rating * 10 : 0);

    return { ...c, priceDelta, categoryMatch, threatScore };
  });

  ranked.sort((a, b) => b.threatScore - a.threatScore);

  return ranked;
}
