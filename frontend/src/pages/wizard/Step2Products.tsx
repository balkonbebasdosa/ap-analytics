import { useRef, useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { menuImportApi } from "@/lib/api";
import type { Product } from "@/types";
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, Loader2 } from "lucide-react";

// Local row carries a transient confidence flag from file import; it's stripped
// before the data is saved to the wizard. The flag clears once the user edits
// the row (i.e. they've reviewed it).
type Row = Product & { confidence?: "high" | "low" };

export default function Step2Products() {
  const { data, updateData, setStep } = useWizard();
  const [products, setProducts] = useState<Row[]>(
    data.products.length > 0 ? data.products : [{ name: "", price: 0 }]
  );
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addProduct = () => setProducts([...products, { name: "", price: 0 }]);

  const removeProduct = (i: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, idx) => idx !== i));
  };

  const updateProduct = (i: number, field: keyof Product, value: string | number) => {
    setProducts(
      products.map((p, idx) =>
        idx === i ? { ...p, [field]: value, confidence: undefined } : p
      )
    );
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setImporting(true);
    setError("");
    setWarnings([]);
    try {
      const { data: result } = await menuImportApi.upload(file);
      const imported: Row[] = result.items.map((item) => ({
        name: item.name,
        price: item.price,
        confidence: item.confidence,
      }));

      if (imported.length === 0) {
        setError("Tidak ada item menu yang ditemukan di file tersebut.");
        setWarnings(result.warnings);
        return;
      }

      // Replace the rows if the form is still untouched, otherwise append.
      const formIsEmpty = products.every((p) => !p.name.trim() && !p.price);
      setProducts(formIsEmpty ? imported : [...products, ...imported]);
      setWarnings(result.warnings);
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ??
        "Gagal mengimpor file. Coba lagi atau masukkan produk secara manual.";
      setError(message);
    } finally {
      setImporting(false);
    }
  };

  const handleNext = () => {
    const valid = products
      .filter((p) => p.name.trim() && p.price > 0)
      .map(({ name, price }) => ({ name, price }));
    if (valid.length === 0) {
      setError("Tambahkan setidaknya satu produk atau layanan dengan nama dan harga.");
      return;
    }
    updateData({ products: valid });
    setStep(3);
  };

  return (
    <div className="space-y-10">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Masukkan nama produk Anda!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftarkan produk/layanan utama dengan harga (IDR). Anda bisa menambahkan beberapa produk.
        </p>
      </div>

      {/* ── Import from file ────────────────────────────────────────────── */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.pdf"
          onChange={handleFileSelected}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          disabled={importing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-card-border bg-muted/40 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses file…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Impor menu dari file (CSV, Excel, atau PDF)
            </>
          )}
        </button>
        <p className="mt-1.5 text-xs text-muted-foreground/70">
          Kami akan membaca nama dan harga dari file. Periksa kembali hasilnya — baris kuning perlu
          dikonfirmasi.
        </p>
      </div>

      {/* ── Import warnings ─────────────────────────────────────────────── */}
      {warnings.length > 0 && (
        <div className="space-y-1 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          {warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </div>
      )}

      {/* ── Product rows ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {products.map((product, i) => {
          const lowConfidence = product.confidence === "low";
          return (
            <div key={i} className="group flex items-center gap-2">
              {/* Name */}
              <div
                className={`flex flex-1 items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground ${
                  lowConfidence ? "border-amber-400" : "border-card-border"
                }`}
              >
                <input
                  type="text"
                  placeholder={`Nama produk ${i + 1} — mis. Kopi Susu Spesial`}
                  value={product.name}
                  onChange={(e) => updateProduct(i, "name", e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/30" />
              </div>

              {/* Price */}
              <div
                className={`flex w-32 items-center rounded-2xl border bg-white px-3 py-3 shadow-sm transition-all focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground ${
                  lowConfidence ? "border-amber-400" : "border-card-border"
                }`}
              >
                <span className="mr-1.5 text-xs text-muted-foreground">Rp</span>
                <input
                  type="number"
                  placeholder="35000"
                  value={product.price || ""}
                  onChange={(e) => updateProduct(i, "price", Number(e.target.value))}
                  min={0}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Remove */}
              <button
                onClick={() => removeProduct(i)}
                disabled={products.length === 1}
                className="rounded-full p-2 text-muted-foreground/40 transition-colors hover:text-destructive disabled:opacity-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Add row ─────────────────────────────────────────────────────── */}
      <button
        onClick={addProduct}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-card-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Tambah item lain
      </button>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 rounded-full border border-card-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
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
