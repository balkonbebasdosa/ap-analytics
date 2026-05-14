export const FEEDBACK_DICTIONARY: Record<string, { low: string; medium: string; high: string }> = {
  "Low-cost / Value": {
    low: "A low-cost model faces significant hurdles here due to intense price competition or insufficient market volume. You must aggressively optimize your supply chain and consider relocating to a higher-traffic area to survive.",
    medium: "Your value-based concept has moderate potential, but margins will be tight. Success depends on achieving high daily turnover and keeping overhead expenses strictly controlled.",
    high: "Your low-cost model is highly viable in this area due to strong market demand and favorable demographic indicators. Focus on high-volume sales and operational efficiency to maximize your margins against nearby competitors."
  },
  "Premium / High-end": {
    low: "The local demographics and current market density do not support a premium pricing strategy at this location. You risk severe underperformance unless you pivot to a more accessible price point or find a more affluent neighborhood.",
    medium: "A high-end concept can survive here if you deliver exceptional, differentiated quality that justifies the price premium. Heavy investment in targeted marketing and customer experience will be essential to draw the right demographic.",
    high: "This location is perfectly primed for a premium business model. High location appeal and affluent local indicators suggest customers are willing to pay a premium for superior quality and exclusivity."
  },
  "Fast Service / Quick turnaround": {
    low: "Fast service relies on massive foot traffic, which this location severely lacks. The current competition density and low demand scores indicate this model will struggle to achieve the volume necessary for profitability.",
    medium: "A quick-turnaround model is viable here, provided you can capture the peak-hour rush effectively. Streamlining your operations and offering convenient grab-and-go options will be the key to outperforming local competitors.",
    high: "Exceptional conditions exist for a high-speed service model in this high-traffic area. The demand profile indicates a strong need for quick, reliable service, making this an ideal spot to maximize daily transaction volume."
  },
  "Specialized / Niche": {
    low: "The market demand for your highly specialized concept is dangerously low in this area. Without a broader appeal or a dedicated destination-shopper base, this location will likely lead to stagnation.",
    medium: "Your niche concept has a fighting chance if you can build a strong, loyal community around your specific offering. You will need to rely heavily on digital marketing to pull customers from outside the immediate walking radius.",
    high: "The data shows a massive gap in the market perfectly suited for your specialized business. The lack of direct competitors and high uniqueness score means you can quickly establish a monopoly in your specific niche."
  },
  "Eco-friendly / Sustainable": {
    low: "While admirable, the local market indicators suggest consumers here are highly price-sensitive and may not pay the premium associated with sustainable practices. Consider softening the eco-angle in favor of pure value to gain traction.",
    medium: "Sustainability is a nice-to-have in this market, but it cannot be your only selling point. You must ensure your core product quality and pricing remain competitive with traditional businesses nearby to maintain steady revenue.",
    high: "This area shows strong alignment with progressive, eco-conscious consumer trends. Your sustainable concept will serve as a massive differentiator, allowing you to capture a dedicated demographic willing to support green initiatives."
  },
  "Innovative / Tech-driven": {
    low: "The local market does not display the early-adopter traits necessary to support a highly innovative or tech-heavy concept. You may face significant friction in customer education and adoption at this specific location.",
    medium: "Your tech-driven approach could streamline operations, but the customer-facing innovation might take time to catch on. Focus on using your tech to lower operational costs while keeping the user experience as familiar and accessible as possible.",
    high: "The local demographic is highly receptive to modern, tech-forward business models. Your innovative approach will easily disrupt the traditional competitors in the area and attract a modern, convenience-seeking customer base."
  },
  "Fallback": {
    low: "The current market indicators suggest significant challenges for this location. High competition or low demand means you must carefully reevaluate your business strategy before proceeding.",
    medium: "This location presents a moderate opportunity with a balanced risk profile. Success will depend heavily on strong operational execution and clear differentiation from existing competitors.",
    high: "The data indicates highly favorable conditions for a new business in this area. Strong demand and manageable competition provide an excellent foundation for immediate growth and profitability."
  }
};

export function getBusinessFeedback(concept: string, bviScore: number): string {
  const targetConcept = FEEDBACK_DICTIONARY[concept] ? concept : "Fallback";
  const feedbackTier = FEEDBACK_DICTIONARY[targetConcept];

  if (bviScore < 50) {
    return feedbackTier.low;
  } else if (bviScore >= 50 && bviScore <= 75) {
    return feedbackTier.medium;
  } else {
    return feedbackTier.high;
  }
}
