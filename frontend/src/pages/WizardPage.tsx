import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "@/contexts/WizardContext";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi, analyzeApi } from "@/lib/api";
import { STRATEGIC_GOALS } from "@/types";
import type { Product } from "@/types";
import { formatPrice, formatDistance } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Car,
  Clapperboard,
  Dumbbell,
  HeartPulse,
  Laptop,
  LogOut,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  Utensils,
  Wrench,
  MapPin,
} from "lucide-react";
import MapPicker from "@/components/MapPicker";
import { HexButton } from "@/components/ui/HexButton";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { MonoLabel } from "@/components/ui/MonoLabel";
import {
  MonoInput, RangeSlider, InputLabel, Fieldset,
} from "@/components/ui/wizard-primitives";

function WizardHeader({ consultNum }: { consultNum: number | null }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="paper-surface"
      style={{ position: "sticky", top: 0, zIndex: 50, padding: "0.7rem 0" }}
    >
      <div className="container">
        <div
          className="compartment-well"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.55rem 0.9rem 0.55rem 1.4rem",
            background: "var(--mist)",
            borderRadius: 999,
          }}
        >
          <Link
            to="/welcome"
            className="brand-logo"
            style={{ fontSize: "1.25rem", textDecoration: "none" }}
          >
            ap-analysis.
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="pill-mono" style={{ background: "var(--deep)", color: "var(--bright)" }}>
              Consult #{consultNum ?? "…"}
            </span>
            <Link to="/welcome" className="mono-nav hover:opacity-60" style={{ textDecoration: "none" }}>Profil</Link>
            <Link to="/history" className="mono-nav hover:opacity-60" style={{ textDecoration: "none" }}>Riwayat</Link>
            {user && <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55 }}>{user.name}</MonoLabel>}
            <button
              onClick={() => { logout(); navigate("/"); }}
              aria-label="Keluar"
              style={{
                background: "none", border: "none", padding: 6, cursor: "pointer",
                color: "var(--deep)", opacity: 0.55,
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; }}
            >
              <LogOut size={16} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function PanelHero({ panel, eyebrow, title, subtitle }: {
  panel: number; eyebrow: string; title: string; subtitle: string;
}) {
  return (
    <section className="compartment">
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        gap: "0.8rem", marginBottom: "1.4rem",
      }}>
        <span className="pill-mono" style={{ background: "var(--deep)", color: "var(--bright)" }}>
          {String(panel).padStart(2, "0")} / 02
        </span>
        <MonoLabel size="xs" tone="ink" style={{ opacity: 0.7 }}>{eyebrow}</MonoLabel>
      </div>
      <h1 className="display-xl" style={{ maxWidth: 900, marginBottom: "0.8rem" }}>
        {title}
      </h1>
      <p
        className="serif-body"
        style={{
          maxWidth: 620,
          color: "color-mix(in srgb, var(--deep) 75%, transparent)",
        }}
      >
        {subtitle}
      </p>
    </section>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="compartment-bright"
      style={{
        padding: "0.9rem 1.4rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em",
        color: "var(--deep)",
        borderRadius: 14,
      }}
    >
      {children}
    </div>
  );
}

