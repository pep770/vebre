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

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────
const ImageUploader = ({ listingId, currentImgs, onImagesUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImgs, setUploadedImgs] = useState(currentImgs || []);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFiles = async (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) { setError("Vyberte prosím obrázky (JPG, PNG, WebP)."); return; }
    if (imageFiles.length + uploadedImgs.length > 8) { setError("Maximálně 8 fotek na nemovitost."); return; }
    setError("");
    setUploading(true);
    try {
      const urls = await Promise.all(imageFiles.map(f => uploadImageToGitHub(f, listingId)));
      const newImgs = [...uploadedImgs, ...urls];
      setUploadedImgs(newImgs);
      onImagesUpdated && onImagesUpdated(newImgs);
    } catch {
      setError("Nahrávání selhalo. Zkontrolujte připojení a zkuste znovu.");
    }
    setUploading(false);
  };

  const removeImg = (idx) => {
    const newImgs = uploadedImgs.filter((_, i) => i !== idx);
    setUploadedImgs(newImgs);
    onImagesUpdated && onImagesUpdated(newImgs);
  };

  const moveImg = (idx, dir) => {
    const newImgs = [...uploadedImgs];
    const swap = idx + dir;
    if (swap < 0 || swap >= newImgs.length) return;
    [newImgs[idx], newImgs[swap]] = [newImgs[swap], newImgs[idx]];
    setUploadedImgs(newImgs);
    onImagesUpdated && onImagesUpdated(newImgs);
  };

  return (
    <div>
      {/* Nahrané fotky */}
      {uploadedImgs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {uploadedImgs.map((url, i) => (
            <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: i === 0 ? "2.5px solid #C9A84C" : "2px solid #e0dbd4" }}>
              <img src={url} alt={`foto ${i + 1}`} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
              {i === 0 && <div style={{ position: "absolute", top: 5, left: 5, background: "#C9A84C", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>HLAVNÍ</div>}
              <div style={{ position: "absolute", top: 5, right: 5, display: "flex", gap: 3 }}>
                {i > 0 && <button onClick={() => moveImg(i, -1)} style={{ width: 20, height: 20, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}
                {i < uploadedImgs.length - 1 && <button onClick={() => moveImg(i, 1)} style={{ width: 20, height: 20, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>}
                <button onClick={() => removeImg(i)} style={{ width: 20, height: 20, background: "rgba(220,38,38,0.8)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current.click()}
        style={{ border: `2px dashed ${dragOver ? "#C9A84C" : "#e0dbd4"}`, borderRadius: 14, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? "#fffbf0" : "#fafaf9", transition: "all 0.15s" }}>
        {uploading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#888", fontSize: 13 }}>
            <div style={{ width: 20, height: 20, border: "2px solid #C9A84C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Nahrávám fotky na GitHub…
          </div>
        ) : (
          <>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Přetáhněte fotky sem nebo klikněte</div>
            <div style={{ fontSize: 12, color: "#999" }}>JPG, PNG, WebP · Max. 8 fotek · První fotka = hlavní</div>
          </>
        )}
      </div>
      <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
      {error && <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 13px", fontSize: 13, marginTop: 10 }}>⚠️ {error}</div>}
    </div>
  );
};

// ─── NOVÝ INZERÁT ─────────────────────────────────────────────────────────────
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
    <script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
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
  const [form, setForm] = useState({ firstName: "", lastName: "", birthNumber: "", street: "", city: "", zip: "", phone: "" });
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
  const confirm = () => { setPaid(true); setTimeout(() => setStep("success"), 2500); };
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
            <div style={{ margin: "4px 0 16px", padding: "14px 16px", background: viewingDone ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: `1.5px solid ${viewingDone ? "#6ee7b7" : "#e0dbd4"}`, cursor: "pointer" }} onClick={() => setViewingDone(v => !v)}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${viewingDone ? "#059669" : "#ccc"}`, background: viewingDone ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{viewingDone && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}</div>
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
          <div style={{ marginTop: 20, padding: "16px 20px", background: contractRead ? "#f0fdf4" : "#f7f4ef", borderRadius: 12, border: `1.5px solid ${contractRead ? "#6ee7b7" : "#e0dbd4"}`, cursor: "pointer", marginBottom: 20 }} onClick={() => setContractRead(v => !v)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${contractRead ? "#059669" : "#ccc"}`, background: contractRead ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{contractRead && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}</div>
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
const LoginPage = ({ setPage, setUser }) => {
  const [role, setRole] = useState("BUYER");
  const [nickname, setNickname] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, textAlign: "center" }}>{[["50%", "Nižší provize"], ["94%", "Přesnost AI"], ["2,1 mld", "Objem transakcí"]].map(([v, lb]) => (<div key={lb}><div style={{ ...D, color: "#C9A84C", fontSize: 26, fontWeight: 800 }}>{v}</div><div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{lb}</div></div>))}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ ...D, fontSize: 30, fontWeight: 800, marginBottom: 5 }}>Přihlásit se</h1>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>Nemáte účet? <span onClick={() => setPage("register")} style={{ color: "#1a1a1a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Zaregistrujte se</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[{ r: "BUYER", label: "🏠 Kupující" }, { r: "SELLER", label: "🏗 Prodávající" }].map(({ r, label }) => (<button key={r} onClick={() => setRole(r)} style={{ padding: "10px 6px", borderRadius: 10, border: `1.5px solid ${role === r ? "#1a1a1a" : "#e0dbd4"}`, background: role === r ? "#1a1a1a" : "#fff", color: role === r ? "#fff" : "#888", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{label}</button>))}
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
          <button key={r.value} onClick={() => setRole(r.value)} style={{ padding: "14px 10px", borderRadius: 13, border: `2px solid ${role === r.value ? "#1a1a1a" : "#e0dbd4"}`, background: role === r.value ? "#f7f4ef" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}><h2 style={{ ...D, fontSize: 28, fontWeight: 800 }}>Vybrané nemovitosti</h2><Btn variant="outline" small onClick={() => setPage("listings")}>Zobrazit vše →</Btn></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>{listings.slice(0, 3).map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}</div>
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
const ListingsPage = ({ setPage }) => {
  const listings = getListings();
  const [search, setSearch] = useState(""); const [type, setType] = useState("Vše");
  const filtered = listings.filter(l => (type === "Vše" || l.propertyType === type) && (!search || l.district?.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ ...D, fontSize: 36, fontWeight: 800, marginBottom: 6 }}>Nabídka nemovitostí</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <input placeholder="🔍  Hledat…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e0dbd4", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
        {["Vše", "APARTMENT", "HOUSE", "OFFICE"].map(t => (<button key={t} onClick={() => setType(t)} style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${type === t ? "#1a1a1a" : "#e0dbd4"}`, background: type === t ? "#1a1a1a" : "#fff", color: type === t ? "#fff" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{t}</button>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>{filtered.map(l => <ListingCard key={l.id} l={l} setPage={setPage} />)}</div>
    </div>
  );
};

// ─── LISTING DETAIL ───────────────────────────────────────────────────────────
const ListingDetail = ({ id, setPage, user }) => {
  const listings = getListings();
  const l = listings.find(x => x.id === id);
  const [activeImg, setActiveImg] = useState(0); const [showOffer, setShowOffer] = useState(false); const [amount, setAmount] = useState(0); const [submitted, setSubmitted] = useState(false); const [ai, setAi] = useState(null); const [ail, setAil] = useState(false);
  useEffect(() => { if (l) setAmount(Math.round(l.askingPrice * 0.95)); }, [l]);
  if (!l) return null;
  const diff = ((l.aiValuation - l.askingPrice) / l.askingPrice) * 100;
  const getAI = () => { setAil(true); setTimeout(() => { setAi({ suggested: Math.round(l.aiValuation * 0.96), winProb: 74, tip: l.daysOnMarket > 20 ? `Inzerováno ${l.daysOnMarket} dní — prodávající je pravděpodobně flexibilní.` : `Čerstvá inzerce. Doporučujeme nabídku blízkou ceně.` }); setAil(false); }, 1200); };
  const submit = () => { if (!user) { setPage("login"); return; } setSubmitted(true); setTimeout(() => setPage("buyer-dash"), 2200); };
  const imgs = l.imgs || [l.img];
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
            <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e" }}>🔒 Rezervační poplatek: <strong>50 000 Kč</strong></div>
            {!showOffer ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <Btn full onClick={() => { if (!user) { setPage("login"); return; } setShowOffer(true); getAI(); }}>Podat nabídku</Btn>
                <Btn variant="outline" full onClick={() => alert("Žádost odeslána!")}>Sjednat prohlídku</Btn>
                <Btn variant="ghost" full onClick={() => { if (!user) { setPage("login"); return; } setPage("reserve-" + l.id); }}>📋 Rezervovat + Smlouva</Btn>
              </div>
            ) : submitted ? (<div style={{ textAlign: "center", padding: "18px 0" }}><div style={{ fontSize: 36 }}>🎉</div><div style={{ fontWeight: 700, marginTop: 8 }}>Nabídka odeslána!</div></div>
            ) : (
              <div>
                {ail ? <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>AI analyzuje…</div> : ai && (<div style={{ background: "#1a1a1a", borderRadius: 12, padding: 14, marginBottom: 14 }}><div style={{ color: "#C9A84C", fontSize: 17, fontWeight: 800, marginBottom: 3 }}>{fmtFull(ai.suggested)}</div><div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>{ai.winProb}% šance</div><p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{ai.tip}</p></div>)}
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
const SellerDash = ({ setPage, user }) => {
  const [tab, setTab] = useState("listings");
  const listings = getListings();
  const myListings = listings.filter(l => l.seller?.anonymousId === user?.anonymousId);
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard prodávajícího</h1><p style={{ color: "#888", fontSize: 13 }}>Správa inzerátů a nabídek</p></div>
        <Btn onClick={() => setPage("new-listing")}>+ Nový inzerát</Btn>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 22, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "listings", label: "Moje inzeráty" }, { id: "offers", label: "Příchozí nabídky" }].map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>))}
      </div>
      {tab === "listings" && (
        myListings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Zatím žádné inzeráty</div>
            <p style={{ color: "#888", marginBottom: 20 }}>Přidejte svou první nemovitost</p>
            <Btn onClick={() => setPage("new-listing")}>+ Přidat inzerát</Btn>
          </div>
        ) : myListings.map(l => (
          <Card key={l.id} style={{ padding: 0, display: "flex", overflow: "hidden", marginBottom: 14 }}>
            <img src={l.img} alt={l.title} style={{ width: 150, height: 110, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ padding: "18px 22px", flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{l.title}</h3>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>📍 {l.address}</div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ ...D, fontSize: 18, fontWeight: 800 }}>{fmt(l.askingPrice)}</div>
                <Badge color="green">AKTIVNÍ</Badge>
                <span style={{ fontSize: 12, color: "#888" }}>📸 {(l.imgs || [l.img]).length} fotek</span>
              </div>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", justifyContent: "center", borderLeft: "1px solid #f0ede8" }}>
              <Btn small onClick={() => setPage("listing-" + l.id)}>Zobrazit</Btn>
            </div>
          </Card>
        ))
      )}
      {tab === "offers" && (<Card style={{ padding: 22 }}><div style={{ textAlign: "center", padding: "24px 0", color: "#aaa" }}>Zatím žádné nabídky</div></Card>)}
    </div>
  );
};

// ─── BUYER DASH ───────────────────────────────────────────────────────────────
const BuyerDash = ({ setPage }) => {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div><h1 style={{ ...D, fontSize: 32, fontWeight: 800, marginBottom: 3 }}>Dashboard kupujícího</h1></div>
        <Btn onClick={() => setPage("listings")}>Procházet nabídky →</Btn>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #e0dbd4" }}>
        {[{ id: "overview", label: "Přehled" }, { id: "offers", label: "Moje nabídky" }].map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", color: tab === t.id ? "#1a1a1a" : "#888", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1 }}>{t.label}</button>))}
      </div>
      {tab === "overview" && (<div style={{ textAlign: "center", padding: "48px 0" }}><div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div><p style={{ color: "#888", marginBottom: 20 }}>Prozkoumejte nabídku nemovitostí</p><Btn onClick={() => setPage("listings")}>Procházet nabídky →</Btn></div>)}
      {tab === "offers" && (<div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Zatím žádné nabídky</div>)}
    </div>
  );
};

// ─── NEW LISTING PAGE ─────────────────────────────────────────────────────────
const NewListingPage = ({ setPage, user }) => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: "", address: "", district: "", propertyType: "APARTMENT", bedrooms: 2, bathrooms: 1, internalSize: 80, yearBuilt: 2000, askingPrice: "", description: "", hasGarage: false, hasBalcony: false, hasGarden: false, hasPool: false });
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
      setPage("seller-dash");
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
          style={{ border: `2px dashed ${uploading ? "#C9A84C" : "#e0dbd4"}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: uploading ? "default" : "pointer", background: "#fafaf8", marginBottom: 16, transition: "all 0.2s" }}>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          {uploading ? (
            <div>
              <div style={{ width: 48, height: 48, border: "4px solid #f0ede8", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Nahrávám fotky… {uploadProgress}%</div>
              <div style={{ height: 6, background: "#f0ede8", borderRadius: 99, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                <div style={{ height: "100%", background: "#C9A84C", borderRadius: 99, width: `${uploadProgress}%`, transition: "width 0.3s" }} />
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
            <div key={item.key} onClick={setFBool(item.key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: form[item.key] ? "#f0fdf4" : "#f7f4ef", borderRadius: 11, border: `1.5px solid ${form[item.key] ? "#6ee7b7" : "#e0dbd4"}`, cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form[item.key] ? "#059669" : "#ccc"}`, background: form[item.key] ? "#059669" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {form[item.key] && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── POPIS ── */}
      <Card style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📝 Popis nemovitosti</h3>
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
