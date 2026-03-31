import { useState, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id: "l1", title: "Luxusní penthouse s výhledem na Prahu", address: "Mánesova 28, Praha 2 - Vinohrady", city: "Praha", district: "Vinohrady", propertyType: "APARTMENT", bedrooms: 4, bathrooms: 2, internalSize: 180, yearBuilt: 2020, hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: true, askingPrice: 28500000, reservationFee: 50000, aiValuation: 29200000, aiConfidence: 0.91, aiRange: { low: 27500000, high: 30500000 }, marketTrend: "rising", daysOnMarket: 14, viewCount: 847, savedCount: 63, description: "Výjimečný penthouse v srdci Vinohrad s panoramatickým výhledem na Pražský hrad. Prostorný open-plan obývací prostor s prémiovým vybavením, kuchyní Bulthaup a terasou 60 m².", features: ["Terasa 60m²", "Výhled na Hrad", "Garáž", "Recepce", "Klimatizace"], img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"], seller: { anonymousId: "SLR-7291", memberSince: "2021", successRate: 94, name: "Kateřina Novotná", email: "k.novotna@email.cz", phone: "+420 732 456 789", address: "Blanická 22, Praha 2" }, aiFactors: [{ factor: "Lokalita Vinohrady", impact: "positive", score: 96 }, { factor: "Novostavba 2020", impact: "positive", score: 91 }, { factor: "Výhled na Hrad", impact: "positive", score: 88 }, { factor: "Rostoucí trh", impact: "positive", score: 84 }], comparables: [{ address: "Blanická 12, Praha 2", price: 27800000, sold: "Nov 2024", beds: 4, size: 175 }, { address: "Mánesova 44, Praha 2", price: 30100000, sold: "Říj 2024", beds: 4, size: 195 }, { address: "Korunní 18, Praha 2", price: 26900000, sold: "Pro 2024", beds: 3, size: 165 }] },
  { id: "l2", title: "Historický byt v činžovním domě", address: "Nerudova 15, Praha 1 - Malá Strana", city: "Praha", district: "Malá Strana", propertyType: "APARTMENT", bedrooms: 3, bathrooms: 2, internalSize: 145, yearBuilt: 1898, hasGarden: false, hasPool: false, hasGarage: false, hasBalcony: true, askingPrice: 19500000, reservationFee: 50000, aiValuation: 18750000, aiConfidence: 0.84, aiRange: { low: 17900000, high: 19900000 }, marketTrend: "stable", daysOnMarket: 31, viewCount: 512, savedCount: 41, description: "Jedinečný byt v historickém domě na Malé Straně. Zachované původní prvky — stropy s štuky, parkety, kachlová kamna — v kombinaci s moderní kuchyní a koupelnou. Výhled na Pražský hrad.", features: ["Historické prvky", "Výhled na Hrad", "Štuková výzdoba", "Parketové podlahy", "Balkón"], img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"], seller: { anonymousId: "SLR-4482", memberSince: "2020", successRate: 88, name: "Martin Dvořák", email: "m.dvorak@email.cz", phone: "+420 603 111 222", address: "Nerudova 8, Praha 1" }, aiFactors: [{ factor: "Lokalita Malá Strana", impact: "positive", score: 94 }, { factor: "Historická hodnota", impact: "positive", score: 87 }, { factor: "Stav nemovitosti", impact: "neutral", score: 72 }, { factor: "Stabilní trh", impact: "neutral", score: 71 }], comparables: [{ address: "Thunovská 8, Praha 1", price: 19200000, sold: "Říj 2024", beds: 3, size: 138 }, { address: "Tržiště 22, Praha 1", price: 20500000, sold: "Zář 2024", beds: 3, size: 155 }, { address: "Karmelitská 31, Praha 1", price: 18400000, sold: "Lis 2024", beds: 3, size: 142 }] },
  { id: "l3", title: "Moderní vila se zahradou", address: "Na Hřebenkách 48, Praha 5 - Smíchov", city: "Praha", district: "Smíchov", propertyType: "HOUSE", bedrooms: 5, bathrooms: 3, internalSize: 320, yearBuilt: 2018, hasGarden: true, hasPool: true, hasGarage: true, hasBalcony: true, askingPrice: 42000000, reservationFee: 50000, aiValuation: 43500000, aiConfidence: 0.89, aiRange: { low: 40500000, high: 45500000 }, marketTrend: "rising", daysOnMarket: 7, viewCount: 1203, savedCount: 89, description: "Reprezentativní vila v žádané rezidenční lokalitě Praha 5. Moderní architektura, bazén, zahrada 800 m², garážové stání pro 2 auta. Perfektní stav, ihned k nastěhování.", features: ["Zahrada 800m²", "Bazén", "Dvojgaráž", "Smart Home", "Sauna"], img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"], seller: { anonymousId: "SLR-9834", memberSince: "2022", successRate: 97, name: "Petr Svoboda", email: "p.svoboda@email.cz", phone: "+420 777 333 444", address: "Na Hřebenkách 12, Praha 5" }, aiFactors: [{ factor: "Prémiová lokalita Praha 5", impact: "positive", score: 93 }, { factor: "Novostavba 2018", impact: "positive", score: 91 }, { factor: "Bazén a zahrada", impact: "positive", score: 89 }, { factor: "Rostoucí trh vil", impact: "positive", score: 86 }], comparables: [{ address: "Na Hřebenkách 32, Praha 5", price: 40200000, sold: "Lis 2024", beds: 5, size: 298 }, { address: "Stroupežnického 12, Praha 5", price: 44800000, sold: "Říj 2024", beds: 5, size: 340 }, { address: "Holečkova 22, Praha 5", price: 39500000, sold: "Pro 2024", beds: 4, size: 285 }] },
  { id: "l4", title: "Designový loft v bývalé továrně", address: "Dělnická 33, Praha 7 - Holešovice", city: "Praha", district: "Holešovice", propertyType: "APARTMENT", bedrooms: 2, bathrooms: 1, internalSize: 120, yearBuilt: 2015, hasGarden: false, hasPool: false, hasGarage: true, hasBalcony: false, askingPrice: 11800000, reservationFee: 50000, aiValuation: 12200000, aiConfidence: 0.86, aiRange: { low: 11400000, high: 12900000 }, marketTrend: "rising", daysOnMarket: 22, viewCount: 694, savedCount: 57, description: "Unikátní loft v revitalizované továrně v trendy Holešovicích. Původní cihlové stěny, ocelové sloupy, stropy 4,5m. Garáž v ceně.", features: ["Stropy 4,5m", "Původní cihly", "Ocelové prvky", "Garáž", "Trendy lokalita"], img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80", imgs: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80"], seller: { anonymousId: "SLR-3317", memberSince: "2023", successRate: 100, name: "Jana Procházková", email: "j.prochazkova@email.cz", phone: "+420 605 222 333", address: "Komunardů 5, Praha 7" }, aiFactors: [{ factor: "Holešovice – rostoucí čtvrť", impact: "positive", score: 92 }, { factor: "Unikátní charakter", impact: "positive", score: 88 }, { factor: "Revitalizace 2015", impact: "positive", score: 83 }, { factor: "Bez balkónu", impact: "negative", score: 58 }], comparables: [{ address: "Komunardů 18, Praha 7", price: 11600000, sold: "Zář 2024", beds: 2, size: 115 }, { address: "Jateční 22, Praha 7", price: 12800000, sold: "Srp 2024", beds: 2, size: 128 }, { address: "Výstaviště 4, Praha 7", price: 11200000, sold: "Lis 2024", beds: 2, size: 112 }] },
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

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
const getUsers = () => { try { return JSON.parse(localStorage.getItem("vebre_users") || "[]"); } catch { return []; } };
const saveUsers = (u) => localStorage.setItem("vebre_users", JSON.stringify(u));

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

// ─── REZERVAČNÍ SMLOUVA (HTML + tisk) ────────────────────────────────────────
const ContractView = ({ listing, buyer, paid }) => {
  const today = fmtDate(new Date());
  const contractNo = "RSV-" + listing.id.toUpperCase() + "-" + new Date().getFullYear();

  const printContract = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Rezervační smlouva ${contractNo}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.8; font-size: 14px; }
        h1 { font-size: 22px; text-align: center; margin-bottom: 4px; }
        h2 { font-size: 15px; margin-top: 28px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        .subtitle { text-align: center; color: #666; font-size: 13px; margin-bottom: 32px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .label { color: #666; min-width: 200px; }
        .value { font-weight: bold; }
        .highlight { background: #f7f4ef; padding: 14px 18px; border-radius: 8px; margin: 16px 0; }
        .clause { margin-bottom: 12px; }
        .clause span { font-weight: bold; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; }
        .sig-box { border-top: 1px solid #999; padding-top: 10px; font-size: 13px; color: #666; }
        .masked { background: #e0dbd4; color: #e0dbd4; border-radius: 3px; }
        @media print { body { margin: 20px; } button { display: none; } }
      </style></head><body>
      <h1>REZERVAČNÍ SMLOUVA</h1>
      <div class="subtitle">č. ${contractNo} · Platforma VEBRE · ${today}</div>

      <h2>I. Smluvní strany</h2>
      <div class="highlight">
        <div class="row"><span class="label">Kupující (rezervant):</span><span class="value">${buyer.firstName} ${buyer.lastName}</span></div>
        <div class="row"><span class="label">Rodné číslo:</span><span class="value">${buyer.birthNumber}</span></div>
        <div class="row"><span class="label">Adresa:</span><span class="value">${buyer.street}, ${buyer.zip} ${buyer.city}</span></div>
        <div class="row"><span class="label">Telefon:</span><span class="value">${buyer.phone}</span></div>
      </div>
      <div class="highlight">
        <div class="row"><span class="label">Prodávající:</span><span class="value">${paid ? listing.seller.name : '<span class="masked">████████████</span>'}</span></div>
        <div class="row"><span class="label">Adresa:</span><span class="value">${paid ? listing.seller.address : '<span class="masked">████████████████</span>'}</span></div>
        <div class="row"><span class="label">E-mail:</span><span class="value">${paid ? listing.seller.email : '<span class="masked">█████████████</span>'}</span></div>
        <div class="row"><span class="label">Telefon:</span><span class="value">${paid ? listing.seller.phone : '<span class="masked">████████████</span>'}</span></div>
        ${!paid ? '<div style="color:#92400e;font-size:12px;margin-top:8px;">⚠️ Údaje prodávajícího budou odhaleny po uhrazení rezervačního poplatku.</div>' : ''}
      </div>

      <h2>II. Předmět rezervace</h2>
      <div class="highlight">
        <div class="row"><span class="label">Nemovitost:</span><span class="value">${listing.title}</span></div>
        <div class="row"><span class="label">Adresa nemovitosti:</span><span class="value">${listing.address}</span></div>
        <div class="row"><span class="label">Typ:</span><span class="value">${listing.propertyType === "APARTMENT" ? "Byt" : listing.propertyType === "HOUSE" ? "Rodinný dům" : "Nemovitost"}</span></div>
        <div class="row"><span class="label">Plocha:</span><span class="value">${listing.internalSize} m²</span></div>
        <div class="row"><span class="label">Rok výstavby:</span><span class="value">${listing.yearBuilt}</span></div>
      </div>

      <h2>III. Kupní cena a rezervační poplatek</h2>
      <div class="highlight">
        <div class="row"><span class="label">Sjednaná kupní cena:</span><span class="value">${fmtFull(listing.askingPrice)}</span></div>
        <div class="row"><span class="label">Rezervační poplatek:</span><span class="value">${fmtFull(listing.reservationFee)}</span></div>
        <div class="row"><span class="label">Splatnost poplatku:</span><span class="value">Do 3 pracovních dnů od podpisu</span></div>
      </div>

      <h2>IV. Podmínky rezervace</h2>
      <div class="clause"><span>1.</span> Kupující prohlašuje, že osobně absolvoval prohlídku nemovitosti a je s jejím stavem seznámen.</div>
      <div class="clause"><span>2.</span> Rezervační poplatek ve výši ${fmtFull(listing.reservationFee)} bude uhrazen bankovním převodem na účet platformy VEBRE č. 2801234567/2010, VS: ${contractNo}.</div>
      <div class="clause"><span>3.</span> Smlouva nabývá účinnosti okamžikem připsání rezervačního poplatku na účet platformy.</div>
      <div class="clause"><span>4.</span> Po uhrazení poplatku budou kupujícímu odhaleny veškeré kontaktní údaje prodávajícího a obě strany budou moci komunikovat přímo.</div>
      <div class="clause"><span>5.</span> Rezervační poplatek je součástí kupní ceny a bude odečten od celkové kupní ceny při podpisu kupní smlouvy.</div>
      <div class="clause"><span>6.</span> V případě, že kupní smlouva nebude uzavřena z důvodu na straně prodávajícího, bude rezervační poplatek vrácen kupujícímu v plné výši do 5 pracovních dnů.</div>
      <div class="clause"><span>7.</span> V případě odstoupení ze strany kupujícího bez závažného důvodu rezervační poplatek propadá ve prospěch prodávajícího.</div>
      <div class="clause"><span>8.</span> Platnost rezervace je 30 dní od data nabytí účinnosti smlouvy.</div>

      <h2>V. Závěrečná ustanovení</h2>
      <div class="clause">Tato smlouva je uzavřena prostřednictvím platformy VEBRE a řídí se právním řádem České republiky. Případné spory budou řešeny příslušným soudem v České republice.</div>

      <div class="signatures">
        <div class="sig-box">
          <strong>${buyer.firstName} ${buyer.lastName}</strong><br/>Kupující<br/><br/>
          Datum: ${today}<br/>
          Podpis: ___________________
        </div>
        <div class="sig-box">
          <strong>${paid ? listing.seller.name : "█████████████"}</strong><br/>Prodávající<br/><br/>
          Datum: ${today}<br/>
          Podpis: ___________________
        </div>
      </div>
      <div style="margin-top:40px;text-align:center;font-size:11px;color:#999;">
        Vygenerováno platformou VEBRE · vebre.cz · ${today}
      </div>
      <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e0dbd4", borderRadius: 16, padding: 28, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hlavička */}
      <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "2px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, background: "#1a1a1a", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#C9A84C", fontWeight: 900, fontSize: 13 }}>V</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>VEBRE</span>
        </div>
        <h2 style={{ ...D, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>REZERVAČNÍ SMLOUVA</h2>
        <div style={{ fontSize: 12, color: "#888" }}>č. {contractNo} · {today}</div>
      </div>

      {/* Smluvní strany */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>KUPUJÍCÍ</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{buyer.firstName} {buyer.lastName}</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>RČ: {buyer.birthNumber}</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>{buyer.street}, {buyer.zip} {buyer.city}</div>
          <div style={{ fontSize: 12, color: "#666" }}>📞 {buyer.phone}</div>
        </div>
        <div style={{ background: paid ? "#f0fdf4" : "#fef3c7", borderRadius: 12, padding: 16, position: "relative" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>PRODÁVAJÍCÍ</div>
          {paid ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#059669" }}>{listing.seller.name}</div>
              <div style={{ fontSize: 12, color: "#059669", marginBottom: 2 }}>{listing.seller.address}</div>
              <div style={{ fontSize: 12, color: "#059669", marginBottom: 2 }}>📧 {listing.seller.email}</div>
              <div style={{ fontSize: 12, color: "#059669" }}>📞 {listing.seller.phone}</div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{listing.seller.anonymousId}</div>
              <div style={{ fontSize: 11, color: "#92400e", marginTop: 8, lineHeight: 1.5 }}>🔒 Jméno, adresa a kontakt prodávajícího budou odhaleny po uhrazení rezervačního poplatku.</div>
            </>
          )}
        </div>
      </div>

      {/* Nemovitost */}
      <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>PŘEDMĚT REZERVACE</div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{listing.title}</div>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>📍 {listing.address}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#888" }}>
          <span>📐 {listing.internalSize} m²</span>
          <span>🛏 {listing.bedrooms} pokoje</span>
          <span>🏗 {listing.yearBuilt}</span>
        </div>
      </div>

      {/* Cena */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ border: "1.5px solid #e0dbd4", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 6, letterSpacing: "0.05em" }}>KUPNÍ CENA</div>
          <div style={{ ...D, fontSize: 20, fontWeight: 800 }}>{fmtFull(listing.askingPrice)}</div>
        </div>
        <div style={{ border: "1.5px solid #C9A84C", borderRadius: 12, padding: 16, background: "#fffbf0" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 6, letterSpacing: "0.05em" }}>REZERVAČNÍ POPLATEK</div>
          <div style={{ ...D, fontSize: 20, fontWeight: 800, color: "#C9A84C" }}>{fmtFull(listing.reservationFee)}</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>Započítává se do kupní ceny</div>
        </div>
      </div>

      {/* Klíčové podmínky */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", marginBottom: 10, letterSpacing: "0.05em" }}>KLÍČOVÉ PODMÍNKY</div>
        {[
          "Smlouva nabývá účinnosti uhrazením rezervačního poplatku.",
          "Rezervační poplatek bude odečten od kupní ceny při podpisu kupní smlouvy.",
          "Platnost rezervace: 30 dní od nabytí účinnosti.",
          "Při odstoupení prodávajícím: poplatek vrácen do 5 pracovních dnů.",
          "Při odstoupení kupujícím bez závažného důvodu: poplatek propadá.",
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#444", lineHeight: 1.5 }}>
            <span style={{ color: "#C9A84C", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
            <span>{c}</span>
          </div>
        ))}
      </div>

      {/* Tlačítko PDF */}
      <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={printContract} style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          📄 Stáhnout / Vytisknout jako PDF
        </button>
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
    } catch {
      setStatus("error"); onResult && onResult(null);
    }
  };

  if (status === "idle") return (
    <button onClick={check} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f7f4ef", border: "1.5px solid #e0dbd4", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
      🔍 Zkontrolovat insolvenci
    </button>
  );
  if (status === "loading") return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#f7f4ef", borderRadius: 10, fontSize: 13, color: "#888" }}>
      <div style={{ width: 16, height: 16, border: "2px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      Ověřuji v ISIR rejstříku…
    </div>
  );
  if (status === "ok") return <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#065f46", fontWeight: 600 }}>✅ Žádný insolvenční záznam nalezen</div>;
  if (status === "insolvent") return <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b", fontWeight: 700 }}>⛔ Aktivní insolvence nalezena! Rezervaci nelze provést.</div>;
  return (
    <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400e" }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>⚠️ Automatická kontrola nedostupná</div>
      <a href="https://isir.justice.cz/isir/ueu/evidence_upadcu.do" target="_blank" rel="noreferrer"
        style={{ background: "#92400e", color: "#fff", padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
        Zkontrolovat ručně na ISIR →
      </a>
    </div>
  );
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
  const l = LISTINGS.find(x => x.id === id);
  const STEPS = ["Osobní údaje", "Smlouva", "Platba"];
  const [step, setStep] = useState("Osobní údaje");
  const [form, setForm] = useState({ firstName: "", lastName: "", birthNumber: "", street: "", city: "", zip: "", phone: "" });
  const [viewingDone, setViewingDone] = useState(false);
  const [insolvencyOk, setInsolvencyOk] = useState(null);
  const [contractRead, setContractRead] = useState(false);
  const [formError, setFormError] = useState("");
  const [paid, setPaid] = useState(false);

  if (!l) return null;
  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validatePersonal = () => {
    if (!form.firstName || !form.lastName || !form.birthNumber || !form.street || !form.city || !form.zip || !form.phone) {
      setFormError("Vyplňte prosím všechna pole."); return false;
    }
    if (!viewingDone) { setFormError("Potvrďte prosím, že jste absolvovali prohlídku nemovitosti."); return false; }
    setFormError(""); return true;
  };

  const confirm = () => {
    setPaid(true);
    setTimeout(() => setStep("success"), 2500);
  };

  // Úspěch
  if (step === "success") return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 18 }}>🔓</div>
      <h1 style={{ ...D, fontSize: 34, fontWeight: 800, marginBottom: 10 }}>Rezervace potvrzena!</h1>
      <p style={{ color: "#666", fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Poplatek přijat. Identita prodávajícího odhalena. Smlouva je nyní plně účinná.</p>
      <div style={{ marginBottom: 28 }}>
        <ContractView listing={l} buyer={form} paid={true} />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn onClick={() => setPage("buyer-dash")}>Na dashboard</Btn>
        <Btn variant="outline" onClick={() => setPage("listing-" + l.id)}>Zobrazit inzerát</Btn>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 24px" }}>
      <button onClick={() => step === "Osobní údaje" ? setPage("listing-" + l.id) : setStep(STEPS[STEPS.indexOf(step) - 1])} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 26, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <Stepper steps={STEPS} current={step} />

      {/* ── KROK 1: Osobní údaje ── */}
      {step === "Osobní údaje" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>
          <div>
            <h2 style={{ ...D, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Osobní údaje</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 22 }}>Vyplňte své údaje pro rezervační smlouvu a ověřte insolvenci.</p>
            <Card style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="JMÉNO" value={form.firstName} onChange={setF("firstName")} placeholder="Vaše jméno" />
                <Input label="PŘÍJMENÍ" value={form.lastName} onChange={setF("lastName")} placeholder="Vaše příjmení" />
              </div>
              <Input label="RODNÉ ČÍSLO" value={form.birthNumber} onChange={setF("birthNumber")} placeholder="900101/1234" />
              <Input label="ULICE A ČÍSLO" value={form.street} onChange={setF("street")} placeholder="Václavské náměstí 1" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
                <Input label="MĚSTO" value={form.city} onChange={setF("city")} placeholder="Praha" />
                <Input label="PSČ" value={form.zip} onChange={setF("zip")} placeholder="110 00" />
              </div>
              <Input label="TELEFON" value={form.phone} onChange={setF("phone")} placeholder="+420 600 000 000" />

              {/* Prohlídka checkbox */}
              <div style={{ margin: "4px 0 18px", padding: "14px 16px", background: viewingDone ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: `1.5px solid ${viewingDone ? "#6ee7b7" : "#e0dbd4"}`, cursor: "pointer" }} onClick={() => setViewingDone(v => !v)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${viewingDone ? "#059669" : "#ccc"}`, background: viewingDone ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {viewingDone && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>Potvrzuji, že jsem absolvoval/a osobní prohlídku nemovitosti</div>
                    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>Seznámil/a jsem se s jejím stavem a beru na vědomí, že rezervace se vztahuje na nemovitost v aktuálním stavu.</div>
                  </div>
                </div>
              </div>

              {/* Insolvence */}
              {form.firstName && form.lastName && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, letterSpacing: "0.05em" }}>KONTROLA INSOLVENCE</div>
                  <InsolvencyCheck firstName={form.firstName} lastName={form.lastName} onResult={setInsolvencyOk} />
                </div>
              )}

              {insolvencyOk === false && (
                <div style={{ background: "#fee2e2", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b", marginBottom: 14 }}>
                  ⛔ Rezervaci nelze provést — kupující je v insolvenci.
                </div>
              )}

              {formError && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginBottom: 14 }}>⚠️ {formError}</div>}

              <Btn full disabled={insolvencyOk === false} onClick={() => { if (validatePersonal()) setStep("Smlouva"); }}>
                Pokračovat ke smlouvě →
              </Btn>
            </Card>
          </div>

          {/* Sidebar */}
          <Card style={{ padding: 20, alignSelf: "start" }}>
            <img src={l.img} alt={l.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
            <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{l.title}</h4>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>📍 {l.district}, Praha</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, borderTop: "1px solid #f0ede8", paddingTop: 12 }}>
              <span>Poplatek</span><span style={{ ...D }}>50 000 Kč</span>
            </div>
            <div style={{ marginTop: 10, background: "#f0fdf4", borderRadius: 9, padding: 10, fontSize: 11, color: "#065f46" }}>✓ Identity odhaleny po platbě<br />✓ Smlouva ihned ke stažení<br />✓ 30 dní platnost rezervace</div>
          </Card>
        </div>
      )}

      {/* ── KROK 2: Smlouva ── */}
      {step === "Smlouva" && (
        <div>
          <h2 style={{ ...D, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Rezervační smlouva</h2>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 22 }}>Přečtěte si smlouvu. Údaje prodávajícího budou doplněny po zaplacení.</p>

          <ContractView listing={l} buyer={form} paid={false} />

          <div style={{ marginTop: 20, padding: "16px 20px", background: contractRead ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: `1.5px solid ${contractRead ? "#6ee7b7" : "#e0dbd4"}`, cursor: "pointer", marginBottom: 20 }} onClick={() => setContractRead(v => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${contractRead ? "#059669" : "#ccc"}`, background: contractRead ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {contractRead && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Přečetl/a jsem si smlouvu a souhlasím s jejími podmínkami</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep("Osobní údaje")}>← Zpět</Btn>
            <Btn full disabled={!contractRead} onClick={() => setStep("Platba")}>Přejít k platbě →</Btn>
          </div>
        </div>
      )}

      {/* ── KROK 3: Platba ── */}
      {step === "Platba" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>
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
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              ⚠️ Po odeslání platby klikněte na tlačítko níže. Smlouva nabude účinnosti a údaje prodávajícího budou odhaleny.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={() => setStep("Smlouva")}>← Zpět</Btn>
              <Btn full onClick={confirm}>Potvrzuji odeslání platby 🔓</Btn>
            </div>
          </Card>

          <Card style={{ padding: 20, alignSelf: "start" }}>
            <img src={l.img} alt={l.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
            <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{l.title}</h4>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>👤 {form.firstName} {form.lastName}</div>
            <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginBottom: 10 }}>✓ Smlouva podepsána</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, borderTop: "1px solid #f0ede8", paddingTop: 12 }}>
              <span>K úhradě</span><span style={{ ...D, color: "#C9A84C" }}>50 000 Kč</span>
            </div>
          </Card>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
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
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.nickname}</div>
            <div style={{ fontSize: 11, color: "#999" }}>{user.role === "BUYER" ? "Kupující" : user.role === "SELLER" ? "Prodávající" : "Admin"}</div>
          </div>
          <div onClick={() => { setUser(null); setPage("home"); }} style={{ width: 34, height: 34, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.nickname[0].toUpperCase()}</div>
        </div>
      ) : (
        <><Btn variant="ghost" small onClick={() => setPage("login")}>Přihlásit se</Btn><Btn small onClick={() => setPage("register")}>Začít</Btn></>
      )}
    </div>
  </nav>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ setPage, setUser }) => {
  const [role, setRole] = useState("BUYER");
  const [nickname, setNickname] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = () => {
    setError("");
    if (!nickname.trim() || !pass) { setError("Vyplňte přezdívku a heslo."); return; }
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
        <blockquote>
          <p style={{ ...D, color: "#fff", fontSize: 24, fontWeight: 600, lineHeight: 1.5, marginBottom: 18 }}>"VEBRE mi ušetřilo přes 200 000 Kč na provizi. AI ocenění bylo přesnější než tři makléři dohromady."</p>
          <footer style={{ color: "#888", fontSize: 13 }}>Tomáš Procházka · Prodal v Praze 2</footer>
        </blockquote>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, textAlign: "center" }}>
          {[["50%", "Nižší provize"], ["94%", "Přesnost AI"], ["2,1 mld", "Objem transakcí"]].map(([v, lb]) => (
            <div key={lb}><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{v}</div><div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{lb}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ ...D, fontSize: 30, fontWeight: 800, marginBottom: 5 }}>Přihlásit se</h1>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Nemáte účet? <span onClick={() => setPage("register")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Zaregistrujte se</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[{ r: "BUYER", label: "🏠 Kupující" }, { r: "SELLER", label: "🏗 Prodávající" }].map(({ r, label }) => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: "10px 6px", borderRadius: 10, border: `1.5px solid ${role === r ? "#1a1a1a" : "#e0dbd4"}`, background: role === r ? "#1a1a1a" : "#fff", color: role === r ? "#fff" : "#888", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{label}</button>
            ))}
          </div>
          <Card style={{ padding: 26 }}>
            <Input label="PŘEZDÍVKA" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Vaše přezdívka" />
            <Input label="HESLO" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Vaše heslo" />
            {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
            <Btn full onClick={login} disabled={loading}>{loading ? "Přihlašuji…" : "Přihlásit se →"}</Btn>
            <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#ddd" }}>Admin: <strong>admin</strong> / <strong>admin123</strong></p>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
const RegisterPage = ({ setPage, setUser, isSeller }) => {
  const [role, setRole] = useState(isSeller ? "SELLER" : "BUYER");
  const [nickname, setNickname] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const register = () => {
    setError("");
    if (!nickname.trim()) { setError("Vyplňte přezdívku."); return; }
    if (pass.length < 6) { setError("Heslo musí mít alespoň 6 znaků."); return; }
    if (pass !== pass2) { setError("Hesla se neshodují."); return; }
    const users = getUsers();
    if (users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase())) { setError("Tato přezdívka je již obsazena."); return; }
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
          <button key={r.value} onClick={() => setRole(r.value)} style={{ padding: "14px 10px", borderRadius: 13, border: `2px solid ${role === r.value ? "#1a1a1a" : "#e0dbd4"}`, background: role === r.value ? "#f7f4ef" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{r.label}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{r.desc}</div>
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
  const [vi, setVi] = useState({ beds: 3, type: "APARTMENT" });
  const [vr, setVr] = useState(null);
  const [vl, setVl] = useState(false);
  const runVal = () => {
    setVl(true); setVr(null);
    setTimeout(() => { const base = { APARTMENT: 12000000, HOUSE: 28000000, OFFICE: 18000000 }; const b = base[vi.type] || 12000000; const v = Math.round(b * (0.8 + vi.beds * 0.12)); setVr({ value: v, confidence: 0.89, low: Math.round(v * 0.91), high: Math.round(v * 1.1) }); setVl(false); }, 1400);
  };
  return (
    <div>
      <div style={{ padding: "52px 32px 40px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 99, marginBottom: 28 }}>✦ REALITNÍ PLATFORMA NOVÉ GENERACE</div>
        <h1 style={{ ...D, fontSize: "clamp(38px,5vw,72px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 24px" }}>Kupujte a prodávejte<br /><span style={{ color: "#C9A84C" }}>chytřeji.</span></h1>
        <p style={{ fontSize: 22, color: "#666", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.5, fontWeight: 500 }}>Poloviční provize&nbsp;&nbsp;|&nbsp;&nbsp;Prověření kupující&nbsp;&nbsp;|&nbsp;&nbsp;Absolutní transparentnost.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => setPage("register-seller")}>Nabídnout nemovitost</Btn>
          <Btn variant="outline" onClick={() => setPage("register")}>Hledám nemovitost</Btn>
        </div>
      </div>
      <div style={{ background: "#1a1a1a", padding: "64px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}><AIBadge /><h2 style={{ ...D, color: "#fff", fontSize: 32, margin: "14px 0 8px" }}>AI Ocenění zdarma</h2></div>
          <Card style={{ background: "#252525", border: "1px solid #333" }}>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
              {[{ label: "POČET POKOJŮ", key: "beds", opts: [1, 2, 3, 4, 5] }, { label: "TYP", key: "type", opts: ["APARTMENT", "HOUSE", "OFFICE"] }].map(f => (
                <div key={f.key}>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 6, fontWeight: 600 }}>{f.label}</div>
                  <select value={vi[f.key]} onChange={e => setVi({ ...vi, [f.key]: f.key === "beds" ? +e.target.value : e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "#333", color: "#fff", border: "1px solid #444", fontSize: 14 }}>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <Btn onClick={runVal} disabled={vl}>{vl ? "Počítám…" : "Odhadnout →"}</Btn>
            </div>
            {vr && !vl && (
              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ height: 1, background: "#333", marginBottom: 20 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                  <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>ODHADOVANÁ CENA</div><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{fmt(vr.value)}</div></div>
                  <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>{Math.round(vr.confidence * 100)}%</div></div>
                  <div><div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>TREND</div><div style={{ color: "#34d399", fontSize: 20, fontWeight: 700 }}>↗ Rostoucí</div></div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <div style={{ padding: "48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ ...D, fontSize: 28, fontWeight: 800 }}>Vybrané nemovitosti v Praze</h2>
          <Btn variant="outline" small onClick={() => setPage("listings")}>Zobrazit vše →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {LISTINGS.slice(0, 3).map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}
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
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
        <Badge color={l.daysOnMarket < 14 ? "green" : "amber"}>{l.daysOnMarket < 7 ? "Nové" : `${l.daysOnMarket}d`}</Badge>
        {l.marketTrend === "rising" && <Badge color="green">↗</Badge>}
      </div>
      <div style={{ position: "absolute", bottom: 10, right: 10 }}><AIBadge /></div>
    </div>
    <div style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>📍 {l.district}, Praha</div>
      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 7, lineHeight: 1.35 }}>{l.title}</h3>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#888", marginBottom: 10 }}>
        <span>🛏 {l.bedrooms}</span><span>📐 {l.internalSize}m²</span>
      </div>
      <div style={{ ...D, fontSize: 20, fontWeight: 800 }}>{fmt(l.askingPrice)}</div>
      <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600 }}>✦ AI: {fmt(l.aiValuation)}</div>
    </div>
  </Card>
);

// ─── LISTINGS PAGE ────────────────────────────────────────────────────────────
const ListingsPage = ({ setPage }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Vše");
  const filtered = LISTINGS.filter(l => (type === "Vše" || l.propertyType === type) && (!search || l.district.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ ...D, fontSize: 36, fontWeight: 800, marginBottom: 6 }}>Nabídka nemovitostí</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <input placeholder="🔍  Hledat…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e0dbd4", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
        {["Vše", "APARTMENT", "HOUSE", "OFFICE"].map(t => (
          <button key={t} onClick={() => setType(t)} style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${type === t ? "#1a1a1a" : "#e0dbd4"}`, background: type === t ? "#1a1a1a" : "#fff", color: type === t ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
        {filtered.map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}
      </div>
    </div>
  );
};

// ─── LISTING DETAIL ───────────────────────────────────────────────────────────
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
  const getAI = () => { setAil(true); setTimeout(() => { setAi({ suggested: Math.round(l.aiValuation * 0.96), winProb: 74, tip: l.daysOnMarket > 20 ? `Inzerováno ${l.daysOnMarket} dní — prodávající je pravděpodobně flexibilní.` : `Čerstvá inzerce. Doporučujeme nabídku blízkou ceně.` }); setAil(false); }, 1200); };
  const submit = () => { if (!user) { setPage("login"); return; } setSubmitted(true); setTimeout(() => setPage("buyer-dash"), 2200); };
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <button onClick={() => setPage("listings")} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14, marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>← Zpět</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: 40 }}>
        <div>
          <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 12 }}>
            <img src={l.imgs[activeImg]} alt={l.title} style={{ width: "100%", height: 420, objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
            {l.imgs.map((im, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{ width: 76, height: 57, borderRadius: 9, overflow: "hidden", cursor: "pointer", border: i === activeImg ? "2.5px solid #C9A84C" : "2.5px solid transparent", opacity: i === activeImg ? 1 : 0.6 }}>
                <img src={im} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
          <h1 style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{l.title}</h1>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>📍 {l.address}</div>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: 14, marginBottom: 22 }}>{l.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 26 }}>
            {l.features.map(f => <span key={f} style={{ background: "#f5f1ec", padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500 }}>✓ {f}</span>)}
          </div>
          <Card style={{ padding: 22, background: "#1a1a1a", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}><AIBadge /><span style={{ color: "#fff", fontWeight: 700 }}>AI Ocenění</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>AI ODHAD</div><div style={{ ...D, color: "#C9A84C", fontSize: 22, fontWeight: 800 }}>{fmt(l.aiValuation)}</div><div style={{ color: diff > 0 ? "#34d399" : "#f87171", fontSize: 11 }}>{diff > 0 ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}%</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>PŘESNOST</div><div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{Math.round(l.aiConfidence * 100)}%</div></div>
              <div><div style={{ color: "#777", fontSize: 10, fontWeight: 600, marginBottom: 5 }}>ROZSAH</div><div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>{fmt(l.aiRange.low)} – {fmt(l.aiRange.high)}</div></div>
            </div>
          </Card>
        </div>
        <div style={{ position: "sticky", top: 76, alignSelf: "start" }}>
          <Card style={{ padding: 26 }}>
            <div style={{ ...D, fontSize: 28, fontWeight: 800, marginBottom: 3 }}>{fmtFull(l.askingPrice)}</div>
            <div style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600, marginBottom: 18 }}>✦ AI odhad: {fmt(l.aiValuation)}</div>
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e" }}>🔒 Rezervační poplatek: <strong>50 000 Kč</strong> · Odhalí identitu + smlouva</div>
            {!showOffer ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <Btn full onClick={() => { if (!user) { setPage("login"); return; } setShowOffer(true); getAI(); }}>Podat nabídku</Btn>
                <Btn variant="outline" full onClick={() => alert("Žádost o prohlídku odeslána!")}>Sjednat prohlídku</Btn>
                <Btn variant="ghost" full onClick={() => { if (!user) { setPage("login"); return; } setPage("reserve-" + l.id); }}>📋 Rezervovat + Smlouva</Btn>
              </div>
            ) : submitted ? (
              <div style={{ textAlign: "center", padding: "18px 0" }}><div style={{ fontSize: 36 }}>🎉</div><div style={{ fontWeight: 700, marginTop: 8 }}>Nabídka odeslána!</div></div>
            ) : (
              <div>
                {ail ? <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>AI analyzuje…</div> : ai && (
                  <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                    <div style={{ color: "#C9A84C", fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{fmtFull(ai.suggested)}</div>
                    <div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>{ai.winProb}% šance na úspěch</div>
                    <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{ai.tip}</p>
                  </div>
                )}
                <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e0dbd4", fontSize: 16, fontWeight: 700, boxSizing: "border-box", marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 7 }}><Btn variant="ghost" small onClick={() => setShowOffer(false)}>Zrušit</Btn><Btn full onClick={submit}>Odeslat nabídku</Btn></div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── SELLER DASH ──────────────────────────────────────────────────────────────
const SellerDash = ({ setPage }) => {
  const [tab, setTab] = useState("listings");
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard prodávajícího</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Správa inzerátů a nabídek</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "listings", label: "Moje inzeráty" }, { id: "offers", label: "Příchozí nabídky" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "listings" && SELLER_LISTINGS.map(l => (
        <Card key={l.id} style={{ padding: 0, display: "flex", overflow: "hidden", marginBottom: 14 }}>
          <img src={l.img} alt={l.title} style={{ width: 150, height: 110, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ padding: "18px 22px", flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{l.title}</h3>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>📍 {l.address}</div>
            <div style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmt(l.askingPrice)}</div>
          </div>
          <div style={{ padding: 18, display: "flex", alignItems: "center", borderLeft: "1px solid #f0ede8" }}>
            <Btn small onClick={() => setPage("listing-" + l.id)}>Zobrazit</Btn>
          </div>
        </Card>
      ))}
      {tab === "offers" && (
        <Card style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{SELLER_LISTINGS[0].title}</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>od Kupujícího BYR-4471</div>
          <div style={{ ...D, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{fmt(26800000)}</div>
          <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#aaa" }}>✦ Silný kupující. Nabídka 6 % pod cenou.</div>
          <div style={{ display: "flex", gap: 8 }}><Btn small>Přijmout</Btn><Btn small variant="outline">Protinabídka</Btn><Btn small variant="ghost">Odmítnout</Btn></div>
        </Card>
      )}
    </div>
  );
};

// ─── BUYER DASH ───────────────────────────────────────────────────────────────
const BuyerDash = ({ setPage, user }) => {
  const [tab, setTab] = useState("overview");
  const BUYER_OFFERS_LOCAL = [
    { id: "o1", listing: LISTINGS[1], amount: 18200000, status: "PENDING", createdAt: "2025-01-08" },
    { id: "o2", listing: LISTINGS[3], amount: 11500000, status: "ACCEPTED", createdAt: "2025-01-05" },
  ];
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard kupujícího</h1><p style={{ color: "#888", fontSize: 13 }}>Vaše nabídky a rezervace</p></div>
        <Btn onClick={() => setPage("listings")}>Procházet nabídky →</Btn>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Přehled" }, { id: "offers", label: "Moje nabídky" }, { id: "reservations", label: "Rezervace" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[{ label: "Aktivní nabídky", value: 2, icon: "📋", color: "#d97706" }, { label: "Prohlídky", value: 3, icon: "📅", color: "#3b82f6" }, { label: "Rezervace", value: 1, icon: "🔑", color: "#059669" }].map(s => (
            <Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#999" }}>{s.label}</div></Card>
          ))}
        </div>
      )}
      {tab === "offers" && BUYER_OFFERS_LOCAL.map(o => (
        <Card key={o.id} style={{ padding: 22, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <img src={o.listing.img} alt={o.listing.title} style={{ width: 86, height: 66, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{o.listing.title}</div>
                <Badge color={o.status === "ACCEPTED" ? "green" : "amber"}>{o.status === "ACCEPTED" ? "PŘIJATO" : "ČEKÁ"}</Badge>
              </div>
              <div style={{ ...D, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{fmtFull(o.amount)}</div>
              {o.status === "ACCEPTED" && (
                <div style={{ padding: "9px 12px", background: "#f0fdf4", borderRadius: 9, fontSize: 12, color: "#065f46" }}>
                  🎉 Přijato! <button onClick={() => setPage("reserve-" + o.listing.id)} style={{ background: "none", border: "none", color: "#059669", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>Zaplatit rezervaci + podepsat smlouvu →</button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      {tab === "reservations" && (
        <Card style={{ padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div><div style={{ fontWeight: 700, fontSize: 15 }}>{LISTINGS[1].title}</div><div style={{ fontSize: 12, color: "#888" }}>#RSV-00492</div></div>
            <Badge color="green">🔓 ODHALENO</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16 }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 7 }}>PRODÁVAJÍCÍ</div><div style={{ fontWeight: 800, color: "#059669" }}>Martin Dvořák</div><div style={{ fontSize: 12, color: "#059669" }}>📧 m.dvorak@email.cz</div><div style={{ fontSize: 12, color: "#059669" }}>📞 +420 603 111 222</div></div>
            <div style={{ background: "#f7f4ef", borderRadius: 12, padding: 16 }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 7 }}>ZAPLACENO</div><div style={{ ...D, fontSize: 22, fontWeight: 800 }}>50 000 Kč</div><div style={{ fontSize: 12, color: "#059669", marginTop: 6 }}>✓ Smlouva podepsána</div></div>
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── ADMIN DASH ───────────────────────────────────────────────────────────────
const AdminDash = () => {
  const [tab, setTab] = useState("overview");
  const users = getUsers();
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Admin Dashboard</h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Přehled platformy</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {[{ label: "Inzeráty", value: 4, icon: "🏠", color: "#059669" }, { label: "Uživatelé", value: users.length, icon: "👤", color: "#3b82f6" }, { label: "Nabídky", value: 12, icon: "📋", color: "#d97706" }, { label: "Rezervace", value: 3, icon: "🔑", color: "#7c3aed" }].map(s => (
          <Card key={s.label} style={{ padding: 18 }}><div style={{ fontSize: 20, marginBottom: 5 }}>{s.icon}</div><div style={{ ...D, fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div><div style={{ fontSize: 11, color: "#999" }}>{s.label}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Aktivita" }, { id: "users", label: "Uživatelé" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
      {tab === "overview" && ALL_ACTIVITY.map(a => (
        <Card key={a.id} style={{ padding: 18, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 22 }}>{a.type === "offer" ? "📋" : a.type === "reservation" ? "🔑" : "📅"}</div>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{a.listing}</div><div style={{ fontSize: 12, color: "#888" }}>{a.buyer} → {a.seller} · {a.date}</div></div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {a.amount && <div style={{ ...D, fontSize: 15, fontWeight: 800 }}>{fmtFull(a.amount)}</div>}
              <Badge color={a.status === "PAID" || a.status === "CONFIRMED" ? "green" : a.status === "ACCEPTED" ? "blue" : "amber"}>{a.status}</Badge>
            </div>
          </div>
        </Card>
      ))}
      {tab === "users" && (users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Zatím žádní registrovaní uživatelé</div>
      ) : users.map(u => (
        <Card key={u.anonymousId} style={{ padding: 18, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, background: u.role === "BUYER" ? "#dbeafe" : "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: u.role === "BUYER" ? "#1e40af" : "#065f46" }}>{u.nickname[0].toUpperCase()}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14 }}>{u.nickname} <span style={{ fontSize: 11, color: "#bbb" }}>· {u.anonymousId}</span></div><div style={{ fontSize: 12, color: "#888" }}>{u.role}</div></div>
            </div>
            <Badge color={u.role === "BUYER" ? "blue" : "green"}>{u.role}</Badge>
          </div>
        </Card>
      )))}
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
