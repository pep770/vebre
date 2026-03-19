import { useState, useEffect } from "react";

const LISTINGS = [
  {
    id: "l1", title: "Luxusní penthouse s výhledem na Prahu",
    address: "Mánesova 28, Praha 2 - Vinohrady", city: "Praha", district: "Vinohrady",
    propertyType: "APARTMENT", bedrooms: 4, bathrooms: 2, internalSize: 180, yearBuilt: 2020,
    hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: true,
    askingPrice: 28500000, reservationFee: 50000, aiValuation: 29200000, aiConfidence: 0.91,
    aiRange: { low: 27500000, high: 30500000 }, marketTrend: "rising", daysOnMarket: 14,
    viewCount: 847, savedCount: 63,
    description: "Výjimečný penthouse v srdci Vinohrad s panoramatickým výhledem na Pražský hrad. Prostorný open-plan obývací prostor s prémiovým vybavením, kuchyní Bulthaup a terasou 60 m².",
    features: ["Terasa 60m²", "Výhled na Hrad", "Garáž", "Recepce", "Klimatizace"],
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    imgs: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
    seller: { anonymousId: "SLR-7291", memberSince: "2021", successRate: 94 },
    aiFactors: [{ factor: "Lokalita Vinohrady", impact: "positive", score: 96 }, { factor: "Novostavba 2020", impact: "positive", score: 91 }, { factor: "Výhled na Hrad", impact: "positive", score: 88 }, { factor: "Rostoucí trh", impact: "positive", score: 84 }],
    comparables: [{ address: "Blanická 12, Praha 2", price: 27800000, sold: "Nov 2024", beds: 4, size: 175 }, { address: "Mánesova 44, Praha 2", price: 30100000, sold: "Říj 2024", beds: 4, size: 195 }, { address: "Korunní 18, Praha 2", price: 26900000, sold: "Pro 2024", beds: 3, size: 165 }],
  },
  {
    id: "l2", title: "Historický byt v činžovním domě",
    address: "Nerudova 15, Praha 1 - Malá Strana", city: "Praha", district: "Malá Strana",
    propertyType: "APARTMENT", bedrooms: 3, bathrooms: 2, internalSize: 145, yearBuilt: 1898,
    hasGarden: false, hasPool: false, hasGarage: false, hasBalcony: true,
    askingPrice: 19500000, reservationFee: 50000, aiValuation: 18750000, aiConfidence: 0.84,
    aiRange: { low: 17900000, high: 19900000 }, marketTrend: "stable", daysOnMarket: 31,
    viewCount: 512, savedCount: 41,
    description: "Jedinečný byt v historickém domě na Malé Straně. Zachované původní prvky — stropy s štuky, parkety, kachlová kamna — v kombinaci s moderní kuchyní a koupelnou. Výhled na Pražský hrad.",
    features: ["Historické prvky", "Výhled na Hrad", "Štuková výzdoba", "Parketové podlahy", "Balkón"],
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    imgs: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
    seller: { anonymousId: "SLR-4482", memberSince: "2020", successRate: 88 },
    aiFactors: [{ factor: "Lokalita Malá Strana", impact: "positive", score: 94 }, { factor: "Historická hodnota", impact: "positive", score: 87 }, { factor: "Stav nemovitosti", impact: "neutral", score: 72 }, { factor: "Stabilní trh", impact: "neutral", score: 71 }],
    comparables: [{ address: "Thunovská 8, Praha 1", price: 19200000, sold: "Říj 2024", beds: 3, size: 138 }, { address: "Tržiště 22, Praha 1", price: 20500000, sold: "Zář 2024", beds: 3, size: 155 }, { address: "Karmelitská 31, Praha 1", price: 18400000, sold: "Lis 2024", beds: 3, size: 142 }],
  },
  {
    id: "l3", title: "Moderní vila se zahradou",
    address: "Na Hřebenkách 48, Praha 5 - Smíchov", city: "Praha", district: "Smíchov",
    propertyType: "HOUSE", bedrooms: 5, bathrooms: 3, internalSize: 320, yearBuilt: 2018,
    hasGarden: true, hasPool: true, hasGarage: true, hasBalcony: true,
    askingPrice: 42000000, reservationFee: 50000, aiValuation: 43500000, aiConfidence: 0.89,
    aiRange: { low: 40500000, high: 45500000 }, marketTrend: "rising", daysOnMarket: 7,
    viewCount: 1203, savedCount: 89,
    description: "Reprezentativní vila v žádané rezidenční lokalitě Praha 5. Moderní architektura, bazén, zahrada 800 m², garážové stání pro 2 auta. Perfektní stav, ihned k nastěhování.",
    features: ["Zahrada 800m²", "Bazén", "Dvojgaráž", "Smart Home", "Sauna"],
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    imgs: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
    seller: { anonymousId: "SLR-9834", memberSince: "2022", successRate: 97 },
    aiFactors: [{ factor: "Prémiová lokalita Praha 5", impact: "positive", score: 93 }, { factor: "Novostavba 2018", impact: "positive", score: 91 }, { factor: "Bazén a zahrada", impact: "positive", score: 89 }, { factor: "Rostoucí trh vil", impact: "positive", score: 86 }],
    comparables: [{ address: "Na Hřebenkách 32, Praha 5", price: 40200000, sold: "Lis 2024", beds: 5, size: 298 }, { address: "Stroupežnického 12, Praha 5", price: 44800000, sold: "Říj 2024", beds: 5, size: 340 }, { address: "Holečkova 22, Praha 5", price: 39500000, sold: "Pro 2024", beds: 4, size: 285 }],
  },
  {
    id: "l4", title: "Designový loft v bývalé továrně",
    address: "Dělnická 33, Praha 7 - Holešovice", city: "Praha", district: "Holešovice",
    propertyType: "APARTMENT", bedrooms: 2, bathrooms: 1, internalSize: 120, yearBuilt: 2015,
    hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: false,
    askingPrice: 11800000, reservationFee: 50000, aiValuation: 12200000, aiConfidence: 0.86,
    aiRange: { low: 11400000, high: 12900000 }, marketTrend: "rising", daysOnMarket: 22,
    viewCount: 694, savedCount: 57,
    description: "Unikátní loft v revitalizované továrně v trendy Holešovicích. Původní cihlové stěny, ocelové sloupy, stropy 4,5m. Garáž v ceně. V docházkové vzdálenosti od Náměstí Republiky.",
    features: ["Stropy 4,5m", "Původní cihly", "Ocelové prvky", "Garáž", "Trendy lokalita"],
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    imgs: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80"],
    seller: { anonymousId: "SLR-3317", memberSince: "2023", successRate: 100 },
    aiFactors: [{ factor: "Holešovice – rostoucí čtvrť", impact: "positive", score: 92 }, { factor: "Unikátní charakter", impact: "positive", score: 88 }, { factor: "Revitalizace 2015", impact: "positive", score: 83 }, { factor: "Bez balkónu", impact: "negative", score: 58 }],
    comparables: [{ address: "Komunardů 18, Praha 7", price: 11600000, sold: "Zář 2024", beds: 2, size: 115 }, { address: "Jateční 22, Praha 7", price: 12800000, sold: "Srp 2024", beds: 2, size: 128 }, { address: "Výstaviště 4, Praha 7", price: 11200000, sold: "Lis 2024", beds: 2, size: 112 }],
  },
];

