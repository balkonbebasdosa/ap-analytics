import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { BUSINESS_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  "Food & Beverage": "🍽️",
  Retail:            "🛍️",
  Beauty:            "💅",
  Health:            "🏥",
  Education:         "📚",
  Entertainment:     "🎭",
  Services:          "🔧",
  Technology:        "💻",
};

export default function Step1Category() {
  const { data, updateData, setStep } = useWizard();
  const [name, setName]       = useState(data.name);
  const [category, setCategory] = useState(data.category);
  const [concept, setConcept] = useState(data.concept);
  const [error, setError]     = useState("");

  const handleNext = () => {
    if (!name.trim())    { setError("Harap masukkan nama bisnis Anda."); return; }
    if (!category)       { setError("Harap pilih kategori bisnis."); return; }
    if (!concept.trim()) { setError("Harap deskripsikan konsep bisnis Anda."); return; }
    updateData({ name: name.trim(), category, concept: concept.trim() });
    setStep(2);
  };

  return (
    <div className="space-y-10">
      {/* ── Business name ──────────────────────────────────────────────── */}
      <div>
        <label className="mb-2 block text-lg font-bold text-foreground">
          Masukkan nama bisnis Anda!
        </label>
        <p className="mb-3 text-sm text-muted-foreground">
          Masukkan nama yang Anda atau orang lain gunakan untuk bisnis ini.
        </p>
        <div className="flex items-center gap-2 rounded-2xl border border-card-border bg-white px-4 py-3 shadow-sm focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground transition-all">
          <input
            type="text"
            placeholder="e.g. Warung Kopi Nusantara"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button
            onClick={handleNext}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Category ───────────────────────────────────────────────────── */}
      <div>
        <label className="mb-3 block text-lg font-bold text-foreground">
          Pilih kategori bisnis Anda
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 text-center text-sm font-medium transition-all",
                category === cat
                  ? "border-foreground bg-foreground text-white shadow-sm"
                  : "border-card-border bg-white text-muted-foreground hover:border-foreground/30"
              )}
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat] || "🏢"}</span>
              <span className="leading-tight text-xs">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Concept ────────────────────────────────────────────────────── */}
      <div>
        <label className="mb-2 block text-lg font-bold text-foreground">
          Deskripsikan konsep bisnis Anda
        </label>
        <p className="mb-3 text-sm text-muted-foreground">
          Deskripsikan bisnis Anda dalam 2–3 kalimat — sejelasnya.
        </p>
        <textarea
          placeholder='mis. "Kedai kopi spesialti yang berfokus pada biji kopi single-origin Indonesia dengan suasana co-working yang nyaman..."'
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-2xl border border-card-border bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          Lanjutkan <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
