import { useState, useEffect, useRef } from "react";

// ─── CLOUDINARY CONFIG ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = "dbyj5kney";
const CLOUDINARY_PRESET = "vebre_upload";

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload selhal");
  const data = await res.json();
  return data.secure_url;
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const LISTINGS_DEFAULT = [
  { id: "l1", title: "Luxusní penthouse s výhledem na Prahu", address: "Mánesova 28, Praha 2 - Vinohrady", city: "Praha", district: "Vinohrady", propertyType: "APARTMENT", bedrooms: 4, bathrooms: 2, internalSize: 180, yearBuilt: 2020, hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: true, askingPrice: 28500000, reservationFee: 50000, aiValuation: 29200000, aiConfidence: 0.91, aiRange: { low: 27500000, high: 30500000 }, marketTrend: "rising", daysOnMarket: 14, viewCount: 847, description: "Výjimečný penthouse v srdci Vinohrad s panoramatickým výhledem na Pražský hrad.", features: ["Terasa 60m²", "Výhled na Hrad", "Garáž", "Recepce", "Klimatizace"], img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"], seller: { anonymousId: "SLR-7291", memberSince: "2021", successRate: 94, name: "Kateřina Novotná", email: "k.novotna@email.cz", phone: "+420 732 456 789", address: "Blanická 22, Praha 2" }, aiFactors: [{ factor: "Lokalita Vinohrady", impact: "positive", score: 96 }, { factor: "Novostavba 2020", impact: "positive", score: 91 }], comparables: [{ address: "Blanická 12, Praha 2", price: 27800000, sold: "Nov 2024", beds: 4, size: 175 }] },
  { id: "l2", title: "Historický byt v činžovním domě", address: "Nerudova 15, Praha 1 - Malá Strana", city: "Praha", district: "Malá Strana", propertyType: "APARTMENT", bedrooms: 3, bathrooms: 2, internalSize: 145, yearBuilt: 1898, hasGarden: false, hasPool: false, hasGarage: false, hasBalcony: true, askingPrice: 19500000, reservationFee: 50000, aiValuation: 18750000, aiConfidence: 0.84, aiRange: { low: 17900000, high: 19900000 }, marketTrend: "stable", daysOnMarket: 31, viewCount: 512, description: "Jedinečný byt v historickém domě na Malé Straně. Zachované původní prvky.", features: ["Historické prvky", "Výhled na Hrad", "Parketové podlahy", "Balkón"], img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"], seller: { anonymousId: "SLR-4482", memberSince: "2020", successRate: 88, name: "Martin Dvořák", email: "m.dvorak@email.cz", phone: "+420 603 111 222", address: "Nerudova 8, Praha 1" }, aiFactors: [{ factor: "Lokalita Malá Strana", impact: "positive", score: 94 }, { factor: "Historická hodnota", impact: "positive", score: 87 }], comparables: [{ address: "Thunovská 8, Praha 1", price: 19200000, sold: "Říj 2024", beds: 3, size: 138 }] },
  { id: "l3", title: "Moderní vila se zahradou", address: "Na Hřebenkách 48, Praha 5 - Smíchov", city: "Praha", district: "Smíchov", propertyType: "HOUSE", bedrooms: 5, bathrooms: 3, internalSize: 320, yearBuilt: 2018, hasGarden: true, hasPool: true, hasGarage: true, hasBalcony: true, askingPrice: 42000000, reservationFee: 50000, aiValuation: 43500000, aiConfidence: 0.89, aiRange: { low: 40500000, high: 45500000 }, marketTrend: "rising", daysOnMarket: 7, viewCount: 1203, description: "Reprezentativní vila v žádané rezidenční lokalitě Praha 5. Bazén, zahrada 800 m².", features: ["Zahrada 800m²", "Bazén", "Dvojgaráž", "Smart Home", "Sauna"], img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"], seller: { anonymousId: "SLR-9834", memberSince: "2022", successRate: 97, name: "Petr Svoboda", email: "p.svoboda@email.cz", phone: "+420 777 333 444", address: "Na Hřebenkách 12, Praha 5" }, aiFactors: [{ factor: "Prémiová lokalita Praha 5", impact: "positive", score: 93 }, { factor: "Novostavba 2018", impact: "positive", score: 91 }], comparables: [{ address: "Na Hřebenkách 32, Praha 5", price: 40200000, sold: "Lis 2024", beds: 5, size: 298 }] },
  { id: "l4", title: "Designový loft v bývalé továrně", address: "Dělnická 33, Praha 7 - Holešovice", city: "Praha", district: "Holešovice", propertyType: "APARTMENT", bedrooms: 2, bathrooms: 1, internalSize: 120, yearBuilt: 2015, hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: false, askingPrice: 11800000, reservationFee: 50000, aiValuation: 12200000, aiConfidence: 0.86, aiRange: { low: 11400000, high: 12900000 }, marketTrend: "rising", daysOnMarket: 22, viewCount: 694, description: "Unikátní loft v revitalizované továrně v trendy Holešovicích. Stropy 4,5m.", features: ["Stropy 4,5m", "Původní cihly", "Garáž", "Trendy lokalita"], img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"], seller: { anonymousId: "SLR-3317", memberSince: "2023", successRate: 100, name: "Jana Procházková", email: "j.prochazkova@email.cz", phone: "+420 605 222 333", address: "Komunardů 5, Praha 7" }, aiFactors: [{ factor: "Holešovice – rostoucí čtvrť", impact: "positive", score: 92 }, { factor: "Bez balkónu", impact: "negative", score: 58 }], comparables: [{ address: "Komunardů 18, Praha 7", price: 11600000, sold: "Zář 2024", beds: 2, size: 115 }] },
];

const ALL_ACTIVITY = [
  { id: 1, type: "offer", buyer: "BYR-4471", seller: "SLR-7291", listing: LISTINGS_DEFAULT[0].title, amount: 26800000, status: "PENDING", date: "2025-01-10" },
  { id: 2, type: "reservation", buyer: "BYR-9203", seller: "SLR-4482", listing: LISTINGS_DEFAULT[1].title, amount: 50000, status: "PAID", date: "2025-01-08" },
  { id: 3, type: "offer", buyer: "BYR-1188", seller: "SLR-9834", listing: LISTINGS_DEFAULT[2].title, amount: 40500000, status: "ACCEPTED", date: "2025-01-07" },
];

// ─── AUTH & STORAGE HELPERS ───────────────────────────────────────────────────
const getUsers = () => { try { return JSON.parse(localStorage.getItem("vebre_users") || "[]"); } catch { return []; } };
const saveUsers = (u) => localStorage.setItem("vebre_users", JSON.stringify(u));
const getListings = () => { try { const s = localStorage.getItem("vebre_listings"); return s ? JSON.parse(s) : LISTINGS_DEFAULT; } catch { return LISTINGS_DEFAULT; } };
const saveListings = (l) => localStorage.setItem("vebre_listings", JSON.stringify(l));
const getBuyerData = (listingId) => { try { return JSON.parse(localStorage.getItem("vebre_buyer_data_" + listingId) || "null"); } catch { return null; } };
const getViewings = () => { try { return JSON.parse(localStorage.getItem("vebre_viewings") || "[]"); } catch { return []; } };
const saveViewings = (v) => localStorage.setItem("vebre_viewings", JSON.stringify(v));
const getAvailability = (listingId) => { try { return JSON.parse(localStorage.getItem("vebre_availability_" + listingId) || "null"); } catch { return null; } };
const saveAvailability = (listingId, slots) => localStorage.setItem("vebre_availability_" + listingId, JSON.stringify(slots));


// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M Kč` : `${(n / 1e3).toFixed(0)}K Kč`;
const fmtFull = (n) => `${n.toLocaleString("cs-CZ")} Kč`;
const fmtDate = (d) => d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
const D = { fontFamily: "'Playfair Display', Georgia, serif" };

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ children, color = "stone" }) => {
  const c = { stone: ["#e7e3dc", "#555"], green: ["#d1fae5", "#065f46"], amber: ["#fef3c7", "#92400e"], blue: ["#dbeafe", "#1e40af"], red: ["#fee2e2", "#991b1b"] };
  const [bg, tx] = c[color] || c.stone;
  return <span style={{ background: bg, color: tx, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{children}</span>;
};

const Btn = ({ children, onClick, variant = "dark", small, full, disabled }) => {
  const v = { dark: { background: "#1a1a1a", color: "#fff", border: "none" }, outline: { background: "transparent", color: "#1a1a1a", border: "1.5px solid #1a1a1a" }, ghost: { background: "transparent", color: "#777", border: "1.5px solid #ddd" }, gold: { background: "#C9A84C", color: "#fff", border: "none" } };
  return <button onClick={onClick} disabled={disabled} style={{ ...(v[variant] || v.dark), borderRadius: 10, padding: small ? "8px 16px" : "12px 24px", fontSize: small ? 13 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : undefined, fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>{children}</button>;
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick}
    onMouseEnter={onClick ? e => e.currentTarget.style.transform = "translateY(-2px)" : undefined}
    onMouseLeave={onClick ? e => e.currentTarget.style.transform = "translateY(0)" : undefined}
    style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", overflow: "hidden", cursor: onClick ? "pointer" : undefined, transition: "all 0.2s", ...style }}>
    {children}
  </div>
);

const AIBadge = () => <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1a1a1a", color: "#C9A84C", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>✦ AI</span>;

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
  </div>
);

// ─── REZERVAČNÍ SMLOUVA ───────────────────────────────────────────────────────
const ContractView = ({ listing, buyer, paid }) => {
  const today = fmtDate(new Date());
  const contractNo = "RSV-" + listing.id.toUpperCase() + "-" + new Date().getFullYear();
  const printContract = () => {
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Rezervační smlouva ${contractNo}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1a1a1a;line-height:1.8;font-size:14px}h1{font-size:22px;text-align:center}h2{font-size:15px;margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:4px}.box{background:#f7f4ef;padding:14px 18px;border-radius:8px;margin:12px 0}.row{display:flex;justify-content:space-between;margin-bottom:4px}.label{color:#666;min-width:200px}.value{font-weight:bold}.clause{margin-bottom:10px}.sigs{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px}.sig{border-top:1px solid #999;padding-top:10px;font-size:13px;color:#666}@media print{button{display:none}}</style>
    </head><body>
    <h1>REZERVAČNÍ SMLOUVA</h1><p style="text-align:center;color:#666">č. ${contractNo} · ${today}</p>
    <h2>I. Smluvní strany</h2>
    <div class="box"><div class="row"><span class="label">Kupující:</span><span class="value">${buyer.firstName} ${buyer.lastName}</span></div><div class="row"><span class="label">RČ:</span><span class="value">${buyer.birthNumber}</span></div><div class="row"><span class="label">Adresa:</span><span class="value">${buyer.street}, ${buyer.zip} ${buyer.city}</span></div><div class="row"><span class="label">Telefon:</span><span class="value">${buyer.phone}</span></div></div>
    <div class="box"><div class="row"><span class="label">Prodávající:</span><span class="value">${paid ? listing.seller.name : "████████████"}</span></div><div class="row"><span class="label">Kontakt:</span><span class="value">${paid ? listing.seller.email + " · " + listing.seller.phone : "Odhaleno po platbě"}</span></div></div>
    <h2>II. Předmět rezervace</h2>
    <div class="box"><div class="row"><span class="label">Nemovitost:</span><span class="value">${listing.title}</span></div><div class="row"><span class="label">Adresa:</span><span class="value">${listing.address}</span></div><div class="row"><span class="label">Plocha:</span><span class="value">${listing.internalSize} m²</span></div></div>
    <h2>III. Finanční podmínky</h2>
    <div class="box"><div class="row"><span class="label">Kupní cena:</span><span class="value">${fmtFull(listing.askingPrice)}</span></div><div class="row"><span class="label">Rezervační poplatek:</span><span class="value">${fmtFull(listing.reservationFee)}</span></div></div>
    <h2>IV. Podmínky</h2>
    <div class="clause">1. Kupující absolvoval osobní prohlídku nemovitosti a je s jejím stavem seznámen.</div>
    <div class="clause">2. Smlouva nabývá účinnosti uhrazením rezervačního poplatku na účet 2801234567/2010, VS: ${contractNo}.</div>
    <div class="clause">3. Poplatek je součástí kupní ceny a bude odečten při podpisu kupní smlouvy.</div>
    <div class="clause">4. Platnost rezervace: 30 dní od nabytí účinnosti.</div>
    <div class="clause">5. Při odstoupení prodávajícím: poplatek vrácen do 5 prac. dnů. Při odstoupení kupujícím: poplatek propadá.</div>
    <div class="sigs"><div class="sig"><strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující · ${today}<br/><br/>Podpis: ___________________</div>
    <div class="sig"><strong>${paid ? listing.seller.name : "█████████████"}</strong><br/>Prodávající · ${today}<br/><br/>Podpis: ___________________</div></div>
    <p style="text-align:center;font-size:11px;color:#999;margin-top:40px">VEBRE · vebre.cz · ${today}</p>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };
  return (
    <div style={{ background: "#fff", border: "1px solid #e0dbd4", borderRadius: 16, padding: 28 }}>
      <div style={{ textAlign: "center", marginBottom: 22, paddingBottom: 18, borderBottom: "2px solid #1a1a1a" }}>
        <h2 style={{ ...D, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>REZERVAČNÍ SMLOUVA</h2>
        <div style={{ fontSize: 12, color: "#888" }}>č. {contractNo} · {today}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8 }}>KUPUJÍCÍ</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{buyer.firstName} {buyer.lastName}</div>
          <div style={{ fontSize: 12, color: "#666" }}>RČ: {buyer.birthNumber}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{buyer.street}, {buyer.city}</div>
          <div style={{ fontSize: 12, color: "#666" }}>📞 {buyer.phone}</div>
        </div>
        <div style={{ background: paid ? "#f0fdf4" : "#fef3c7", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8 }}>PRODÁVAJÍCÍ</div>
          {paid ? (<><div style={{ fontWeight: 700, fontSize: 14, color: "#059669" }}>{listing.seller.name}</div><div style={{ fontSize: 12, color: "#059669" }}>📧 {listing.seller.email}</div><div style={{ fontSize: 12, color: "#059669" }}>📞 {listing.seller.phone}</div></>) : (<><div style={{ fontWeight: 700, fontSize: 14 }}>{listing.seller.anonymousId}</div><div style={{ fontSize: 11, color: "#92400e", marginTop: 6 }}>🔒 Odhaleno po zaplacení</div></>)}
        </div>
      </div>
      <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8 }}>NEMOVITOST</div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{listing.title}</div>
        <div style={{ fontSize: 12, color: "#666" }}>📍 {listing.address} · {listing.internalSize} m²</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ border: "1.5px solid #e0dbd4", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 4 }}>KUPNÍ CENA</div>
          <div style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmtFull(listing.askingPrice)}</div>
        </div>
        <div style={{ border: "1.5px solid #C9A84C", borderRadius: 12, padding: 14, background: "#fffbf0" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>REZERVAČNÍ POPLATEK</div>
          <div style={{ ...D, fontSize: 18, fontWeight: 800, color: "#C9A84C" }}>{fmtFull(listing.reservationFee)}</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={printContract} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>📄 Stáhnout jako PDF</button>
        <span style={{ fontSize: 11, color: "#bbb" }}>Otevře se v novém okně pro tisk</span>
      </div>
    </div>
  );
};

// ─── INSOLVENCY CHECK ─────────────────────────────────────────────────────────
const InsolvencyCheck = ({ firstName, lastName, onResult }) => {
  const [status, setStatus] = useState("idle");
  const check = async () => {
    setStatus("loading");
    try {
      const url = `https://isir.justice.cz/isir/common/rest.do?jmeno=${encodeURIComponent(firstName)}&prijmeni=${encodeURIComponent(lastName)}&dotaz=DluznikFyzickaOsoba&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("error");
      const data = await res.json();
      const hasActive = data?.items?.some(i => i.stavVeci === "PROBÍHAJÍCÍ");
      if (hasActive) { setStatus("insolvent"); onResult && onResult(false); }
      else { setStatus("ok"); onResult && onResult(true); }
    } catch { setStatus("error"); onResult && onResult(null); }
  };
  if (status === "idle") return <button onClick={check} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f7f4ef", border: "1.5px solid #e0dbd4", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🔍 Zkontrolovat insolvenci</button>;
  if (status === "loading") return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#f7f4ef", borderRadius: 10, fontSize: 13, color: "#888" }}><div style={{ width: 16, height: 16, border: "2px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Ověřuji…</div>;
  if (status === "ok") return <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#065f46", fontWeight: 600 }}>✅ Žádný insolvenční záznam</div>;
  if (status === "insolvent") return <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b", fontWeight: 700 }}>⛔ Aktivní insolvence nalezena!</div>;
  return <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400e" }}><div style={{ fontWeight: 700, marginBottom: 6 }}>⚠️ Automatická kontrola nedostupná</div><a href="https://isir.justice.cz/isir/ueu/evidence_upadcu.do" target="_blank" rel="noreferrer" style={{ background: "#92400e", color: "#fff", padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Zkontrolovat ručně →</a></div>;
};

// ─── STEPPER ──────────────────────────────────────────────────────────────────
const Stepper = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
    {steps.map((s, i) => {
      const idx = steps.indexOf(current);
      const done = i < idx;
      const active = s === current;
      return (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#059669" : active ? "#1a1a1a" : "#e0dbd4", color: done || active ? "#fff" : "#999", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{done ? "✓" : i + 1}</div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#1a1a1a" : done ? "#059669" : "#999", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: done ? "#059669" : "#e0dbd4", margin: "0 12px" }} />}
        </div>
      );
    })}
  </div>
);

// ─── RESERVE PAGE ─────────────────────────────────────────────────────────────
const ReservePage = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id);
  const STEPS = ["Osobní údaje", "Smlouva", "Platba"];
  const [step, setStep] = useState("Osobní údaje");
  const [form, setForm] = useState({ firstName: "Jan", lastName: "Novák", birthNumber: "900101/1234", street: "Václavské náměstí 1", city: "Praha", zip: "110 00", phone: "+420 603 123 456" });
  const [viewingDone, setViewingDone] = useState(false);
  const [insolvencyOk, setInsolvencyOk] = useState(null);
  const [contractRead, setContractRead] = useState(false);
  const [formError, setFormError] = useState("");
  const [paid, setPaid] = useState(false); // eslint-disable-line no-unused-vars
  if (!l) return null;
  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const validatePersonal = () => {
    if (!form.firstName || !form.lastName || !form.birthNumber || !form.street || !form.city || !form.zip || !form.phone) { setFormError("Vyplňte prosím všechna pole."); return false; }
    if (!viewingDone) { setFormError("Potvrďte prosím, že jste absolvovali prohlídku."); return false; }
    setFormError(""); return true;
  };
  const confirm = () => {
    // Uložit osobní údaje kupujícího do localStorage pro použití ve smlouvách
    localStorage.setItem("vebre_buyer_data_" + l.id, JSON.stringify({
      ...form,
      listingId: l.id,
      reservationDate: new Date().toISOString(),
      reservationFee: l.reservationFee,
    }));
    setPaid(true);
    setTimeout(() => setStep("success"), 2500);
  };
  if (step === "success") return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 18 }}>🔓</div>
      <h1 style={{ ...D, fontSize: 34, fontWeight: 800, marginBottom: 10 }}>Rezervace potvrzena!</h1>
      <p style={{ color: "#666", fontSize: 15, marginBottom: 28 }}>Poplatek přijat. Identita prodávajícího odhalena.</p>
      <div style={{ marginBottom: 28 }}><ContractView listing={l} buyer={form} paid={true} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Btn onClick={() => setPage("buyer-dash")}>Na dashboard</Btn><Btn variant="outline" onClick={() => setPage("listing-" + l.id)}>Zobrazit inzerát</Btn></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => step === "Osobní údaje" ? setPage("listing-" + l.id) : setStep(STEPS[STEPS.indexOf(step) - 1])} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <Stepper steps={STEPS} current={step} />
      {step === "Osobní údaje" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>
          <Card style={{ padding: 24 }}>
            <h2 style={{ ...D, fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Osobní údaje</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="JMÉNO" value={form.firstName} onChange={setF("firstName")} placeholder="Vaše jméno" /><Input label="PŘÍJMENÍ" value={form.lastName} onChange={setF("lastName")} placeholder="Vaše příjmení" /></div>
            <Input label="RODNÉ ČÍSLO" value={form.birthNumber} onChange={setF("birthNumber")} placeholder="900101/1234" />
            <Input label="ULICE A ČÍSLO" value={form.street} onChange={setF("street")} placeholder="Václavské náměstí 1" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}><Input label="MĚSTO" value={form.city} onChange={setF("city")} placeholder="Praha" /><Input label="PSČ" value={form.zip} onChange={setF("zip")} placeholder="110 00" /></div>
            <Input label="TELEFON" value={form.phone} onChange={setF("phone")} placeholder="+420 600 000 000" />
            <div style={{ margin: "4px 0 16px", padding: "14px 16px", background: viewingDone ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (viewingDone ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }} onClick={() => setViewingDone(v => !v)}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (viewingDone ? "#059669" : "#ccc"), background: viewingDone ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{viewingDone && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}</div>
                <div><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Potvrzuji, že jsem absolvoval/a osobní prohlídku nemovitosti</div><div style={{ fontSize: 11, color: "#888" }}>Jsem seznámen/a s jejím stavem.</div></div>
              </div>
            </div>
            {form.firstName && form.lastName && (<div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>KONTROLA INSOLVENCE</div><InsolvencyCheck firstName={form.firstName} lastName={form.lastName} onResult={setInsolvencyOk} /></div>)}
            {insolvencyOk === false && <div style={{ background: "#fee2e2", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b", marginBottom: 14 }}>⛔ Rezervaci nelze provést.</div>}
            {formError && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginBottom: 14 }}>⚠️ {formError}</div>}
            <Btn full disabled={insolvencyOk === false} onClick={() => { if (validatePersonal()) setStep("Smlouva"); }}>Pokračovat ke smlouvě →</Btn>
          </Card>
          <Card style={{ padding: 20, alignSelf: "start" }}>
            <img src={l.img} alt={l.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
            <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{l.title}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, borderTop: "1px solid #f0ede8", paddingTop: 12 }}><span>Poplatek</span><span style={{ ...D }}>50 000 Kč</span></div>
          </Card>
        </div>
      )}
      {step === "Smlouva" && (
        <div>
          <ContractView listing={l} buyer={form} paid={false} />
          <div style={{ marginTop: 20, padding: "16px 20px", background: contractRead ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (contractRead ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer", marginBottom: 20 }} onClick={() => setContractRead(v => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (contractRead ? "#059669" : "#ccc"), background: contractRead ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{contractRead && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Přečetl/a jsem si smlouvu a souhlasím s podmínkami</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}><Btn variant="ghost" onClick={() => setStep("Osobní údaje")}>← Zpět</Btn><Btn full disabled={!contractRead} onClick={() => setStep("Platba")}>Přejít k platbě →</Btn></div>
        </div>
      )}
      {step === "Platba" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>
          <Card style={{ padding: 26 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Platební instrukce</h3>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 18, marginBottom: 18 }}>
              {[["Číslo účtu", "2801234567/2010"], ["IBAN", "CZ65 2010 0000 0028 0123 4567"], ["Variabilní symbol", "RSV-" + l.id.toUpperCase()], ["Částka", "50 000 Kč"]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}><span style={{ color: "#888" }}>{label}</span><span style={{ fontWeight: 700, fontFamily: "monospace" }}>{value}</span></div>
              ))}
            </div>
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12, color: "#92400e" }}>⚠️ Po odeslání platby klikněte níže. Smlouva nabude účinnosti a identita prodávajícího bude odhalena.</div>
            <div style={{ display: "flex", gap: 10 }}><Btn variant="ghost" onClick={() => setStep("Smlouva")}>← Zpět</Btn><Btn full onClick={confirm}>Potvrzuji odeslání platby 🔓</Btn></div>
          </Card>
          <Card style={{ padding: 20, alignSelf: "start" }}>
            <img src={l.img} alt={l.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
            <div style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>👤 {form.firstName} {form.lastName}</div>
            <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginBottom: 10 }}>✓ Smlouva podepsána</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, borderTop: "1px solid #f0ede8", paddingTop: 12 }}><span>K úhradě</span><span style={{ ...D, color: "#C9A84C" }}>50 000 Kč</span></div>
          </Card>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── BOOKING PAGE (Rezervace prohlídky — kupující) ────────────────────────────
const BookingPage = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id);
  const savedAvailability = getAvailability(id);

  // Generuj dostupné termíny — buď ze storage (nastavené prodávajícím) nebo demo
  const generateSlots = () => {
    if (savedAvailability) return savedAvailability;
    const slots = [];
    for (let d = 1; d <= 21; d++) {
      const date = new Date(); date.setDate(date.getDate() + d);
      if (date.getDay() === 0) continue;
      const times = date.getDay() === 6 ? ["10:00", "11:00", "12:00"] : ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
      times.filter(() => Math.random() > 0.35).forEach(t => {
        slots.push({
          id: `${d}-${t}`,
          date: date.toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long" }),
          dateShort: date.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" }),
          dayNum: date.getDay(),
          time: t,
          available: true,
        });
      });
    }
    return slots;
  };

  const allSlots = generateSlots();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: user?.nickname || "Jan Novák", phone: "+420 603 123 456", email: "jan.novak@email.cz", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);

  if (!l) return null;

  // Seskup termíny po týdnech
  const weeks = [];
  let current = [];
  let lastDate = null;
  allSlots.forEach(slot => {
    if (lastDate && slot.dateShort !== lastDate && current.length >= 7) {
      weeks.push(current); current = [];
    }
    current.push(slot);
    lastDate = slot.dateShort;
  });
  if (current.length) weeks.push(current);

  // Seskup aktuální týden podle dne
  const currentWeekSlots = weeks[activeWeek] || [];
  const byDay = {};
  currentWeekSlots.forEach(s => {
    if (!byDay[s.dateShort]) byDay[s.dateShort] = { label: s.date, slots: [] };
    byDay[s.dateShort].slots.push(s);
  });

  const submit = () => {
    if (!selectedSlot || !form.name || !form.phone) return;
    const viewings = getViewings();
    const newViewing = {
      id: "v" + Date.now(),
      listingId: l.id,
      listingTitle: l.title,
      listingAddress: l.address,
      listingImg: l.img,
      buyerNickname: user?.nickname || form.name,
      buyerAnonymousId: user?.anonymousId || "BYR-XXXX",
      sellerAnonymousId: l.seller.anonymousId,
      slot: selectedSlot,
      form,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    saveViewings([...viewings, newViewing]);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Prohlídka rezervována!</h1>
      <p style={{ color: "#666", fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Vaše žádost o prohlídku byla odeslána prodávajícímu. Potvrzení obdržíte do 24 hodin.</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 16, padding: 24, marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 12, letterSpacing: "0.05em" }}>DETAIL PROHLÍDKY</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
          <img src={l.img} alt={l.title} style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{l.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>📍 {l.address}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ l: "DATUM", v: selectedSlot.date }, { l: "ČAS", v: selectedSlot.time }, { l: "KONTAKT", v: form.phone }, { l: "STATUS", v: "⏳ Čeká na potvrzení" }].map(item => (
            <div key={item.l} style={{ background: "#fff", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>{item.l}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.l === "STATUS" ? "#d97706" : "#1a1a1a" }}>{item.v}</div>
            </div>
          ))}
        </div>
      </div>
      {/* #22 — SMS + Kalendář */}
      <div style={{ background: "#fff", border: "1px solid #ede9e3", borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "10px 14px", background: "#f7f4ef", borderRadius: 10 }}>
          <span style={{ fontSize: 18 }}>📱</span>
          <div style={{ fontSize: 13, color: "#444" }}>
            <span style={{ fontWeight: 600 }}>SMS potvrzení odesláno</span> na <span style={{ fontWeight: 700 }}>{form.phone}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f7f4ef", borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📅</span>
            <div style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>Pozvánka do kalendáře</div>
          </div>
          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#4285F4", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            <span style={{ fontSize: 14 }}>📆</span> Přidat do Google Kalendáře
          </a>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn onClick={() => setPage("buyer-dash")}>Na dashboard</Btn>
        <Btn variant="outline" onClick={() => setPage("listing-" + l.id)}>Zpět na inzerát</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("listing-" + l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na inzerát</button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
        <img src={l.img} alt={l.title} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
        <div>
          <h1 style={{ ...D, fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Rezervace prohlídky</h1>
          <div style={{ fontSize: 13, color: "#888" }}>{l.title} · 📍 {l.address}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Kalendář */}
        <div>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>📅 Vyberte termín</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setActiveWeek(w => Math.max(0, w - 1))} disabled={activeWeek === 0} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e0dbd4", background: "#fff", cursor: activeWeek === 0 ? "not-allowed" : "pointer", opacity: activeWeek === 0 ? 0.4 : 1, fontSize: 16 }}>←</button>
                <button onClick={() => setActiveWeek(w => Math.min(weeks.length - 1, w + 1))} disabled={activeWeek === weeks.length - 1} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e0dbd4", background: "#fff", cursor: activeWeek === weeks.length - 1 ? "not-allowed" : "pointer", opacity: activeWeek === weeks.length - 1 ? 0.4 : 1, fontSize: 16 }}>→</button>
              </div>
            </div>

            {Object.keys(byDay).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Žádné termíny tento týden</div>
                <div style={{ fontSize: 12 }}>Zkuste další týden →</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(byDay).map(([dateKey, day]) => (
                  <div key={dateKey}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>{day.label}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {day.slots.map(slot => {
                        const selected = selectedSlot?.id === slot.id;
                        return (
                          <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                            style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid " + (selected ? "#1a1a1a" : "#e0dbd4"), background: selected ? "#1a1a1a" : "#fff", color: selected ? "#fff" : "#1a1a1a", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kontaktní formulář */}
          {selectedSlot && (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>👤 Vaše kontaktní údaje</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="JMÉNO" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jan Novák" />
                <Input label="TELEFON *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+420 600 000 000" />
              </div>
              <Input label="E-MAIL" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jan@email.cz" />
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>POZNÁMKA (nepovinné)</label>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} placeholder="Např. přijdu s partnerem, potřebuji zkontrolovat sklep…" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} />
              </div>
              <Btn full disabled={!form.name || !form.phone} onClick={submit}>Odeslat žádost o prohlídku →</Btn>
              <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#bbb" }}>Prodávající potvrdí termín do 24 hodin</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 12, letterSpacing: "0.05em" }}>VYBRANÝ TERMÍN</div>
            {selectedSlot ? (
              <div>
                <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#059669", marginBottom: 3 }}>📅 {selectedSlot.date}</div>
                  <div style={{ fontSize: 13, color: "#059669" }}>🕐 {selectedSlot.time}</div>
                </div>
                <button onClick={() => setSelectedSlot(null)} style={{ background: "none", border: "none", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕ Zrušit výběr</button>
              </div>
            ) : (
              <div style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>👆</div>
                Vyberte termín vlevo
              </div>
            )}
          </div>

          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 12, letterSpacing: "0.05em" }}>INFORMACE O PROHLÍDCE</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
              📍 {l.address}<br />
              📐 {l.internalSize} m² · {l.bedrooms} pokoje<br />
              🏗 Rok výstavby: {l.yearBuilt}<br />
              👤 Prodávající: {l.seller.anonymousId}
            </div>
          </div>

          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 14, padding: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ℹ️ <strong>Jak prohlídka probíhá:</strong><br />
            Po potvrzení termínu vás prodávající kontaktuje a dohodne detaily. Identity zůstávají anonymní až do rezervace.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AVAILABILITY PAGE (Nastavení dostupnosti — prodávající) ──────────────────
const AvailabilityPage = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id);

  const TIME_SLOTS = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const DAYS = ["Po", "Út", "St", "Čt", "Pá", "So"];
  const DAY_NAMES = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

  // Načtení uloženého nastavení
  const saved = getAvailability(id);
  const initSlots = () => {
    if (saved) return saved;
    // Demo výchozí nastavení
    const slots = [];
    for (let d = 1; d <= 21; d++) {
      const date = new Date(); date.setDate(date.getDate() + d);
      if (date.getDay() === 0) continue;
      const times = date.getDay() === 6 ? ["10:00", "11:00"] : ["10:00", "14:00", "16:00"];
      times.forEach(t => slots.push({
        id: `${d}-${t}`,
        date: date.toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long" }),
        dateShort: date.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" }),
        dayNum: date.getDay(),
        time: t,
        available: true,
      }));
    }
    return slots;
  };

  const [slots, setSlots] = useState(initSlots);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Po-Pá
  const [selectedTimes, setSelectedTimes] = useState(["10:00", "14:00", "16:00"]);
  const [weeksAhead, setWeeksAhead] = useState(3);
  const [saved2, setSaved2] = useState(false);
  const [activeTab, setActiveTab] = useState("wizard");

  if (!l) return null;

  const toggleDay = (d) => setSelectedDays(ds => ds.includes(d) ? ds.filter(x => x !== d) : [...ds, d]);
  const toggleTime = (t) => setSelectedTimes(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);

  const generateFromWizard = () => {
    const newSlots = [];
    for (let d = 1; d <= weeksAhead * 7; d++) {
      const date = new Date(); date.setDate(date.getDate() + d);
      if (!selectedDays.includes(date.getDay())) continue;
      selectedTimes.forEach(t => newSlots.push({
        id: `${d}-${t}`,
        date: date.toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long" }),
        dateShort: date.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" }),
        dayNum: date.getDay(),
        time: t,
        available: true,
      }));
    }
    setSlots(newSlots);
  };

  const removeSlot = (slotId) => setSlots(s => s.filter(x => x.id !== slotId));

  const save = () => {
    saveAvailability(id, slots);
    setSaved2(true);
    setTimeout(() => setSaved2(false), 3000);
  };

  // Seskup termíny po dnech pro náhled
  const byDay = {};
  slots.forEach(s => {
    if (!byDay[s.dateShort]) byDay[s.dateShort] = { label: s.date, slots: [] };
    byDay[s.dateShort].slots.push(s);
  });

  return (
    <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("seller-dash")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na dashboard</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ ...D, fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Nastavení termínů prohlídek</h1>
          <div style={{ fontSize: 13, color: "#888" }}>{l.title}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved2 && <Badge color="green">✓ Uloženo</Badge>}
          <Btn onClick={save}>Uložit termíny</Btn>
        </div>
      </div>

      {/* Záložky */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "wizard", label: "⚡ Rychlé nastavení" }, { id: "preview", label: "Termíny (" + slots.length + ")" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: activeTab === t.id ? "#1a1a1a" : "#888", fontWeight: activeTab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "wizard" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 26, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>1. Které dny jste k dispozici?</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DAYS.map((d, i) => {
                const dayNum = i + 1;
                const active = selectedDays.includes(dayNum);
                return (
                  <button key={d} onClick={() => toggleDay(dayNum)} style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid " + (active ? "#1a1a1a" : "#e0dbd4"), background: active ? "#1a1a1a" : "#fff", color: active ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {DAY_NAMES[i]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 26, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>2. V kolik hodin?</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TIME_SLOTS.map(t => {
                const active = selectedTimes.includes(t);
                return (
                  <button key={t} onClick={() => toggleTime(t)} style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid " + (active ? "#C9A84C" : "#e0dbd4"), background: active ? "#fffbf0" : "#fff", color: active ? "#92400e" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 26, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>3. Na jak dlouho dopředu?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4].map(w => (
                <button key={w} onClick={() => setWeeksAhead(w)} style={{ flex: 1, padding: "12px 8px", borderRadius: 10, border: "1.5px solid " + (weeksAhead === w ? "#1a1a1a" : "#e0dbd4"), background: weeksAhead === w ? "#1a1a1a" : "#fff", color: weeksAhead === w ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
                  {w} {w === 1 ? "týden" : w < 5 ? "týdny" : "týdnů"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Btn onClick={() => { generateFromWizard(); setActiveTab("preview"); }}>
              Vygenerovat {selectedDays.length * selectedTimes.length * weeksAhead} termínů →
            </Btn>
            <span style={{ fontSize: 12, color: "#888" }}>Poté je můžete upravit v záložce Termíny</span>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div>
          {slots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Žádné termíny</div>
              <p style={{ color: "#888", marginBottom: 20 }}>Použijte záložku Rychlé nastavení pro vygenerování termínů.</p>
              <Btn variant="outline" onClick={() => setActiveTab("wizard")}>Nastavit termíny →</Btn>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                Celkem <strong>{slots.length} termínů</strong>. Kliknutím na ✕ odstraníte konkrétní termín.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.entries(byDay).map(([dateKey, day]) => (
                  <div key={dateKey} style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede9e3", padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>{day.label}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {day.slots.map(slot => (
                        <div key={slot.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: "#f7f4ef", border: "1.5px solid #e0dbd4" }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{slot.time}</span>
                          <button onClick={() => removeSlot(slot.id)} style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                <Btn onClick={save}>{saved2 ? "✓ Uloženo!" : "Uložit termíny"}</Btn>
                <Btn variant="ghost" onClick={() => setSlots([])}>Smazat vše</Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── #6 — TRANSACTION MILESTONE PROGRESS BAR ─────────────────────────────────
const TRANSACTION_MILESTONES = [
  { id: "listed", label: "Inzerát zveřejněn", icon: "🏠" },
  { id: "viewing", label: "Prohlídky", icon: "📅" },
  { id: "offer", label: "Nabídka přijata", icon: "📋" },
  { id: "reservation", label: "Rezervační poplatek", icon: "💰" },
  { id: "contract", label: "Kupní smlouva", icon: "📄" },
  { id: "transfer", label: "Převod vlastnictví", icon: "🔑" },
];

const TransactionProgress = ({ activeStep = "contract", compact = false }) => {
  const activeIdx = TRANSACTION_MILESTONES.findIndex(m => m.id === activeStep);
  return (
    <div style={{ background: "#fff", borderRadius: compact ? 14 : 20, border: "1px solid #ede9e3", padding: compact ? "16px 20px" : "22px 28px" }}>
      {!compact && <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 16, letterSpacing: "0.05em" }}>PRŮBĚH TRANSAKCE</div>}
      <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
        {TRANSACTION_MILESTONES.map((m, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: compact ? 56 : 72 }}>
                <div style={{ width: compact ? 32 : 38, height: compact ? 32 : 38, borderRadius: "50%", background: done ? "#059669" : active ? "#1a1a1a" : "#f0ede8", border: active ? "3px solid #C9A84C" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 13 : 16, transition: "all 0.2s" }}>
                  {done ? <span style={{ color: "#fff", fontWeight: 800 }}>✓</span> : <span style={{ filter: active ? "none" : "grayscale(1)", opacity: active ? 1 : 0.5 }}>{m.icon}</span>}
                </div>
                <div style={{ fontSize: compact ? 9 : 10, fontWeight: active ? 700 : 400, color: done ? "#059669" : active ? "#1a1a1a" : "#bbb", textAlign: "center", lineHeight: 1.3, maxWidth: compact ? 56 : 68 }}>{m.label}</div>
              </div>
              {i < TRANSACTION_MILESTONES.length - 1 && (
                <div style={{ width: compact ? 16 : 24, height: 3, background: done ? "#059669" : "#f0ede8", borderRadius: 99, margin: "0 2px", marginBottom: compact ? 18 : 22, flexShrink: 0, transition: "background 0.3s" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── #11 — BROKERAGE CONTRACT (Smlouva o zprostředkování) ─────────────────────
const BrokerageContractPage = ({ listingData, setPage, onSigned }) => {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const sign = () => {
    if (!agreed) return;
    setSigning(true);
    setTimeout(() => { setSigned(true); setSigning(false); }, 1200);
  };

  if (signed) return (
    <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
      <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Smlouva podepsána!</h1>
      <p style={{ color: "#666", fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Smlouva o realitním zprostředkování byla uzavřena. Váš inzerát je nyní aktivní.</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 14, padding: 20, marginBottom: 28, textAlign: "left" }}>
        {[["Nemovitost", listingData?.title || "Nový inzerát"], ["Provize VEBRE", "2 % z kupní ceny (vč. DPH)"], ["Exkluzivita", "90 dní"], ["Výpovědní lhůta", "30 dní"], ["Platforma", "VEBRE — vebre.cz"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #d1fae5", fontSize: 13 }}>
            <span style={{ color: "#666" }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>
      <Btn full onClick={onSigned || (() => setPage("seller-dash"))}>Přejít na dashboard →</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("new-listing")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, background: "#1a1a1a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#C9A84C", fontSize: 20 }}>📋</span></div>
        <div>
          <h1 style={{ ...D, fontSize: 24, fontWeight: 800, marginBottom: 2 }}>Smlouva o realitním zprostředkování</h1>
          <div style={{ fontSize: 13, color: "#888" }}>Před zveřejněním inzerátu prosím podepište smlouvu</div>
        </div>
      </div>

      <Card style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 16, letterSpacing: "0.05em" }}>KLÍČOVÉ PODMÍNKY SMLOUVY</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "💰", title: "Provize", desc: "2 % z dosažené kupní ceny (vč. DPH). Účtuje se pouze při úspěšném prodeji." },
            { icon: "📅", title: "Exkluzivita", desc: "90 dní od podpisu smlouvy. Po uplynutí lze inzerát zveřejnit i jinde." },
            { icon: "📋", title: "Výpověď", desc: "Smlouvu lze vypovědět s 30denní výpovědní lhůtou bez udání důvodu." },
            { icon: "🔒", title: "Anonymita", desc: "Identity kupujícího a prodávajícího jsou skryty až do zaplacení rezervace." },
            { icon: "⚖️", title: "Právní podpora", desc: "VEBRE Legal zajistí přípravu smluvní dokumentace (rezervační a kupní smlouva)." },
            { icon: "📣", title: "Distribuce", desc: "Inzerát bude zveřejněn na platformě VEBRE a partnerských portálech." },
          ].map(item => (
            <div key={item.title} style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
          ⚠️ Toto je zjednodušené shrnutí smlouvy pro demo účely. Plné znění smlouvy obdržíte na email.
        </div>

        <div onClick={() => setAgreed(v => !v)} style={{ padding: "16px 18px", background: agreed ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (agreed ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (agreed ? "#059669" : "#ccc"), background: agreed ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {agreed && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Souhlasím s podmínkami smlouvy o realitním zprostředkování a potvrzuji správnost zadaných údajů o nemovitosti.</div>
          </div>
        </div>

        <Btn full disabled={!agreed || signing} onClick={sign}>
          {signing ? "Podepisuji…" : "✍️ Podepsat a zveřejnit inzerát"}
        </Btn>
      </Card>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({ setPage, user, setUser }) => (
  <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,244,239,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ede9e3", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
    <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
      <div style={{ width: 30, height: 30, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#C9A84C", fontWeight: 900, fontSize: 14, fontFamily: "'Playfair Display', serif" }}>V</span></div>
      <span style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Playfair Display', serif" }}>VEBRE</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, color: "#666" }}>
      <span onClick={() => setPage("listings")} style={{ cursor: "pointer", fontWeight: 500 }}>Nabídka</span>
      {user && <span onClick={() => setPage(user.role === "SELLER" ? "seller-dash" : user.role === "ADMIN" ? "admin-dash" : "buyer-dash")} style={{ cursor: "pointer", fontWeight: 500 }}>Dashboard</span>}
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 600 }}>{user.nickname}</div><div style={{ fontSize: 11, color: "#999" }}>{user.role === "BUYER" ? "Kupující" : user.role === "SELLER" ? "Prodávající" : "Admin"}</div></div>
          <div onClick={() => { setUser(null); setPage("home"); }} style={{ width: 34, height: 34, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.nickname[0].toUpperCase()}</div>
        </div>
      ) : (<><Btn variant="ghost" small onClick={() => setPage("login")}>Přihlásit se</Btn><Btn small onClick={() => setPage("register")}>Začít</Btn></>)}
    </div>
  </nav>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  { nickname: "demo_kupujici", password: "demo123", role: "BUYER", anonymousId: "BYR-0001", label: "🏠 Kupující", desc: "Prohlíží nemovitosti, podává nabídky, rezervuje", color: "#3b82f6" },
  { nickname: "demo_prodavajici", password: "demo123", role: "SELLER", anonymousId: "SLR-0001", label: "🏗 Prodávající", desc: "Přidává inzeráty, spravuje nabídky", color: "#059669" },
  { nickname: "admin", password: "admin123", role: "ADMIN", anonymousId: "ADM-001", label: "⚙️ Admin", desc: "Přehled celé platformy, uživatelé, inzeráty", color: "#7c3aed" },
];

const LoginPage = ({ setPage, setUser }) => {
  const [role, setRole] = useState("BUYER");
  const [nickname, setNickname] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginWith = (account) => {
    setLoading(true);
    setTimeout(() => {
      if (account.role !== "ADMIN") {
        const users = getUsers();
        if (!users.find(u => u.nickname === account.nickname)) {
          saveUsers([...users, account]);
        }
      }
      // Předvyplnit demo údaje kupujícího pro všechny nemovitosti
      if (account.role === "BUYER") {
        const demoBuyerData = { firstName: "Jan", lastName: "Novák", birthNumber: "900101/1234", street: "Václavské náměstí 1", city: "Praha", zip: "110 00", phone: "+420 603 123 456", reservationFee: 50000, reservationDate: new Date().toISOString() };
        ["l1","l2","l3","l4"].forEach(id => {
          if (!localStorage.getItem("vebre_buyer_data_" + id)) {
            localStorage.setItem("vebre_buyer_data_" + id, JSON.stringify({ ...demoBuyerData, listingId: id }));
          }
        });
      }
      setUser(account);
      setPage(account.role === "SELLER" ? "seller-dash" : account.role === "ADMIN" ? "admin-dash" : "buyer-dash");
      setLoading(false);
    }, 600);
  };

  const login = () => {
    setError(""); if (!nickname.trim() || !pass) { setError("Vyplňte přezdívku a heslo."); return; }
    setLoading(true);
    setTimeout(() => {
      if (nickname === "admin" && pass === "admin123") { setUser({ nickname: "Admin", role: "ADMIN", anonymousId: "ADM-001" }); setPage("admin-dash"); setLoading(false); return; }
      const found = getUsers().find(u => u.nickname.toLowerCase() === nickname.toLowerCase() && u.password === pass);
      if (!found) { setError("Nesprávná přezdívka nebo heslo."); setLoading(false); return; }
      setUser(found); setPage(found.role === "SELLER" ? "seller-dash" : "buyer-dash"); setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ background: "#1a1a1a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48 }}>
        <blockquote><p style={{ ...D, color: "#fff", fontSize: 24, fontWeight: 600, lineHeight: 1.5, marginBottom: 18 }}>"VEBRE mi ušetřilo přes 200 000 Kč na provizi."</p><footer style={{ color: "#888", fontSize: 13 }}>Tomáš Procházka · Prodal v Praze 2</footer></blockquote>

        {/* Demo účty */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", marginBottom: 14 }}>🧪 DEMO ÚČTY — VYZKOUŠEJTE PLATFORMU</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.nickname} onClick={() => loginWith(acc)} disabled={loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: "1px solid #333", background: "#252525", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2e2e2e"}
                onMouseLeave={e => e.currentTarget.style.background = "#252525"}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>{acc.label}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{acc.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{acc.nickname}</div>
                    <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{acc.password}</div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: acc.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>→</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, textAlign: "center" }}>{[["50%", "Nižší provize"], ["94%", "Přesnost AI"], ["2,1 mld", "Objem transakcí"]].map(([v, lb]) => (<div key={lb}><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{v}</div><div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{lb}</div></div>))}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ ...D, fontSize: 30, fontWeight: 800, marginBottom: 5 }}>Přihlásit se</h1>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Nemáte účet? <span onClick={() => setPage("register")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Zaregistrujte se</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[{ r: "BUYER", label: "🏠 Kupující" }, { r: "SELLER", label: "🏗 Prodávající" }].map(({ r, label }) => (<button key={r} onClick={() => setRole(r)} style={{ padding: "10px 6px", borderRadius: 10, border: "1.5px solid " + (role === r ? "#1a1a1a" : "#e0dbd4"), background: role === r ? "#1a1a1a" : "#fff", color: role === r ? "#fff" : "#888", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{label}</button>))}
          </div>
          <Card style={{ padding: 26 }}>
            <Input label="PŘEZDÍVKA" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Vaše přezdívka" />
            <Input label="HESLO" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Vaše heslo" />
            {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
            <Btn full onClick={login} disabled={loading}>{loading ? "Přihlašuji…" : "Přihlásit se →"}</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
const RegisterPage = ({ setPage, setUser, isSeller }) => {
  const [role, setRole] = useState(isSeller ? "SELLER" : "BUYER");
  const [nickname, setNickname] = useState(""); const [pass, setPass] = useState(""); const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const register = () => {
    setError("");
    if (!nickname.trim()) { setError("Vyplňte přezdívku."); return; }
    if (pass.length < 6) { setError("Heslo musí mít alespoň 6 znaků."); return; }
    if (pass !== pass2) { setError("Hesla se neshodují."); return; }
    const users = getUsers();
    if (users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase())) { setError("Přezdívka je obsazena."); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = { nickname: nickname.trim(), password: pass, role, anonymousId: role === "BUYER" ? "BYR-" + Math.floor(1000 + Math.random() * 9000) : "SLR-" + Math.floor(1000 + Math.random() * 9000) };
      saveUsers([...users, newUser]); setUser(newUser); setPage(role === "BUYER" ? "buyer-dash" : "seller-dash"); setLoading(false);
    }, 1000);
  };
  return (
    <div style={{ maxWidth: 480, margin: "52px auto", padding: "0 24px" }}>
      <h1 style={{ ...D, fontSize: 34, fontWeight: 800, marginBottom: 7 }}>Vytvořit účet</h1>
      <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>Máte účet? <span onClick={() => setPage("login")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Přihlaste se</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[{ value: "BUYER", label: "🏠 Kupující", desc: "Hledám nemovitost" }, { value: "SELLER", label: "🏗 Prodávající", desc: "Chci prodat" }].map(r => (
          <button key={r.value} onClick={() => setRole(r.value)} style={{ padding: "14px 10px", borderRadius: 13, border: "2px solid " + (role === r.value ? "#1a1a1a" : "#e0dbd4"), background: role === r.value ? "#f7f4ef" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{r.label}</div><div style={{ fontSize: 11, color: "#888" }}>{r.desc}</div>
          </button>
        ))}
      </div>
      <Card style={{ padding: 26 }}>
        <Input label="PŘEZDÍVKA" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Zvolte si přezdívku" />
        <Input label="HESLO" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Min. 6 znaků" />
        <Input label="HESLO ZNOVU" type="password" value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Zopakujte heslo" />
        {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
        <Btn full onClick={register} disabled={loading || !nickname.trim()}>{loading ? "Vytvářím…" : "Vytvořit účet →"}</Btn>
      </Card>
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const listings = getListings();
  const [vi, setVi] = useState({ beds: 3, type: "APARTMENT" }); const [vr, setVr] = useState(null); const [vl, setVl] = useState(false);
  const [price, setPrice] = useState(15);
  const vebreFee = Math.round(price * 1e6 * 0.02);
  const agencyFee = Math.round(price * 1e6 * 0.04);
  const savings = agencyFee - vebreFee;
  const runVal = () => { setVl(true); setVr(null); setTimeout(() => { const base = { APARTMENT: 12000000, HOUSE: 28000000, OFFICE: 18000000 }; const b = base[vi.type] || 12000000; const v = Math.round(b * (0.8 + vi.beds * 0.12)); setVr({ value: v, confidence: 0.89, low: Math.round(v * 0.91), high: Math.round(v * 1.1) }); setVl(false); }, 1400); };
  return (
    <div>
      <div style={{ padding: "52px 32px 40px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 99, marginBottom: 28 }}>✦ REALITNÍ PLATFORMA NOVÉ GENERACE</div>
        <h1 style={{ ...D, fontSize: "clamp(38px,5vw,72px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 24px" }}>Kupujte a prodávejte<br /><span style={{ color: "#C9A84C" }}>chytřeji.</span></h1>
        <p style={{ fontSize: 22, color: "#666", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.5, fontWeight: 500 }}>Poloviční provize&nbsp;&nbsp;|&nbsp;&nbsp;Prověření kupující&nbsp;&nbsp;|&nbsp;&nbsp;Absolutní transparentnost.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}><Btn onClick={() => setPage("register-seller")}>Nabídnout nemovitost</Btn><Btn variant="outline" onClick={() => setPage("register")}>Hledám nemovitost</Btn></div>
      </div>
      <div style={{ background: "#1a1a1a", padding: "64px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}><AIBadge /><h2 style={{ ...D, color: "#fff", fontSize: 32, margin: "14px 0 8px" }}>AI Ocenění zdarma</h2></div>
          <Card style={{ background: "#252525", border: "1px solid #333" }}>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
              {[{ label: "POKOJE", key: "beds", opts: [1, 2, 3, 4, 5] }, { label: "TYP", key: "type", opts: ["APARTMENT", "HOUSE", "OFFICE"] }].map(f => (<div key={f.key}><div style={{ color: "#888", fontSize: 11, marginBottom: 6, fontWeight: 600 }}>{f.label}</div><select value={vi[f.key]} onChange={e => setVi({ ...vi, [f.key]: f.key === "beds" ? +e.target.value : e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "#333", color: "#fff", border: "1px solid #444", fontSize: 14 }}>{f.opts.map(o => <option key={o}>{o}</option>)}</select></div>))}
              <Btn onClick={runVal} disabled={vl}>{vl ? "Počítám…" : "Odhadnout →"}</Btn>
            </div>
            {vr && !vl && (<div style={{ padding: "0 24px 24px" }}><div style={{ height: 1, background: "#333", marginBottom: 20 }} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}><div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>ODHAD</div><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{fmt(vr.value)}</div></div><div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>{Math.round(vr.confidence * 100)}%</div></div><div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>TREND</div><div style={{ color: "#34d399", fontSize: 20, fontWeight: 700 }}>↗ Rostoucí</div></div></div></div>)}
          </Card>
        </div>
      </div>
      <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* #9 — Kalkulačka úspor */}
          <div style={{ background: "#f7f4ef", borderTop: "1px solid #ede9e3", padding: "56px 32px", marginLeft: -32, marginRight: -32 }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Kolik ušetříte s VEBRE?</h2>
                <p style={{ color: "#888", fontSize: 15 }}>Posuňte slider a zjistěte rozdíl v provizi</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 32 }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Cena nemovitosti</span>
                    <span style={{ ...D, fontSize: 18, fontWeight: 800 }}>{price} 000 000 Kč</span>
                  </div>
                  <input type="range" min={5} max={50} step={1} value={price} onChange={e => setPrice(+e.target.value)}
                    style={{ width: "100%", accentColor: "#C9A84C", height: 6 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#bbb", marginTop: 4 }}>
                    <span>5M Kč</span><span>50M Kč</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#f0fdf4", border: "2px solid #6ee7b7", borderRadius: 16, padding: 24, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 24, height: 24, background: "#1a1a1a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#C9A84C", fontWeight: 900, fontSize: 11 }}>V</span></div>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>VEBRE</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Provize 2%</div>
                    <div style={{ ...D, fontSize: 28, fontWeight: 800, color: "#059669" }}>{fmtFull(vebreFee)}</div>
                  </div>
                  <div style={{ background: "#f7f4ef", border: "1.5px solid #e0dbd4", borderRadius: 16, padding: 24, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12, color: "#888" }}>Tradiční agentura</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>Průměrná provize 4%</div>
                    <div style={{ ...D, fontSize: 28, fontWeight: 800, color: "#999" }}>{fmtFull(agencyFee)}</div>
                  </div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ color: "#888", fontSize: 14 }}>Vaše úspora s VEBRE</div>
                  <div style={{ ...D, fontSize: 32, fontWeight: 800, color: "#C9A84C" }}>{fmtFull(savings)}</div>
                </div>
              </div>
            </div>
          </div>

        <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}><h2 style={{ ...D, fontSize: 28, fontWeight: 800 }}>Vybrané nemovitosti</h2><Btn variant="outline" small onClick={() => setPage("listings")}>Zobrazit vše →</Btn></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>{listings.slice(0, 3).map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}</div>
      </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
const ListingCard = ({ l, setPage }) => (
  <Card onClick={() => setPage("listing-" + l.id)} style={{ padding: 0 }}>
    <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
      <img src={l.img} alt={l.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}><Badge color={l.daysOnMarket < 14 ? "green" : "amber"}>{l.daysOnMarket < 1 ? "Nové" : `${l.daysOnMarket}d`}</Badge></div>
      <div style={{ position: "absolute", bottom: 10, right: 10 }}><AIBadge /></div>
    </div>
    <div style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>📍 {l.district}, Praha</div>
      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 7, lineHeight: 1.35 }}>{l.title}</h3>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#888", marginBottom: 10 }}><span>🛏 {l.bedrooms}</span><span>📐 {l.internalSize}m²</span></div>
      <div style={{ ...D, fontSize: 20, fontWeight: 800 }}>{fmt(l.askingPrice)}</div>
      <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600 }}>✦ AI: {fmt(l.aiValuation)}</div>
    </div>
  </Card>
);

// ─── LISTINGS PAGE ────────────────────────────────────────────────────────────
const DISTRICTS = ["Vinohrady", "Malá Strana", "Smíchov", "Holešovice", "Žižkov", "Dejvice", "Nusle", "Karlín", "Vršovice", "Střešovice"];

const defaultFilters = { search: "", type: "Vše", priceMin: "", priceMax: "", sizeMin: "", sizeMax: "", bedroomsMin: "", district: "", hasGarage: false, hasBalcony: false, hasGarden: false, hasPool: false };

const ListingsPage = ({ setPage }) => {
  const listings = getListings();
  const [filters, setFilters] = useState(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const setF = (key) => (val) => setFilters(f => ({ ...f, [key]: val }));
  const setFE = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }));
  const setFB = (key) => () => setFilters(f => ({ ...f, [key]: !f[key] }));

  const filtered = listings.filter(l => {
    if (filters.type !== "Vše" && l.propertyType !== filters.type) return false;
    if (filters.search && !l.title.toLowerCase().includes(filters.search.toLowerCase()) && !l.district?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.priceMin && l.askingPrice < +filters.priceMin * 1e6) return false;
    if (filters.priceMax && l.askingPrice > +filters.priceMax * 1e6) return false;
    if (filters.sizeMin && l.internalSize < +filters.sizeMin) return false;
    if (filters.sizeMax && l.internalSize > +filters.sizeMax) return false;
    if (filters.bedroomsMin && l.bedrooms < +filters.bedroomsMin) return false;
    if (filters.district && l.district !== filters.district) return false;
    if (filters.hasGarage && !l.hasGarage) return false;
    if (filters.hasBalcony && !l.hasBalcony) return false;
    if (filters.hasGarden && !l.hasGarden) return false;
    if (filters.hasPool && !l.hasPool) return false;
    return true;
  });

  const activeCount = Object.entries(filters).filter(([k, v]) => v !== "" && v !== "Vše" && v !== false && k !== "search").length;
  const resetFilters = () => setFilters(defaultFilters);

  const SidebarSection = ({ title, children }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.05em", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );

  const CheckBtn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "1.5px solid " + (active ? "#1a1a1a" : "#e0dbd4"), background: active ? "#1a1a1a" : "#fff", color: active ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%", marginBottom: 6 }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, border: "2px solid " + (active ? "#fff" : "#ccc"), background: active ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {active && <span style={{ color: "#1a1a1a", fontSize: 10, fontWeight: 900 }}>✓</span>}
      </div>
      {children}
    </button>
  );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Nabídka nemovitostí</h1>
          <p style={{ color: "#888", fontSize: 13 }}>{filtered.length} z {listings.length} nemovitostí</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input placeholder="🔍  Hledat…" value={filters.search} onChange={setFE("search")}
            style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e0dbd4", fontSize: 14, fontFamily: "'DM Sans', sans-serif", width: 240 }} />
          <button onClick={() => setSidebarOpen(s => !s)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 12, border: "1.5px solid " + (sidebarOpen ? "#1a1a1a" : "#e0dbd4"), background: sidebarOpen ? "#1a1a1a" : "#fff", color: sidebarOpen ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            ⚙️ Filtry {activeCount > 0 && <span style={{ background: "#C9A84C", color: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 700, padding: "1px 7px" }}>{activeCount}</span>}
          </button>
          {activeCount > 0 && <button onClick={resetFilters} style={{ padding: "10px 14px", borderRadius: 12, border: "1.5px solid #fee2e2", background: "#fff", color: "#991b1b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕ Reset</button>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: sidebarOpen ? "260px 1fr" : "1fr", gap: 28 }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ alignSelf: "start", position: "sticky", top: 76 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: 22 }}>

              <SidebarSection title="TYP NEMOVITOSTI">
                {[{ v: "Vše", l: "Vše" }, { v: "APARTMENT", l: "🏢 Byt" }, { v: "HOUSE", l: "🏠 Dům" }, { v: "OFFICE", l: "🏗 Kancelář" }].map(t => (
                  <CheckBtn key={t.v} active={filters.type === t.v} onClick={() => setF("type")(t.v)}>{t.l}</CheckBtn>
                ))}
              </SidebarSection>

              <SidebarSection title="CENA (MIL. KČ)">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>Od</div>
                    <input type="number" value={filters.priceMin} onChange={setFE("priceMin")} placeholder="0" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>Do</div>
                    <input type="number" value={filters.priceMax} onChange={setFE("priceMax")} placeholder="100" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {[5, 10, 20, 50].map(v => (
                    <button key={v} onClick={() => setFilters(f => ({ ...f, priceMax: v }))} style={{ padding: "4px 10px", borderRadius: 99, border: "1.5px solid #e0dbd4", background: +filters.priceMax === v ? "#1a1a1a" : "#fff", color: +filters.priceMax === v ? "#fff" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>do {v}M</button>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection title="PLOCHA (M²)">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>Od</div>
                    <input type="number" value={filters.sizeMin} onChange={setFE("sizeMin")} placeholder="0" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>Do</div>
                    <input type="number" value={filters.sizeMax} onChange={setFE("sizeMax")} placeholder="∞" style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                  </div>
                </div>
              </SidebarSection>

              <SidebarSection title="POČET POKOJŮ (MIN.)">
                <div style={{ display: "flex", gap: 6 }}>
                  {["", "1", "2", "3", "4", "5+"].map(v => (
                    <button key={v} onClick={() => setF("bedroomsMin")(v === "5+" ? "5" : v)} style={{ flex: 1, padding: "8px 4px", borderRadius: 9, border: "1.5px solid " + (filters.bedroomsMin === (v === "5+" ? "5" : v) ? "#1a1a1a" : "#e0dbd4"), background: filters.bedroomsMin === (v === "5+" ? "5" : v) ? "#1a1a1a" : "#fff", color: filters.bedroomsMin === (v === "5+" ? "5" : v) ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{v || "Vše"}</button>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection title="LOKALITA / ČTVRŤ">
                <select value={filters.district} onChange={setFE("district")} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
                  <option value="">Všechny čtvrti</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </SidebarSection>

              <SidebarSection title="VYBAVENÍ">
                {[{ key: "hasGarage", label: "🚗 Garáž" }, { key: "hasBalcony", label: "🏙 Balkón / terasa" }, { key: "hasGarden", label: "🌿 Zahrada" }, { key: "hasPool", label: "🏊 Bazén" }].map(item => (
                  <CheckBtn key={item.key} active={filters[item.key]} onClick={setFB(item.key)}>{item.label}</CheckBtn>
                ))}
              </SidebarSection>

              {activeCount > 0 && (
                <button onClick={resetFilters} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid #fee2e2", background: "#fff5f5", color: "#991b1b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ✕ Zrušit všechny filtry
                </button>
              )}
            </div>
          </div>
        )}

        {/* Výsledky */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ ...D, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Žádné výsledky</h3>
              <p style={{ color: "#888", marginBottom: 20 }}>Zkuste upravit filtry nebo rozšířit hledání.</p>
              <Btn onClick={resetFilters} variant="outline">Zrušit filtry</Btn>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: sidebarOpen ? "repeat(auto-fill,minmax(280px,1fr))" : "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
              {filtered.map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── LISTING DETAIL ───────────────────────────────────────────────────────────
const ListingDetail = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [showOffer, setShowOffer] = useState(false);
  const [amount, setAmount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ai, setAi] = useState(null);
  const [ail, setAil] = useState(false);
  const [financing, setOfferFinancing] = useState("own");
  const [mortgageBank, setOfferBank] = useState("");
  // Hypotéka kalkulačka
  const [ltv, setLtv] = useState(80);
  const RATE = 5.2;

  useEffect(() => { if (l) setAmount(Math.round(l.askingPrice * 0.95)); }, [l]);
  if (!l) return null;

  const diff = ((l.aiValuation - l.askingPrice) / l.askingPrice) * 100;
  const getAI = () => { setAil(true); setTimeout(() => { setAi({ suggested: Math.round(l.aiValuation * 0.96), winProb: 74, tip: l.daysOnMarket > 20 ? `Inzerováno ${l.daysOnMarket} dní — prodávající je pravděpodobně flexibilní.` : `Čerstvá inzerce. Doporučujeme nabídku blízkou ceně.` }); setAil(false); }, 1200); };

  const submit = () => {
    if (!user) { setPage("login"); return; }
    const offers = JSON.parse(localStorage.getItem("vebre_offers") || "[]");
    offers.push({ id: "o" + Date.now(), listingId: l.id, listingTitle: l.title, listingAddress: l.address, listingImg: l.img, amount, financing, mortgageBank, buyerAnonymousId: user?.anonymousId || "BYR-0001", status: "PENDING", createdAt: new Date().toISOString() });
    localStorage.setItem("vebre_offers", JSON.stringify(offers));
    setSubmitted(true);
  };

  // Competing offers (mock)
  const competingOffers = [
    { pct: 0.91, label: "Nízká" },
    { pct: 0.96, label: "Střední" },
  ];

  // Kalkulačka hypotéky
  const loanAmount = l.askingPrice * (ltv / 100);
  const monthlyRate = RATE / 100 / 12;
  const months = 300; // 25 let
  const monthly = Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

  // Potvrzovací obrazovka
  if (submitted) return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Nabídka odeslána!</h1>
      <p style={{ color: "#666", fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Vaše nabídka byla doručena prodávajícímu. Odpověď obdržíte do 24 hodin.</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 16, padding: 24, marginBottom: 28, textAlign: "left" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
          <img src={l.img} alt={l.title} style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 8 }} />
          <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{l.title}</div><div style={{ fontSize: 12, color: "#666" }}>📍 {l.address}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ l: "VAŠE NABÍDKA", v: fmtFull(amount) }, { l: "VYVOLÁVACÍ CENA", v: fmtFull(l.askingPrice) }, { l: "FINANCOVÁNÍ", v: financing === "own" ? "Vlastní zdroje" : financing === "mortgage" ? `Hypotéka (${mortgageBank || "banka"})` : "Kombinace" }, { l: "STATUS", v: "⏳ Čeká na odpověď" }].map(item => (
            <div key={item.l} style={{ background: "#fff", borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 3 }}>{item.l}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: item.l === "STATUS" ? "#d97706" : item.l === "VAŠE NABÍDKA" ? "#059669" : "#1a1a1a" }}>{item.v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: "#dbeafe", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#1e40af" }}>
          ℹ️ Prodávající obdrží vaši anonymní nabídku. Identity budou odhaleny až po rezervaci.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn onClick={() => setPage("buyer-dash")}>Na dashboard</Btn>
        <Btn variant="outline" onClick={() => { setSubmitted(false); setShowOffer(false); }}>Zpět na inzerát</Btn>
      </div>
    </div>
  );

  const imgs = l.imgs || [l.img];

  // Mock cenová historie
  const priceHistory = [
    { date: "10. 11. 2024", event: "Inzerát zveřejněn", price: Math.round(l.askingPrice * 1.035), type: "published" },
    { date: "15. 1. 2025", event: "Cena snížena", price: l.askingPrice, type: "reduced" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <button onClick={() => setPage("listings")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: 40 }}>
        <div>
          <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 12 }}><img src={imgs[activeImg] || l.img} alt={l.title} style={{ width: "100%", height: 420, objectFit: "cover" }} /></div>
          {imgs.length > 1 && (<div style={{ display: "flex", gap: 8, marginBottom: 26 }}>{imgs.map((im, i) => (<div key={i} onClick={() => setActiveImg(i)} style={{ width: 76, height: 57, borderRadius: 9, overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2.5px solid #C9A84C" : "2.5px solid transparent", opacity: i === activeImg ? 1 : 0.6 }}><img src={im} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>))}</div>)}
          <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{l.title}</h1>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>📍 {l.address}</div>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: 14, marginBottom: 22 }}>{l.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 26 }}>{(l.features || []).map(f => <span key={f} style={{ background: "#f5f1ec", padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>✓ {f}</span>)}</div>

          {/* AI Ocenění */}
          <Card style={{ padding: 22, background: "#1a1a1a", border: "none", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><AIBadge /><span style={{ color: "#fff", fontWeight: 700 }}>AI Ocenění</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>AI ODHAD</div><div style={{ ...D, color: "#C9A84C", fontSize: 22, fontWeight: 800 }}>{fmt(l.aiValuation)}</div><div style={{ color: diff > 0 ? "#34d399" : "#f87171", fontSize: 11 }}>{diff > 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}%</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{Math.round(l.aiConfidence * 100)}%</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>ROZSAH</div><div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>{fmt(l.aiRange.low)} – {fmt(l.aiRange.high)}</div></div>
            </div>
          </Card>

          {/* #19 — Historie ceny */}
          <Card style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📈 Historie ceny</div>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: "#f0ede8" }} />
              {priceHistory.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < priceHistory.length - 1 ? 20 : 0, position: "relative" }}>
                  <div style={{ position: "absolute", left: -13, top: 4, width: 10, height: 10, borderRadius: "50%", background: item.type === "published" ? "#059669" : "#C9A84C", border: "2px solid #fff", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>{item.date}</div>
                    <div style={{ fontSize: 13, color: "#555", marginBottom: 2 }}>{item.event}</div>
                    <div style={{ ...D, fontSize: 16, fontWeight: 800, color: item.type === "reduced" ? "#C9A84C" : "#1a1a1a" }}>{fmtFull(item.price)}</div>
                  </div>
                  {item.type === "reduced" && (
                    <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#92400e", fontWeight: 600, alignSelf: "center" }}>
                      ↓ {Math.round((1 - item.price / priceHistory[0].price) * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* #20 — Kalkulačka hypotéky */}
          <Card style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🏦 Orientační splátka hypotéky</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Sazba je orientační ({RATE}% p.a.). Kontaktujte svého finančního poradce.</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
                <span>LTV (výše hypotéky)</span>
                <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{ltv}% = {fmtFull(Math.round(loanAmount))}</span>
              </div>
              <input type="range" min={60} max={90} step={5} value={ltv} onChange={e => setLtv(+e.target.value)}
                style={{ width: "100%", accentColor: "#C9A84C" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginTop: 3 }}>
                <span>60%</span><span>70%</span><span>80%</span><span>90%</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 4 }}>VÝŠE ÚVĚRU</div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{fmtFull(Math.round(loanAmount))}</div>
              </div>
              <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 4 }}>SPLATNOST</div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>25 let</div>
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>MĚSÍČNÍ SPLÁTKA</div>
                <div style={{ ...D, fontWeight: 800, fontSize: 17, color: "#C9A84C" }}>{fmtFull(monthly)}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Pravý panel */}
        <div style={{ position: "sticky", top: 76, alignSelf: "start" }}>
          <Card style={{ padding: 26 }}>
            <div style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 3 }}>{fmtFull(l.askingPrice)}</div>
            <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600, marginBottom: 18 }}>✦ AI odhad: {fmt(l.aiValuation)}</div>
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e" }}>🔒 Rezervační poplatek: <strong>50 000 Kč</strong></div>
            {!showOffer ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <Btn full onClick={() => { if (!user) { setPage("login"); return; } setShowOffer(true); getAI(); }}>Podat nabídku</Btn>
                <Btn variant="outline" full onClick={() => { if (!user) { setPage("login"); return; } setPage("booking-" + l.id); }}>Sjednat prohlídku</Btn>
                <Btn variant="ghost" full onClick={() => { if (!user) { setPage("login"); return; } setPage("reserve-" + l.id); }}>📋 Rezervovat + Smlouva</Btn>
              </div>
            ) : (
              <div>
                {ail ? <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>AI analyzuje…</div> : ai && (
                  <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                    <div style={{ color: "#C9A84C", fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{fmtFull(ai.suggested)}</div>
                    <div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>{ai.winProb}% šance na úspěch</div>
                    <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{ai.tip}</p>
                  </div>
                )}

                {/* #8 — Competing offers */}
                <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f7f4ef", borderRadius: 11, border: "1px solid #e0dbd4" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.04em" }}>AKTIVITA OSTATNÍCH ZÁJEMCŮ</div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{competingOffers.length} další nabídky</span> na tuto nemovitost
                  </div>
                  <div style={{ position: "relative", height: 8, background: "#e0dbd4", borderRadius: 99, marginBottom: 6 }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", borderRadius: 99, background: "linear-gradient(to right, #e0dbd4 0%, #d1fae5 60%, #C9A84C 85%, #e0dbd4 100%)" }} />
                    {competingOffers.map((o, i) => (
                      <div key={i} style={{ position: "absolute", top: -3, left: String(o.pct * 100 - 91) + "%", width: 14, height: 14, borderRadius: "50%", background: "#fff", border: "2.5px solid #888", transform: "translateX(-50%)" }} title={o.label} />
                    ))}
                    <div style={{ position: "absolute", top: -3, left: String((amount / l.askingPrice) * 100 - 91) + "%", width: 14, height: 14, borderRadius: "50%", background: "#1a1a1a", border: "2.5px solid #C9A84C", transform: "translateX(-50%)" }} title="Vaše nabídka" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb" }}>
                    <span>Nízké nabídky</span><span>Vaše</span><span>Vyvolávací cena</span>
                  </div>
                </div>

                {/* Cena */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>VAŠE NABÍDKA (KČ)</label>
                  <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 16, fontWeight: 700, boxSizing: "border-box" }} />
                </div>

                {/* #17 — Způsob financování */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>ZPŮSOB FINANCOVÁNÍ</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[{ id: "own", label: "💰 Vlastní prostředky" }, { id: "mortgage", label: "🏦 Hypotéka" }, { id: "combined", label: "🔀 Kombinace" }].map(f => (
                      <button key={f.id} onClick={() => setOfferFinancing(f.id)} style={{ padding: "9px 12px", borderRadius: 9, border: "1.5px solid " + (financing === f.id ? "#1a1a1a" : "#e0dbd4"), background: financing === f.id ? "#f7f4ef" : "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>{f.label}</button>
                    ))}
                  </div>
                  {financing === "mortgage" && (
                    <input value={mortgageBank} onChange={e => setOfferBank(e.target.value)} placeholder="Název banky…" style={{ marginTop: 8, width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #e0dbd4", fontSize: 12, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                  )}
                </div>

                <div style={{ display: "flex", gap: 7 }}>
                  <Btn variant="ghost" small onClick={() => setShowOffer(false)}>Zrušit</Btn>
                  <Btn full onClick={submit}>Odeslat nabídku</Btn>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── SELLER DASH ──────────────────────────────────────────────────────────────
const MOCK_SELLER_LISTING = { ...LISTINGS_DEFAULT[0], seller: { ...LISTINGS_DEFAULT[0].seller, anonymousId: "SLR-0001" }, daysOnMarket: 12, stats: { viewers: 247, interested: 8, viewings: 3 } };
const MOCK_OFFERS = [
  { id: "mo1", buyerId: "BYR-4471", amount: 26800000, date: "10. 1. 2025", financing: "Hypotéka (ČS)" },
  { id: "mo2", buyerId: "BYR-7732", amount: 27200000, date: "11. 1. 2025", financing: "Vlastní prostředky" },
];
const MOCK_VIEWINGS_SELLER = [
  { id: "mv1", buyerId: "BYR-4471", date: "15. 1. 2025", time: "10:00", initStatus: "pending" },
  { id: "mv2", buyerId: "BYR-7732", date: "16. 1. 2025", time: "14:00", initStatus: "confirmed" },
  { id: "mv3", buyerId: "BYR-9203", date: "17. 1. 2025", time: "11:00", initStatus: "pending" },
];

const SellerDash = ({ setPage, user }) => {
  const [tab, setTab] = useState("listings");
  const listings = getListings();
  const myListings = listings.filter(l => l.seller?.anonymousId === user?.anonymousId);
  const myViewings = getViewings().filter(v => v.sellerAnonymousId === user?.anonymousId);
  const isDemo = user?.anonymousId === "SLR-0001";
  const [offerStatuses, setOfferStatuses] = useState({ mo1: "new", mo2: "new" });
  const [viewingStatuses, setViewingStatuses] = useState({ mv1: "pending", mv2: "confirmed", mv3: "pending" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const confirmViewing = (id) => { const u = getViewings().map(v => v.id === id ? { ...v, status: "CONFIRMED" } : v); saveViewings(u); window.location.reload(); };
  const cancelViewing = (id) => { const u = getViewings().map(v => v.id === id ? { ...v, status: "CANCELLED" } : v); saveViewings(u); window.location.reload(); };

  const allListings = isDemo ? [MOCK_SELLER_LISTING, ...myListings] : myListings;
  const allViewings = isDemo ? MOCK_VIEWINGS_SELLER : myViewings;
  const pendingCount = isDemo ? MOCK_VIEWINGS_SELLER.filter(v => viewingStatuses[v.id] === "pending").length : myViewings.filter(v => v.status === "PENDING").length;

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      {toast && <div style={{ position: "fixed", top: 80, right: 24, background: "#059669", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>✓ {toast}</div>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard prodávajícího</h1><p style={{ color: "#888", fontSize: 13 }}>Správa inzerátů a nabídek</p></div>
        <Btn onClick={() => setPage("new-listing")}>+ Nový inzerát</Btn>
      </div>
      {pendingCount > 0 && (
        <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 14, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>📅 Máte <strong>{pendingCount}</strong> nové žádosti o prohlídku čekající na potvrzení</div>
          <button onClick={() => setTab("viewings")} style={{ background: "#92400e", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Zobrazit →</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "listings", label: "Moje inzeráty" }, { id: "offers", label: "Příchozí nabídky" + (isDemo ? " (2)" : "") }, { id: "viewings", label: "Prohlídky" + (pendingCount > 0 ? " (" + pendingCount + ")" : "") }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>

      {/* #3 — Inzeráty */}
      {tab === "listings" && (allListings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div><div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Zatím žádné inzeráty</div><p style={{ color: "#888", marginBottom: 20 }}>Přidejte svou první nemovitost</p><Btn onClick={() => setPage("new-listing")}>+ Přidat inzerát</Btn></div>
      ) : allListings.map(l => (
        <Card key={l.id} style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ display: "flex" }}>
            <img src={l.img} alt={l.title} style={{ width: 160, height: 120, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ padding: "16px 20px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{l.title}</h3>
                <Badge color="green">AKTIVNÍ</Badge>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>📍 {l.address} · {l.daysOnMarket} dní inzerce</div>
              <div style={{ ...D, fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{fmt(l.askingPrice)}</div>
              <div style={{ display: "flex", gap: 20 }}>
                {[{ icon: "👁", label: "Zobrazení", v: l.stats?.viewers || l.viewCount || 0 }, { icon: "🙋", label: "Zájemci", v: l.stats?.interested || 0 }, { icon: "📅", label: "Prohlídky", v: l.stats?.viewings || 0 }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", borderLeft: "1px solid #f0ede8" }}>
              <Btn small onClick={() => setPage("listing-" + l.id)}>Zobrazit</Btn>
              <Btn small variant="outline" onClick={() => setPage("availability-" + l.id)}>📅 Termíny</Btn>
              <Btn small variant="ghost" onClick={() => setPage("manage-listing-" + l.id)}>Spravovat</Btn>
            </div>
          </div>
        </Card>
      )))}

      {/* #4 — Nabídky */}
      {tab === "offers" && (isDemo ? MOCK_OFFERS : []).length === 0 && !isDemo ? (
        <Card style={{ padding: 22 }}><div style={{ textAlign: "center", padding: "24px 0", color: "#aaa" }}>Zatím žádné nabídky</div></Card>
      ) : tab === "offers" && (
        <div>
          {(isDemo ? MOCK_OFFERS : []).map(offer => (
            <Card key={offer.id} style={{ padding: 22, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{MOCK_SELLER_LISTING.title}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>od {offer.buyerId} · {offer.date} · {offer.financing}</div>
                </div>
                <Badge color={offerStatuses[offer.id] === "accepted" ? "green" : offerStatuses[offer.id] === "rejected" ? "red" : "amber"}>
                  {offerStatuses[offer.id] === "accepted" ? "✓ Přijatá" : offerStatuses[offer.id] === "rejected" ? "Odmítnuta" : "Nová"}
                </Badge>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ ...D, fontSize: 22, fontWeight: 800 }}>{fmtFull(offer.amount)}</div>
                  <div style={{ fontSize: 12, color: offer.amount >= MOCK_SELLER_LISTING.askingPrice ? "#059669" : "#d97706" }}>
                    {offer.amount >= MOCK_SELLER_LISTING.askingPrice ? "▲" : "▼"} {Math.abs(Math.round((offer.amount / MOCK_SELLER_LISTING.askingPrice - 1) * 100))}% od vyvolávací ceny
                  </div>
                </div>
                {offerStatuses[offer.id] === "new" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small onClick={() => { setOfferStatuses(s => ({ ...s, [offer.id]: "accepted" })); showToast("Nabídka přijata! Kupující byl informován."); }}>✓ Přijmout</Btn>
                    <Btn small variant="ghost" onClick={() => { setOfferStatuses(s => ({ ...s, [offer.id]: "rejected" })); showToast("Nabídka odmítnuta."); }}>Odmítnout</Btn>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* #5 — Prohlídky */}
      {tab === "viewings" && (allViewings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📅</div><div style={{ fontWeight: 600, marginBottom: 8 }}>Zatím žádné žádosti</div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allViewings.map(v => {
            const isMock = v.id?.startsWith("mv");
            const status = isMock ? viewingStatuses[v.id] : v.status?.toLowerCase();
            return (
              <Card key={v.id} style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{isMock ? MOCK_SELLER_LISTING.title : v.listingTitle}</div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Kupující: {isMock ? v.buyerId : v.buyerAnonymousId}</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ background: "#f7f4ef", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>📅 {isMock ? v.date : v.slot?.date}</span>
                      <span style={{ background: "#f7f4ef", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>🕐 {isMock ? v.time : v.slot?.time}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <Badge color={status === "confirmed" ? "green" : status === "cancelled" ? "red" : "amber"}>
                      {status === "confirmed" ? "✓ Potvrzeno" : status === "cancelled" ? "Zrušeno" : "⏳ Čeká"}
                    </Badge>
                    {status === "pending" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn small onClick={() => { if (isMock) { setViewingStatuses(s => ({ ...s, [v.id]: "confirmed" })); showToast("Prohlídka potvrzena!"); } else confirmViewing(v.id); }}>✓ Potvrdit</Btn>
                        <Btn small variant="ghost" onClick={() => { if (isMock) setViewingStatuses(s => ({ ...s, [v.id]: "cancelled" })); else cancelViewing(v.id); }}>Odmítnout</Btn>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── MANAGE LISTING PAGE ─────────────────────────────────────────────────────
const ManageListingPage = ({ id, setPage, user }) => {
  const listings = getListings();
  const raw = listings.find(x => x.id === id);
  const l = raw || { ...{ id: "l1", title: "Luxusní penthouse s výhledem na Prahu", address: "Mánesova 28, Praha 2 - Vinohrady", askingPrice: 28500000, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", imgs: [], district: "Vinohrady", internalSize: 180, bedrooms: 4, yearBuilt: 2020, daysOnMarket: 12, viewCount: 247, seller: { anonymousId: "SLR-0001" } }, stats: { viewers: 247, interested: 8, viewings: 3 } };

  const PORTALS = [
    { name: "Sreality", status: "active", icon: "🏠" },
    { name: "iDnes Reality", status: "active", icon: "📰" },
    { name: "Bezrealitky", status: "processing", icon: "🔄" },
    { name: "Sklik", status: "active", icon: "📣" },
    { name: "Facebook Marketplace", status: "inactive", icon: "📘" },
  ];

  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("overview");

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://vebre-5djc.vercel.app/#listing-${l.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("seller-dash")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na dashboard</button>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28 }}>
        <img src={l.img} alt={l.title} style={{ width: 100, height: 74, objectFit: "cover", borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ ...D, fontSize: 22, fontWeight: 800, margin: 0 }}>{l.title}</h1>
            <Badge color="green">AKTIVNÍ</Badge>
          </div>
          <div style={{ fontSize: 13, color: "#888" }}>📍 {l.address} · {l.daysOnMarket || 12} dní inzerce · {fmt(l.askingPrice)}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small variant="outline" onClick={() => setPage("listing-" + l.id)}>Náhled →</Btn>
          <Btn small onClick={() => setPage("availability-" + l.id)}>📅 Termíny</Btn>
        </div>
      </div>

      {/* Záložky */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "📊 Přehled" }, { id: "distribution", label: "📣 Distribuce" }, { id: "share", label: "🔗 Sdílení" }, { id: "progress", label: "📋 Průběh" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>

      {/* ── PŘEHLED ── */}
      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            {[{ icon: "👁", label: "Zobrazení", v: l.stats?.viewers || l.viewCount || 247, color: "#3b82f6" }, { icon: "🙋", label: "Zájemci", v: l.stats?.interested || 8, color: "#059669" }, { icon: "📅", label: "Prohlídky", v: l.stats?.viewings || 3, color: "#d97706" }, { icon: "📋", label: "Nabídky", v: 2, color: "#7c3aed" }].map(s => (
              <Card key={s.label} style={{ padding: 18 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ ...D, fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{s.label}</div>
              </Card>
            ))}
          </div>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 14, letterSpacing: "0.05em" }}>AKTIVITA POSLEDNÍCH 7 DNÍ</div>
            {[
              { date: "Dnes", event: "Nová nabídka — BYR-7732", type: "offer" },
              { date: "Včera", event: "Prohlídka potvrzena — BYR-4471", type: "viewing" },
              { date: "před 3 dny", event: "2 nové prohlídky nemovitosti", type: "view" },
              { date: "před 5 dny", event: "Nabídka — BYR-4471", type: "offer" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #f7f4ef" : "none", fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>{a.type === "offer" ? "📋" : a.type === "viewing" ? "📅" : "👁"}</span>
                <div style={{ flex: 1 }}><span style={{ fontWeight: 600 }}>{a.event}</span></div>
                <span style={{ color: "#bbb", fontSize: 12, whiteSpace: "nowrap" }}>{a.date}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── DISTRIBUCE ── (#32) */}
      {tab === "distribution" && (
        <Card style={{ padding: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Kde je váš inzerát zveřejněn</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PORTALS.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#f7f4ef", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: p.status === "active" ? "#059669" : p.status === "processing" ? "#d97706" : "#bbb" }}>
                      {p.status === "active" ? "✓ Publikováno" : p.status === "processing" ? "⏳ Zpracovává se…" : "— Neplánováno"}
                    </div>
                  </div>
                </div>
                {p.status === "active" && (
                  <a href="https://www.sreality.cz" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>Zobrazit inzerát →</a>
                )}
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.status === "active" ? "#059669" : p.status === "processing" ? "#d97706" : "#e0dbd4", flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, background: "#dbeafe", border: "1px solid #93c5fd", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1e40af" }}>
            ℹ️ Inzeráty jsou synchronizovány automaticky do 24 hodin od zveřejnění.
          </div>
        </Card>
      )}

      {/* ── SDÍLENÍ ── (#12) */}
      {tab === "share" && (
        <Card style={{ padding: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Sdílejte inzerát</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { name: "Facebook", icon: "📘", color: "#1877F2", bg: "#E7F0FD" },
              { name: "Instagram", icon: "📸", color: "#E1306C", bg: "#FCE4EC" },
              { name: "WhatsApp", icon: "💬", color: "#25D366", bg: "#E8F5E9" },
              { name: "Zkopírovat odkaz", icon: copied ? "✓" : "🔗", color: copied ? "#059669" : "#1a1a1a", bg: copied ? "#d1fae5" : "#f7f4ef" },
            ].map(s => (
              <button key={s.name} onClick={s.name === "Zkopírovat odkaz" ? copyLink : () => {}}
                style={{ padding: "16px 8px", borderRadius: 14, border: "none", background: s.bg, cursor: "pointer", textAlign: "center", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.name === "Zkopírovat odkaz" && copied ? "Zkopírováno!" : s.name}</div>
              </button>
            ))}
          </div>
          <div style={{ background: "#f7f4ef", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, fontSize: 12, color: "#888", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              https://vebre-5djc.vercel.app/#listing-{l.id}
            </div>
            <button onClick={copyLink} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
              {copied ? "✓ Zkopírováno" : "Kopírovat"}
            </button>
          </div>
        </Card>
      )}

      {/* ── PRŮBĚH TRANSAKCE ── (#6) */}
      {tab === "progress" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <TransactionProgress activeStep="viewing" />
          </div>
          <Card style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 14, letterSpacing: "0.05em" }}>AKTUÁLNÍ STAV</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", background: "#fef3c7", borderRadius: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>📅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Probíhají prohlídky</div>
                <div style={{ fontSize: 12, color: "#92400e" }}>3 prohlídky dokončeny · 2 čekají na potvrzení</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>
              Dalším krokem je přijetí nabídky od kupujícího. Po přijetí nabídky bude aktivován rezervační proces.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── PRÁVNÍ WORKFLOW ─────────────────────────────────────────────────────────
const FINANCING_OPTIONS = [
  { id: "cash", label: "💰 Vlastní zdroje", desc: "Platba z vlastních prostředků, bez hypotéky", deadlineDays: 30, color: "#059669" },
  { id: "mortgage_pending", label: "🏦 Hypotéka (nesjednaná)", desc: "Teprve vyřizuji hypotéku u banky", deadlineDays: 90, color: "#d97706" },
  { id: "mortgage_approved", label: "✅ Hypotéka (předschválená)", desc: "Banka mi hypotéku předschválila", deadlineDays: 60, color: "#3b82f6" },
  { id: "combined", label: "🔀 Kombinace", desc: "Část vlastní zdroje, část hypotéka", deadlineDays: 60, color: "#7c3aed" },
];

const WORKFLOW_STEPS = [
  { id: "verification", label: "Prověření nemovitosti", icon: "🔍" },
  { id: "financing", label: "Financování", icon: "💰" },
  { id: "reservation", label: "Rezervační smlouva", icon: "📋" },
  { id: "future_contract", label: "Smlouva o smlouvě budoucí", icon: "📝" },
  { id: "escrow_contract", label: "Smlouva o úschově", icon: "🔐" },
  { id: "purchase_contract", label: "Kupní smlouva", icon: "📄" },
  { id: "escrow_payment", label: "Úhrada do úschovy", icon: "💳" },
  { id: "cadastre", label: "Návrh na vklad do KN", icon: "🏛️" },
  { id: "handover", label: "Předání nemovitosti", icon: "🔑" },
];

const LegalWorkflowPage = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id) || listings[1];
  const today = new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
  const addDays = (days) => { const d = new Date(); d.setDate(d.getDate() + +days); return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }); };

  // Načtení uložených osobních údajů z rezervace
  const savedBuyer = getBuyerData(id) || {};
  const buyer = {
    firstName: savedBuyer.firstName || user?.nickname || "",
    lastName: savedBuyer.lastName || "",
    birthNumber: savedBuyer.birthNumber || "",
    street: savedBuyer.street || "",
    city: savedBuyer.city || "Praha",
    zip: savedBuyer.zip || "",
    phone: savedBuyer.phone || "",
  };

  const [activeStep, setActiveStep] = useState("verification");
  const [completedSteps, setCompletedSteps] = useState(["reservation"]);
  const [financing, setFinancing] = useState(null);
  const [ownAmount, setOwnAmount] = useState("5000000");
  const [mortgageAmount, setMortgageAmount] = useState("7500000");
  const [mortgageBank, setMortgageBank] = useState("Česká spořitelna");
  const [deadlineDays, setDeadlineDays] = useState(30);
  const [customDeadline, setCustomDeadline] = useState("");
  const [lvNumber, setLvNumber] = useState("1234");
  const [parcelNumber, setParcelNumber] = useState("567/8");
  const [cadastralArea, setCadastralArea] = useState(l?.district || "Nové Město");
  const [coowners, setCoowners] = useState(false);
  const [coownersDone, setCoownersDone] = useState(true);
  const [encumbrances, setEncumbrances] = useState("Bez zástavních práv a věcných břemen.");
  const [futureApproved, setFutureApproved] = useState({ buyer: false, seller: false });
  const [escrowContractApproved, setEscrowContractApproved] = useState({ buyer: false, seller: false });
  const [purchaseApproved, setPurchaseApproved] = useState({ buyer: false, seller: false });
  const [escrowSent, setEscrowSent] = useState(false);
  const [handoverDate, setHandoverDate] = useState("15. 5. 2025");
  const [meterReadings, setMeterReadings] = useState({ electricity: "12345", gas: "4567", water: "890" });
  const [keysHandedOver, setKeysHandedOver] = useState(false);
  const [handoverComplete, setHandoverComplete] = useState(false);
  const [lawyerSlot, setLawyerSlot] = useState(null);
  const [lawyerForm, setLawyerForm] = useState({ name: `${buyer.firstName} ${buyer.lastName}`.trim(), email: "jan.novak@email.cz", phone: buyer.phone || "+420 603 123 456" });
  const [lawyerBooked, setLawyerBooked] = useState(false);
  const [buyerComment, setBuyerComment] = useState("Žádám o prodloužení lhůty pro doložení hypotéky na 45 dní.");
  const [sellerComment, setSellerComment] = useState("Souhlasím s prodloužením lhůty. Ostatní podmínky jsou pro mě přijatelné.");
  const [commentsSent, setCommentsSent] = useState(false);

  if (!l) return null;

  const fin = FINANCING_OPTIONS.find(f => f.id === financing);
  const effectiveDeadline = customDeadline || deadlineDays;
  const isHypoteka = financing === "mortgage_pending" || financing === "mortgage_approved" || financing === "combined";
  const hypLhuta = Math.round(+effectiveDeadline * 0.5);

  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) setCompletedSteps(s => [...s, stepId]);
    const idx = WORKFLOW_STEPS.findIndex(s => s.id === stepId);
    if (idx < WORKFLOW_STEPS.length - 1) setActiveStep(WORKFLOW_STEPS[idx + 1].id);
  };

  // Generování termínů u advokáta
  const lawyerSlots = [];
  for (let d = 2; d <= 14; d++) {
    const date = new Date(); date.setDate(date.getDate() + d);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      ["9:00", "10:30", "13:00", "15:00"].filter(() => Math.random() > 0.4).forEach(t => {
        lawyerSlots.push({ id: `${d}-${t}`, date: date.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" }), time: t });
      });
    }
  }

  // Tisk dokumentů
  const printDoc = (title, content) => {
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>${title}</title>
    <style>body{font-family:Georgia,serif;max-width:820px;margin:40px auto;color:#1a1a1a;line-height:1.85;font-size:14px}h1{font-size:21px;text-align:center;margin-bottom:6px}h2{font-size:15px;margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:5px}.meta{text-align:center;color:#777;font-size:12px;margin-bottom:32px}.box{background:#f7f4ef;padding:14px 18px;border-radius:8px;margin:14px 0}.row{display:flex;justify-content:space-between;margin-bottom:5px}.lbl{color:#666;min-width:220px}.val{font-weight:bold}.clause{margin-bottom:12px}.sigs{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:52px}.sig{border-top:1px solid #888;padding-top:10px;font-size:13px;color:#666}.warn{background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:13px;color:#92400e;margin:16px 0}@media print{button{display:none}}</style>
    </head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const DocHeader = (title, no) => `<h1>${title}</h1><div class="meta">č. ${no} · VEBRE · ${today}</div><div class="warn">⚠️ Vzorový dokument generovaný automaticky. Před podpisem doporučujeme konzultaci s advokátem.</div>`;
  const BuyerBlock = () => `<div class="box"><div class="row"><span class="lbl">Kupující:</span><span class="val">${buyer.firstName} ${buyer.lastName}</span></div><div class="row"><span class="lbl">Rodné číslo:</span><span class="val">${buyer.birthNumber}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${buyer.street}, ${buyer.zip} ${buyer.city}</span></div><div class="row"><span class="lbl">Telefon:</span><span class="val">${buyer.phone}</span></div></div>`;
  const SellerBlock = () => `<div class="box"><div class="row"><span class="lbl">Prodávající:</span><span class="val">${l.seller.name}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${l.seller.address}</span></div><div class="row"><span class="lbl">E-mail:</span><span class="val">${l.seller.email}</span></div><div class="row"><span class="lbl">Telefon:</span><span class="val">${l.seller.phone}</span></div></div>`;
  const PropertyBlock = () => `<div class="box"><div class="row"><span class="lbl">Nemovitost:</span><span class="val">${l.title}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${l.address}</span></div><div class="row"><span class="lbl">List vlastnictví:</span><span class="val">${lvNumber || "–"}</span></div><div class="row"><span class="lbl">Parcelní číslo / č. jednotky:</span><span class="val">${parcelNumber || "–"}</span></div><div class="row"><span class="lbl">Katastrální území:</span><span class="val">${cadastralArea || "–"}</span></div><div class="row"><span class="lbl">Obec:</span><span class="val">${l.city}</span></div><div class="row"><span class="lbl">Plocha:</span><span class="val">${l.internalSize} m²</span></div></div>`;
  const FinancingBlock = () => `<div class="box"><div class="row"><span class="lbl">Způsob financování:</span><span class="val">${fin?.label || "–"}</span></div>${financing === "combined" ? `<div class="row"><span class="lbl">Vlastní zdroje:</span><span class="val">${ownAmount ? fmtFull(+ownAmount) : "–"}</span></div><div class="row"><span class="lbl">Hypoteční úvěr:</span><span class="val">${mortgageAmount ? fmtFull(+mortgageAmount) : "–"}</span></div>` : ""}${isHypoteka ? `<div class="row"><span class="lbl">Poskytovatel hypotéky:</span><span class="val">${mortgageBank || "–"}</span></div>` : ""}<div class="row"><span class="lbl">Kupní cena celkem:</span><span class="val">${fmtFull(l.askingPrice)}</span></div></div>`;
  const SigsBlock = () => `<div class="sigs"><div class="sig"><strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující<br/><br/>V ${l.city} dne ${today}<br/>Podpis: ___________________</div><div class="sig"><strong>${l.seller.name}</strong><br/>Prodávající<br/><br/>V ${l.city} dne ${today}<br/>Podpis: ___________________</div></div><div style="margin-top:40px;text-align:center;font-size:11px;color:#aaa">Vygenerováno platformou VEBRE · vebre.cz · ${today}</div>`;

  const printReservation = () => printDoc("Rezervační smlouva", `
    ${DocHeader("REZERVAČNÍ SMLOUVA", "RS-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>I. Smluvní strany</h2>${BuyerBlock()}${SellerBlock()}
    <h2>II. Předmět rezervace</h2>${PropertyBlock()}
    <h2>III. Způsob financování</h2>${FinancingBlock()}
    <h2>IV. Rezervační poplatek</h2>
    <div class="box"><div class="row"><span class="lbl">Výše poplatku:</span><span class="val">${fmtFull(l.reservationFee)}</span></div><div class="row"><span class="lbl">Splatnost:</span><span class="val">Do 3 pracovních dnů od podpisu smlouvy</span></div><div class="row"><span class="lbl">Uhrazen:</span><span class="val">${today}</span></div></div>
    <h2>V. Podmínky a závazky stran</h2>
    <div class="clause"><strong>1.</strong> Smlouva nabývá účinnosti uhrazením rezervačního poplatku připsáním na účet platformy VEBRE.</div>
    <div class="clause"><strong>2.</strong> Smluvní strany se zavazují uzavřít smlouvu o smlouvě budoucí kupní nejpozději do ${effectiveDeadline} dnů od nabytí účinnosti, tj. do ${addDays(effectiveDeadline)}.</div>
    ${isHypoteka ? `<div class="clause"><strong>3.</strong> <em>Rozvazovací podmínka — hypotéka:</em> Kupující je povinen doložit písemné rozhodnutí banky o schválení hypotečního úvěru do ${hypLhuta} dnů od nabytí účinnosti (tj. do ${addDays(hypLhuta)}). Nedoloží-li v této lhůtě, smlouva se ruší a rezervační poplatek se vrací kupujícímu v plné výši do 5 pracovních dnů.</div>` : ""}
    <div class="clause"><strong>${isHypoteka ? "4" : "3"}.</strong> Kupující prohlašuje, že osobně absolvoval prohlídku nemovitosti a je s jejím stavem seznámen.</div>
    <div class="clause"><strong>${isHypoteka ? "5" : "4"}.</strong> Kupní cena bude uhrazena prostřednictvím advokátní úschovy. Podmínky úschovy budou upraveny samostatnou smlouvou o advokátní úschově.</div>
    <div class="clause"><strong>${isHypoteka ? "6" : "5"}.</strong> Při odstoupení prodávajícím bude rezervační poplatek vrácen kupujícímu do 5 pracovních dnů. Prodávající je dále povinen nahradit kupujícímu účelně vynaložené náklady.</div>
    <div class="clause"><strong>${isHypoteka ? "7" : "6"}.</strong> Při odstoupení kupujícím bez závažného důvodu rezervační poplatek propadá ve prospěch prodávajícího jako smluvní pokuta.</div>
    <div class="clause"><strong>${isHypoteka ? "8" : "7"}.</strong> Vlastnické právo kupujícího k nemovitosti vznikne zápisem do katastru nemovitostí, nikoliv podpisem kupní smlouvy.</div>
    ${SigsBlock()}
  `);

  const printFutureContract = () => printDoc("Smlouva o smlouvě budoucí kupní", `
    ${DocHeader("SMLOUVA O SMLOUVĚ BUDOUCÍ KUPNÍ", "SSBK-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>I. Smluvní strany</h2>${BuyerBlock()}${SellerBlock()}
    <h2>II. Předmět budoucí koupě</h2>${PropertyBlock()}
    <h2>III. Způsob financování</h2>${FinancingBlock()}
    <h2>IV. Závazek uzavřít kupní smlouvu</h2>
    <div class="clause"><strong>1.</strong> Budoucí prodávající se zavazuje uzavřít s budoucím kupujícím kupní smlouvu o převodu nemovitosti specifikované v čl. II. této smlouvy.</div>
    <div class="clause"><strong>2.</strong> Kupní smlouva bude uzavřena nejpozději do <strong>${addDays(effectiveDeadline)}</strong>. Sjednaná kupní cena je <strong>${fmtFull(l.askingPrice)}</strong>.</div>
    <div class="clause"><strong>3.</strong> Na kupní cenu bude započten uhrazený rezervační poplatek ve výši ${fmtFull(l.reservationFee)}. Zbývající část ve výši ${fmtFull(l.askingPrice - l.reservationFee)} bude uhrazena prostřednictvím advokátní úschovy.</div>
    ${isHypoteka ? `<div class="clause"><strong>4.</strong> Uzavření kupní smlouvy je podmíněno schválením hypotečního úvěru kupujícímu bankou <strong>${mortgageBank || "–"}</strong>. Kupující je povinen doložit schválení hypotéky do ${addDays(hypLhuta)}. Nedoloží-li, smlouva se ruší bez nároku na smluvní pokutu.</div>` : ""}
    <h2>V. Úschova kupní ceny</h2>
    <div class="clause">Smluvní strany se dohodly, že kupní cena bude uhrazena prostřednictvím advokátní úschovy vedenou VEBRE Legal, s.r.o. Podmínky uvolnění budou upraveny smlouvou o advokátní úschově, kterou smluvní strany uzavřou nejpozději společně s kupní smlouvou.</div>
    <div class="clause">Prostředky z úschovy budou uvolněny prodávajícímu až po doložení zápisu vlastnického práva kupujícího v katastru nemovitostí.</div>
    ${isHypoteka ? `<h2>VI. Součinnost při hypotéce</h2><div class="clause">Prodávající se zavazuje poskytnout součinnost potřebnou pro zřízení zástavního práva banky k nemovitosti. Zástavní právo bude zapsáno do katastru nemovitostí současně s převodem vlastnického práva.</div>` : ""}
    ${SigsBlock()}
  `);

  const printEscrowContract = () => printDoc("Smlouva o advokátní úschově", `
    ${DocHeader("SMLOUVA O ADVOKÁTNÍ ÚSCHOVĚ", "US-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>I. Smluvní strany</h2>
    ${BuyerBlock()}${SellerBlock()}
    <div class="box"><div class="row"><span class="lbl">Advokát (schovatel):</span><span class="val">VEBRE Legal, s.r.o.</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">Národní 12, Praha 1, 110 00</span></div><div class="row"><span class="lbl">IČO:</span><span class="val">12345678</span></div><div class="row"><span class="lbl">Číslo ČAK:</span><span class="val">12345</span></div></div>
    <h2>II. Předmět úschovy</h2>
    <div class="box"><div class="row"><span class="lbl">Výše úschovy:</span><span class="val">${fmtFull(l.askingPrice - l.reservationFee)}</span></div><div class="row"><span class="lbl">Úschovní účet:</span><span class="val">1234567890/2700</span></div><div class="row"><span class="lbl">IBAN:</span><span class="val">CZ65 2700 0000 0012 3456 7890</span></div><div class="row"><span class="lbl">Variabilní symbol:</span><span class="val">${("US" + l.id).toUpperCase()}</span></div></div>
    <h2>III. Podmínky uvolnění</h2>
    <div class="clause"><strong>1. Uvolnění kupujícímu (prodávajícímu):</strong> Advokát uvolní prostředky z úschovy prodávajícímu po předložení výpisu z katastru nemovitostí prokazujícího zapsání vlastnického práva kupujícího, a to do 3 pracovních dnů od předložení.</div>
    <div class="clause"><strong>2. Vrácení kupujícímu:</strong> Advokát vrátí prostředky kupujícímu, pokud do ${addDays(+effectiveDeadline + 60)} dnů nebude předložen výpis z katastru dle bodu 1, nebo na základě písemné dohody obou stran.</div>
    ${isHypoteka ? `<div class="clause"><strong>3. Hypoteční úvěr:</strong> Prostředky budou poukázány přímo bankou ${mortgageBank || "–"} na úschovní účet. Advokát potvrdí přijetí prostředků bance i kupujícímu.</div>` : ""}
    <div class="clause"><strong>${isHypoteka ? "4" : "3"}.</strong> Odměna advokáta za vedení úschovy: 5 000 Kč (+ DPH), hradí kupující.</div>
    <h2>IV. Závěrečná ustanovení</h2>
    <div class="clause">Tato smlouva se řídí zákonem č. 89/2012 Sb. (občanský zákoník) a zákonem č. 85/1996 Sb. (zákon o advokacii).</div>
    <div class="sigs"><div class="sig"><strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující<br/>Podpis: ___________________</div><div class="sig"><strong>${l.seller.name}</strong><br/>Prodávající<br/>Podpis: ___________________</div></div>
    <div class="sig" style="margin-top:24px;max-width:300px"><strong>VEBRE Legal, s.r.o.</strong><br/>Advokát / schovatel<br/>Podpis a razítko: ___________________</div>
    <div style="margin-top:40px;text-align:center;font-size:11px;color:#aaa">Vygenerováno platformou VEBRE · vebre.cz · ${today}</div>
  `);

  const printPurchaseContract = () => printDoc("Kupní smlouva", `
    ${DocHeader("KUPNÍ SMLOUVA", "KS-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>I. Smluvní strany</h2>${BuyerBlock()}${SellerBlock()}
    <h2>II. Předmět koupě</h2>${PropertyBlock()}
    <h2>III. Způsob financování</h2>${FinancingBlock()}
    <h2>IV. Kupní cena a platební podmínky</h2>
    <div class="box"><div class="row"><span class="lbl">Kupní cena:</span><span class="val">${fmtFull(l.askingPrice)}</span></div><div class="row"><span class="lbl">Uhrazeno (rezervace):</span><span class="val">${fmtFull(l.reservationFee)}</span></div><div class="row"><span class="lbl">Doplatek přes úschovu:</span><span class="val">${fmtFull(l.askingPrice - l.reservationFee)}</span></div><div class="row"><span class="lbl">Splatnost doplatku:</span><span class="val">30 dní od podpisu na úschovní účet VEBRE Legal</span></div></div>
    <h2>V. Převod vlastnictví</h2>
    <div class="clause"><strong>1.</strong> Vlastnické právo kupujícího k nemovitosti vzniká <strong>zápisem do katastru nemovitostí</strong>, nikoliv podpisem této smlouvy (§ 1105 OZ).</div>
    <div class="clause"><strong>2.</strong> Prodávající se zavazuje převést nemovitost prosté věcných břemen, zástavních práv a jiných závad, s výjimkou zástavního práva banky ${isHypoteka ? mortgageBank || "–" : "–"} vzniklého na základě hypotečního úvěru kupujícího.</div>
    <div class="clause"><strong>3.</strong> Kupní cena bude uvolněna z advokátní úschovy prodávajícímu po doložení zápisu vlastnického práva kupujícího v katastru nemovitostí.</div>
    ${isHypoteka ? `<div class="clause"><strong>4.</strong> Zástavní právo banky ${mortgageBank || "–"} bude zapsáno do katastru nemovitostí současně s vlastnickým právem kupujícího. Prodávající uděluje souhlas se zřízením zástavního práva.</div>` : ""}
    <h2>VI. Předání nemovitosti</h2>
    <div class="clause">Prodávající předá nemovitost kupujícímu do 14 dnů od připsání kupní ceny na úschovní účet. O předání bude sepsán předávací protokol obsahující stav měřičů energií a počet předaných klíčů.</div>
    <h2>VII. Návrh na vklad</h2>
    <div class="clause">Návrh na povolení vkladu vlastnického práva podají smluvní strany prostřednictvím advokáta do 5 pracovních dnů od podpisu této smlouvy. Správní poplatek 2 000 Kč za každé vkládané právo hradí kupující.</div>
    <div class="clause">Smluvní strany berou na vědomí, že po dobu řízení o povolení vkladu nemůže prodávající nemovitost zatížit ani s ní jinak nakládat.</div>
    ${SigsBlock()}
  `);

  const printCadastre = () => printDoc("Návrh na vklad do KN", `
    ${DocHeader("NÁVRH NA POVOLENÍ VKLADU DO KATASTRU NEMOVITOSTÍ", "KN-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>Adresát</h2>
    <div class="box"><div>Katastrální úřad pro hlavní město Prahu<br/>Katastrální pracoviště Praha<br/>Pod sídlištěm 1800/9a, 182 14 Praha 8</div></div>
    <h2>I. Účastníci řízení</h2>
    <div class="box"><div class="row"><span class="lbl">1. účastník (nabyvatel):</span><span class="val">${buyer.firstName} ${buyer.lastName}, RČ: ${buyer.birthNumber}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${buyer.street}, ${buyer.zip} ${buyer.city}</span></div></div>
    <div class="box"><div class="row"><span class="lbl">2. účastník (převodce):</span><span class="val">${l.seller.name}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${l.seller.address}</span></div></div>
    <h2>II. Nemovitost</h2>
    <div class="box"><div class="row"><span class="lbl">List vlastnictví č.:</span><span class="val">${lvNumber || "DOPLNIT"}</span></div><div class="row"><span class="lbl">Parcelní číslo / č. jednotky:</span><span class="val">${parcelNumber || "DOPLNIT"}</span></div><div class="row"><span class="lbl">Katastrální území:</span><span class="val">${cadastralArea || "DOPLNIT"}</span></div><div class="row"><span class="lbl">Obec:</span><span class="val">${l.city}</span></div><div class="row"><span class="lbl">Adresa:</span><span class="val">${l.address}</span></div></div>
    <h2>III. Navrhovaný vklad</h2>
    <div class="clause">Na základě kupní smlouvy ze dne ${today} navrhujeme, aby katastrální úřad povolil vklad vlastnického práva k výše specifikované nemovitosti ve prospěch nabyvatele ${buyer.firstName} ${buyer.lastName}.</div>
    ${isHypoteka ? `<div class="clause">Současně navrhujeme vklad zástavního práva ve prospěch banky ${mortgageBank || "–"} na základě zástavní smlouvy ze dne ${today}.</div>` : ""}
    <h2>IV. Přílohy</h2>
    <div class="clause">1. Kupní smlouva — originál nebo úředně ověřená kopie (2×)</div>
    <div class="clause">2. Výpis z katastru nemovitostí — ne starší 3 měsíců</div>
    <div class="clause">3. Snímek katastrální mapy</div>
    ${isHypoteka ? `<div class="clause">4. Zástavní smlouva (2×)</div>` : ""}
    <div class="clause">${isHypoteka ? "5" : "4"}. Doklad o zaplacení správního poplatku: ${isHypoteka ? "4 000 Kč (2× 2 000 Kč)" : "2 000 Kč"}</div>
    <div class="sigs"><div class="sig"><strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující<br/>V ${l.city} dne ${today}<br/>Podpis: ___________________</div><div class="sig"><strong>${l.seller.name}</strong><br/>Prodávající<br/>V ${l.city} dne ${today}<br/>Podpis: ___________________</div></div>
    <div style="margin-top:40px;text-align:center;font-size:11px;color:#aaa">Vygenerováno platformou VEBRE · vebre.cz · ${today}</div>
  `);

  const printHandover = () => printDoc("Předávací protokol", `
    ${DocHeader("PŘEDÁVACÍ PROTOKOL NEMOVITOSTI", "PP-" + l.id.toUpperCase() + "-" + new Date().getFullYear())}
    <h2>I. Smluvní strany</h2>${BuyerBlock()}${SellerBlock()}
    <h2>II. Předávaná nemovitost</h2>${PropertyBlock()}
    <h2>III. Stavy měřičů k datu předání (${handoverDate || today})</h2>
    <div class="box"><div class="row"><span class="lbl">Elektřina (číslo měřiče):</span><span class="val">${meterReadings.electricity || "–"}</span></div><div class="row"><span class="lbl">Plyn (číslo měřiče):</span><span class="val">${meterReadings.gas || "–"}</span></div><div class="row"><span class="lbl">Voda (číslo měřiče):</span><span class="val">${meterReadings.water || "–"}</span></div></div>
    <h2>IV. Předané klíče a přístupové prostředky</h2>
    <div class="box"><div class="clause">Prodávající předal kupujícímu klíče a přístupové prostředky k nemovitosti. Kupující jejich převzetí potvrzuje.</div></div>
    <h2>V. Stav nemovitosti</h2>
    <div class="clause">Kupující prohlašuje, že nemovitost přebírá ve stavu, v jakém ji viděl při prohlídce, a nemá k jejímu stavu žádné výhrady, pokud není níže uvedeno jinak.</div>
    <h2>VI. Závěr</h2>
    <div class="clause">Podpisem tohoto protokolu potvrzují obě smluvní strany, že k předání nemovitosti došlo řádně a včas.</div>
    ${SigsBlock()}
  `);

  // UI helpers
  const StepCard = ({ children, title, subtitle }) => (
    <Card style={{ padding: 26, marginBottom: 16 }}>
      {title && <div style={{ ...D, fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>{subtitle}</div>}
      {children}
    </Card>
  );

  const ApprovalBox = ({ label, approved, onToggle, color = "#059669" }) => (
    <div onClick={onToggle} style={{ padding: 16, background: approved ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (approved ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid " + (approved ? color : "#ccc"), background: approved ? color : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {approved && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
        </div>
        <div><div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div><div style={{ fontSize: 11, color: approved ? color : "#aaa" }}>{approved ? "Schváleno" : "Čeká"}</div></div>
      </div>
    </div>
  );

  const PdfBtn = ({ onClick, label }) => (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
      📄 {label}
    </button>
  );

  const InfoBox = ({ color = "blue", icon, children }) => {
    const colors = { blue: ["#dbeafe", "#1e40af"], amber: ["#fef3c7", "#92400e"], green: ["#d1fae5", "#065f46"], red: ["#fee2e2", "#991b1b"] };
    const [bg, tx] = colors[color];
    return <div style={{ background: bg, border: "1px solid " + (bg), borderRadius: 10, padding: "12px 16px", fontSize: 13, color: tx, marginBottom: 16, lineHeight: 1.6 }}>{icon} {children}</div>;
  };

  return (
    <div style={{ maxWidth: 980, margin: "32px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("buyer-dash")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na dashboard</button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ ...D, fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Právní proces koupě</h1>
          <div style={{ fontSize: 13, color: "#888" }}>{l.title} · {fmtFull(l.askingPrice)}</div>
        </div>
        {fin && <Badge color="blue">{fin.label}</Badge>}
      </div>

      {/* Stepper */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ede9e3", padding: "18px 20px", marginBottom: 28, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: 700 }}>
          {WORKFLOW_STEPS.map((s, i) => {
            const done = completedSteps.includes(s.id);
            const active = activeStep === s.id;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div onClick={() => (done || active) && setActiveStep(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: done || active ? "pointer" : "default", minWidth: 68 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: done ? "#059669" : active ? "#1a1a1a" : "#e0dbd4", color: done || active ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 13 : 14, fontWeight: 700 }}>{done ? "✓" : s.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? "#1a1a1a" : done ? "#059669" : "#aaa", textAlign: "center", lineHeight: 1.3 }}>{s.label}</div>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && <div style={{ width: 24, height: 2, background: done ? "#059669" : "#e0dbd4", margin: "0 2px", marginBottom: 18, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── KROK 1: PROVĚŘENÍ NEMOVITOSTI ── */}
      {activeStep === "verification" && (
        <StepCard title="🔍 Prověření nemovitosti" subtitle="Před podpisem jakékoli smlouvy je nutné ověřit právní stav nemovitosti v katastru. Toto je klíčový krok — odhalí zástavy, věcná břemena, exekuce nebo spoluvlastníky.">
          <InfoBox color="amber" icon="⚠️">Vždy si vyžádejte aktuální výpis z katastru nemovitostí (LV) přímo z <a href="https://nahlizenidokn.cuzk.cz" target="_blank" rel="noreferrer" style={{ color: "#92400e" }}>nahlizenidokn.cuzk.cz</a>. Výpis musí být ne starší 3 měsíců.</InfoBox>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <Input label="ČÍSLO LISTU VLASTNICTVÍ (LV)" value={lvNumber} onChange={e => setLvNumber(e.target.value)} placeholder="Např. 1234" />
            <Input label="PARCELNÍ ČÍSLO / Č. JEDNOTKY" value={parcelNumber} onChange={e => setParcelNumber(e.target.value)} placeholder="Např. 567/1 nebo 567/1-89" />
            <Input label="KATASTRÁLNÍ ÚZEMÍ" value={cadastralArea} onChange={e => setCadastralArea(e.target.value)} placeholder="Např. Vinohrady" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>VĚCNÁ BŘEMENA A ZÁSTAVY</div>
            <textarea value={encumbrances} onChange={e => setEncumbrances(e.target.value)} rows={2} placeholder="Z výpisu z KN opište případná věcná břemena, zástavní práva nebo jiné závady (nebo napište 'Žádné')…" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 20, padding: "16px 18px", background: coowners ? "#fef3c7" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (coowners ? "#fde68a" : "#e0dbd4") }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>SPOLUVLASTNICTVÍ A PŘEDKUPNÍ PRÁVO</div>
            <div style={{ display: "flex", gap: 10, marginBottom: coowners ? 12 : 0 }}>
              {[{ v: false, l: "Nemovitost nemá spoluvlastníky" }, { v: true, l: "Má spoluvlastníky" }].map(opt => (
                <button key={String(opt.v)} onClick={() => setCoowners(opt.v)} style={{ padding: "8px 16px", borderRadius: 9, border: "1.5px solid " + (coowners === opt.v ? "#1a1a1a" : "#e0dbd4"), background: coowners === opt.v ? "#1a1a1a" : "#fff", color: coowners === opt.v ? "#fff" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{opt.l}</button>
              ))}
            </div>
            {coowners && (
              <div>
                <InfoBox color="amber" icon="⚠️">Nemovitost má spoluvlastníky. Dle § 1124 OZ mají zákonné předkupní právo. Prodávající jim musí nabídnout koupi za stejných podmínek. Doložte prosím písemné vzdání se předkupního práva nebo doklad o jeho vypořádání.</InfoBox>
                <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setCoownersDone(v => !v)}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (coownersDone ? "#059669" : "#ccc"), background: coownersDone ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {coownersDone && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Předkupní právo spoluvlastníků bylo vypořádáno</span>
                </div>
              </div>
            )}
          </div>

          <Btn disabled={!lvNumber || !parcelNumber || (coowners && !coownersDone)} onClick={() => completeStep("verification")}>
            Prověření dokončeno, pokračovat →
          </Btn>
        </StepCard>
      )}

      {/* ── KROK 2: FINANCOVÁNÍ ── */}
      {activeStep === "financing" && (
        <StepCard title="💰 Způsob financování" subtitle="Vyberte způsob úhrady kupní ceny. Ovlivní obsah smluv, lhůty a postup při hypotéce.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {FINANCING_OPTIONS.map(f => (
              <div key={f.id} onClick={() => { setFinancing(f.id); setDeadlineDays(f.deadlineDays); }} style={{ padding: 16, borderRadius: 12, border: "2px solid " + (financing === f.id ? f.color : "#e0dbd4"), background: financing === f.id ? "#f7fffe" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: financing === f.id ? f.color : "#1a1a1a" }}>{f.label}</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{f.desc}</div>
                <div style={{ fontSize: 11, color: financing === f.id ? f.color : "#bbb", fontWeight: 600 }}>Výchozí lhůta pro KS: {f.deadlineDays} dní</div>
              </div>
            ))}
          </div>

          {financing === "combined" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <Input label="VLASTNÍ ZDROJE (KČ)" value={ownAmount} onChange={e => setOwnAmount(e.target.value)} placeholder="Např. 5 000 000" />
              <Input label="HYPOTEČNÍ ÚVĚR (KČ)" value={mortgageAmount} onChange={e => setMortgageAmount(e.target.value)} placeholder="Např. 14 500 000" />
            </div>
          )}
          {isHypoteka && (
            <div style={{ marginBottom: 14 }}>
              <Input label="BANKA / POSKYTOVATEL HYPOTÉKY" value={mortgageBank} onChange={e => setMortgageBank(e.target.value)} placeholder="Např. Česká spořitelna, Komerční banka…" />
              {financing === "mortgage_pending" && <InfoBox color="amber" icon="⚠️">Rezervační smlouva bude obsahovat rozvazovací podmínku. Nedoložíte-li schválení hypotéky do {Math.round(+deadlineDays * 0.5)} dní, smlouva se ruší a rezervační poplatek se vrací v plné výši.</InfoBox>}
              {financing === "mortgage_approved" && <InfoBox color="blue" icon="ℹ️">Do smlouvy bude zahrnuta podmínka platnosti předschválení. Doporučujeme přiložit potvrzení banky. Pamatujte, že při hypotéce banka požaduje zástavní právo k nemovitosti.</InfoBox>}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>LHŮTA PRO UZAVŘENÍ KUPNÍ SMLOUVY</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {[30, 45, 60, 90].map(d => (
                <button key={d} onClick={() => { setDeadlineDays(d); setCustomDeadline(""); }} style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid " + (deadlineDays === d && !customDeadline ? "#1a1a1a" : "#e0dbd4"), background: deadlineDays === d && !customDeadline ? "#1a1a1a" : "#fff", color: deadlineDays === d && !customDeadline ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{d} dní</button>
              ))}
              <input type="number" value={customDeadline} onChange={e => setCustomDeadline(e.target.value)} placeholder="Vlastní…" style={{ width: 100, padding: "8px 12px", borderRadius: 10, border: "1.5px solid " + (customDeadline ? "#1a1a1a" : "#e0dbd4"), fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            {financing && <div style={{ fontSize: 12, color: "#666" }}>Kupní smlouva musí být podepsána nejpozději: <strong>{addDays(+effectiveDeadline)}</strong></div>}
          </div>

          <Btn disabled={!financing || (isHypoteka && !mortgageBank)} onClick={() => completeStep("financing")}>Potvrdit způsob financování →</Btn>
        </StepCard>
      )}

      {/* ── KROK 3: REZERVAČNÍ SMLOUVA ── */}
      {activeStep === "reservation" && (
        <StepCard title="📋 Rezervační smlouva" subtitle="Smlouva byla uzavřena a rezervační poplatek uhrazen. Níže je shrnutí podmínek.">
          <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#059669", marginBottom: 2 }}>Rezervační smlouva uzavřena a účinná</div>
              <div style={{ fontSize: 12, color: "#059669" }}>Rezervační poplatek {fmtFull(l.reservationFee)} uhrazen · {today}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ l: "KUPNÍ CENA", v: fmtFull(l.askingPrice) }, { l: "FINANCOVÁNÍ", v: fin?.label || "–" }, { l: "LHŮTA PRO KS", v: addDays(+effectiveDeadline) }].map(item => (
              <div key={item.l} style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 5 }}>{item.l}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{item.v}</div></div>
            ))}
          </div>
          {isHypoteka && <InfoBox color="amber" icon="🏦">Podmínka hypotéky: Schválení musí být doloženo do <strong>{addDays(hypLhuta)}</strong>. Po uplynutí lhůty bez doložení se smlouva ruší a poplatek se vrací.</InfoBox>}
          {buyer.firstName && <InfoBox color="blue" icon="👤">Osobní údaje načteny z rezervace: <strong>{buyer.firstName} {buyer.lastName}</strong>, RČ: {buyer.birthNumber}. Budou automaticky použity ve všech smlouvách.</InfoBox>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfBtn onClick={printReservation} label="Stáhnout rezervační smlouvu (PDF)" />
            <Btn onClick={() => completeStep("reservation")}>Pokračovat →</Btn>
          </div>
        </StepCard>
      )}

      {/* ── KROK 4: SSBK ── */}
      {activeStep === "future_contract" && (
        <StepCard title="📝 Smlouva o smlouvě budoucí kupní" subtitle="Obě strany se zaváží uzavřít kupní smlouvu za dohodnutých podmínek. SSBK upravuje i podmínky úschovy a hypotéky.">
          <div style={{ marginBottom: 20 }}>
            {[
              { l: "Termín uzavření KS", v: addDays(+effectiveDeadline) },
              { l: "Kupní cena", v: fmtFull(l.askingPrice) },
              { l: "Doplatek přes úschovu", v: fmtFull(l.askingPrice - l.reservationFee) },
              { l: "Způsob financování", v: fin?.label || "–" },
              { l: "Úschova kupní ceny", v: "VEBRE Legal, s.r.o." },
              isHypoteka && { l: "Lhůta pro doložení hypotéky", v: addDays(hypLhuta) },
              isHypoteka && { l: "Zástavní právo banky", v: mortgageBank + " — zřízeno současně s převodem" },
            ].filter(Boolean).map(row => (
              <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0ede8", fontSize: 13 }}>
                <span style={{ color: "#888" }}>{row.l}</span><span style={{ fontWeight: 700 }}>{row.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>PŘIPOMÍNKY KE SMLOUVĚ</div>
            {commentsSent ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {buyerComment && <div style={{ background: "#dbeafe", borderRadius: 10, padding: 14, fontSize: 13, color: "#1e40af" }}><strong>Kupující:</strong> {buyerComment}</div>}
                {sellerComment && <div style={{ background: "#d1fae5", borderRadius: 10, padding: 14, fontSize: 13, color: "#065f46" }}><strong>Prodávající:</strong> {sellerComment}</div>}
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                  <div><div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, marginBottom: 6 }}>KUPUJÍCÍ</div><textarea value={buyerComment} onChange={e => setBuyerComment(e.target.value)} rows={3} placeholder="Vaše připomínky…" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} /></div>
                  <div><div style={{ fontSize: 11, color: "#059669", fontWeight: 600, marginBottom: 6 }}>PRODÁVAJÍCÍ</div><textarea value={sellerComment} onChange={e => setSellerComment(e.target.value)} rows={3} placeholder="Reakce nebo připomínky…" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} /></div>
                </div>
                <button onClick={() => setCommentsSent(true)} style={{ background: "none", border: "1.5px solid #e0dbd4", borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Odeslat připomínky</button>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <ApprovalBox label="Kupující schvaluje" approved={futureApproved.buyer} onToggle={() => setFutureApproved(s => ({ ...s, buyer: !s.buyer }))} />
            <ApprovalBox label="Prodávající schvaluje" approved={futureApproved.seller} onToggle={() => setFutureApproved(s => ({ ...s, seller: !s.seller }))} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfBtn onClick={printFutureContract} label="Stáhnout SSBK (PDF)" />
            {futureApproved.buyer && futureApproved.seller && <Btn onClick={() => completeStep("future_contract")}>SSBK schválena →</Btn>}
          </div>
        </StepCard>
      )}

      {/* ── KROK 5: SMLOUVA O ÚSCHOVĚ ── */}
      {activeStep === "escrow_contract" && (
        <StepCard title="🔐 Smlouva o advokátní úschově" subtitle="Třístranná smlouva mezi kupujícím, prodávajícím a advokátem. Upravuje podmínky uložení a uvolnění kupní ceny. Musí být uzavřena před kupní smlouvou.">
          <InfoBox color="blue" icon="ℹ️">Kupní cena nikdy nepřechází přímo mezi stranami. Nejprve jde na úschovní účet advokáta a uvolní se prodávajícímu až po zapsání vlastnického práva kupujícího v katastru nemovitostí.</InfoBox>
          {isHypoteka && <InfoBox color="amber" icon="🏦">Hypoteční prostředky poukáže banka přímo na úschovní účet. Advokát potvrdí přijetí bance. Zástavní právo banky bude zapsáno do KN současně s převodem vlastnictví.</InfoBox>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 8 }}>ÚSCHOVNÍ ÚČET</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>VEBRE Legal, s.r.o.</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>Číslo účtu: 1234567890/2700</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>IBAN: CZ65 2700 0000 0012 3456 7890</div>
              <div style={{ fontSize: 12, color: "#666" }}>VS: {("US" + l.id).toUpperCase()}</div>
            </div>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 8 }}>PODMÍNKY UVOLNĚNÍ</div>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.7 }}>
                ✓ Po zápisu vlastnického práva v KN<br />
                ✓ Do 3 pracovních dnů od předložení výpisu<br />
                {isHypoteka && "✓ Zástavní právo banky zapsáno současně"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ l: "K ULOŽENÍ DO ÚSCHOVY", v: fmtFull(l.askingPrice - l.reservationFee) }, { l: "ODMĚNA ADVOKÁTA", v: "5 000 Kč + DPH" }, { l: "UVOLNĚNÍ", v: "Po zápisu v KN" }].map(item => (
              <div key={item.l} style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 5 }}>{item.l}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{item.v}</div></div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <ApprovalBox label="Kupující podepisuje" approved={escrowContractApproved.buyer} onToggle={() => setEscrowContractApproved(s => ({ ...s, buyer: !s.buyer }))} />
            <ApprovalBox label="Prodávající podepisuje" approved={escrowContractApproved.seller} onToggle={() => setEscrowContractApproved(s => ({ ...s, seller: !s.seller }))} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfBtn onClick={printEscrowContract} label="Stáhnout smlouvu o úschově (PDF)" />
            {escrowContractApproved.buyer && escrowContractApproved.seller && <Btn onClick={() => completeStep("escrow_contract")}>Smlouva o úschově podepsána →</Btn>}
          </div>
        </StepCard>
      )}

      {/* ── KROK 6: KUPNÍ SMLOUVA ── */}
      {activeStep === "purchase_contract" && (
        <StepCard title="📄 Kupní smlouva" subtitle="Finální smlouva o převodu vlastnictví. Vlastnické právo přechází zápisem do katastru nemovitostí, nikoliv podpisem smlouvy.">
          <InfoBox color="blue" icon="ℹ️">Dle § 1105 OZ nabývá kupující vlastnické právo k nemovitosti <strong>zápisem do katastru nemovitostí</strong>, nikoliv podpisem kupní smlouvy. Podpisem smlouvy vzniká pouze závazek k převodu.</InfoBox>
          {isHypoteka && <InfoBox color="amber" icon="🏦">Prodávající v kupní smlouvě uděluje souhlas se zřízením zástavního práva banky {mortgageBank}. Zástavní právo bude zapsáno do KN současně s převodem vlastnictví kupujícímu.</InfoBox>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ l: "KUPNÍ CENA", v: fmtFull(l.askingPrice) }, { l: "DOPLATEK PŘES ÚSCHOVU", v: fmtFull(l.askingPrice - l.reservationFee) }, { l: "PŘEDÁNÍ NEMOVITOSTI", v: "Do 14 dní od připsání do úschovy" }].map(item => (
              <div key={item.l} style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 5 }}>{item.l}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{item.v}</div></div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <ApprovalBox label="Kupující podepisuje" approved={purchaseApproved.buyer} onToggle={() => setPurchaseApproved(s => ({ ...s, buyer: !s.buyer }))} />
            <ApprovalBox label="Prodávající podepisuje" approved={purchaseApproved.seller} onToggle={() => setPurchaseApproved(s => ({ ...s, seller: !s.seller }))} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfBtn onClick={printPurchaseContract} label="Stáhnout kupní smlouvu (PDF)" />
            {purchaseApproved.buyer && purchaseApproved.seller && <Btn onClick={() => completeStep("purchase_contract")}>Kupní smlouva podepsána →</Btn>}
          </div>
        </StepCard>
      )}

      {/* ── KROK 7: ÚHRADA DO ÚSCHOVY ── */}
      {activeStep === "escrow_payment" && (
        <StepCard title="💳 Úhrada kupní ceny do úschovy" subtitle="Doplatek kupní ceny odešlete na úschovní účet advokáta. Bez přijetí na úschovním účtu nelze podat návrh na vklad.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 8 }}>PLATEBNÍ INSTRUKCE</div>
              {[["Číslo účtu", "1234567890/2700"], ["IBAN", "CZ65 2700 0000 0012 3456 7890"], ["Variabilní symbol", ("US" + l.id).toUpperCase()], ["Částka", fmtFull(l.askingPrice - l.reservationFee)], ["Splatnost", "30 dní od podpisu KS"]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13 }}><span style={{ color: "#888" }}>{label}</span><span style={{ fontWeight: 700, fontFamily: label === "IBAN" || label === "Číslo účtu" ? "monospace" : "inherit" }}>{value}</span></div>
              ))}
            </div>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 8 }}>CO NÁSLEDUJE PO PŘIJETÍ</div>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.9 }}>
                1. Advokát potvrdí přijetí prostředků<br />
                {isHypoteka ? `2. Banka ${mortgageBank} poukáže hypotéku<br />3. Advokát podá návrh na vklad do KN<br />` : "2. Advokát podá návrh na vklad do KN<br />"}
                {isHypoteka ? "4." : "3."} Po zápisu uvolnění prodávajícímu
              </div>
            </div>
          </div>

          {isHypoteka && <InfoBox color="blue" icon="🏦">Informujte svého hypotečního poradce o čísle úschovního účtu. Banka poukáže prostředky přímo na tento účet po podpisu zástavní smlouvy.</InfoBox>}

          <div style={{ marginBottom: 20, padding: "16px 18px", background: escrowSent ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (escrowSent ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }} onClick={() => setEscrowSent(v => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (escrowSent ? "#059669" : "#ccc"), background: escrowSent ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {escrowSent && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Potvrzuji odeslání platby na úschovní účet advokáta</span>
            </div>
          </div>

          {escrowSent && <Btn onClick={() => completeStep("escrow_payment")}>Pokračovat k návrhu na vklad →</Btn>}
        </StepCard>
      )}

      {/* ── KROK 8: KATASTR ── */}
      {activeStep === "cadastre" && (
        <StepCard title="🏛️ Návrh na vklad do katastru nemovitostí" subtitle="Advokát podá návrh na vklad do 5 pracovních dnů od podpisu kupní smlouvy. Standardní lhůta zápisu je 20–30 dní.">
          <InfoBox color="blue" icon="ℹ️">Návrh na vklad podává advokát elektronicky nebo osobně na KÚ. Správní poplatek je {isHypoteka ? "4 000 Kč (vlastnické právo + zástavní právo)" : "2 000 Kč (vlastnické právo)"}. Do zápisu nemůže prodávající s nemovitostí nakládat.</InfoBox>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ l: "Katastrální úřad", v: "KÚ pro hl. m. Prahu, KP Praha" }, { l: "Správní poplatek", v: isHypoteka ? "4 000 Kč" : "2 000 Kč" }, { l: "Lhůta pro podání", v: "Do 5 pracovních dnů od podpisu KS" }, { l: "Lhůta zápisu KÚ", v: "20–30 dní (může být delší)" }].map(item => (
              <div key={item.l} style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 5 }}>{item.l}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{item.v}</div></div>
            ))}
          </div>

          <PdfBtn onClick={printCadastre} label="Stáhnout návrh na vklad do KN (PDF)" />

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f0ede8" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📅 Rezervace termínu u advokáta</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>VEBRE Legal, s.r.o. · Praha 1, Národní 12 · +420 222 333 444</div>

            {lawyerBooked ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Termín rezervován!</div>
                <div style={{ fontSize: 13, color: "#059669" }}>📅 {lawyerSlot?.date} v {lawyerSlot?.time}</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
                <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                  {lawyerSlots.slice(0, 15).map(slot => (
                    <div key={slot.id} onClick={() => setLawyerSlot(slot)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: 10, border: "1.5px solid " + (lawyerSlot?.id === slot.id ? "#1a1a1a" : "#e0dbd4"), background: lawyerSlot?.id === slot.id ? "#1a1a1a" : "#fff", cursor: "pointer" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: lawyerSlot?.id === slot.id ? "#fff" : "#1a1a1a" }}>{slot.date} · {slot.time}</span>
                      {lawyerSlot?.id === slot.id && <span style={{ color: "#C9A84C", fontWeight: 700 }}>✓</span>}
                    </div>
                  ))}
                </div>
                <Card style={{ padding: 18 }}>
                  {lawyerSlot && <div style={{ background: "#f0fdf4", borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#059669", fontWeight: 600, marginBottom: 14 }}>📅 {lawyerSlot.date} · {lawyerSlot.time}</div>}
                  <Input label="JMÉNO" value={lawyerForm.name} onChange={e => setLawyerForm(f => ({ ...f, name: e.target.value }))} placeholder="Jan Novák" />
                  <Input label="E-MAIL" value={lawyerForm.email} onChange={e => setLawyerForm(f => ({ ...f, email: e.target.value }))} placeholder="jan@email.cz" />
                  <Input label="TELEFON" value={lawyerForm.phone} onChange={e => setLawyerForm(f => ({ ...f, phone: e.target.value }))} placeholder="+420 600 000 000" />
                  <Btn full disabled={!lawyerSlot || !lawyerForm.name || !lawyerForm.email} onClick={() => { setLawyerBooked(true); completeStep("cadastre"); }}>Rezervovat termín →</Btn>
                </Card>
              </div>
            )}
          </div>
        </StepCard>
      )}

      {/* ── KROK 9: PŘEDÁNÍ ── */}
      {activeStep === "handover" && (
        <StepCard title="🔑 Předání nemovitosti" subtitle="Nemovitost se předává po zápisu vlastnického práva v katastru nemovitostí a uvolnění kupní ceny z úschovy. Sepište předávací protokol.">
          <InfoBox color="green" icon="✅">Vlastnické právo bylo zapsáno v katastru nemovitostí. Kupní cena byla uvolněna prodávajícímu. Nyní probíhá fyzické předání nemovitosti.</InfoBox>

          <div style={{ marginBottom: 16 }}>
            <Input label="DATUM PŘEDÁNÍ" value={handoverDate} onChange={e => setHandoverDate(e.target.value)} placeholder={today} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>STAVY MĚŘIČŮ K DATU PŘEDÁNÍ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Input label="ELEKTŘINA (stav + č. měřiče)" value={meterReadings.electricity} onChange={e => setMeterReadings(m => ({ ...m, electricity: e.target.value }))} placeholder="Např. 12345 kWh, EL123456" />
              <Input label="PLYN (stav + č. měřiče)" value={meterReadings.gas} onChange={e => setMeterReadings(m => ({ ...m, gas: e.target.value }))} placeholder="Např. 678 m³, PL789012" />
              <Input label="VODA (stav + č. měřiče)" value={meterReadings.water} onChange={e => setMeterReadings(m => ({ ...m, water: e.target.value }))} placeholder="Např. 234 m³, V345678" />
            </div>
          </div>

          <div style={{ marginBottom: 20, padding: "16px 18px", background: keysHandedOver ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (keysHandedOver ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }} onClick={() => setKeysHandedOver(v => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (keysHandedOver ? "#059669" : "#ccc"), background: keysHandedOver ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {keysHandedOver && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>🔑 Klíče a přístupové prostředky předány kupujícímu</div>
                <div style={{ fontSize: 11, color: "#888" }}>Kupující potvrzuje převzetí všech klíčů</div>
              </div>
            </div>
          </div>

          <InfoBox color="amber" icon="💡">Nezapomeňte: sjednejte pojištění nemovitosti nejpozději ke dni předání. Přihlaste se k odběru energií a zajistěte přepis smluv s dodavateli.</InfoBox>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PdfBtn onClick={printHandover} label="Stáhnout předávací protokol (PDF)" />
            {keysHandedOver && (
              <Btn onClick={() => { setHandoverComplete(true); completeStep("handover"); }}>Předání dokončeno →</Btn>
            )}
          </div>

          {handoverComplete && (
            <div style={{ marginTop: 24, background: "#f0fdf4", border: "2px solid #6ee7b7", borderRadius: 16, padding: 28, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🏠</div>
              <h2 style={{ ...D, fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#059669" }}>Gratulujeme! Proces koupě je dokončen.</h2>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>Vlastnické právo bylo zapsáno v katastru, kupní cena uvolněna a nemovitost předána. Přejeme vám mnoho spokojenosti v novém domově!</p>
              <Btn onClick={() => setPage("buyer-dash")}>Zpět na dashboard</Btn>
            </div>
          )}
        </StepCard>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};


// ─── KUPNÍ SMLOUVA ────────────────────────────────────────────────────────────
const PurchaseContractPage = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id) || listings[0];
  const contractNo = "KS-" + (l?.id || "").toUpperCase() + "-" + new Date().getFullYear();
  const today = new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });

  // Demo buyer data
  const buyer = { firstName: user?.nickname || "Jan", lastName: "Novák", birthNumber: "900101/1234", street: "Václavské náměstí 1", city: "Praha", zip: "110 00", phone: "+420 603 123 456" };

  const [tab, setTab] = useState("contract");
  const [buyerApproved, setBuyerApproved] = useState(false);
  const [sellerApproved, setSellerApproved] = useState(false);
  const [buyerComment, setBuyerComment] = useState("");
  const [sellerComment, setSellerComment] = useState("");
  const [buyerCommentSent, setBuyerCommentSent] = useState(false);
  const [sellerCommentSent, setSellerCommentSent] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lawyerForm, setLawyerForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [lawyerSent, setLawyerSent] = useState(false);

  if (!l) return null;

  // Generuj termíny na příštích 14 dní
  const slots = [];
  const now = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      ["9:00", "10:30", "13:00", "14:30", "16:00"].forEach(time => {
        if (Math.random() > 0.4) slots.push({ date: date.toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" }), time, id: `${d}-${time}` });
      });
    }
  }

  const printContract = () => {
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Kupní smlouva ${contractNo}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1a1a1a;line-height:1.8;font-size:14px}h1{font-size:22px;text-align:center;margin-bottom:4px}h2{font-size:15px;margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:4px}.row{display:flex;justify-content:space-between;margin-bottom:4px}.label{color:#666;min-width:200px}.highlight{background:#f7f4ef;padding:14px 18px;border-radius:8px;margin:16px 0}.clause{margin-bottom:12px}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px}.sig-box{border-top:1px solid #999;padding-top:10px;font-size:13px;color:#666}@media print{button{display:none}}</style>
    </head><body>
    <h1>KUPNÍ SMLOUVA</h1>
    <div style="text-align:center;color:#666;font-size:13px;margin-bottom:32px">č. ${contractNo} · VEBRE · ${today}</div>
    <h2>I. Smluvní strany</h2>
    <div class="highlight">
      <div class="row"><span class="label">Kupující:</span><span><strong>${buyer.firstName} ${buyer.lastName}</strong></span></div>
      <div class="row"><span class="label">Rodné číslo:</span><span>${buyer.birthNumber}</span></div>
      <div class="row"><span class="label">Adresa:</span><span>${buyer.street}, ${buyer.zip} ${buyer.city}</span></div>
    </div>
    <div class="highlight">
      <div class="row"><span class="label">Prodávající:</span><span><strong>${l.seller.name}</strong></span></div>
      <div class="row"><span class="label">Adresa:</span><span>${l.seller.address}</span></div>
      <div class="row"><span class="label">E-mail:</span><span>${l.seller.email}</span></div>
    </div>
    <h2>II. Předmět koupě</h2>
    <div class="highlight">
      <div class="row"><span class="label">Nemovitost:</span><span><strong>${l.title}</strong></span></div>
      <div class="row"><span class="label">Adresa:</span><span>${l.address}</span></div>
      <div class="row"><span class="label">Plocha:</span><span>${l.internalSize} m²</span></div>
      <div class="row"><span class="label">Rok výstavby:</span><span>${l.yearBuilt}</span></div>
    </div>
    <h2>III. Kupní cena</h2>
    <div class="highlight">
      <div class="row"><span class="label">Kupní cena:</span><span><strong>${fmtFull(l.askingPrice)}</strong></span></div>
      <div class="row"><span class="label">Již uhrazeno (rezervace):</span><span>${fmtFull(l.reservationFee)}</span></div>
      <div class="row"><span class="label">Zbývá doplatit:</span><span><strong>${fmtFull(l.askingPrice - l.reservationFee)}</strong></span></div>
      <div class="row"><span class="label">Splatnost doplatku:</span><span>Do 30 dnů od podpisu smlouvy</span></div>
    </div>
    <h2>IV. Podmínky převodu</h2>
    <div class="clause"><strong>1.</strong> Prodávající se zavazuje převést vlastnické právo k nemovitosti na kupujícího, a to bez věcných břemen a jiných závad.</div>
    <div class="clause"><strong>2.</strong> Kupující se zavazuje uhradit kupní cenu v termínu stanoveném touto smlouvou.</div>
    <div class="clause"><strong>3.</strong> Předání nemovitosti proběhne do 14 dnů od připsání kupní ceny na účet prodávajícího.</div>
    <div class="clause"><strong>4.</strong> Návrh na vklad do katastru nemovitostí podá kupující do 5 pracovních dnů od podpisu smlouvy.</div>
    <div class="clause"><strong>5.</strong> Náklady spojené s vkladem do katastru nemovitostí hradí kupující.</div>
    <div class="clause"><strong>6.</strong> Prodávající prohlašuje, že nemovitost není zatížena žádným zástavním právem, věcným břemenem ani jiným právem třetích osob.</div>
    <div class="clause"><strong>7.</strong> Tato smlouva se řídí právním řádem České republiky. Případné spory budou řešeny věcně příslušným soudem.</div>
    <div class="signatures">
      <div class="sig-box"><strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující<br/><br/>Datum: ${today}<br/>Podpis: ___________________</div>
      <div class="sig-box"><strong>${l.seller.name}</strong><br/>Prodávající<br/><br/>Datum: ${today}<br/>Podpis: ___________________</div>
    </div>
    <div style="margin-top:40px;text-align:center;font-size:11px;color:#999">Vygenerováno platformou VEBRE · vebre.cz · ${today}</div>
    );
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const bothApproved = buyerApproved && sellerApproved;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("buyer-dash")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>← Zpět na dashboard</button>

      {/* Hlavička */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Kupní smlouva</h1>
          <div style={{ fontSize: 13, color: "#888" }}>č. {contractNo} · {l.title}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {bothApproved ? <Badge color="green">✓ Obě strany schválily</Badge> : <Badge color="amber">Čeká na schválení</Badge>}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {[
          { icon: "📄", label: "Smlouva vygenerována", done: true },
          { icon: "✅", label: "Obě strany schválily", done: bothApproved },
          { icon: "📅", label: "Termín u advokáta", done: !!selectedSlot && lawyerSent },
        ].map((s, i) => (
          <div key={i} style={{ background: s.done ? "#f0fdf4" : "#f7f4ef", border: "1px solid " + (s.done ? "#6ee7b7" : "#e0dbd4"), borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.done ? "#059669" : "#888" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.done ? "#059669" : "#bbb" }}>{s.done ? "Hotovo" : "Čeká"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Záložky */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "contract", label: "📄 Smlouva" }, { id: "comments", label: "💬 Připomínky" }, { id: "lawyer", label: "📅 Advokát" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 20px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>

      {/* ── ZÁLOŽKA: SMLOUVA ── */}
      {tab === "contract" && (
        <div>
          <Card style={{ padding: 28, marginBottom: 20 }}>
            {/* Hlavička smlouvy */}
            <div style={{ textAlign: "center", paddingBottom: 20, marginBottom: 20, borderBottom: "2px solid #1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, background: "#1a1a1a", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#C9A84C", fontWeight: 900, fontSize: 13 }}>V</span></div>
                <span style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>VEBRE</span>
              </div>
              <h2 style={{ ...D, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>KUPNÍ SMLOUVA</h2>
              <div style={{ fontSize: 12, color: "#888" }}>č. {contractNo} · {today}</div>
            </div>

            {/* Strany */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>KUPUJÍCÍ</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{buyer.firstName} {buyer.lastName}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>RČ: {buyer.birthNumber}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{buyer.street}, {buyer.zip} {buyer.city}</div>
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>PRODÁVAJÍCÍ</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, color: "#059669" }}>{l.seller.name}</div>
                <div style={{ fontSize: 12, color: "#059669", marginBottom: 2 }}>{l.seller.address}</div>
                <div style={{ fontSize: 12, color: "#059669" }}>📧 {l.seller.email}</div>
              </div>
            </div>

            {/* Předmět */}
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>PŘEDMĚT KOUPĚ</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{l.title}</div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>📍 {l.address}</div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888", marginTop: 6 }}>
                <span>📐 {l.internalSize} m²</span><span>🛏 {l.bedrooms} pokoje</span><span>🏗 {l.yearBuilt}</span>
              </div>
            </div>

            {/* Cena */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ border: "1.5px solid #e0dbd4", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 5 }}>KUPNÍ CENA</div>
                <div style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmtFull(l.askingPrice)}</div>
              </div>
              <div style={{ border: "1.5px solid #6ee7b7", borderRadius: 12, padding: 14, background: "#f0fdf4" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 5 }}>UŽ UHRAZENO</div>
                <div style={{ ...D, fontSize: 18, fontWeight: 800, color: "#059669" }}>{fmtFull(l.reservationFee)}</div>
              </div>
              <div style={{ border: "1.5px solid #C9A84C", borderRadius: 12, padding: 14, background: "#fffbf0" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 5 }}>DOPLATEK</div>
                <div style={{ ...D, fontSize: 18, fontWeight: 800, color: "#C9A84C" }}>{fmtFull(l.askingPrice - l.reservationFee)}</div>
              </div>
            </div>

            {/* Podmínky */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>KLÍČOVÉ PODMÍNKY</div>
              {[
                "Prodávající převádí nemovitost bez věcných břemen a jiných závad.",
                "Doplatek kupní ceny splatný do 30 dnů od podpisu smlouvy.",
                "Předání nemovitosti do 14 dnů od připsání kupní ceny.",
                "Návrh na vklad do katastru podá kupující do 5 pracovních dnů.",
                "Náklady spojené s vkladem do katastru hradí kupující.",
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#444", lineHeight: 1.5 }}>
                  <span style={{ color: "#C9A84C", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* PDF tlačítko */}
            <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 18, display: "flex", gap: 10 }}>
              <button onClick={printContract} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                📄 Stáhnout / Vytisknout PDF
              </button>
            </div>
          </Card>

          {/* Schválení */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Schválení smlouvy</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div onClick={() => setBuyerApproved(v => !v)} style={{ padding: "16px", background: buyerApproved ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (buyerApproved ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid " + (buyerApproved ? "#059669" : "#ccc"), background: buyerApproved ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {buyerApproved && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Kupující</div>
                    <div style={{ fontSize: 11, color: buyerApproved ? "#059669" : "#888" }}>{buyerApproved ? "Schváleno" : "Čeká na schválení"}</div>
                  </div>
                </div>
              </div>
              <div onClick={() => setSellerApproved(v => !v)} style={{ padding: "16px", background: sellerApproved ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: "1.5px solid " + (sellerApproved ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid " + (sellerApproved ? "#059669" : "#ccc"), background: sellerApproved ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {sellerApproved && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Prodávající</div>
                    <div style={{ fontSize: 11, color: sellerApproved ? "#059669" : "#888" }}>{sellerApproved ? "Schváleno" : "Čeká na schválení"}</div>
                  </div>
                </div>
              </div>
            </div>
            {bothApproved && (
              <div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#059669", fontWeight: 600 }}>
                🎉 Obě strany smlouvu schválily! Nyní si rezervujte termín u advokáta.
                <button onClick={() => setTab("lawyer")} style={{ marginLeft: 12, background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Rezervovat termín →</button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── ZÁLOŽKA: PŘIPOMÍNKY ── */}
      {tab === "comments" && (
        <div>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>💬 Připomínky ke smlouvě</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Napište připomínky nebo požadavky na úpravu. Druhá strana je uvidí a může reagovat.</div>

            {/* Připomínky kupujícího */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", marginBottom: 8, letterSpacing: "0.05em" }}>🏠 KUPUJÍCÍ</div>
              {buyerCommentSent && buyerComment ? (
                <div style={{ background: "#dbeafe", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#1e40af", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}>Odesláno {today}</div>
                  <div>{buyerComment}</div>
                </div>
              ) : (
                <div>
                  <textarea value={buyerComment} onChange={e => setBuyerComment(e.target.value)} rows={3} placeholder="Napište připomínku nebo požadavek na úpravu smlouvy…" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box", marginBottom: 8 }} />
                  <Btn small disabled={!buyerComment.trim()} onClick={() => setBuyerCommentSent(true)}>Odeslat připomínku</Btn>
                </div>
              )}
            </div>

            {/* Připomínky prodávajícího */}
            <div style={{ paddingTop: 20, borderTop: "1px solid #f0ede8" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 8, letterSpacing: "0.05em" }}>🏗 PRODÁVAJÍCÍ</div>
              {sellerCommentSent && sellerComment ? (
                <div style={{ background: "#d1fae5", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#065f46", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, marginBottom: 3 }}>Odesláno {today}</div>
                  <div>{sellerComment}</div>
                </div>
              ) : (
                <div>
                  <textarea value={sellerComment} onChange={e => setSellerComment(e.target.value)} rows={3} placeholder="Reagujte na připomínky nebo přidejte vlastní…" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box", marginBottom: 8 }} />
                  <Btn small variant="outline" disabled={!sellerComment.trim()} onClick={() => setSellerCommentSent(true)}>Odeslat reakci</Btn>
                </div>
              )}
            </div>
          </Card>

          {buyerCommentSent && sellerCommentSent && (
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#92400e" }}>
              💡 Obě strany zaslaly připomínky. Doporučujeme konzultaci s advokátem před finálním podpisem.
              <button onClick={() => setTab("lawyer")} style={{ marginLeft: 12, background: "#92400e", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Rezervovat advokáta →</button>
            </div>
          )}
        </div>
      )}

      {/* ── ZÁLOŽKA: ADVOKÁT ── */}
      {tab === "lawyer" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          <div>
            {/* Kalendář */}
            <Card style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📅 Dostupné termíny</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 18 }}>Advokátní kancelář VEBRE Legal · Praha 1, Národní 12</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
                {slots.slice(0, 20).map(slot => (
                  <div key={slot.id} onClick={() => setSelectedSlot(slot)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: "1.5px solid " + (selectedSlot?.id === slot.id ? "#1a1a1a" : "#e0dbd4"), background: selectedSlot?.id === slot.id ? "#1a1a1a" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontSize: 20 }}>📅</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: selectedSlot?.id === slot.id ? "#fff" : "#1a1a1a" }}>{slot.date}</div>
                        <div style={{ fontSize: 12, color: selectedSlot?.id === slot.id ? "#aaa" : "#888" }}>{slot.time}</div>
                      </div>
                    </div>
                    {selectedSlot?.id === slot.id && <span style={{ color: "#C9A84C", fontWeight: 700 }}>✓ Vybráno</span>}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Kontaktní formulář */}
          <div>
            <Card style={{ padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Kontaktní formulář</div>
              {lawyerSent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Termín rezervován!</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>Potvrzení bylo odesláno na váš e-mail. Advokát vás kontaktuje do 24 hodin.</div>
                  {selectedSlot && <div style={{ marginTop: 14, background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#059669", fontWeight: 600 }}>📅 {selectedSlot.date} v {selectedSlot.time}</div>}
                </div>
              ) : (
                <div>
                  {selectedSlot && <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#059669", fontWeight: 600, marginBottom: 16 }}>📅 {selectedSlot.date} v {selectedSlot.time}</div>}
                  <Input label="JMÉNO A PŘÍJMENÍ" value={lawyerForm.name} onChange={e => setLawyerForm(f => ({ ...f, name: e.target.value }))} placeholder="Jan Novák" />
                  <Input label="E-MAIL" value={lawyerForm.email} onChange={e => setLawyerForm(f => ({ ...f, email: e.target.value }))} placeholder="jan@email.cz" />
                  <Input label="TELEFON" value={lawyerForm.phone} onChange={e => setLawyerForm(f => ({ ...f, phone: e.target.value }))} placeholder="+420 600 000 000" />
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>POZNÁMKA</label>
                    <textarea value={lawyerForm.message} onChange={e => setLawyerForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Případné poznámky nebo dotazy…" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <Btn full disabled={!selectedSlot || !lawyerForm.name || !lawyerForm.email} onClick={() => setLawyerSent(true)}>
                    Rezervovat termín →
                  </Btn>
                  <div style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 10 }}>Advokát vás kontaktuje do 24 hodin</div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── BUYER DASH ───────────────────────────────────────────────────────────────
const BuyerDash = ({ setPage, user }) => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard kupujícího</h1></div>
        <Btn onClick={() => setPage("listings")}>Procházet nabídky →</Btn>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Přehled" }, { id: "viewings", label: "Prohlídky (" + getViewings().filter(v => v.buyerAnonymousId === (user?.anonymousId || "BYR-0001")).length + ")" }, { id: "offers", label: "Moje nabídky" }, { id: "reservations", label: "Rezervace" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[{ label: "Aktivní nabídky", value: 0, icon: "📋", color: "#d97706" }, { label: "Prohlídky", value: getViewings().filter(v => v.buyerAnonymousId === (user?.anonymousId || "BYR-0001")).length, icon: "📅", color: "#3b82f6" }, { label: "Rezervace", value: 1, icon: "🔑", color: "#059669" }, { label: "Smlouvy", value: 1, icon: "📄", color: "#7c3aed" }].map(s => (
            <Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#999" }}>{s.label}</div></Card>
          ))}
        </div>
      )}
      {tab === "viewings" && (() => {
        const myViewings = getViewings().filter(v => v.buyerAnonymousId === (user?.anonymousId || "BYR-0001"));
        if (myViewings.length === 0) return (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: "48px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📅</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Zatím žádné prohlídky</div>
            <p style={{ color: "#888", marginBottom: 8, fontSize: 14 }}>Máte zájem o nemovitost? Rezervujte si prohlídku přímo z inzerátu.</p>
            <p style={{ color: "#bbb", marginBottom: 20, fontSize: 12 }}>Vyberte nemovitost → klikněte na "Sjednat prohlídku" → zvolte termín</p>
            <Btn onClick={() => setPage("listings")}>Procházet nemovitosti →</Btn>
          </div>
        );
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {myViewings.map(v => (
              <Card key={v.id} style={{ padding: 22 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <img src={v.listingImg} alt={v.listingTitle} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{v.listingTitle}</div>
                      <Badge color={v.status === "CONFIRMED" ? "green" : v.status === "CANCELLED" ? "red" : "amber"}>
                        {v.status === "CONFIRMED" ? "✓ Potvrzeno" : v.status === "CANCELLED" ? "Zrušeno" : "⏳ Čeká"}
                      </Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>📍 {v.listingAddress}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                      <span style={{ background: "#f7f4ef", padding: "5px 12px", borderRadius: 8, fontWeight: 600 }}>📅 {v.slot.date}</span>
                      <span style={{ background: "#f7f4ef", padding: "5px 12px", borderRadius: 8, fontWeight: 600 }}>🕐 {v.slot.time}</span>
                    </div>
                  </div>
                </div>
                {v.form?.note && <div style={{ marginTop: 12, background: "#f7f4ef", borderRadius: 9, padding: "9px 14px", fontSize: 12, color: "#666" }}>💬 {v.form.note}</div>}
              </Card>
            ))}
          </div>
        );
      })()}
      {tab === "offers" && (<div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ede9e3", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Ještě jste nepodali žádnou nabídku</div>
        <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>Najděte svoji vysněnou nemovitost a podejte první nabídku.</p>
        <Btn onClick={() => setPage("listings")}>Procházet nemovitosti →</Btn>
      </div>)}
      {tab === "reservations" && (
        <Card style={{ padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Historický byt v činžovním domě</div>
              <div style={{ fontSize: 12, color: "#888" }}>📍 Nerudova 15, Malá Strana · #RSV-00492</div>
            </div>
            <Badge color="green">🔓 ZAPLACENO</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 6 }}>PRODÁVAJÍCÍ</div>
              <div style={{ fontWeight: 700, color: "#059669" }}>Martin Dvořák</div>
              <div style={{ fontSize: 12, color: "#059669" }}>📧 m.dvorak@email.cz</div>
              <div style={{ fontSize: 12, color: "#059669" }}>📞 +420 603 111 222</div>
            </div>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 6 }}>REZERVAČNÍ POPLATEK</div>
              <div style={{ ...D, fontSize: 20, fontWeight: 800 }}>50 000 Kč</div>
              <div style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>✓ Uhrazeno</div>
            </div>
          </div>
          <div style={{ background: "#dbeafe", border: "1px solid #93c5fd", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e40af", marginBottom: 2 }}>📄 Kupní smlouva připravena k podpisu</div>
              <div style={{ fontSize: 12, color: "#3b82f6" }}>Zkontrolujte návrh, přidejte připomínky a rezervujte termín u advokáta</div>
            </div>
            <Btn small onClick={() => setPage("legal-workflow-l2")}>Otevřít právní proces →</Btn>
          </div>
          {/* #6 — Transaction Progress */}
          <div style={{ marginTop: 8 }}>
            <TransactionProgress activeStep="contract" />
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── AI DESCRIPTION BUTTON ────────────────────────────────────────────────────
const AiDescBtn = ({ form, onGenerated }) => {
  const [loading, setLoading] = useState(false);
  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const type = form.propertyType === "APARTMENT" ? "byt" : form.propertyType === "HOUSE" ? "rodinný dům" : "kancelář";
      const amenities = [form.hasGarage && "garáží", form.hasBalcony && "balkónem", form.hasGarden && "zahradou", form.hasPool && "bazénem"].filter(Boolean);
      const amenStr = amenities.length ? ` s ${amenities.join(", ")}` : "";
      const desc = `Nabízíme k prodeji ${form.bedrooms > 0 ? `${form.bedrooms}+kk ` : ""}${type}${amenStr} o výměře ${form.internalSize} m² v žádané lokalitě ${form.district || "Praha"}. Nemovitost z roku ${form.yearBuilt || "2000"} se nachází v klidné části s výbornou dostupností do centra města a veškerou občanskou vybaveností v okolí.\n\nDispoziční řešení je praktické a promyšlené. ${form.hasBalcony ? "Součástí je prostorný balkón s příjemným výhledem. " : ""}${form.hasGarage ? "K dispozici je garážové stání. " : ""}${form.hasGarden ? "Přiléhá soukromá zahrada vhodná k relaxaci. " : ""}Nemovitost je ve výborném stavu, připravena k okamžitému nastěhování.\n\nIdální pro rodiny i náročné kupce hledající kvalitní bydlení v Praze.`;
      onGenerated(desc);
      setLoading(false);
    }, 1200);
  };
  return (
    <button onClick={generate} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, background: loading ? "#f7f4ef" : "#1a1a1a", color: loading ? "#888" : "#C9A84C", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
      {loading ? (
        <><div style={{ width: 14, height: 14, border: "2px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> AI píše popis…</>
      ) : (
        <>✦ AI popis</>
      )}
    </button>
  );
};

// ─── NEW LISTING PAGE ─────────────────────────────────────────────────────────
const NewListingPage = ({ setPage, user }) => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: "Prostorný byt 3+kk v centru Prahy", address: "Vodičkova 22, Praha 1 - Nové Město", district: "Nové Město", propertyType: "APARTMENT", bedrooms: 3, bathrooms: 1, internalSize: 95, yearBuilt: 2005, askingPrice: "12500000", description: "Světlý byt 3+kk v samém srdci Prahy. Nová kuchyně, parkety, zasklený balkón. Výborná dostupnost MHD, veškerá občanská vybavenost v okolí.", hasGarage: false, hasBalcony: true, hasGarden: false, hasPool: false });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setFBool = (key) => () => setForm(f => ({ ...f, [key]: !f[key] }));

  const handleFiles = async (files) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 10 - photos.length);
    if (arr.length === 0) return;
    setUploading(true); setUploadProgress(0);
    const uploaded = [];
    for (let i = 0; i < arr.length; i++) {
      try {
        const url = await uploadImageToCloudinary(arr[i]);
        uploaded.push({ url, name: arr[i].name, preview: URL.createObjectURL(arr[i]) });
        setUploadProgress(Math.round(((i + 1) / arr.length) * 100));
      } catch { setError("Nahrání fotky selhalo. Zkuste to znovu."); }
    }
    setPhotos(p => [...p, ...uploaded]);
    setUploading(false);
  };

  const removePhoto = (i) => setPhotos(p => p.filter((_, idx) => idx !== i));
  const movePhoto = (i, dir) => {
    setPhotos(p => { const n = [...p]; const t = n[i]; n[i] = n[i + dir]; n[i + dir] = t; return n; });
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const save = () => {
    if (!form.title || !form.address || !form.district || !form.askingPrice) { setError("Vyplňte povinná pole (název, adresa, čtvrť, cena)."); return; }
    if (photos.length === 0) { setError("Nahrajte alespoň jednu fotku."); return; }
    setSaving(true);
    setTimeout(() => {
      const listings = getListings();
      const price = parseInt(form.askingPrice.replace(/\s/g, ""));
      const newListing = {
        id: "l" + Date.now(),
        title: form.title, address: form.address, city: "Praha", district: form.district,
        propertyType: form.propertyType, bedrooms: +form.bedrooms, bathrooms: +form.bathrooms,
        internalSize: +form.internalSize, yearBuilt: +form.yearBuilt,
        hasGarden: form.hasGarden, hasPool: form.hasPool, hasGarage: form.hasGarage, hasBalcony: form.hasBalcony,
        askingPrice: price, reservationFee: 50000,
        aiValuation: Math.round(price * 1.03), aiConfidence: 0.85,
        aiRange: { low: Math.round(price * 0.93), high: Math.round(price * 1.1) },
        marketTrend: "rising", daysOnMarket: 0, viewCount: 0,
        description: form.description,
        features: [form.hasGarage && "Garáž", form.hasBalcony && "Balkón", form.hasGarden && "Zahrada", form.hasPool && "Bazén"].filter(Boolean),
        img: photos[0].url,
        imgs: photos.map(p => p.url),
        seller: { anonymousId: user?.anonymousId || "SLR-0000", memberSince: new Date().getFullYear().toString(), successRate: 100, name: user?.nickname || "Prodávající", email: "", phone: "", address: form.address },
        aiFactors: [{ factor: "Lokalita " + form.district, impact: "positive", score: 85 }],
        comparables: [],
      };
      saveListings([...listings, newListing]);
      setSaving(false);
      setPage("brokerage-contract");
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => setPage("seller-dash")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Nový inzerát</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 28 }}>Vyplňte údaje o nemovitosti a nahrajte fotky.</p>

      {/* ── FOTKY ── */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📸 Fotky nemovitosti</h3>

        {/* Drop zone */}
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{ border: "2px dashed " + (uploading ? "#C9A84C" : "#e0dbd4"), borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: uploading ? "default" : "pointer", background: "#fafaf8", marginBottom: 16, transition: "all 0.2s" }}>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          {uploading ? (
            <div>
              <div style={{ width: 48, height: 48, border: "4px solid #f0ede8", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Nahrávám fotky… {uploadProgress}%</div>
              <div style={{ height: 6, background: "#f0ede8", borderRadius: 99, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                <div style={{ height: "100%", background: "#C9A84C", borderRadius: 99, width: uploadProgress + "%", transition: "width 0.3s" }} />
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Přetáhněte fotky sem nebo klikněte</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>JPG, PNG · Max. 10 fotek · První fotka bude titulní</div>
            </div>
          )}
        </div>

        {/* Náhled fotek */}
        {photos.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {photos.map((p, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: i === 0 ? "2.5px solid #C9A84C" : "2.5px solid transparent" }}>
                <img src={p.preview || p.url} alt="" style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
                {i === 0 && <div style={{ position: "absolute", top: 4, left: 4, background: "#C9A84C", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>TITULNÍ</div>}
                <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 3 }}>
                  {i > 0 && <button onClick={() => movePhoto(i, -1)} style={{ width: 22, height: 22, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, cursor: "pointer" }}>←</button>}
                  {i < photos.length - 1 && <button onClick={() => movePhoto(i, 1)} style={{ width: 22, height: 22, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, cursor: "pointer" }}>→</button>}
                  <button onClick={() => removePhoto(i)} style={{ width: 22, height: 22, background: "rgba(220,38,38,0.8)", border: "none", borderRadius: 5, color: "#fff", fontSize: 13, cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>
              </div>
            ))}
            {photos.length < 10 && (
              <div onClick={() => fileInputRef.current?.click()} style={{ height: 90, border: "2px dashed #e0dbd4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#bbb", fontSize: 28 }}>+</div>
            )}
          </div>
        )}
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 10 }}>{photos.length}/10 fotek · Šipkami měníte pořadí</div>
      </Card>

      {/* ── ZÁKLADNÍ ÚDAJE ── */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📋 Základní údaje</h3>
        <Input label="NÁZEV INZERÁTU *" value={form.title} onChange={setF("title")} placeholder="Např. Luxusní byt 3+kk v centru Prahy" />
        <Input label="ADRESA *" value={form.address} onChange={setF("address")} placeholder="Václavské náměstí 1, Praha 1" />
        <Input label="ČTVRŤ / LOKALITA *" value={form.district} onChange={setF("district")} placeholder="Vinohrady, Žižkov, Holešovice…" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#999", display: "block", marginBottom: 5, letterSpacing: "0.05em" }}>TYP NEMOVITOSTI</label>
            <select value={form.propertyType} onChange={setF("propertyType")} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
              <option value="APARTMENT">Byt</option>
              <option value="HOUSE">Rodinný dům</option>
              <option value="OFFICE">Kancelář</option>
            </select>
          </div>
          <Input label="ROK VÝSTAVBY" value={form.yearBuilt} onChange={setF("yearBuilt")} placeholder="2010" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Input label="POČET POKOJŮ" value={form.bedrooms} onChange={setF("bedrooms")} placeholder="3" />
          <Input label="KOUPELNY" value={form.bathrooms} onChange={setF("bathrooms")} placeholder="1" />
          <Input label="PLOCHA (m²)" value={form.internalSize} onChange={setF("internalSize")} placeholder="80" />
        </div>
        <Input label="POŽADOVANÁ CENA (KČ) *" value={form.askingPrice} onChange={setF("askingPrice")} placeholder="5 000 000" />
      </Card>

      {/* ── VYBAVENÍ ── */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🏠 Vybavení a příslušenství</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ key: "hasGarage", label: "🚗 Garáž / parkovací místo" }, { key: "hasBalcony", label: "🏙 Balkón nebo terasa" }, { key: "hasGarden", label: "🌿 Zahrada" }, { key: "hasPool", label: "🏊 Bazén" }].map(item => (
            <div key={item.key} onClick={setFBool(item.key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: form[item.key] ? "#f0fdf4" : "#f7f4ef", borderRadius: 11, border: "1.5px solid " + (form[item.key] ? "#6ee7b7" : "#e0dbd4"), cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (form[item.key] ? "#059669" : "#ccc"), background: form[item.key] ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {form[item.key] && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── POPIS ── */}
      <Card style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>📝 Popis nemovitosti</h3>
          <AiDescBtn form={form} onGenerated={desc => setForm(f => ({ ...f, description: desc }))} />
        </div>
        <textarea value={form.description} onChange={setF("description")} rows={5} placeholder="Popište nemovitost — co ji dělá výjimečnou, co je v okolí, stav…" style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }} />
      </Card>

      {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="ghost" onClick={() => setPage("seller-dash")}>Zrušit</Btn>
        <Btn full disabled={saving || uploading} onClick={save}>{saving ? "Ukládám inzerát…" : "Zveřejnit inzerát →"}</Btn>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── ADMIN DASH ───────────────────────────────────────────────────────────────
const AdminDash = () => {
  const [tab, setTab] = useState("overview");
  const users = getUsers(); const listings = getListings();
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Admin Dashboard</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Přehled platformy</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {[{ label: "Inzeráty", value: listings.length, icon: "🏠", color: "#059669" }, { label: "Uživatelé", value: users.length, icon: "👤", color: "#3b82f6" }, { label: "Nabídky", value: ALL_ACTIVITY.filter(a => a.type === "offer").length, icon: "📋", color: "#d97706" }, { label: "Rezervace", value: ALL_ACTIVITY.filter(a => a.type === "reservation").length, icon: "🔑", color: "#7c3aed" }].map(s => (<Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div><div style={{ fontSize: 11, color: "#999" }}>{s.label}</div></Card>))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Aktivita" }, { id: "users", label: "Uživatelé" }, { id: "listings", label: "Inzeráty" }].map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>))}
      </div>
      {tab === "overview" && ALL_ACTIVITY.map(a => (<Card key={a.id} style={{ padding: 18, marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ fontSize: 22 }}>{a.type === "offer" ? "📋" : a.type === "reservation" ? "🔑" : "📅"}</div><div><div style={{ fontWeight: 700, fontSize: 13 }}>{a.listing}</div><div style={{ fontSize: 12, color: "#888" }}>{a.buyer} → {a.seller} · {a.date}</div></div></div><div style={{ display: "flex", gap: 12, alignItems: "center" }}>{a.amount && <div style={{ ...D, fontSize: 15, fontWeight: 800 }}>{fmtFull(a.amount)}</div>}<Badge color={a.status === "PAID" || a.status === "CONFIRMED" ? "green" : a.status === "ACCEPTED" ? "blue" : "amber"}>{a.status}</Badge></div></div></Card>))}
      {tab === "users" && (users.length === 0 ? <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Žádní uživatelé</div> : users.map(u => (<Card key={u.anonymousId} style={{ padding: 18, marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 38, height: 38, background: u.role === "BUYER" ? "#dbeafe" : "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: u.role === "BUYER" ? "#1e40af" : "#065f46" }}>{u.nickname[0].toUpperCase()}</div><div><div style={{ fontWeight: 700, fontSize: 14 }}>{u.nickname} <span style={{ fontSize: 11, color: "#bbb" }}>· {u.anonymousId}</span></div><div style={{ fontSize: 12, color: "#888" }}>{u.role}</div></div></div><Badge color={u.role === "BUYER" ? "blue" : "green"}>{u.role}</Badge></div></Card>)))}
      {tab === "listings" && listings.map(l => (<Card key={l.id} style={{ padding: 18, marginBottom: 10 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src={l.img} alt={l.title} style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} /><div><div style={{ fontWeight: 700, fontSize: 14 }}>{l.title}</div><div style={{ fontSize: 12, color: "#888" }}>📍 {l.district} · {l.seller?.anonymousId} · 📸 {(l.imgs || [l.img]).length} fotek</div></div></div><div style={{ ...D, fontSize: 15, fontWeight: 800 }}>{fmt(l.askingPrice)}</div></div></Card>))}
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet"; document.head.appendChild(link);
  }, []);
  const renderPage = () => {
    if (page === "home") return <HomePage setPage={setPage} />;
    if (page === "listings") return <ListingsPage setPage={setPage} />;
    if (page === "login") return <LoginPage setPage={setPage} setUser={setUser} />;
    if (page === "register") return <RegisterPage setPage={setPage} setUser={setUser} isSeller={false} />;
    if (page === "register-seller") return <RegisterPage setPage={setPage} setUser={setUser} isSeller={true} />;
    if (page === "seller-dash") return <SellerDash setPage={setPage} user={user} />;
    if (page === "buyer-dash") return <BuyerDash setPage={setPage} user={user} />;
    if (page === "admin-dash") return <AdminDash setPage={setPage} />;
    if (page === "new-listing") return <NewListingPage setPage={setPage} user={user} />;
    if (page === "brokerage-contract") return <BrokerageContractPage setPage={setPage} onSigned={() => setPage("seller-dash")} />;
    if (page.startsWith("manage-listing-")) return <ManageListingPage id={page.replace("manage-listing-", "")} setPage={setPage} user={user} />;
    if (page.startsWith("booking-")) return <BookingPage id={page.replace("booking-", "")} setPage={setPage} user={user} />;
    if (page.startsWith("availability-")) return <AvailabilityPage id={page.replace("availability-", "")} setPage={setPage} user={user} />;
    if (page.startsWith("legal-workflow-")) return <LegalWorkflowPage id={page.replace("legal-workflow-", "")} setPage={setPage} user={user} />;
    if (page.startsWith("purchase-contract-")) return <PurchaseContractPage id={page.replace("purchase-contract-", "")} setPage={setPage} user={user} />;
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
