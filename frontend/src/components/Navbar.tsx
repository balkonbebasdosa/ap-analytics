import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface NavbarProps {
  consultLabel?: string;
}

export default function Navbar({ consultLabel }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isHistory   = location.pathname === "/history";
  const isWelcome   = location.pathname === "/welcome";
  const isDashboard = location.pathname.startsWith("/dashboard");

  const linkBase: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "0.78rem", fontWeight: 600,
    letterSpacing: "0.02em",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: 999,
    transition: "background 200ms, color 200ms",
  };
  const activeStyle: React.CSSProperties = {
    background: "var(--deep)",
    color: "var(--bright)",
  };
  const inactiveStyle: React.CSSProperties = {
    background: "transparent",
    color: "var(--deep)",
    opacity: 0.65,
  };

  return (
    <nav
      className="paper-surface"
      style={{ position: "sticky", top: 0, zIndex: 50, padding: "0.7rem 0" }}
    >
      <div className="container">
        <div
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

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Link to="/survey" style={{ ...linkBase, ...(isDashboard ? activeStyle : inactiveStyle) }}>
                {consultLabel ?? (isDashboard ? "Konsultasi" : "Konsultasi baru")}
              </Link>
              <Link to="/welcome" style={{ ...linkBase, ...(isWelcome ? activeStyle : inactiveStyle) }}>
                Profil
              </Link>
              <Link to="/history" style={{ ...linkBase, ...(isHistory ? activeStyle : inactiveStyle) }}>
                Riwayat
              </Link>

              <span style={{
                marginLeft: 6, paddingLeft: 12,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11, fontWeight: 500, letterSpacing: 0,
                color: "var(--deep)", opacity: 0.55,
                display: "none",
              }} className="sm-show">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                aria-label="Keluar"
                style={{
                  marginLeft: 4, background: "transparent", border: "none",
                  cursor: "pointer", padding: 6, borderRadius: 999,
                  color: "var(--deep)", opacity: 0.55,
                  transition: "background 200ms, opacity 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bright)"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.55"; }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) { .sm-show { display: inline-block !important; } }
      `}</style>
    </nav>
  );
}
