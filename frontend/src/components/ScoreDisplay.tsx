import type { ScoreBreakdown } from "@/types";
import { getScoreLabel, getScoreTier } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  breakdown: ScoreBreakdown;
  summary: string;
}

const METRICS: { key: keyof ScoreBreakdown; label: string; desc: string }[] = [
  {
    key:   "marketDemand",
    label: "Permintaan pasar",
    desc:  "Kepadatan populasi, lalu lintas pejalan kaki, dan perilaku pembelian dalam radius Anda.",
  },
  {
    key:   "locationAppeal",
    label: "Daya tarik lokasi",
    desc:  "Visibilitas jalan, akses transportasi, arus pejalan kaki, dan perdagangan di sekitar.",
  },
  {
    key:   "conceptUniqueness",
    label: "Keunikan konsep",
    desc:  "Seberapa berbeda konsep Anda dibandingkan pesaing di sekitar.",
  },
  {
    key:   "competitionDensity",
    label: "Kepadatan pesaing",
    desc:  "Jumlah, kedekatan, dan penilaian bisnis yang bersaing dalam radius Anda.",
  },
];

const SUMMARY_TRANSLATIONS: Record<string, string> = {
  "A low-cost model faces significant hurdles here due to intense price competition or insufficient market volume. You must aggressively optimize your supply chain and consider relocating to a higher-traffic area to survive.":
    "Model harga terjangkau menghadapi hambatan besar di lokasi ini karena persaingan harga yang ketat atau volume pasar yang belum cukup. Anda perlu mengoptimalkan rantai pasok secara agresif dan mempertimbangkan lokasi dengan lalu lintas yang lebih tinggi.",
  "Your value-based concept has moderate potential, but margins will be tight. Success depends on achieving high daily turnover and keeping overhead expenses strictly controlled.":
    "Konsep berbasis nilai memiliki potensi sedang, tetapi margin akan cukup tipis. Keberhasilan bergantung pada perputaran harian yang tinggi dan pengendalian biaya operasional yang ketat.",
  "Your low-cost model is highly viable in this area due to strong market demand and favorable demographic indicators. Focus on high-volume sales and operational efficiency to maximize your margins against nearby competitors.":
    "Model harga terjangkau sangat layak di area ini berkat permintaan pasar yang kuat dan indikator demografis yang mendukung. Fokus pada volume penjualan tinggi dan efisiensi operasional untuk memaksimalkan margin dibanding pesaing sekitar.",
  "The local demographics and current market density do not support a premium pricing strategy at this location. You risk severe underperformance unless you pivot to a more accessible price point or find a more affluent neighborhood.":
    "Demografi lokal dan kepadatan pasar saat ini belum mendukung strategi harga premium di lokasi ini. Risiko performa rendah cukup besar kecuali Anda beralih ke harga yang lebih terjangkau atau mencari kawasan dengan daya beli lebih tinggi.",
  "A high-end concept can survive here if you deliver exceptional, differentiated quality that justifies the price premium. Heavy investment in targeted marketing and customer experience will be essential to draw the right demographic.":
    "Konsep premium masih bisa bertahan di sini jika Anda menawarkan kualitas yang sangat berbeda dan sepadan dengan harga lebih tinggi. Investasi kuat pada pemasaran tertarget dan pengalaman pelanggan akan penting untuk menarik segmen yang tepat.",
  "This location is perfectly primed for a premium business model. High location appeal and affluent local indicators suggest customers are willing to pay a premium for superior quality and exclusivity.":
    "Lokasi ini sangat siap untuk model bisnis premium. Daya tarik lokasi yang tinggi dan indikator daya beli sekitar menunjukkan pelanggan berpotensi membayar lebih untuk kualitas unggul dan eksklusivitas.",
  "Fast service relies on massive foot traffic, which this location severely lacks. The current competition density and low demand scores indicate this model will struggle to achieve the volume necessary for profitability.":
    "Layanan cepat membutuhkan arus pengunjung yang besar, sementara lokasi ini masih kekurangan hal tersebut. Kepadatan pesaing dan skor permintaan yang rendah menunjukkan model ini akan sulit mencapai volume yang dibutuhkan untuk profitabilitas.",
  "A quick-turnaround model is viable here, provided you can capture the peak-hour rush effectively. Streamlining your operations and offering convenient grab-and-go options will be the key to outperforming local competitors.":
    "Model layanan cepat cukup layak di sini jika Anda mampu menangkap jam ramai secara efektif. Merampingkan operasional dan menawarkan opsi praktis siap ambil akan menjadi kunci untuk mengungguli pesaing lokal.",
  "Exceptional conditions exist for a high-speed service model in this high-traffic area. The demand profile indicates a strong need for quick, reliable service, making this an ideal spot to maximize daily transaction volume.":
    "Kondisi area ini sangat mendukung model layanan cepat dengan lalu lintas tinggi. Profil permintaan menunjukkan kebutuhan kuat terhadap layanan yang cepat dan andal, sehingga lokasi ini ideal untuk memaksimalkan volume transaksi harian.",
  "The market demand for your highly specialized concept is dangerously low in this area. Without a broader appeal or a dedicated destination-shopper base, this location will likely lead to stagnation.":
    "Permintaan pasar untuk konsep yang sangat spesifik masih terlalu rendah di area ini. Tanpa daya tarik yang lebih luas atau basis pelanggan tujuan yang kuat, lokasi ini berisiko membuat bisnis stagnan.",
  "Your niche concept has a fighting chance if you can build a strong, loyal community around your specific offering. You will need to rely heavily on digital marketing to pull customers from outside the immediate walking radius.":
    "Konsep niche Anda masih punya peluang jika mampu membangun komunitas yang loyal di sekitar penawaran spesifik tersebut. Anda perlu sangat mengandalkan pemasaran digital untuk menarik pelanggan dari luar radius jalan kaki terdekat.",
  "The data shows a massive gap in the market perfectly suited for your specialized business. The lack of direct competitors and high uniqueness score means you can quickly establish a monopoly in your specific niche.":
    "Data menunjukkan celah pasar besar yang sangat cocok untuk bisnis spesialis Anda. Minimnya pesaing langsung dan skor keunikan yang tinggi membuat Anda berpeluang cepat mendominasi niche tersebut.",
  "While admirable, the local market indicators suggest consumers here are highly price-sensitive and may not pay the premium associated with sustainable practices. Consider softening the eco-angle in favor of pure value to gain traction.":
    "Meskipun positif, indikator pasar lokal menunjukkan konsumen di sini sangat sensitif terhadap harga dan mungkin belum siap membayar lebih untuk praktik berkelanjutan. Pertimbangkan untuk menonjolkan nilai utama terlebih dahulu agar lebih mudah mendapat traksi.",
  "Sustainability is a nice-to-have in this market, but it cannot be your only selling point. You must ensure your core product quality and pricing remain competitive with traditional businesses nearby to maintain steady revenue.":
    "Keberlanjutan dapat menjadi nilai tambah di pasar ini, tetapi tidak bisa menjadi satu-satunya alasan pembelian. Pastikan kualitas produk inti dan harga tetap kompetitif dibanding bisnis tradisional di sekitar.",
  "This area shows strong alignment with progressive, eco-conscious consumer trends. Your sustainable concept will serve as a massive differentiator, allowing you to capture a dedicated demographic willing to support green initiatives.":
    "Area ini menunjukkan kecocokan kuat dengan tren konsumen yang progresif dan peduli lingkungan. Konsep berkelanjutan Anda dapat menjadi pembeda besar dan menarik segmen pelanggan yang siap mendukung inisiatif hijau.",
  "The local market does not display the early-adopter traits necessary to support a highly innovative or tech-heavy concept. You may face significant friction in customer education and adoption at this specific location.":
    "Pasar lokal belum menunjukkan karakter early adopter yang dibutuhkan untuk mendukung konsep yang sangat inovatif atau berbasis teknologi. Anda mungkin menghadapi hambatan besar dalam edukasi dan adopsi pelanggan di lokasi ini.",
  "Your tech-driven approach could streamline operations, but the customer-facing innovation might take time to catch on. Focus on using your tech to lower operational costs while keeping the user experience as familiar and accessible as possible.":
    "Pendekatan berbasis teknologi dapat merampingkan operasional, tetapi inovasi yang langsung dirasakan pelanggan mungkin butuh waktu untuk diterima. Fokuskan teknologi untuk menurunkan biaya operasional sambil menjaga pengalaman pengguna tetap familiar dan mudah diakses.",
  "The local demographic is highly receptive to modern, tech-forward business models. Your innovative approach will easily disrupt the traditional competitors in the area and attract a modern, convenience-seeking customer base.":
    "Demografi lokal sangat terbuka terhadap model bisnis modern berbasis teknologi. Pendekatan inovatif Anda berpotensi mengganggu pesaing tradisional di area ini dan menarik pelanggan modern yang mencari kemudahan.",
  "The current market indicators suggest significant challenges for this location. High competition or low demand means you must carefully reevaluate your business strategy before proceeding.":
    "Indikator pasar saat ini menunjukkan tantangan besar untuk lokasi ini. Persaingan tinggi atau permintaan rendah berarti Anda perlu mengevaluasi ulang strategi bisnis dengan cermat sebelum melanjutkan.",
  "This location presents a moderate opportunity with a balanced risk profile. Success will depend heavily on strong operational execution and clear differentiation from existing competitors.":
    "Lokasi ini menawarkan peluang sedang dengan profil risiko yang cukup seimbang. Keberhasilan akan sangat bergantung pada eksekusi operasional yang kuat dan diferensiasi yang jelas dari pesaing yang sudah ada.",
  "The data indicates highly favorable conditions for a new business in this area. Strong demand and manageable competition provide an excellent foundation for immediate growth and profitability.":
    "Data menunjukkan kondisi yang sangat mendukung untuk bisnis baru di area ini. Permintaan yang kuat dan persaingan yang masih terkendali memberi fondasi baik untuk pertumbuhan dan profitabilitas awal.",
};

