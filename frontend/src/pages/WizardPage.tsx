import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "@/contexts/WizardContext";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi, analyzeApi } from "@/lib/api";
import { STRATEGIC_GOALS } from "@/types";
import type { Product } from "@/types";
import { formatPrice, formatDistance } from "@/lib/utils";
import { ArrowLeft, ArrowRight, LogOut, Plus, Trash2, Sparkles, MapPin } from "lucide-react";
import MapPicker from "@/components/MapPicker";
import { HexButton } from "@/components/ui/HexButton";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { MonoLabel } from "@/components/ui/MonoLabel";
import {
  MonoInput, MonoTextarea, PillToggle, RangeSlider, InputLabel, Fieldset,
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
            <Link to="/welcome" className="mono-nav hover:opacity-60" style={{ textDecoration: "none" }}>Profile</Link>
            <Link to="/history" className="mono-nav hover:opacity-60" style={{ textDecoration: "none" }}>History</Link>
            {user && <MonoLabel size="xs" tone="ink" style={{ opacity: 0.55 }}>{user.name}</MonoLabel>}
            <button
              onClick={() => { logout(); navigate("/"); }}
              aria-label="Log out"
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

const PARENT_ICONS: Record<string, string> = {
  "F&B": "🍽️",
  "Retail": "🛍️",
  "Services": "🔧",
  "Health & Beauty": "💄",
  "Technology": "💻",
  "Fitness, Sports & Leisure": "🏋️",
  "Entertainment & Nightlife": "🎬",
  "Automotive & Transportation": "🚗",
  "Professional Services": "💼",
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
              <span>{PARENT_ICONS[p]}</span> {p}
            </button>
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
  const toggleGoal = (id: string) =>
    setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const handleContinue = () => {
    if (!name.trim()) return setError("Business name is required.");
    if (!category) return setError("Pick a category.");
    if (!concept.trim()) return setError("Describe your concept.");
    const validProducts = products.filter((p) => p.name.trim() && p.price > 0);
    if (validProducts.length === 0) return setError("Add at least one product with a name and price.");
    if (goals.length === 0) return setError("Pick at least one strategic goal.");

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
        eyebrow="Identity · Products · Goals"
        title="Tell us what you're building."
        subtitle="Three blocks to capture. Name, category, and concept set the shape. Products and prices anchor the offer. Goals calibrate how we score it."
      />

      
      <Fieldset
        anchor="A / IDENTITY"
        title="The business itself."
        description="What you call it, what it does, and which lane it's in."
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem" }} className="identity-grid">
          
          <div className="compartment-inner">
            <InputLabel hint="The name you'll use on signage." required>Business name</InputLabel>
            <MonoInput
              type="text"
              placeholder="e.g. Warung Kopi Nusantara"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              autoFocus
            />
          </div>

          
          <div className="compartment-inner">
            <InputLabel hint="What lane are you in?" required>Category</InputLabel>
            <CategoryPicker
              value={category}
              onChange={(val) => { setCategory(val); setError(""); }}
            />
          </div>
        </div>
      </Fieldset>

      
      <Fieldset
        anchor="B / PRODUCTS"
        title="What you sell."
        description="The actual menu, catalog, or service list with prices in IDR. Add as many lines as you need."
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
            {["Item", "Price (IDR)", ""].map((h, i) => (
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
                  placeholder={`Item ${i + 1} — e.g. Signature Latte`}
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
                  aria-label="Remove item"
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
          <Plus size={13} /> Add item
        </button>
      </Fieldset>

      <Fieldset
        anchor="C / STRATEGY"
        title="What are you optimizing for?"
        description="Select your primary strategic focus. This determines how we analyze your viability and generate your deterministic feedback."
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
          Panel 01 — fill all required fields to continue.
        </span>
        <HexButton onClick={handleContinue}>
          Continue to location <ArrowRight size={14} />
        </HexButton>
      </StickyFooter>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PANEL 2 — Location + Radius + Submit
   ────────────────────────────────────────────────────────────────────── */
function PanelTwo() {
  const { data, updateData, setStep, reset } = useWizard();
  const [latitude, setLatitude] = useState<number | null>(data.latitude);
  const [longitude, setLongitude] = useState<number | null>(data.longitude);
  const [radiusMeters, setRadiusMeters] = useState(data.radiusMeters);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat); setLongitude(lng); setError("");
  };

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      setError("Drop a pin on the map to set your location.");
      return;
    }
    updateData({ latitude, longitude, radiusMeters });
    setIsSubmitting(true);
    setError("");
    try {
      const { data: profileData } = await businessApi.create({
        ...data, latitude, longitude, radiusMeters,
      });
      const { data: analysisData } = await analyzeApi.run(profileData.profile.id);
      reset();
      navigate(`/dashboard/${analysisData.profile.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: "clamp(1rem, 2vw, 1.6rem)",
      paddingBottom: "8rem",
    }}>
      <PanelHero
        panel={2}
        eyebrow="Location · Radius · Submit"
        title="Where will it sit, and how far do we look?"
        subtitle="Drop a pin where you intend to open. Then dial in the radius — that's the zone we scan for competitors, demand, and zoning constraints."
      />

      {/* ── Map ────────────────────────────────────────────────────────── */}
      <Fieldset
        anchor="D / LOCATION"
        title="Drop your pin."
        description="Click anywhere on the map. Zoom in for street-level precision."
      >
        <div
          className="compartment-inner"
          style={{
            padding: 0,
            overflow: "hidden",
          }}
        >
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            radiusMeters={radiusMeters}
            onLocationChange={handleLocationChange}
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
              Pin set: {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </MonoLabel>
          </div>
        )}
      </Fieldset>

      {/* ── Radius slider ──────────────────────────────────────────────── */}
      <Fieldset
        anchor="E / RADIUS"
        title="Set the analysis radius."
        description="The geographic zone we scan for competitors and market signals. Drag the slider, or tap a tick mark to snap."
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
        anchor="F / REVIEW"
        title="Confirm and run."
        description="One last look before we generate your analysis."
      >
        <ReviewCard data={data} latitude={latitude} longitude={longitude} radiusMeters={radiusMeters} />
      </Fieldset>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StickyFooter>
        <HexButton onClick={() => setStep(1)} variant="outline">
          <ArrowLeft size={14} /> Back
        </HexButton>
        <HexButton onClick={handleSubmit} disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? "Analyzing…" : <>Run analysis <Sparkles size={14} /></>}
        </HexButton>
      </StickyFooter>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ReviewCard — striped rows, no borders
   ────────────────────────────────────────────────────────────────────── */
function ReviewCard({ data, latitude, longitude, radiusMeters }: {
  data: ReturnType<typeof useWizard>["data"];
  latitude: number | null; longitude: number | null; radiusMeters: number;
}) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: data.name || "—" },
    { label: "Category", value: data.category || "—" },
    { label: "Concept", value: data.concept || "—" },
    {
      label: "Products",
      value: data.products.length > 0
        ? data.products.map((p) => `${p.name} (${formatPrice(p.price)})`).join(" · ")
        : "—",
    },
    {
      label: "Goals",
      value: data.goals.length > 0
        ? data.goals.map((id) => STRATEGIC_GOALS.find((g) => g.id === id)?.label ?? id).join(" · ")
        : "—",
    },
    {
      label: "Location",
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
