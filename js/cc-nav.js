// ─── NAV + FOOTER ───
window.CC = window.CC || {};
var { useState } = React;

function Nav({ page, setPage }) {
  var [mobileOpen, setMobileOpen] = useState(false);
  var navItems = [
    { label: "Our Chefs", target: "home" },
    { label: "How It Works", target: "how" },
    { label: "Become a Chef", target: "become" },
  ];
  return (
    <>
      <header className="cc-header">
        <div className="cc-header-inner">
          <div className="cc-nav-left">
            <button className="cc-logo" onClick={() => { setPage({ name: "home" }); setMobileOpen(false); }}>
              HOME<i className="ph-fill ph-bowl-food"></i>MEALS
            </button>
            <nav className="cc-nav-links">
              {navItems.map(item => (
                <button
                  key={item.target}
                  className={page.name === item.target ? "active" : ""}
                  onClick={() => setPage({ name: item.target })}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="cc-nav-right">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (page.name === "home") {
                  document.getElementById("chef-grid")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setPage({ name: "home" });
                  setTimeout(() => document.getElementById("chef-grid")?.scrollIntoView({ behavior: "smooth" }), 100);
                }
              }}
            >
              Order Now
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              className="md:hidden"
              aria-label="Menu"
            >
              <i className={`ph-bold ${mobileOpen ? "ph-x" : "ph-list"}`} style={{ fontSize: "24px" }}></i>
            </button>
          </div>
        </div>
      </header>
      {/* Mobile dropdown */}
      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        {navItems.map(item => (
          <button
            key={item.target}
            onClick={() => { setPage({ name: item.target }); setMobileOpen(false); }}
          >
            {item.label}
          </button>
        ))}
        <button
          className="btn btn-primary"
          style={{ marginTop: "8px", borderRadius: "8px" }}
          onClick={() => {
            setMobileOpen(false);
            if (page.name === "home") {
              document.getElementById("chef-grid")?.scrollIntoView({ behavior: "smooth" });
            } else {
              setPage({ name: "home" });
              setTimeout(() => document.getElementById("chef-grid")?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          }}
        >
          Order Now
        </button>
      </div>
    </>
  );
}

function Footer({ setPage }) {
  var sc = window.CC.siteContent || {};
  return (
    <footer className="cc-footer">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "32px", marginBottom: "40px" }}>
          <div>
            <div className="cc-logo" style={{ marginBottom: "12px" }}>
              HOME<i className="ph-fill ph-bowl-food"></i>MEALS
            </div>
            <p style={{ color: "#aaa", fontSize: "0.9rem", maxWidth: "260px", margin: 0 }}>
              {sc.footer_tagline}
            </p>
          </div>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Explore</p>
              {[
                { label: "Our Chefs", target: "home" },
                { label: "How It Works", target: "how" },
                { label: "Become a Chef", target: "become" },
              ].map(item => (
                <div key={item.target} style={{ marginBottom: "8px" }}>
                  <a href="#" onClick={e => { e.preventDefault(); setPage({ name: item.target }); window.scrollTo(0, 0); }}>{item.label}</a>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</p>
              <div style={{ marginBottom: "8px" }}><a href={"mailto:" + sc.contact_email}>{sc.contact_email}</a></div>
              <div style={{ marginBottom: "8px" }}><a href="#">Instagram</a></div>
              <div><a href="#">Facebook</a></div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ color: "#666", fontSize: "0.82rem", margin: 0 }}>© 2026 Home Meal. All rights reserved. Sydney, Australia.</p>
          <p style={{ color: "#666", fontSize: "0.82rem", margin: 0 }}>ABN: 00 000 000 000 (placeholder)</p>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window.CC, { Nav, Footer });
