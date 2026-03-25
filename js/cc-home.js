// ─── HOMEPAGE + CHEF CARD ───
window.CC = window.CC || {};
var { useState } = React;
var { CUISINES, DISH_TYPE_COLORS } = window.CC;

function ChefCard({ chef, onViewMenu }) {
  var dtc = DISH_TYPE_COLORS;
  return (
    <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E5E5", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Food image banner */}
      <div style={{ position: "relative", height: "176px", overflow: "hidden" }}>
        <img
          src={chef.food_image}
          alt={chef.cuisine_type}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
        {/* Chef avatar */}
        <div style={{ position: "absolute", bottom: 0, left: "16px", transform: "translateY(50%)" }}>
          <img
            src={chef.photo_url}
            alt={chef.chef_name}
            style={{ width: "52px", height: "52px", borderRadius: "50%", border: "3px solid white", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.chef_name)}&background=FACA50&color=111&size=52`; }}
          />
        </div>
        {/* Cuisine badge */}
        <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", color: "#111", fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" }}>
          {chef.cuisine_type}
        </span>
      </div>

      {/* Card body */}
      <div style={{ paddingTop: "36px", padding: "36px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "4px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111" }}>{chef.chef_name}</h3>
          <span style={{ color: "#F59E0B", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
            ⭐ {chef.rating} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({chef.review_count})</span>
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#9CA3AF", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "4px" }}>
          <i className="ph-fill ph-map-pin" style={{ color: "#FACA50", fontSize: "0.9rem" }}></i>
          {chef.delivery_postcodes.join(", ")}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
          {chef.tags.slice(0, 3).map((t, i) => (
            <span key={i} style={{ fontSize: "0.72rem", background: "#F4F4F4", color: "#5A5D66", padding: "2px 8px", borderRadius: "20px", border: "1px solid #E5E5E5" }}>{t}</span>
          ))}
        </div>

        {/* Highlights */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>This Week's Highlights</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            {chef.highlights.map((h, i) => (
              <span key={i} style={{ fontSize: "0.78rem", background: "#FAFAFA", color: "#374151", padding: "5px 8px", borderRadius: "8px", border: "1px solid #F0F0F0" }}>{h}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #F4F4F4" }}>
          <div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111" }}>${chef.price_per_week}</span>
            <span style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>/week</span>
          </div>
          <button
            onClick={() => onViewMenu(chef)}
            className="btn btn-primary btn-sm"
          >
            View Full Menu →
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ chefs, setPage }) {
  var [selectedCuisine, setSelectedCuisine] = useState("All");
  var [postcodeInput, setPostcodeInput] = useState("");
  var [activePostcode, setActivePostcode] = useState("");

  var filtered = chefs.filter(chef => {
    var cuisineOk = selectedCuisine === "All" || chef.cuisine_type.toLowerCase() === selectedCuisine.toLowerCase();
    var postcodeOk = !activePostcode || chef.delivery_postcodes.includes(activePostcode.trim());
    return cuisineOk && postcodeOk;
  });

  // Reliable Unsplash food images (tested)
  var heroImages = [
    { src: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=85", label: "Indian" },
    { src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=85", label: "Mediterranean" },
    { src: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&q=85", label: "Thai" },
    { src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=85", label: "Italian" },
  ];

  return (
    <div>
      {/* ── HERO ── dark, high-contrast, brand-forward */}
      <section style={{ background: "#111", padding: "80px 24px 88px", position: "relative", overflow: "hidden" }}>
        {/* Subtle background texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=40')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left: headline + CTAs */}
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#111", background: "#FACA50", padding: "5px 14px", borderRadius: "20px", marginBottom: "28px" }}>
              <i className="ph-fill ph-map-pin"></i> Sydney's Home-Cooked Meal Marketplace
            </span>
            <h1 style={{ fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "white", marginBottom: "24px" }}>
              Authentic<br />
              <span style={{ color: "#FACA50" }}>Home-Cooked</span><br />
              Meals, Weekly.
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", marginBottom: "36px", maxWidth: "440px", lineHeight: 1.7 }}>
              Subscribe to a local home chef. Get 5 freshly cooked meals delivered Mon–Fri. Support your community.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: "1rem", padding: "14px 32px" }}
                onClick={() => document.getElementById("chef-grid") && document.getElementById("chef-grid").scrollIntoView({ behavior: "smooth" })}
              >
                Browse Chefs →
              </button>
              <button
                className="btn btn-outline"
                style={{ fontSize: "1rem", padding: "14px 28px", color: "white", borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)" }}
                onClick={() => setPage({ name: "how" })}
              >
                How It Works
              </button>
            </div>
            {/* Stats row */}
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[["4.8 ⭐", "Avg chef rating"], ["5 meals", "Delivered Mon–Fri"], ["Cancel", "Anytime, no lock-in"]].map(([stat, label]) => (
                <div key={label}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1.2rem", color: "white", letterSpacing: "-0.02em" }}>{stat}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2×2 food photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {heroImages.map((img, i) => (
              <div key={i} style={{ position: "relative", borderRadius: "14px", overflow: "hidden", aspectRatio: "1", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <img
                  src={img.src}
                  alt={img.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentNode.style.background = "#222";
                  }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)", padding: "20px 12px 10px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FACA50", textTransform: "uppercase", letterSpacing: "0.08em" }}>{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E5E5E5", padding: "20px 24px", marginTop: "-32px", position: "relative", zIndex: 10 }}>
          <p style={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#111", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="ph-fill ph-magnifying-glass" style={{ color: "#FACA50" }}></i>
            Find Your Perfect Chef
          </p>
          {/* Cuisine filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                style={{
                  padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: selectedCuisine === c ? "#FACA50" : "white",
                  color: selectedCuisine === c ? "#111" : "#5A5D66",
                  border: selectedCuisine === c ? "1.5px solid #FACA50" : "1.5px solid #E5E5E5",
                }}
              >{c}</button>
            ))}
          </div>
          {/* Postcode search */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <i className="ph-fill ph-map-pin" style={{ color: "#FACA50", fontSize: "1.1rem" }}></i>
            <input
              type="text"
              value={postcodeInput}
              onChange={e => setPostcodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={e => e.key === "Enter" && setActivePostcode(postcodeInput)}
              placeholder="Enter postcode (e.g. 2042)"
              style={{ border: "1.5px solid #E5E5E5", borderRadius: "8px", padding: "8px 14px", fontSize: "0.9rem", width: "220px", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "#FACA50"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"}
            />
            <button className="btn btn-primary btn-sm" onClick={() => setActivePostcode(postcodeInput)}>Find Chefs</button>
            {activePostcode && (
              <button onClick={() => { setPostcodeInput(""); setActivePostcode(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "0.85rem", textDecoration: "underline", fontFamily: "inherit" }}>Clear</button>
            )}
          </div>
          {activePostcode && (
            <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#5A5D66" }}>
              Showing chefs who deliver to <strong>{activePostcode}</strong>
              {filtered.length === 0 && " — no chefs found, try another postcode"}
            </p>
          )}
        </div>
      </div>

      {/* Chef grid */}
      <div id="chef-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#111" }}>
            {selectedCuisine === "All" ? "All Chefs" : `${selectedCuisine} Chefs`}
            <span style={{ fontWeight: 400, color: "#9CA3AF", fontSize: "1rem", marginLeft: "8px" }}>({filtered.length})</span>
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#9CA3AF" }}>
            <i className="ph ph-bowl-food" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></i>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#5A5D66", margin: "0 0 8px" }}>No chefs found</p>
            <p style={{ margin: 0 }}>Try a different cuisine or postcode</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {filtered.map(chef => (
              <ChefCard key={chef.chef_id} chef={chef} onViewMenu={c => setPage({ name: "detail", chef: c })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window.CC, { ChefCard, HomePage });