const CATEGORY_SUBCATEGORIES: Record<string, { label: string; value: string }[]> = {
  "F&B": [
    { label: "Cafe / Coffee Shop", value: "cafe" }, 
    { label: "Restaurant / Dine-in", value: "restaurant" }, 
    { label: "Takeout / Ghost Kitchen", value: "meal_takeaway" },
    { label: "Bakery", value: "bakery" }
  ],
  "Retail": [
    { label: "Convenience Store", value: "convenience_store" }, 
    { label: "Clothing / Apparel", value: "clothing_store" },
    { label: "Hardware Store", value: "hardware_store" },
    { label: "Pet Store", value: "pet_store" },
    { label: "Stationery & Books", value: "book_store" }
  ],
  "Services": [
    { label: "Laundry Services", value: "laundry" }, 
    { label: "Auto & Motor Repair", value: "car_repair" },
    { label: "Car / Motor Wash", value: "car_wash" }
  ],
  "Health & Beauty": [
    { label: "Pharmacy", value: "pharmacy" }, 
    { label: "Clinic", value: "doctor" },
    { label: "Barbershop / Salon", value: "beauty_salon" }, 
    { label: "Spa & Massage", value: "spa" }
  ],
  "Technology": [
    { label: "Electronics & Gadgets", value: "electronics_store" }, 
    { label: "Mobile Phone & Accessories", value: "cell_phone_store" }
  ],
  "Fitness, Sports & Leisure": [
    { label: "Gym / Fitness Center", value: "gym" },
    { label: "Park / Outdoor Recreation", value: "park" },
    { label: "Sports Stadium", value: "stadium" }
  ],
  "Entertainment & Nightlife": [
    { label: "Movie Theater", value: "movie_theater" },
    { label: "Night Club", value: "night_club" },
    { label: "Tourist Attraction", value: "tourist_attraction" }
  ],
  "Automotive & Transportation": [
    { label: "Gas Station", value: "gas_station" },
    { label: "Car Dealership", value: "car_dealer" },
    { label: "Car Rental", value: "car_rental" }
  ],
  "Professional Services": [
    { label: "Legal Services / Lawyer", value: "lawyer" }
  ]
};

const PARENT_ICONS: Record<string, React.ElementType> = {
  "F&B": Utensils,
  "Retail": ShoppingBag,
  "Services": Wrench,
  "Health & Beauty": HeartPulse,
  "Technology": Laptop,
  "Fitness, Sports & Leisure": Dumbbell,
  "Entertainment & Nightlife": Clapperboard,
  "Automotive & Transportation": Car,
  "Professional Services": BriefcaseBusiness,
};

const PARENT_ICON_COLORS: Record<string, string> = {
  "F&B": "#B45309",
  "Retail": "#0F766E",
  "Services": "#475569",
  "Health & Beauty": "#BE123C",
  "Technology": "#2563EB",
  "Fitness, Sports & Leisure": "#15803D",
  "Entertainment & Nightlife": "#7C3AED",
  "Automotive & Transportation": "#DC2626",
  "Professional Services": "#6D4C41",
};

function CategoryPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const parents = Object.keys(CATEGORY_SUBCATEGORIES);
  const activeParentFound = parents.find((p) =>
    CATEGORY_SUBCATEGORIES[p].some((s) => s.value === value)
  ) ?? null;
  const [localParent, setLocalParent] = useState<string | null>(activeParentFound);

  const handleParent = (p: string) => {
    setLocalParent((prev) => (prev === p ? null : p));
  };

  const selectedLabel = value
    ? Object.values(CATEGORY_SUBCATEGORIES)
        .flat()
        .find((s) => s.value === value)?.label
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {selectedLabel && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--deep)", color: "var(--bright)",
          borderRadius: 999, padding: "4px 12px",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          alignSelf: "flex-start",
        }}>
          ✓ {selectedLabel}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {parents.map((p) => {
          const isActive = localParent === p;
          return (
            (() => {
              const Icon = PARENT_ICONS[p] ?? Store;
              const iconColor = PARENT_ICON_COLORS[p] ?? "currentColor";
              return (
            <button
              key={p}
              type="button"
              onClick={() => handleParent(p)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 12px", borderRadius: 999, border: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
                cursor: "pointer",
                background: isActive ? "var(--deep)" : "var(--soft)",
                color: isActive ? "var(--bright)" : "var(--deep)",
                transition: "background 150ms, color 150ms",
              }}
            >
              <Icon size={14} strokeWidth={1.8} color={iconColor} /> {p}
            </button>
              );
            })()
          );
        })}
      </div>

      {localParent && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.4rem",
          padding: "0.6rem 0.8rem",
          background: "var(--mist)",
          borderRadius: 12,
        }}>
          {CATEGORY_SUBCATEGORIES[localParent].map((sub) => {
            const isSelected = value === sub.value;
            return (
              <button
                key={sub.value}
                type="button"
                onClick={() => onChange(sub.value)}
                style={{
                  padding: "4px 14px", borderRadius: 999, border: "none",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
                  cursor: "pointer",
                  background: isSelected ? "var(--bright)" : "var(--cream)",
                  color: "var(--deep)",
                  outline: isSelected ? "2px solid var(--deep)" : "none",
                  outlineOffset: 1,
                  transition: "background 150ms, outline 150ms",
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PanelOne() {
  const { data, updateData, setStep } = useWizard();
  const [name, setName] = useState(data.name);
  const [category, setCategory] = useState(data.category);
  const [concept, setConcept] = useState(data.concept);
  const [products, setProducts] = useState<Product[]>(
    data.products.length > 0 ? data.products : [{ name: "", price: 0 }]
  );
  const [goals, setGoals] = useState<string[]>(data.goals);
  const [error, setError] = useState("");

  const addProduct = () => setProducts([...products, { name: "", price: 0 }]);
  const removeProduct = (i: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, idx) => idx !== i));
  };
  const updateProduct = (i: number, field: keyof Product, value: string | number) => {
    setProducts(products.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };
  const handleContinue = () => {
    if (!name.trim()) return setError("Nama bisnis wajib diisi.");
    if (!category) return setError("Pilih kategori.");
    if (!concept.trim()) return setError("Deskripsikan konsep Anda.");
    const validProducts = products.filter((p) => p.name.trim() && p.price > 0);
    if (validProducts.length === 0) return setError("Tambahkan setidaknya satu produk dengan nama dan harga.");
    if (goals.length === 0) return setError("Pilih setidaknya satu tujuan strategis.");

    updateData({
      name: name.trim(), category, concept: concept.trim(),
      products: validProducts, goals,
    });
    setStep(2);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: "clamp(1rem, 2vw, 1.6rem)",
      paddingBottom: "8rem",
    }}>
      <PanelHero
        panel={1}
        eyebrow="Identitas · Produk · Tujuan"
        title="Ceritakan bisnis yang akan Anda bangun."
        subtitle="Tiga blok untuk diisi. Nama, kategori, dan konsep menentukan bentuk. Produk dan harga menjangkarkan penawaran. Tujuan mengkalibrasi cara kami menilai."
      />

      
      <Fieldset
        anchor="A / IDENTITAS"
        title="Bisnis itu sendiri."
        description="Nama bisnis, apa yang dilakukan, dan kategorinya."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }} className="identity-grid">
          
          <div className="compartment-inner">
            <InputLabel hint="Nama yang akan digunakan di papan tanda." required>Nama bisnis</InputLabel>
            <MonoInput
              type="text"
              placeholder="e.g. Warung Kopi Nusantara"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              autoFocus
            />
          </div>

          
          <div className="compartment-inner">
            <InputLabel hint="Termasuk kategori apa?" required>Kategori</InputLabel>
            <CategoryPicker
              value={category}
              onChange={(val) => { setCategory(val); setError(""); }}
            />
          </div>
        </div>
      </Fieldset>

      
      <Fieldset
        anchor="B / PRODUK"
        title="Apa yang Anda jual."
        description="Menu, katalog, atau daftar layanan dengan harga dalam IDR. Tambahkan sebanyak yang diperlukan."
      >
        <div className="compartment-inner" style={{ padding: "0.6rem" }}>
          
          <div
            className="compartment-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 48px",
              padding: "0.6rem 1rem",
              marginBottom: "0.4rem",
              borderRadius: 12,
            }}
          >
            {["Item", "Harga (IDR)", ""].map((h, i) => (
              <div key={i} style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--bright)",
              }}>
                {h}
              </div>
            ))}
          </div>

          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {products.map((product, i) => (
              <div
                key={i}
                className="row-stripe"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 48px",
                  alignItems: "center",
                  padding: "0.55rem 1rem",
                  gap: "0.6rem",
                  background: i % 2 === 1 ? "var(--soft)" : "transparent",
                }}
              >
                <input
                  type="text"
                  placeholder={`Item ${i + 1}, mis. Kopi Susu Spesial`}
                  value={product.name}
                  onChange={(e) => updateProduct(i, "name", e.target.value)}
                  style={{
                    border: "none", outline: "none",
                    padding: "0.4rem 0",
                    background: "transparent",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 15, fontWeight: 500, color: "var(--deep)",
                    width: "100%",
                  }}
                />
                <div style={{
                  display: "flex", alignItems: "center",
                  background: "var(--cream)",
                  borderRadius: 10,
                  padding: "0.35rem 0.7rem",
                }}>
                  <span style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", color: "var(--deep)", opacity: 0.55,
                    marginRight: 6,
                  }}>Rp</span>
                  <input
                    type="number"
                    placeholder="35000"
                    value={product.price || ""}
                    onChange={(e) => updateProduct(i, "price", Number(e.target.value))}
                    min={0}
                    style={{
                      flex: 1, border: "none", outline: "none", background: "transparent",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 14, fontWeight: 500, color: "var(--deep)",
                      minWidth: 0,
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(i)}
                  disabled={products.length === 1}
                  aria-label="Hapus item"
                  style={{
                    background: "transparent", border: "none",
                    cursor: products.length === 1 ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 8, padding: 6,
                    color: "var(--deep)", opacity: products.length === 1 ? 0.2 : 0.65,
                    transition: "background 200ms, opacity 200ms",
                  }}
                  onMouseEnter={(e) => {
                    if (products.length > 1) {
                      e.currentTarget.style.background = "var(--bright)";
                      e.currentTarget.style.opacity = "1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.opacity = products.length === 1 ? "0.2" : "0.65";
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addProduct}
          style={{
            marginTop: "1rem",
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--soft)", border: "none",
            borderRadius: 999, padding: "10px 20px", cursor: "pointer",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
            color: "var(--deep)",
            transition: "background 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bright)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--soft)"; }}
        >
          <Plus size={13} /> Tambah item
        </button>
      </Fieldset>

      <Fieldset
        anchor="C / STRATEGI"
        title="Apa yang ingin Anda optimalkan?"
        description="Pilih fokus strategis utama Anda. Ini menentukan cara kami menganalisis kelayakan dan menghasilkan umpan balik Anda."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem" }} className="goals-grid">
          {STRATEGIC_GOALS.map((goal) => {
            const GOAL_TO_CONCEPT: Record<string, string> = {
              "quality": "Premium / High-end",
              "volume": "Fast Service / Quick turnaround",
              "niche": "Specialized / Niche",
              "community": "Eco-friendly / Sustainable",
              "digital": "Innovative / Tech-driven",
              "affordable": "Low-cost / Value"
            };
            const targetConcept = GOAL_TO_CONCEPT[goal.id];
            const selected = concept === targetConcept;
            
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => { 
                  setConcept(targetConcept); 
                  setGoals([goal.id]);
                  setError(""); 
                }}
                className={selected ? "compartment-deep" : "compartment-inner"}
                style={{
                  textAlign: "left", cursor: "pointer",
                  border: "none",
                  padding: "1.1rem 1.3rem",
                  borderRadius: 16,
                  transition: "background 200ms, color 200ms, transform 120ms",
                  display: "flex", flexDirection: "column", gap: "0.4rem",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: selected ? "var(--bright)" : "var(--deep)",
                  opacity: selected ? 0.85 : 0.6,
                }}>
                  {goal.label}
                </span>
                <span style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 500, fontSize: 13, lineHeight: 1.4,
                  color: selected ? "var(--bright)" : "var(--deep)",
                  opacity: selected ? 0.9 : 0.78,
                }}>
                  {goal.description}
                </span>
              </button>
            );
          })}
        </div>
      </Fieldset>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StickyFooter>
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--bright)", opacity: 0.85,
        }}>
          Panel 01. Lengkapi semua kolom wajib untuk melanjutkan.
        </span>
        <HexButton onClick={handleContinue}>
          Lanjut ke lokasi <ArrowRight size={14} />
        </HexButton>
      </StickyFooter>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PANEL 2 — Location + Radius + Submit
   ────────────────────────────────────────────────────────────────────── */
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

