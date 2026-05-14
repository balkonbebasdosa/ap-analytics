import { useState, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { PaletteScope } from "@/components/ui/PaletteScope";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { MonoInput, InputLabel } from "@/components/ui/wizard-primitives";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "register");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate("/welcome");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; errors?: Array<{ msg: string }> } } })?.response?.data;
      const msg = data?.error ?? data?.errors?.[0]?.msg;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaletteScope palette="green" as="div" className="paper-surface" style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Left brand panel — green-100 with pink accents ───────────────── */}
      <div
        className="auth-brand"
        style={{
          width: "50%",
          position: "relative",
          display: "none",
          flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          background: "var(--deep)",
          color: "var(--cream)",
          padding: "0 3rem",
        }}
      >
        {/* Floating sticker */}
        <div
          className="animate-float-sticky"
          style={{
            position: "absolute", top: "3rem", right: "2.5rem",
            background: "var(--bright)",
            color: "var(--deep)",
            borderRadius: 999,
            padding: "8px 18px",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase",
            transform: "rotate(4deg)",
          }}
        >
          gratis ✦
        </div>

        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <MonoLabel size="md" tone="current" letterSpacing="0.18em" style={{ color: "var(--bright)", marginBottom: "2rem", display: "block" }}>
            AP · Analytics
          </MonoLabel>
          <h1 className="font-display" style={{
            fontSize: "clamp(2.6rem, 5vw, 5rem)",
            fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.04em",
            color: "var(--cream)",
          }}>
            Angka yang berbicara.
          </h1>
          <p style={{
            marginTop: "1.6rem",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300, fontSize: "1.15rem", lineHeight: 1.45,
            color: "color-mix(in srgb, var(--cream) 78%, transparent)",
          }}>
            Lihat ke mana bisnis Anda benar-benar pergi, dan apa yang bisa Anda lakukan.
          </p>
        </div>

        {/* Bottom mini-card */}
        <div
          className="animate-float"
          style={{
            position: "absolute", bottom: "3rem", left: "2.5rem",
            background: "var(--bright)",
            color: "var(--deep)",
            borderRadius: 18,
            padding: "1.1rem 1.2rem",
            width: 180,
            transform: "rotate(-2deg)",
          }}
        >
          <MonoLabel size="xs" tone="current" style={{ color: "var(--deep)", opacity: 0.75 }}>BVI Score</MonoLabel>
          <div className="font-display" style={{
            fontSize: 44, fontWeight: 700, lineHeight: 1, marginTop: 6,
            letterSpacing: "-0.04em", color: "var(--deep)",
          }}>72</div>
          <MonoLabel size="xs" tone="current" style={{ color: "var(--deep)", opacity: 0.65, marginTop: 4, display: "block" }}>
            Highly viable
          </MonoLabel>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="paper-surface" style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--deep)", opacity: 0.7,
            textDecoration: "none", marginBottom: "2.6rem",
          }}>
            <ArrowLeft size={14} /> Back to home
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="display-xl" style={{ marginBottom: "0.6rem" }}>
                {isRegister ? "Create account." : "Welcome back."}
              </h2>
              <p className="serif-body" style={{
                color: "color-mix(in srgb, var(--deep) 70%, transparent)",
                marginBottom: "2rem",
              }}>
                {isRegister
                  ? "Start analyzing business locations with AI."
                  : "Sign in to your AP Analytics account."}
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
                {isRegister && (
                  <div>
                    <InputLabel required>Full name</InputLabel>
                    <MonoInput
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div>
                  <InputLabel required>Email</InputLabel>
                  <MonoInput
                    type="email"
                    placeholder="you@business.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <InputLabel required hint={isRegister ? "Minimum 8 characters." : undefined}>
                    Password
                  </InputLabel>
                  <div style={{ position: "relative" }}>
                    <MonoInput
                      type={showPassword ? "text" : "password"}
                      placeholder={isRegister ? "Min. 8 characters" : "Your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={isRegister ? 8 : 1}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--deep)", opacity: 0.55, padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{
                    background: "var(--bright)",
                    borderRadius: 14,
                    padding: "0.7rem 1rem",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 12, fontWeight: 600, letterSpacing: "-0.005em",
                    color: "var(--deep)",
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ marginTop: "0.6rem" }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      background: "var(--deep)",
                      color: "var(--bright)",
                      border: "none",
                      borderRadius: 999,
                      padding: "14px 22px",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 13, fontWeight: 700, letterSpacing: "-0.005em",
                      cursor: isLoading ? "default" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                      transition: "background 200ms",
                    }}
                    onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "color-mix(in srgb, var(--deep) 86%, var(--bright))"; }}
                    onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "var(--deep)"; }}
                  >
                    {isLoading
                      ? "Loading…"
                      : isRegister ? "Create account" : "Sign in"}
                  </button>
                </div>
              </form>

              <p style={{
                marginTop: "1.6rem", textAlign: "center",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11, letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--deep)", opacity: 0.65,
              }}>
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(""); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit",
                    textTransform: "inherit", fontWeight: 700,
                    color: "var(--deep)",
                    textDecoration: "underline",
                  }}
                >
                  {isRegister ? "Sign in" : "Sign up"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .auth-brand { display: flex !important; } }
      `}</style>
    </PaletteScope>
  );
}