const SELLER_LISTINGS = [LISTINGS[0], LISTINGS[2]];
const BUYER_OFFERS = [
  { id: "o1", listing: LISTINGS[1], amount: 18200000, status: "PENDING", aiTip: "Zvažte navýšení na 18,8M — data trhu naznačují rezervu prodávajícího kolem 18,5M Kč.", createdAt: "2025-01-08" },
  { id: "o2", listing: LISTINGS[3], amount: 11500000, status: "ACCEPTED", aiTip: "Silná nabídka. Nemovitost je na trhu 22 dní — prodávající je pravděpodobně motivovaný.", createdAt: "2025-01-05" },
];

const ALL_ACTIVITY = [
  { id: 1, type: "offer", buyer: "BYR-4471", seller: "SLR-7291", listing: LISTINGS[0].title, amount: 26800000, status: "PENDING", date: "2025-01-10" },
  { id: 2, type: "reservation", buyer: "BYR-9203", seller: "SLR-4482", listing: LISTINGS[1].title, amount: 50000, status: "PAID", date: "2025-01-08" },
  { id: 3, type: "offer", buyer: "BYR-1188", seller: "SLR-9834", listing: LISTINGS[2].title, amount: 40500000, status: "ACCEPTED", date: "2025-01-07" },
  { id: 4, type: "viewing", buyer: "BYR-5521", seller: "SLR-3317", listing: LISTINGS[3].title, amount: null, status: "CONFIRMED", date: "2025-01-09" },
  { id: 5, type: "offer", buyer: "BYR-7732", seller: "SLR-7291", listing: LISTINGS[0].title, amount: 27200000, status: "PENDING", date: "2025-01-11" },
];

