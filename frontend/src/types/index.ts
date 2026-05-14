export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Product {
  name: string;
  price: number;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  category: string;
  concept: string;
  products: Product[];
  goals: string[];
  latitude: number;
  longitude: number;
  radiusMeters: number;
  analysisResult: AnalysisResult | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ScoreBreakdown {
  competitionDensity: number;
  locationAppeal: number;
  marketDemand: number;
  conceptUniqueness: number;
}

export interface StrategicRoadmap {
  differentiation: string[];
  pricing: string[];
  marketing: string[];
}

export interface Competitor {
  name: string;
  type: string;
  allTypes: string[];
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  vicinity: string;
  placeId: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  priceDelta: number;
  categoryMatch: boolean;
  threatScore: number;
}

export interface ZoneResult {
  zone_label: "MERAH" | "KUNING" | "HIJAU" | "UNKNOWN";
  zone_type: string | null;
  zone_name: string;
  green_zone_ratio: number;
  commercial_ratio: number;
  mixed_use_ratio: number;
  is_restricted: boolean;
}

export interface AnalysisResult {
  swot: SwotAnalysis;
  successScore: number;
  scoreBreakdown: ScoreBreakdown;
  strategicRoadmap: StrategicRoadmap;
  summary: string;
  competitors: Competitor[];
  topCompetitor: Competitor | null;
  userPriceTier: number;
  address: string;
  zone?: ZoneResult;
}

export interface WizardData {
  name: string;
  category: string;
  concept: string;
  products: Product[];
  goals: string[];
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  address?: string;
}

export const BUSINESS_CATEGORIES = [
  "Makanan & Minuman",
  "Ritel",
  "Kecantikan",
  "Kesehatan",
  "Pendidikan",
  "Hiburan",
  "Jasa",
  "Teknologi",
] as const;

export const STRATEGIC_GOALS = [
  { id: "quality",    label: "Kualitas & Nilai Terbaik",  description: "Fokus pada kualitas premium dan nilai terbaik bagi pelanggan" },
  { id: "volume",     label: "Berbasis Volume",           description: "Maksimalkan jumlah pelanggan dan perputaran" },
  { id: "niche",      label: "Pasar Niche",               description: "Sasar segmen pelanggan yang sangat spesifik" },
  { id: "community",  label: "Berbasis Komunitas",        description: "Bangun basis komunitas lokal yang loyal" },
  { id: "digital",    label: "Digital-first",             description: "Manfaatkan kanal online dan layanan pesan antar" },
  { id: "affordable", label: "Pemimpin Harga Terjangkau", description: "Bersaing di harga dan aksesibilitas" },
] as const;