type SubmitPhase = "idle" | "saving" | "validating" | "analyzing";

const SUBMIT_STEPS = [
  { label: "Menyimpan profil bisnis..." },
  { label: "Memvalidasi zonasi RDTR..." },
  { label: "Memindai pesaing & membuat laporan AI..." },
];

function PanelTwo() {
  const { data, updateData, setStep, reset } = useWizard();
  const [latitude, setLatitude] = useState<number | null>(data.latitude);
  const [longitude, setLongitude] = useState<number | null>(data.longitude);
  const [radiusMeters, setRadiusMeters] = useState(data.radiusMeters);
  const [address, setAddress] = useState(data.address ?? "");
  const [addressQuery, setAddressQuery] = useState(data.address ?? "");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [geocodedCenter, setGeocodedCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestRef = useRef(0);
  const navigate = useNavigate();

  const isSubmitting = submitPhase !== "idle";

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const handleAddressInput = (query: string) => {
    setAddressQuery(query);
    const requestId = ++searchRequestRef.current;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    if (normalizedQuery.length < 3) { setSuggestions([]); return; }
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(normalizedQuery)}&format=json&limit=5&countrycodes=id`,
          { headers: { "Accept-Language": "id" } }
        );
        const results: NominatimResult[] = await resp.json();
        if (requestId !== searchRequestRef.current) return;
        setSuggestions(results);
      } catch {
        if (requestId !== searchRequestRef.current) return;
        setSuggestions([]);
      }
    }, 600);
  };

  const handleSuggestionSelect = (s: NominatimResult) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    searchRequestRef.current += 1;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setAddress(s.display_name);
    setAddressQuery(s.display_name);
    setSuggestions([]);
    setLatitude(lat);
    setLongitude(lng);
    setGeocodedCenter({ lat, lng });
    setError("");
  };

  const handleLocationChange = (lat: number, lng: number) => {
    searchRequestRef.current += 1;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setLatitude(lat);
    setLongitude(lng);
    setSuggestions([]);
    setError("");
  };

  const handleAddressChange = (addr: string) => {
    searchRequestRef.current += 1;
    setAddress(addr);
    setAddressQuery(addr);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      setError("Tandai pin pada peta atau masukkan alamat untuk menentukan lokasi Anda.");
      return;
    }
    updateData({ latitude, longitude, radiusMeters, address });
    setSubmitPhase("saving");
    setCompletedSteps([]);
    setError("");
    try {
      const { data: profileData } = await businessApi.create({
        ...data, latitude, longitude, radiusMeters, address,
      });
      setCompletedSteps([0]);
      setSubmitPhase("validating");

      await new Promise((resolve) => setTimeout(resolve, 1800));
      setCompletedSteps([0, 1]);
      setSubmitPhase("analyzing");

      const { data: analysisData } = await analyzeApi.run(profileData.profile.id);
      setCompletedSteps([0, 1, 2]);

      await new Promise((resolve) => setTimeout(resolve, 600));
      reset();
      navigate(`/dashboard/${analysisData.profile.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Terjadi kesalahan. Silakan coba lagi.");
      setSubmitPhase("idle");
      setCompletedSteps([]);
    }
  };

  /* ── Loading overlay ─────────────────────────────────────────────────── */
  if (isSubmitting) {
    const phaseIndex = submitPhase === "saving" ? 0 : submitPhase === "validating" ? 1 : 2;
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingBottom: "4rem",
      }}>
        <div
          className="compartment"
          style={{ width: "100%", maxWidth: 560, textAlign: "center" }}
        >
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--deep)", opacity: 0.6,
            marginBottom: "2rem",
          }}>
            MEMPROSES ANALISIS ANDA
          </div>

          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.04em",
            color: "var(--deep)", marginBottom: "2.4rem",
          }}>
            {completedSteps.length === 3 ? "Selesai." : "Mohon\ntunggu."}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", textAlign: "left" }}>
            {SUBMIT_STEPS.map((s, i) => {
              const done = completedSteps.includes(i);
              const active = i === phaseIndex && !done;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.9rem",
                    padding: "1rem 1.2rem",
                    borderRadius: 14,
                    background: done
                      ? "var(--deep)"
                      : active ? "var(--mist)" : "var(--soft)",
                    opacity: !done && !active ? 0.4 : 1,
                    transition: "all 0.4s ease",
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--bright)" : active ? "var(--deep)" : "var(--mist)",
                    transition: "background 0.3s ease",
                  }}>
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : active ? (
                      <div style={{
                        width: 10, height: 10, borderRadius: 999,
                        border: "2px solid var(--bright)", borderTopColor: "transparent",
                        animation: "spin 0.7s linear infinite",
                      }} />
                    ) : (
                      <div style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: "var(--deep)", opacity: 0.3,
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14, fontWeight: 600,
                    color: done ? "var(--bright)" : active ? "var(--deep)" : "var(--deep)",
                    letterSpacing: "-0.01em",
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {error && (
            <div style={{
              marginTop: "1.5rem",
              padding: "0.9rem 1.2rem",
              borderRadius: 12,
              background: "var(--bright)",
              color: "var(--deep)",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13, fontWeight: 600,
            }}>
              {error}
              <button
                onClick={() => { setSubmitPhase("idle"); setCompletedSteps([]); setError(""); }}
                style={{
                  display: "block", marginTop: "0.7rem",
                  background: "var(--deep)", color: "var(--bright)",
                  border: "none", borderRadius: 999, padding: "6px 16px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}
              >
                Coba lagi
              </button>
            </div>
          )}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: "clamp(1rem, 2vw, 1.6rem)",
      paddingBottom: "8rem",
    }}>
      <PanelHero
        panel={2}
        eyebrow="Lokasi · Radius · Kirim"
        title="Di mana lokasinya, dan sejauh apa kita mencari?"
        subtitle="Tandai pin di lokasi yang Anda rencanakan. Lalu atur radius. Itu adalah zona yang kami scan untuk pesaing, permintaan, dan batasan zonasi."
      />

      {/* ── Map ────────────────────────────────────────────────────────── */}
      <Fieldset
        anchor="D / LOKASI"
        title="Tandai pin Anda."
        description="Ketik alamat atau klik langsung pada peta. Anda juga bisa menggeser pin untuk presisi tingkat jalan."
      >
        {/* Address search input */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <div
            className="compartment-inner"
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.75rem 1.1rem",
            }}
          >
            <MapPin size={15} style={{ color: "var(--deep)", opacity: 0.5, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Ketik nama jalan, gedung, atau kawasan..."
              value={addressQuery}
              onChange={(e) => handleAddressInput(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14, fontWeight: 500, color: "var(--deep)",
              }}
            />
            {addressQuery && (
              <button
                type="button"
                onClick={() => { setAddressQuery(""); setAddress(""); setSuggestions([]); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--deep)", opacity: 0.35, padding: 0, fontSize: 16, lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "var(--cream)",
              border: "1px solid color-mix(in srgb, var(--deep) 16%, transparent)",
              borderRadius: 14,
              boxShadow: "0 8px 24px -8px color-mix(in srgb, var(--deep) 20%, transparent)",
              zIndex: 50,
              overflow: "hidden",
            }}>
              {suggestions.map((s, i) => (
                <button
                  key={s.place_id}
                  type="button"
                  onMouseDown={() => handleSuggestionSelect(s)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "0.7rem 1.1rem",
                    background: "transparent", border: "none", cursor: "pointer",
                    borderBottom: i < suggestions.length - 1
                      ? "1px solid color-mix(in srgb, var(--deep) 10%, transparent)"
                      : "none",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 13, fontWeight: 500, color: "var(--deep)",
                    lineHeight: 1.4,
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--soft)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {s.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="compartment-inner"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            radiusMeters={radiusMeters}
            onLocationChange={handleLocationChange}
            selectedLocation={geocodedCenter}
            onAddressChange={handleAddressChange}
          />
        </div>

        {latitude && longitude && (
          <div
            className="compartment-well"
            style={{
              marginTop: "1rem",
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.7rem 1.1rem",
            }}
          >
            <MapPin size={15} style={{ color: "var(--deep)" }} />
            <MonoLabel size="xs" tone="current" style={{ letterSpacing: "0.08em" }}>
              Pin ditandai: {latitude.toFixed(5)}, {longitude.toFixed(5)}
              {address && <span style={{ opacity: 0.6 }}> · {address.split(",").slice(0, 2).join(",")}</span>}
            </MonoLabel>
          </div>
        )}
      </Fieldset>

      {/* ── Radius slider ──────────────────────────────────────────────── */}
      <Fieldset
        anchor="E / RADIUS"
        title="Atur radius analisis."
        description="Zona geografis yang kami scan untuk pesaing dan sinyal pasar. Geser slider, atau ketuk tanda tick untuk snap."
      >
        <div className="compartment-inner" style={{ padding: "clamp(1.6rem, 3vw, 2.4rem)" }}>
          <RangeSlider
            min={500}
            max={10000}
            step={100}
            value={radiusMeters}
            onChange={setRadiusMeters}
            format={(v) => formatDistance(v)}
            ticks={[
              { value: 500,  label: "0.5km" },
              { value: 1000, label: "1km" },
              { value: 2000, label: "2km" },
              { value: 3000, label: "3km" },
              { value: 5000, label: "5km" },
              { value: 10000, label: "10km" },
            ]}
          />
        </div>
      </Fieldset>

      {/* ── Review ─────────────────────────────────────────────────────── */}
      <Fieldset
        anchor="F / TINJAU"
        title="Konfirmasi dan jalankan."
        description="Satu kali lihat terakhir sebelum kami membuat analisis Anda."
      >
        <ReviewCard data={data} address={address} latitude={latitude} longitude={longitude} radiusMeters={radiusMeters} />
      </Fieldset>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StickyFooter>
        <HexButton onClick={() => setStep(1)} variant="outline">
          <ArrowLeft size={14} /> Kembali
        </HexButton>
        <HexButton onClick={handleSubmit}>
          Jalankan analisis <Sparkles size={14} />
        </HexButton>
      </StickyFooter>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ReviewCard — striped rows, no borders
   ────────────────────────────────────────────────────────────────────── */
function ReviewCard({ data, address, latitude, longitude, radiusMeters }: {
  data: ReturnType<typeof useWizard>["data"];
  address: string;
  latitude: number | null; longitude: number | null; radiusMeters: number;
}) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Nama", value: data.name || "—" },
    { label: "Kategori", value: data.category || "—" },
    { label: "Konsep", value: data.concept || "—" },
    {
      label: "Produk",
      value: data.products.length > 0
        ? data.products.map((p) => `${p.name} (${formatPrice(p.price)})`).join(" · ")
        : "—",
    },
    {
      label: "Tujuan",
      value: data.goals.length > 0
        ? data.goals.map((id) => STRATEGIC_GOALS.find((g) => g.id === id)?.label ?? id).join(" · ")
        : "—",
    },
    {
      label: "Lokasi",
      value: address || data.address || "Alamat belum tersedia",
    },
    {
      label: "Koordinat",
      value: latitude && longitude ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "—",
    },
    { label: "Radius", value: formatDistance(radiusMeters) },
  ];

  return (
    <div className="compartment-inner" style={{ padding: "0.6rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              alignItems: "stretch",
              padding: "0.85rem 1.1rem",
              borderRadius: 12,
              background: i % 2 === 1 ? "var(--soft)" : "transparent",
            }}
          >
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--deep)", opacity: 0.6,
              alignSelf: "center",
            }}>
              {r.label}
            </div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 15, fontWeight: 500, lineHeight: 1.4, color: "var(--deep)",
            }}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickyFooter({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "1rem", left: 0, right: 0,
      pointerEvents: "none",
      zIndex: 40,
    }}>
      <div className="container" style={{ pointerEvents: "auto" }}>
        <div
          className="compartment-deep"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "1rem", padding: "0.85rem 1.2rem",
            borderRadius: 999,
            boxShadow: "0 8px 24px -8px rgba(31, 46, 21, 0.32)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   WizardPage
   ────────────────────────────────────────────────────────────────────── */
export default function WizardPage() {
  const { step } = useWizard();
  const [consultNum, setConsultNum] = useState<number | null>(null);

  useEffect(() => {
    businessApi.list()
      .then(({ data }) => setConsultNum((data.profiles?.length ?? 0) + 1))
      .catch(() => setConsultNum(1));
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [step]);

  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ minHeight: "100vh" }}>
      <WizardHeader consultNum={consultNum} />

      <main className="container" style={{ maxWidth: 1100, paddingTop: "1rem" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 ? <PanelOne /> : <PanelTwo />}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .identity-grid { grid-template-columns: 1fr !important; }
          .goals-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PaletteScope>
  );
}