const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M Kč` : `${(n / 1e3).toFixed(0)}K Kč`;
const fmtFull = (n) => `${n.toLocaleString("cs-CZ")} Kč`;
const D = { fontFamily: "'Playfair Display', Georgia, serif" };

const Badge = ({ children, color = "stone" }) => {
  const c = { stone: ["#e7e3dc", "#555"], green: ["#d1fae5", "#065f46"], amber: ["#fef3c7", "#92400e"], blue: ["#dbeafe", "#1e40af"], red: ["#fee2e2", "#991b1b"], purple: ["#ede9fe", "#5b21b6"] };
  const [bg, tx] = c[color] || c.stone;
  return <span style={{ background: bg, color: tx, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{children}</span>;
};

const Btn = ({ children, onClick, variant = "dark", small, full, disabled }) => {
  const v = { dark: { background: "#1a1a1a", color: "#fff", border: "none" }, outline: { background: "transparent", color: "#1a1a1a", border: "1.5px solid #1a1a1a" }, ghost: { background: "transparent", color: "#777", border: "1.5px solid #ddd" }, gold: { background: "#C9A84C", color: "#fff", border: "none" } };
  return <button onClick={onClick} disabled={disabled} style={{ ...(v[variant] || v.dark), borderRadius: 10, padding: small ? "8px 16px" : "12px 24px", fontSize: small ? 13 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : undefined, fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{children}</button>;
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} onMouseEnter={onClick ? e => e.currentTarget.style.transform = "translateY(-2px)" : undefined} onMouseLeave={onClick ? e => e.currentTarget.style.transform = "translateY(0)" : undefined}
    style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", overflow: "hidden", cursor: onClick ? "pointer" : undefined, transition: "all 0.2s", ...style }}>
    {children}
  </div>
);

const AIBadge = () => <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1a1a1a", color: "#C9A84C", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>✦ AI</span>;

const ScoreRing = ({ score, size = 64 }) => {
  const color = score >= 70 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626";
  const c = size / 2, r = c - 5, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#f0ede8" strokeWidth={5} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} />
      <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: size * 0.26, fontWeight: 700, fill: color, fontFamily: "'DM Sans', sans-serif" }}>{score}</text>
    </svg>
  );
};

const Nav = ({ setPage, user, setUser }) => (
  <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,244,239,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ede9e3", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
    <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{ width: 30, height: 30, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#C9A84C", fontWeight: 900, fontSize: 14, fontFamily: "'Playfair Display', serif" }}>V</span>
      </div>
      <span style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>VEBRE</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, color: "#666" }}>
      <span onClick={() => setPage("listings")} style={{ cursor: "pointer", fontWeight: 500 }}>Nabídka</span>
      {user && <span onClick={() => setPage(user.role === "SELLER" ? "seller-dash" : user.role === "ADMIN" ? "admin-dash" : "buyer-dash")} style={{ cursor: "pointer", fontWeight: 500 }}>Dashboard</span>}
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#999" }}>{user.role === "BUYER" ? "Kupující" : user.role === "SELLER" ? "Prodávající" : "Admin"}</div>
          </div>
          <div onClick={() => { setUser(null); setPage("home"); }} style={{ width: 34, height: 34, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.name[0]}</div>
        </div>
      ) : (
        <><Btn variant="ghost" small onClick={() => setPage("login")}>Přihlásit se</Btn><Btn small onClick={() => setPage("register")}>Začít</Btn></>
      )}
    </div>
  </nav>
);

const HomePage = ({ setPage }) => {
  const [vi, setVi] = useState({ beds: 3, type: "APARTMENT" });
  const [vr, setVr] = useState(null);
  const [vl, setVl] = useState(false);
  const runVal = () => {
    setVl(true); setVr(null);
    setTimeout(() => {
      const base = { APARTMENT: 12000000, HOUSE: 28000000, OFFICE: 18000000 };
      const b = base[vi.type] || 12000000;
      const v = Math.round(b * (0.8 + vi.beds * 0.12));
      setVr({ value: v, confidence: 0.89, low: Math.round(v * 0.91), high: Math.round(v * 1.1) });
      setVl(false);
    }, 1400);
  };
  return (
    <div>
      <div style={{ padding: "52px 32px 40px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 99, marginBottom: 28, letterSpacing: "0.05em" }}>✦ REALITNÍ PLATFORMA NOVÉ GENERACE</div>
        <h1 style={{ ...D, fontSize: "clamp(38px,5vw,72px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 24px", color: "#0f0f0f" }}>Kupujte a prodávejte<br /><span style={{ color: "#C9A84C" }}>chytřeji.</span></h1>
        <p style={{ fontSize: 22, color: "#666", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.5, fontWeight: 500 }}>Poloviční provize&nbsp;&nbsp;|&nbsp;&nbsp;Prověření kupující&nbsp;&nbsp;|&nbsp;&nbsp;Absolutní transparentnost.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => setPage("register-seller")}>Nabídnout nemovitost</Btn>
          <Btn variant="outline" onClick={() => setPage("register")}>Hledám nemovitost</Btn>
        </div>
      </div>

      <div style={{ background: "#f7f4ef", borderTop: "1px solid #ede9e3", borderBottom: "1px solid #ede9e3", padding: "28px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { icon: "💰", title: "O 50 % nižší provize", desc: "Ušetříte stovky tisíc. Cena jasně daná předem." },
            { icon: "📊", title: "Plná transparentnost", desc: "Máte přehled o každém kroku prodeje — od prohlídek po konkrétní nabídky." },
            { icon: "✅", title: "Jen prověření kupující", desc: "Jednáte pouze s reálnými zájemci." },
          ].map(f => (
            <div key={f.title} style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ ...D, fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#0f0f0f" }}>{f.title}</h3>
              <p style={{ color: "#777", lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#1a1a1a", padding: "64px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}><AIBadge /><h2 style={{ ...D, color: "#fff", fontSize: 32, margin: "14px 0 8px" }}>AI Ocenění zdarma</h2><p style={{ color: "#888", fontSize: 14 }}>Okamžitý odhad — bez registrace</p></div>
          <Card style={{ background: "#252525", border: "1px solid #333" }}>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
              {[{ label: "POČET POKOJŮ", key: "beds", opts: [1, 2, 3, 4, 5] }, { label: "TYP", key: "type", opts: ["APARTMENT", "HOUSE", "OFFICE"] }].map(f => (
                <div key={f.key}>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 6, fontWeight: 600 }}>{f.label}</div>
                  <select value={vi[f.key]} onChange={e => setVi({ ...vi, [f.key]: f.key === "beds" ? +e.target.value : e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "#333", color: "#fff", border: "1px solid #444", fontSize: 14 }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <Btn onClick={runVal} disabled={vl}>{vl ? "Počítám…" : "Odhadnout →"}</Btn>
            </div>
            {(vl || vr) && (
              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ height: 1, background: "#333", marginBottom: 20 }} />
                {vl ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ display: "inline-block", width: 26, height: 26, border: "3px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <div style={{ color: "#888", marginTop: 10, fontSize: 13 }}>AI model analyzuje trh…</div>
                  </div>
                ) : vr && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                    <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>ODHADOVANÁ CENA</div><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{fmt(vr.value)}</div><div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>Rozsah: {fmt(vr.low)} – {fmt(vr.high)}</div></div>
                    <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>{Math.round(vr.confidence * 100)}%</div><div style={{ marginTop: 8, height: 4, background: "#333", borderRadius: 4 }}><div style={{ width: `${vr.confidence * 100}%`, height: "100%", background: "#059669", borderRadius: 4 }} /></div></div>
                    <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>TREND TRHU</div><div style={{ color: "#34d399", fontSize: 20, fontWeight: 700 }}>↗ Rostoucí</div><div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>Vhodný čas k prodeji</div></div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ ...D, fontSize: 36, fontWeight: 800, textAlign: "center", marginBottom: 48 }}>Jak VEBRE funguje</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[{ n: "01", title: "Procházejte anonymně", desc: "Plná data o nemovitosti. Identity kupujících i prodávajících skryty — vidíte jen AI skóre.", icon: "👁️" }, { n: "02", title: "Nabídněte s AI asistencí", desc: "Podávejte nabídky podložené daty. AI navrhne částku, odhadne šanci na úspěch a poradí strategii.", icon: "✦" }, { n: "03", title: "Rezervace odhalí identitu", desc: "Zaplaťte rezervační poplatek 50 000 Kč převodem na účet. Okamžitě se odhalí obě identity.", icon: "🔓" }].map(s => (
            <Card key={s.n} style={{ padding: 32 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", marginBottom: 8 }}>{s.n}</div>
              <h3 style={{ ...D, fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#0f0f0f" }}>{s.title}</h3>
              <p style={{ color: "#777", lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 32px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ ...D, fontSize: 28, fontWeight: 800 }}>Vybrané nemovitosti v Praze</h2>
          <Btn variant="outline" small onClick={() => setPage("listings")}>Zobrazit vše →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {LISTINGS.slice(0, 3).map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}
        </div>
      </div>

      <div style={{ background: "#1a1a1a", padding: "44px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>🔒</div>
          <h2 style={{ ...D, color: "#fff", fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Identita chráněna<br /><span style={{ color: "#C9A84C" }}>až do rezervace</span></h2>
          <p style={{ color: "#888", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>Jméno, email ani telefon nejsou sdíleny, dokud není uhrazen rezervační poplatek. Jeden bankovní převod odhalí vše.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[{ before: "Kupující #BYR-7291", after: "Jan Novák", label: "Identita" }, { before: "j•••@••••.cz", after: "jan.novak@email.cz", label: "Email" }, { before: "+420 ••• ••• •••", after: "+420 732 456 789", label: "Telefon" }].map(item => (
              <div key={item.label} style={{ background: "#252525", borderRadius: 14, padding: 18, border: "1px solid #333" }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 8, fontWeight: 600, letterSpacing: "0.05em" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#555", textDecoration: "line-through", fontFamily: "monospace", marginBottom: 5 }}>{item.before}</div>
                <div style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>→ {item.after}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>Po rezervaci 50 000 Kč</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const ListingCard = ({ l, setPage }) => (
  <Card onClick={() => setPage("listing-" + l.id)} style={{ padding: 0 }}>
    <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
      <img src={l.img} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
        <Badge color={l.daysOnMarket < 14 ? "green" : l.daysOnMarket < 30 ? "amber" : "stone"}>{l.daysOnMarket < 7 ? "Nové" : `${l.daysOnMarket}d inzerce`}</Badge>
        {l.marketTrend === "rising" && <Badge color="green">↗ Rostoucí</Badge>}
      </div>
      <div style={{ position: "absolute", bottom: 10, right: 10 }}><AIBadge /></div>
    </div>
    <div style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>📍 {l.district}, Praha</div>
      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 7, lineHeight: 1.35, color: "#0f0f0f" }}>{l.title}</h3>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#888", marginBottom: 12 }}>
        <span>🛏 {l.bedrooms}</span><span>🚿 {l.bathrooms}</span><span>📐 {l.internalSize}m²</span>
        {l.hasPool && <span>🏊</span>}{l.hasGarage && <span>🚗</span>}{l.hasGarden && <span>🌿</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...D, fontSize: 20, fontWeight: 800, color: "#0f0f0f" }}>{fmt(l.askingPrice)}</div>
          <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600, marginTop: 2 }}>✦ AI: {fmt(l.aiValuation)} · {Math.round(l.aiConfidence * 100)}%</div>
        </div>
        <div style={{ fontSize: 11, color: "#bbb" }}>👁 {l.viewCount.toLocaleString()}</div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: "#aaa" }}>Prodávající {l.seller.anonymousId} · 🔒 Identita skryta</div>
    </div>
  </Card>
);

const ListingsPage = ({ setPage }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Vše");
  const filtered = LISTINGS.filter(l => (type === "Vše" || l.propertyType === type) && (!search || l.district.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ ...D, fontSize: 36, fontWeight: 800, marginBottom: 6 }}>Nabídka nemovitostí</h1>
        <p style={{ color: "#888", fontSize: 14 }}>{LISTINGS.length} nemovitostí v Praze · Identity anonymizovány do rezervace</p>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="🔍  Hledat čtvrť nebo nemovitost…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e0dbd4", background: "#fff", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
        {["Vše", "APARTMENT", "HOUSE", "OFFICE"].map(t => (
          <button key={t} onClick={() => setType(t)} style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${type === t ? "#1a1a1a" : "#e0dbd4"}`, background: type === t ? "#1a1a1a" : "#fff", color: type === t ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
        {filtered.map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#aaa" }}>Žádné nemovitosti nenalezeny</div>}
      </div>
    </div>
  );
};