function localizeSummary(summary: string) {
  const trimmed = summary.trim();
  if (SUMMARY_TRANSLATIONS[trimmed]) return SUMMARY_TRANSLATIONS[trimmed];
  if (/\b(the|your|this|market|location|competition|pricing|business)\b/i.test(trimmed)) {
    return "Indikator pasar untuk lokasi ini perlu dievaluasi dengan cermat. Perhatikan permintaan sekitar, kepadatan pesaing, daya tarik lokasi, dan keunikan konsep sebelum mengambil keputusan bisnis.";
  }
  return summary;
}

/* ──────────────────────────────────────────────────────────────────────────
   Big colored hero panel (Shelby calculator card translation)
   ────────────────────────────────────────────────────────────────────── */
function ScoreHero({ score }: { score: number }) {
  const tier = getScoreTier(score);

  return (
    <div style={{
      background: tier.panel,
      borderRadius: 28,
      padding: "clamp(3rem, 6vw, 5.5rem) clamp(1.6rem, 4vw, 3.5rem)",
      position: "relative",
      transition: "background 0.3s var(--transition-color-easing)",
    }}>
      {/* Mono eyebrow */}
      <div style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: tier.ink, opacity: 0.7,
      }}>
        Indeks Kelayakan Bisnis
      </div>

      {/* Massive score */}
      <div style={{
        marginTop: "1.5rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "clamp(7rem, 18vw, 14rem)",
        fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.05em",
        color: tier.ink,
        display: "flex", alignItems: "baseline", gap: "0.4rem",
      }}>
        <span>{score}</span>
        <span style={{
          fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
          fontWeight: 500, opacity: 0.55,
        }}>/100</span>
      </div>

      <div style={{
        marginTop: "1rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: tier.ink, opacity: 0.85,
      }}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Horizontal metric bar — mono label left, fill, mono number right
   ────────────────────────────────────────────────────────────────────── */
function MetricBar({ label, desc, value, accent, stripeAlt }: {
  label: string; desc: string; value: number; accent?: boolean; stripeAlt?: boolean;
}) {
  return (
    <div
      className="compartment-inner"
      style={{
        padding: "1.3rem 1.4rem",
        background: stripeAlt ? "var(--soft)" : "var(--cream)",
        borderRadius: 16,
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1rem", alignItems: "baseline",
        marginBottom: "0.9rem",
      }}>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--deep)",
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em",
          lineHeight: 1, color: "var(--deep)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {value}
          <span style={{ fontSize: "0.95rem", opacity: 0.5, marginLeft: 4 }}>/100</span>
        </div>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${accent ? "score-bar-fill--accent" : ""}`}
          style={{ transform: `scaleX(${value / 100})` }}
        />
      </div>
      <p style={{
        marginTop: "0.8rem",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 400, fontSize: "0.92rem", lineHeight: 1.5,
        color: "color-mix(in srgb, var(--deep) 70%, transparent)",
        maxWidth: 640,
      }}>
        {desc}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ScoreDisplay
   ────────────────────────────────────────────────────────────────────── */
export default function ScoreDisplay({ score, breakdown, summary }: ScoreDisplayProps) {
  const maxValue = Math.max(...METRICS.map((m) => breakdown[m.key]));
  const localizedSummary = localizeSummary(summary);

  return (
    <div className="compartment-stack" style={{ gap: "0.8rem" }}>
      <ScoreHero score={score} />

      {/* Metric bars — striped compartment-inner panels */}
      <div className="compartment-inner" style={{ padding: "0.6rem", background: "var(--mist)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {METRICS.map((m, i) => (
            <MetricBar
              key={m.key}
              label={m.label}
              desc={m.desc}
              value={breakdown[m.key]}
              /* Strongest metric gets the bright pop — single highlight */
              accent={breakdown[m.key] === maxValue}
              stripeAlt={i % 2 === 1}
            />
          ))}
        </div>
      </div>

      {/* Market insight panel — the rare deep-emphasis moment */}
      <div
        className="compartment-deep"
        style={{
          padding: "clamp(1.8rem, 4vw, 2.8rem) clamp(1.6rem, 4vw, 3rem)",
        }}>
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--bright)",
          marginBottom: "1rem",
        }}>
          Wawasan pasar
        </div>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 500, fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
          lineHeight: 1.55, letterSpacing: "-0.005em",
          color: "var(--cream)", margin: 0, maxWidth: 800,
        }}>
          {localizedSummary}
        </p>
      </div>
    </div>
  );
}