const ListingDetail = ({ id, setPage, user }) => {
  const l = LISTINGS.find(x => x.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [showOffer, setShowOffer] = useState(false);
  const [amount, setAmount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ai, setAi] = useState(null);
  const [ail, setAil] = useState(false);
  useEffect(() => { if (l) setAmount(Math.round(l.askingPrice * 0.95)); }, [l]);
  if (!l) return null;
  const diff = ((l.aiValuation - l.askingPrice) / l.askingPrice) * 100;
  const getAI = () => {
    setAil(true);
    setTimeout(() => {
      setAi({ suggested: Math.round(l.aiValuation * 0.96), winProb: 74, dealMin: Math.round(l.askingPrice * 0.91), dealMax: Math.round(l.askingPrice * 1.02), tip: l.daysOnMarket > 20 ? `Inzerováno ${l.daysOnMarket} dní. Prodávající je pravděpodobně flexibilní. AI doporučuje zahájit na ${fmt(Math.round(l.askingPrice * 0.93))}.` : `Čerstvá inzerce. Trh je rostoucí. Doporučujeme nabídku blízkou vyvolávací ceně.` });
      setAil(false);
    }, 1200);
  };
  const submit = () => { if (!user) { setPage("login"); return; } setSubmitted(true); setTimeout(() => setPage("buyer-dash"), 2200); };
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <button onClick={() => setPage("listings")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na nabídku</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: 40 }}>
        <div>
          <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 12, position: "relative" }}>
            <img src={l.imgs[activeImg]} alt={l.title} style={{ width: "100%", height: 420, objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 7 }}>
              <Badge color={l.daysOnMarket < 14 ? "green" : "amber"}>{l.daysOnMarket < 7 ? "🔥 Právě přidáno" : `${l.daysOnMarket} dní inzerce`}</Badge>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
            {l.imgs.map((im, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{ width: 76, height: 57, borderRadius: 9, overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2.5px solid #C9A84C" : "2.5px solid transparent", opacity: i === activeImg ? 1 : 0.6 }}>
                <img src={im} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
          <h1 style={{ ...D, fontSize: 28, fontWeight: 800, color: "#0f0f0f", marginBottom: 6 }}>{l.title}</h1>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 18 }}>📍 {l.address}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {[{ i: "🛏", v: `${l.bedrooms} pokoje` }, { i: "🚿", v: `${l.bathrooms} koupelny` }, { i: "📐", v: `${l.internalSize}m²` }, { i: "🏗", v: `${l.yearBuilt}` }, ...(l.hasPool ? [{ i: "🏊", v: "Bazén" }] : []), ...(l.hasGarage ? [{ i: "🚗", v: "Garáž" }] : []), ...(l.hasGarden ? [{ i: "🌿", v: "Zahrada" }] : []), ...(l.hasBalcony ? [{ i: "🏙", v: "Balkón" }] : [])].map(f => (
              <div key={f.v} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f5f1ec", padding: "6px 12px", borderRadius: 9, fontSize: 12, fontWeight: 500 }}>{f.i} {f.v}</div>
            ))}
          </div>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: 14, marginBottom: 22 }}>{l.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 26 }}>
            {l.features.map(f => <span key={f} style={{ background: "#f5f1ec", padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>✓ {f}</span>)}
          </div>
          <Card style={{ padding: 22, background: "#1a1a1a", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18 }}><AIBadge /><span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>AI Ocenění</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 5 }}>AI ODHAD</div><div style={{ ...D, color: "#C9A84C", fontSize: 22, fontWeight: 800 }}>{fmt(l.aiValuation)}</div><div style={{ color: diff > 0 ? "#34d399" : "#f87171", fontSize: 11, marginTop: 3 }}>{diff > 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}% vs. cena</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 5 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{Math.round(l.aiConfidence * 100)}%</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 5 }}>ROZSAH</div><div style={{ color: "#aaa", fontSize: 12, fontWeight: 600, marginTop: 4 }}>{fmt(l.aiRange.low)} – {fmt(l.aiRange.high)}</div></div>
            </div>
            <div style={{ borderTop: "1px solid #333", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ color: "#777", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 10 }}>FAKTORY OCENĚNÍ</div>
              {l.aiFactors.map(f => (
                <div key={f.factor} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                  <div style={{ flex: 1, color: "#ccc", fontSize: 12 }}>{f.factor}</div>
                  <div style={{ width: 90, height: 4, background: "#333", borderRadius: 4 }}><div style={{ width: `${f.score}%`, height: "100%", background: f.impact === "positive" ? "#059669" : f.impact === "neutral" ? "#d97706" : "#dc2626", borderRadius: 4 }} /></div>
                  <div style={{ color: "#888", fontSize: 11, width: 24, textAlign: "right" }}>{f.score}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #333", paddingTop: 16 }}>
              <div style={{ color: "#777", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 10 }}>SROVNATELNÉ PRODEJE</div>
              {l.comparables.map(c => (
                <div key={c.address} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, paddingBottom: 9, borderBottom: "1px solid #2a2a2a" }}>
                  <div><div style={{ color: "#ccc", fontSize: 12 }}>{c.address}</div><div style={{ color: "#666", fontSize: 11 }}>{c.sold} · {c.beds}+kk · {c.size}m²</div></div>
                  <div style={{ ...D, color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>{fmt(c.price)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ position: "sticky", top: 76, alignSelf: "start" }}>
          <Card style={{ padding: 26 }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ ...D, fontSize: 28, fontWeight: 800, color: "#0f0f0f" }}>{fmtFull(l.askingPrice)}</div>
              <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600, marginTop: 3 }}>✦ AI odhad: {fmt(l.aiValuation)}</div>
            </div>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#999", letterSpacing: "0.05em", marginBottom: 8 }}>PROFIL PRODÁVAJÍCÍHO</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, background: "#e0dbd4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔒</div>
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{l.seller.anonymousId}</div><div style={{ fontSize: 11, color: "#999" }}>Člen od {l.seller.memberSince}</div></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, textAlign: "center", background: "#fff", borderRadius: 9, padding: "7px 5px" }}><div style={{ fontWeight: 800, fontSize: 16, color: "#059669" }}>{l.seller.successRate}%</div><div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>Úspěšnost</div></div>
                <div style={{ flex: 1, textAlign: "center", background: "#fff", borderRadius: 9, padding: "7px 5px" }}><div style={{ fontWeight: 800, fontSize: 16 }}>🔒</div><div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>ID skryto</div></div>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: "#bbb", textAlign: "center" }}>Odhaleno po rezervaci 50 000 Kč</div>
            </div>
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e" }}>🔒 Rezervační poplatek: <strong>50 000 Kč</strong> · Odhalí identitu + přímý kontakt</div>
            {!showOffer ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <Btn full onClick={() => { if (!user) { setPage("login"); return; } setShowOffer(true); getAI(); }}>Podat nabídku</Btn>
                <Btn variant="outline" full onClick={() => alert("Žádost o prohlídku odeslána! Potvrdíme do 24 hodin.")}>Sjednat prohlídku</Btn>
                <Btn variant="ghost" full onClick={() => setPage("reserve-" + l.id)}>Rezervovat (50 000 Kč)</Btn>
              </div>
            ) : submitted ? (
              <div style={{ textAlign: "center", padding: "18px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>Nabídka odeslána!</div>
                <div style={{ color: "#888", fontSize: 13 }}>Přesměrování na dashboard…</div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Podat nabídku</h3>
                {ail ? (
                  <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14, marginBottom: 14, textAlign: "center" }}>
                    <div style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <div style={{ color: "#888", fontSize: 12, marginTop: 7 }}>AI analyzuje trh…</div>
                  </div>
                ) : ai && (
                  <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><AIBadge /><span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>AI Asistent</span></div>
                    <div style={{ color: "#C9A84C", fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{fmtFull(ai.suggested)}</div>
                    <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>Doporučená nabídka · {ai.winProb}% šance na úspěch</div>
                    <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{ai.tip}</p>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>Dealové pásmo: {fmt(ai.dealMin)} – {fmt(ai.dealMax)}</div>
                    <button onClick={() => setAmount(ai.suggested)} style={{ background: "#C9A84C", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Použít AI návrh</button>
                  </div>
                )}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#888", display: "block", marginBottom: 5 }}>VAŠE NABÍDKA (KČ)</label>
                  <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#0f0f0f", boxSizing: "border-box" }} />
                </div>
                <textarea placeholder="Doplňující zpráva (volitelné)…" rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#555", marginBottom: 10, boxSizing: "border-box", resize: "none" }} />
                <div style={{ display: "flex", gap: 7 }}><Btn variant="ghost" small onClick={() => setShowOffer(false)}>Zrušit</Btn><Btn full onClick={submit}>Odeslat nabídku</Btn></div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const ReservePage = ({ id, setPage, user }) => {
  const l = LISTINGS.find(x => x.id === id);
  const [step, setStep] = useState("form");
  if (!l) return null;
  const confirm = () => { setStep("processing"); setTimeout(() => setStep("success"), 2500); };
  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("listing-" + l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      {step === "success" ? (
        <div style={{ textAlign: "center", padding: "56px 0" }}>
          <div style={{ fontSize: 60, marginBottom: 18 }}>🔓</div>
          <h1 style={{ ...D, fontSize: 34, fontWeight: 800, marginBottom: 10 }}>Identita odhalena!</h1>
          <p style={{ color: "#666", fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Rezervační poplatek byl přijat. Nyní vidíte identitu prodávajícího a můžete komunikovat přímo.</p>
          <Card style={{ padding: 26, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, textAlign: "left" }}>
              <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 7, letterSpacing: "0.05em" }}>PRODÁVAJÍCÍ — ODHALENO</div><div style={{ fontWeight: 800, fontSize: 17, marginBottom: 3 }}>Kateřina Novotná</div><div style={{ color: "#059669", fontSize: 13, marginBottom: 2 }}>📧 k.novotna@email.cz</div><div style={{ color: "#059669", fontSize: 13 }}>📞 +420 732 456 789</div></div>
              <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 7, letterSpacing: "0.05em" }}>VY — ODHALENO</div><div style={{ fontWeight: 800, fontSize: 17, marginBottom: 3 }}>{user?.name || "Jan Novák"}</div><div style={{ color: "#059669", fontSize: 13, marginBottom: 2 }}>📧 {user?.email || "jan.novak@email.cz"}</div><div style={{ color: "#059669", fontSize: 13 }}>📞 +420 603 123 456</div></div>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Btn onClick={() => setPage("buyer-dash")}>Na dashboard</Btn><Btn variant="outline" onClick={() => setPage("listing-" + l.id)}>Zobrazit inzerát</Btn></div>
        </div>
      ) : (
        <>
          <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 5 }}>Rezervovat nemovitost</h1>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Uhraďte rezervační poplatek bankovním převodem a odhalte identitu prodávajícího</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
            <div>
              {step === "processing" ? (
                <Card style={{ padding: 56, textAlign: "center" }}>
                  <div style={{ display: "inline-block", width: 44, height: 44, border: "4px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 18 }} />
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Ověřuji platbu…</div>
                  <div style={{ color: "#888", fontSize: 13 }}>Kontrola přijetí na bankovním účtu</div>
                </Card>
              ) : (
                <Card style={{ padding: 26 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Platební instrukce</h3>
                  <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 18, marginBottom: 18 }}>
                    {[["Číslo účtu", "2801234567/2010"], ["IBAN", "CZ65 2010 0000 0028 0123 4567"], ["Variabilní symbol", "RSV-" + l.id.toUpperCase()], ["Částka", "50 000 Kč"], ["Zpráva", "Rezervace – " + l.district]].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                        <span style={{ color: "#888" }}>{label}</span>
                        <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "#92400e" }}>
                    ⚠️ Po odeslání platby klikněte na tlačítko níže. Identita bude odhalena po ověření přijetí platby (obvykle do 1 pracovního dne).
                  </div>
                  <Btn full onClick={confirm}>Potvrzuji odeslání platby 🔓</Btn>
                  <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#bbb" }}>Rezervační poplatek je vratný, pokud prodej neproběhne</div>
                </Card>
              )}
            </div>
            <div>
              <Card style={{ padding: 22 }}>
                <img src={l.img} alt={l.title} style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginBottom: 14 }} />
                <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{l.title}</h4>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>📍 {l.district}, Praha</div>
                <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13 }}><span style={{ color: "#888" }}>Rezervační poplatek</span><span style={{ fontWeight: 600 }}>50 000 Kč</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, paddingTop: 10, borderTop: "1px solid #f0ede8" }}><span>Celkem</span><span style={{ ...D }}>50 000 Kč</span></div>
                </div>
                <div style={{ marginTop: 14, background: "#f0fdf4", borderRadius: 9, padding: 10, fontSize: 11, color: "#065f46" }}>✓ Obě identity okamžitě odhaleny<br />✓ Přímá komunikace odemčena<br />✓ 48hodinová blokace pro prodávajícího</div>
              </Card>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const SellerDash = ({ setPage }) => {
  const [tab, setTab] = useState("listings");
  const OFFERS = [
    { id: "of1", buyer: "BYR-4471", score: 82, amount: 26800000, listing: SELLER_LISTINGS[0], conditions: ["Hypotéka", "Inspekce"], aiStrength: 74, aiTip: "Silný kupující (skóre 82). Nabídka 6 % pod cenou. Doporučujeme protinabídku 27,8M." },
    { id: "of2", buyer: "BYR-9203", score: 67, amount: 25200000, listing: SELLER_LISTINGS[0], conditions: ["Hypotéka"], aiStrength: 51, aiTip: "Průměrný profil. Nabídka 12 % pod cenou. Zvažte pevnou protinabídku." },
    { id: "of3", buyer: "BYR-1188", score: 91, amount: 41000000, listing: SELLER_LISTINGS[1], conditions: [], aiStrength: 91, aiTip: "Výborný kupující. Bezpodmínečná nabídka blízko ceně. Vysoká pravděpodobnost uzavření." },
  ];
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard prodávajícího</h1><p style={{ color: "#888", fontSize: 13 }}>Správa inzerátů, nabídek a rezervací</p></div>
        <Btn onClick={() => alert("Formulář pro nový inzerát — připojit k backendu!")}>+ Nový inzerát</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {[{ label: "Aktivní inzeráty", value: SELLER_LISTINGS.length, icon: "🏠", color: "#059669" }, { label: "Čekající nabídky", value: 3, icon: "📋", color: "#d97706" }, { label: "Celkem zobrazení", value: "2 050", icon: "👁", color: "#3b82f6" }, { label: "Rezervace", value: 1, icon: "🔑", color: "#7c3aed" }].map(s => (
          <Card key={s.label} style={{ padding: 20 }}><div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div><div style={{ ...D, fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 3 }}>{s.value}</div><div style={{ fontSize: 12, color: "#999" }}>{s.label}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "listings", label: "Moje inzeráty" }, { id: "offers", label: "Příchozí nabídky" }, { id: "reservations", label: "Rezervace" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "listings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SELLER_LISTINGS.map(l => (
            <Card key={l.id} style={{ padding: 0, display: "flex", overflow: "hidden" }}>
              <img src={l.img} alt={l.title} style={{ width: 150, height: 110, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "18px 22px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 7 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f0f0f" }}>{l.title}</h3>
                  <div style={{ display: "flex", gap: 6 }}><Badge color="green">AKTIVNÍ</Badge><Badge color="stone">{l.daysOnMarket}d inzerce</Badge></div>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>📍 {l.address}</div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div><span style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmt(l.askingPrice)}</span><span style={{ fontSize: 11, color: "#C9A84C", marginLeft: 7 }}>✦ AI: {fmt(l.aiValuation)}</span></div>
                  <div style={{ fontSize: 12, color: "#888" }}>👁 {l.viewCount.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7, borderLeft: "1px solid #f0ede8" }}>
                <Btn small onClick={() => setPage("listing-" + l.id)}>Zobrazit</Btn>
                <Btn small variant="ghost">Upravit</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "offers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {OFFERS.map(o => (
            <Card key={o.id} style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{o.listing.title}</div><div style={{ fontSize: 12, color: "#888" }}>od Kupujícího {o.buyer}</div></div>
                <Badge color="amber">ČEKÁ</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>NABÍDKA</div><div style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmt(o.amount)}</div><div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Cena: {fmt(o.listing.askingPrice)}</div></div>
                <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>SKÓRE KUPUJÍCÍHO</div><ScoreRing score={o.score} size={50} /></div>
                <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>PODMÍNKY</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{o.conditions.length === 0 ? <Badge color="green">Bezpodmínečná</Badge> : o.conditions.map(c => <Badge key={c} color="stone">{c}</Badge>)}</div></div>
                <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>AI SÍLA</div><div style={{ fontWeight: 800, fontSize: 18, color: o.aiStrength >= 70 ? "#059669" : o.aiStrength >= 50 ? "#d97706" : "#dc2626" }}>{o.aiStrength}%</div></div>
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 7 }}>
                <span style={{ color: "#C9A84C", fontWeight: 700 }}>✦</span>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{o.aiTip}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Btn small>Přijmout</Btn><Btn small variant="outline">Protinabídka</Btn><Btn small variant="ghost">Odmítnout</Btn>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#bbb" }}>🔒 ID kupujícího skryto do rezervace</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "reservations" && (
        <Card style={{ padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div><div style={{ fontWeight: 700, fontSize: 15 }}>{SELLER_LISTINGS[1].title}</div><div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Rezervace #RSV-00492</div></div>
            <Badge color="green">AKTIVNÍ — ZAPLACENO</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 14 }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 7 }}>KUPUJÍCÍ — ODHALENO 🔓</div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3, color: "#059669" }}>Jan Novák</div><div style={{ fontSize: 12, color: "#059669" }}>📧 jan.novak@email.cz</div><div style={{ fontSize: 12, color: "#059669" }}>📞 +420 603 123 456</div></div>
            <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 7 }}>ZAPLACENO</div><div style={{ ...D, fontSize: 22, fontWeight: 800, color: "#059669" }}>50 000 Kč</div><div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>8. 1. 2025</div></div>
            <div><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 7 }}>SKÓRE KUPUJÍCÍHO</div><ScoreRing score={84} size={56} /></div>
          </div>
          <Btn variant="outline">📨 Napsat kupujícímu</Btn>
        </Card>
      )}
    </div>
  );
};

const BuyerDash = ({ setPage, user }) => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard kupujícího</h1><p style={{ color: "#888", fontSize: 13 }}>Vaše nabídky, prohlídky a rezervace</p></div>
        <Btn onClick={() => setPage("listings")}>Procházet nabídky →</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e0dbd4" }}>
            {[{ id: "overview", label: "Přehled" }, { id: "offers", label: "Moje nabídky" }, { id: "reservations", label: "Rezervace" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
            ))}
          </div>
          {tab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
                {[{ label: "Aktivní nabídky", value: 2, icon: "📋", color: "#d97706" }, { label: "Prohlídky", value: 3, icon: "📅", color: "#3b82f6" }, { label: "Rezervace", value: 1, icon: "🔑", color: "#059669" }].map(s => (
                  <Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{s.label}</div></Card>
                ))}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Nedávná aktivita</h3>
              {[{ icon: "🎉", text: "Rezervace potvrzena — Nerudova 15, Malá Strana", time: "2 dny ago" }, { icon: "📋", text: "Nabídka 18 200 000 Kč odeslána na Nerudova 15", time: "4 dny ago" }, { icon: "📅", text: "Prohlídka potvrzena: Dělnická 33, Holešovice", time: "1 týden ago" }].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, padding: "13px 16px", background: "#fff", borderRadius: 12, border: "1px solid #ede9e3" }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <div><div style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{a.text}</div><div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{a.time}</div></div>
                </div>
              ))}
            </div>
          )}
          {tab === "offers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BUYER_OFFERS.map(o => (
                <Card key={o.id} style={{ padding: 22 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <img src={o.listing.img} alt={o.listing.title} style={{ width: 86, height: 66, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{o.listing.title}</div>
                        <Badge color={o.status === "ACCEPTED" ? "green" : "amber"}>{o.status === "ACCEPTED" ? "PŘIJATO" : "ČEKÁ"}</Badge>
                      </div>
                      <div style={{ ...D, fontSize: 18, fontWeight: 800, marginBottom: 3 }}>{fmtFull(o.amount)}</div>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 7 }}>Cena: {fmt(o.listing.askingPrice)} · {o.createdAt}</div>
                      <div style={{ background: "#1a1a1a", borderRadius: 9, padding: "9px 12px", display: "flex", gap: 5 }}><span style={{ color: "#C9A84C" }}>✦</span><span style={{ color: "#aaa", fontSize: 12 }}>{o.aiTip}</span></div>
                    </div>
                  </div>
                  {o.status === "ACCEPTED" && (
                    <div style={{ marginTop: 12, padding: "11px 14px", background: "#f0fdf4", borderRadius: 10, fontSize: 12, color: "#065f46" }}>
                      🎉 Nabídka přijata! <button onClick={() => setPage("reserve-" + o.listing.id)} style={{ background: "none", border: "none", color: "#059669", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>Zaplaťte rezervaci a odhalte identitu →</button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
          {tab === "reservations" && (
            <Card style={{ padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div><div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{LISTINGS[1].title}</div><div style={{ fontSize: 12, color: "#888" }}>Rezervace #RSV-00492</div></div>
                <Badge color="green">🔓 ODHALENO</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 16 }}>
                <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16 }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 7 }}>PRODÁVAJÍCÍ — ODHALENO 🔓</div><div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3, color: "#059669" }}>Kateřina Novotná</div><div style={{ fontSize: 12, color: "#059669", marginBottom: 2 }}>📧 k.novotna@email.cz</div><div style={{ fontSize: 12, color: "#059669" }}>📞 +420 732 456 789</div></div>
                <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 7 }}>ZAPLACENO</div><div style={{ ...D, fontSize: 24, fontWeight: 800 }}>50 000 Kč</div><div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>8. 1. 2025</div><div style={{ marginTop: 7 }}><Badge color="green">✓ Potvrzeno</Badge></div></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}><Btn small>📨 Napsat prodávajícímu</Btn><Btn small variant="outline" onClick={() => setPage("listing-" + LISTINGS[1].id)}>Zobrazit inzerát</Btn></div>
            </Card>
          )}
        </div>
        <div>
          <Card style={{ padding: 0, background: "#1a1a1a", border: "none" }}>
            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}><span style={{ background: "#C9A84C", color: "#1a1a1a", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 99 }}>✦ AI</span><span style={{ color: "#aaa", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>SKÓRE KUPUJÍCÍHO</span></div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><ScoreRing score={74} size={96} /></div>
              <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ color: "#aaa", fontSize: 12 }}>Stupeň: <span style={{ color: "#34d399", fontWeight: 800, fontSize: 17 }}>B</span></div><div style={{ color: "#666", fontSize: 11, marginTop: 3 }}>Anonymně zobrazeno prodávajícím</div></div>
              <div style={{ borderTop: "1px solid #333", paddingTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                {[{ label: "Předschválení hypotéky", done: true, pts: 40 }, { label: "Kreditní profil", done: true, pts: 20 }, { label: "Ověření příjmu", done: false, pts: "+14" }].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 14 }}>{item.done ? "✅" : "⬜"}</span>
                    <span style={{ color: item.done ? "#ccc" : "#666", fontSize: 12, flex: 1 }}>{item.label}</span>
                    <span style={{ color: item.done ? "#666" : "#C9A84C", fontSize: 11, fontWeight: 700 }}>{item.done ? `+${item.pts}` : `${item.pts} b.`}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card style={{ padding: 18, marginTop: 14 }}>
            <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>✦ AI TIP</div>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, margin: 0 }}>Kupující se skóre nad 75 dostávají 2,3× více přijatých nabídek. Ověření příjmu vás posune na stupeň A.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AdminDash = ({ setPage }) => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Admin Dashboard</h1>
        <p style={{ color: "#888", fontSize: 13 }}>Přehled veškeré aktivity na platformě</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
        {[{ label: "Aktivní inzeráty", value: 4, icon: "🏠", color: "#059669" }, { label: "Registrovaní uživatelé", value: 28, icon: "👤", color: "#3b82f6" }, { label: "Nabídky celkem", value: 12, icon: "📋", color: "#d97706" }, { label: "Rezervace", value: 3, icon: "🔑", color: "#7c3aed" }, { label: "Objem transakcí", value: "142M", icon: "💰", color: "#C9A84C" }].map(s => (
          <Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div><div style={{ fontSize: 11, color: "#999" }}>{s.label}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Veškerá aktivita" }, { id: "listings", label: "Inzeráty" }, { id: "users", label: "Uživatelé" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ALL_ACTIVITY.map(a => (
            <Card key={a.id} style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 22 }}>{a.type === "offer" ? "📋" : a.type === "reservation" ? "🔑" : "📅"}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{a.listing}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{a.buyer} → {a.seller} · {a.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {a.amount && <div style={{ ...D, fontSize: 15, fontWeight: 800 }}>{fmtFull(a.amount)}</div>}
                  <Badge color={a.status === "PAID" || a.status === "CONFIRMED" ? "green" : a.status === "ACCEPTED" ? "blue" : "amber"}>{a.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "listings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LISTINGS.map(l => (
            <Card key={l.id} style={{ padding: 0, display: "flex", overflow: "hidden" }}>
              <img src={l.img} alt={l.title} style={{ width: 130, height: 96, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "16px 20px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14 }}>{l.title}</h3>
                  <Badge color="green">AKTIVNÍ</Badge>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>📍 {l.address} · Prodávající: {l.seller.anonymousId}</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <span style={{ ...D, fontSize: 16, fontWeight: 800 }}>{fmt(l.askingPrice)}</span>
                  <span style={{ fontSize: 12, color: "#C9A84C" }}>✦ AI: {fmt(l.aiValuation)}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>👁 {l.viewCount}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{l.daysOnMarket}d inzerce</span>
                </div>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, borderLeft: "1px solid #f0ede8" }}>
                <Btn small onClick={() => setPage("listing-" + l.id)}>Detail</Btn>
                <Btn small variant="ghost">Suspend</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ id: "BYR-7291", name: "Jan Novák", role: "BUYER", score: 74, offers: 2, reservations: 1, joined: "2024-11-01" }, { id: "BYR-4471", name: "Martin Dvořák", role: "BUYER", score: 82, offers: 3, reservations: 0, joined: "2024-10-15" }, { id: "SLR-7291", name: "Kateřina Novotná", role: "SELLER", score: null, offers: null, reservations: 1, joined: "2024-09-20" }, { id: "SLR-9834", name: "Petr Svoboda", role: "SELLER", score: null, offers: null, reservations: 0, joined: "2024-12-01" }].map(u => (
            <Card key={u.id} style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, background: u.role === "BUYER" ? "#dbeafe" : "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: u.role === "BUYER" ? "#1e40af" : "#065f46" }}>{u.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name} <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>· {u.id}</span></div>
                    <div style={{ fontSize: 12, color: "#888" }}>Registrován: {u.joined} · {u.role === "BUYER" ? `Nabídky: ${u.offers} · Rezervace: ${u.reservations}` : `Prodávající · Rezervace: ${u.reservations}`}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {u.score && <ScoreRing score={u.score} size={42} />}
                  <Badge color={u.role === "BUYER" ? "blue" : "green"}>{u.role}</Badge>
                  <Btn small variant="ghost">Detail</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ setPage, setUser }) => {
  const [role, setRole] = useState("BUYER");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("demo@vebre.cz");
  const [pass, setPass] = useState("Demo1234");
  const login = () => {
    setLoading(true);
    setTimeout(() => {
      const names = { BUYER: "Jan Novák", SELLER: "Kateřina Novotná", ADMIN: "Admin VEBRE" };
      setUser({ name: names[role], email, role, anonymousId: role === "BUYER" ? "BYR-7291" : role === "SELLER" ? "SLR-4482" : "ADM-001" });
      setPage(role === "BUYER" ? "buyer-dash" : role === "SELLER" ? "seller-dash" : "admin-dash");
      setLoading(false);
    }, 1000);
  };
  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ background: "#1a1a1a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48 }}>
        <blockquote>
          <p style={{ ...D, color: "#fff", fontSize: 24, fontWeight: 600, lineHeight: 1.5, marginBottom: 18 }}>"VEBRE mi ušetřilo přes 200 000 Kč na provizi. AI ocenění bylo přesnější než tři makléři dohromady."</p>
          <footer style={{ color: "#888", fontSize: 13 }}>Tomáš Procházka · Prodal v Praze 2</footer>
        </blockquote>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, textAlign: "center" }}>
          {[["50%", "Nižší provize"], ["94%", "Přesnost AI"], ["2,1 mld", "Objem transakcí"]].map(([v, l]) => (
            <div key={l}><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{v}</div><div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ ...D, fontSize: 30, fontWeight: 800, marginBottom: 5 }}>Přihlásit se</h1>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Nemáte účet? <span onClick={() => setPage("register")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Zaregistrujte se</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[{ r: "BUYER", label: "🏠 Kupující" }, { r: "SELLER", label: "🏗 Prodávající" }, { r: "ADMIN", label: "⚙️ Admin" }].map(({ r, label }) => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: "10px 6px", borderRadius: 10, border: `1.5px solid ${role === r ? "#1a1a1a" : "#e0dbd4"}`, background: role === r ? "#1a1a1a" : "#fff", color: role === r ? "#fff" : "#888", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{label}</button>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>HESLO</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          </div>
          <Btn full onClick={login} disabled={loading}>{loading ? "Přihlašuji…" : "Přihlásit se →"}</Btn>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "#bbb" }}>🔒 Identita chráněna až do rezervace</p>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ setPage, setUser, isSeller }) => {
  const [role, setRole] = useState(isSeller ? "SELLER" : "BUYER");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const register = () => {
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setUser({ name: name.trim(), email: "demo@vebre.cz", role, anonymousId: role === "BUYER" ? "BYR-" + Math.floor(1000 + Math.random() * 9000) : "SLR-" + Math.floor(1000 + Math.random() * 9000) });
      setPage(role === "BUYER" ? "buyer-dash" : "seller-dash");
      setLoading(false);
    }, 1000);
  };
  return (
    <div style={{ maxWidth: 480, margin: "52px auto", padding: "0 24px" }}>
      <h1 style={{ ...D, fontSize: 34, fontWeight: 800, marginBottom: 7 }}>Vytvořit účet</h1>
      <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>Máte účet? <span onClick={() => setPage("login")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Přihlaste se</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[{ value: "BUYER", label: "🏠 Kupující", desc: "Hledám nemovitost" }, { value: "SELLER", label: "🏗 Prodávající", desc: "Chci prodat" }].map(r => (
          <button key={r.value} onClick={() => setRole(r.value)} style={{ padding: "14px 10px", borderRadius: 13, border: `2px solid ${role === r.value ? "#1a1a1a" : "#e0dbd4"}`, background: role === r.value ? "#f7f4ef" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{r.label}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{r.desc}</div>
          </button>
        ))}
      </div>
      <Card style={{ padding: 26 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>CELÉ JMÉNO</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Vaše jméno" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>EMAIL</label>
          <input placeholder="vas@email.cz" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>HESLO</label>
          <input type="password" placeholder="Min. 8 znaků" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
        </div>
        <Btn full onClick={register} disabled={loading || !name.trim()}>{loading ? "Vytvářím…" : `Vytvořit účet ${role === "BUYER" ? "kupujícího" : "prodávajícího"} →`}</Btn>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#bbb" }}>Identita anonymizována · Rezervace bankovním převodem</p>
      </Card>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const renderPage = () => {
    if (page === "home") return <HomePage setPage={setPage} />;
    if (page === "listings") return <ListingsPage setPage={setPage} />;
    if (page === "login") return <LoginPage setPage={setPage} setUser={setUser} />;
    if (page === "register") return <RegisterPage setPage={setPage} setUser={setUser} isSeller={false} />;
    if (page === "register-seller") return <RegisterPage setPage={setPage} setUser={setUser} isSeller={true} />;
    if (page === "seller-dash") return <SellerDash setPage={setPage} />;
    if (page === "buyer-dash") return <BuyerDash setPage={setPage} user={user} />;
    if (page === "admin-dash") return <AdminDash setPage={setPage} />;
    if (page.startsWith("listing-")) return <ListingDetail id={page.replace("listing-", "")} setPage={setPage} user={user} />;
    if (page.startsWith("reserve-")) return <ReservePage id={page.replace("reserve-", "")} setPage={setPage} user={user} />;
    return <HomePage setPage={setPage} />;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", minHeight: "100vh", color: "#1a1a1a" }}>
      <Nav setPage={setPage} user={user} setUser={setUser} />
      {renderPage()}
    </div>
  );
}