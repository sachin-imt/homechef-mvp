// ─── HOW IT WORKS + BECOME A CHEF ───
window.CC = window.CC || {};
var { useState } = React;

function HowItWorksPage({ setPage }) {
  var sc = window.CC.siteContent || {};
  var [tab, setTab] = useState("customer");

  var customerSteps = [
    { icon: "ph-fill ph-magnifying-glass", title: sc.how_c1_title, desc: sc.how_c1_desc },
    { icon: "ph-fill ph-calendar-check",   title: sc.how_c2_title, desc: sc.how_c2_desc },
    { icon: "ph-fill ph-users-three",      title: sc.how_c3_title, desc: sc.how_c3_desc },
  ];

  var chefSteps = [
    { icon: "ph-fill ph-pencil-simple", title: sc.how_ch1_title, desc: sc.how_ch1_desc },
    { icon: "ph-fill ph-users",         title: sc.how_ch2_title, desc: sc.how_ch2_desc },
    { icon: "ph-fill ph-wallet",        title: sc.how_ch3_title, desc: sc.how_ch3_desc },
  ];

  var steps = tab === "customer" ? customerSteps : chefSteps;

  return (
    <div className="fade-in" style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111", marginBottom: "12px" }}>How Home Meals Works</h1>
        <p style={{ color: "#5A5D66", fontSize: "1.1rem", margin: 0 }}>Choose your journey.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
        {[{ val: "customer", label: "For Customers" }, { val: "chef", label: "For Chefs" }].map(t => (
          <button
            key={t.val}
            onClick={() => setTab(t.val)}
            style={{
              padding: "12px 32px", borderRadius: "9999px", fontFamily: "inherit", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.15s",
              background: tab === t.val ? "rgba(250,202,80,0.12)" : "transparent",
              border: tab === t.val ? "2px solid #111" : "2px solid #E5E5E5",
              color: tab === t.val ? "#111" : "#5A5D66",
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "28px", background: "white", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "28px 32px", alignItems: "flex-start" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(250,202,80,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={step.icon} style={{ fontSize: "32px", color: "#111" }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 8px", color: "#111" }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.65, color: "#5A5D66" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "48px" }}>
        {tab === "customer" ? (
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 40px" }} onClick={() => setPage({ name: "home" })}>Browse Chefs</button>
        ) : (
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 40px" }} onClick={() => setPage({ name: "become" })}>Apply Now</button>
        )}
      </div>
    </div>
  );
}

function BecomeAChefPage({ setPage }) {
  var [form, setForm] = useState({
    full_name: "", email: "", phone: "", suburb: "",
    cuisine_type: "", cooking_background: "",
    dish1: "", dish2: "", dish3: "", dish4: "", dish5: "",
    weekly_capacity: "5-10", can_deliver: "yes",
    delivery_days: [], price_per_week: "",
  });
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [charCount, setCharCount] = useState(0);

  var perks = [
    { icon: "ph ph-cooking-pot", title: "1. You cook", desc: "5–15 meals per week" },
    { icon: "ph ph-megaphone", title: "2. We market", desc: "Find customers easily" },
    { icon: "ph ph-bicycle", title: "3. You deliver", desc: "Or we arrange it" },
    { icon: "ph ph-wallet", title: "4. Get Paid", desc: "Keep 80% of price" },
  ];

  function handleDayToggle(day) {
    setForm(f => ({
      ...f,
      delivery_days: f.delivery_days.includes(day)
        ? f.delivery_days.filter(d => d !== day)
        : [...f.delivery_days, day],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    var newApp = {
      full_name: form.full_name, email: form.email, phone: form.phone,
      suburb: form.suburb, cuisine_type: form.cuisine_type,
      cooking_background: form.cooking_background,
      sample_dishes: [form.dish1,form.dish2,form.dish3,form.dish4,form.dish5].filter(Boolean),
      weekly_capacity: form.weekly_capacity,
      delivery_days: form.delivery_days,
      status: 'pending',
    };
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        setLoading(false); setSubmitted(true); window.scrollTo(0, 0);
      })
      .catch(function() {
        setLoading(false); setSubmitted(true); window.scrollTo(0, 0);
      });
  }

  if (submitted) {
    return (
      <div className="fade-in" style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", background: "rgba(58,129,61,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <i className="ph-fill ph-check-circle" style={{ fontSize: "40px", color: "#3A813D" }}></i>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#111", marginBottom: "12px" }}>Application Received!</h1>
        <p style={{ color: "#5A5D66", fontSize: "1rem", marginBottom: "8px" }}>Thanks for applying to become a Home Meals partner.</p>
        <p style={{ color: "#5A5D66", fontSize: "0.9rem", marginBottom: "32px" }}>We'll review your application and contact you within 48 hours at <strong style={{ color: "#111" }}>{form.email}</strong>.</p>
        <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }} onClick={() => { setPage({ name: "home" }); window.scrollTo(0, 0); }}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#111", marginBottom: "12px" }}>Become a Home Meals Partner</h1>
        <p style={{ fontSize: "1.1rem", color: "#5A5D66", maxWidth: "520px", margin: "0 auto 20px" }}>Turn your home cooking into income. Set your own menu. Set your own pace.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(250,202,80,0.15)", border: "1px solid #FACA50", borderRadius: "8px", padding: "12px 24px", fontWeight: 700, fontSize: "1rem", color: "#111" }}>
          <i className="ph-fill ph-money" style={{ color: "#FACA50", fontSize: "1.2rem" }}></i>
          Current chefs earn $400–$900/week
        </div>
      </div>

      {/* Perks */}
      <div className="perks-grid" style={{ marginBottom: "48px" }}>
        {perks.map((p, i) => (
          <div key={i} className="perk-card">
            <i className={p.icon} style={{ fontSize: "32px", color: "#FACA50" }}></i>
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* About You */}
        <fieldset>
          <legend>1. About You</legend>
          <div className="form-group">
            <label>Full Name *</label>
            <input className="form-input" type="text" required placeholder="Your full name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div className="addr-row">
            <div className="form-group">
              <label>Email *</label>
              <input className="form-input" type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input className="form-input" type="tel" required placeholder="04XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Suburb (where you will cook) *</label>
            <input className="form-input" type="text" required placeholder="e.g. Newtown" value={form.suburb} onChange={e => setForm(f => ({ ...f, suburb: e.target.value }))} />
          </div>
        </fieldset>

        {/* Your Cooking */}
        <fieldset>
          <legend>2. Your Cooking</legend>
          <div className="form-group">
            <label>Cuisine Type *</label>
            <input className="form-input" type="text" required placeholder="e.g. Italian, Thai, Middle Eastern" value={form.cuisine_type} onChange={e => setForm(f => ({ ...f, cuisine_type: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Cooking Background * <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(max 200 chars)</span></label>
            <textarea className="form-input" required rows={4} maxLength={200} placeholder="I grew up learning my family's traditional recipes..." value={form.cooking_background}
              onChange={e => { setForm(f => ({ ...f, cooking_background: e.target.value })); setCharCount(e.target.value.length); }} />
            <div className="char-count">{charCount}/200</div>
          </div>
        </fieldset>

        {/* Sample Menu */}
        <fieldset>
          <legend>3. Sample Menu</legend>
          <p style={{ margin: "0 0 20px", fontSize: "0.9rem", color: "#5A5D66" }}>What 5 dishes would you cook for a sample week?</p>
          <div className="addr-row">
            {["dish1","dish2","dish3","dish4","dish5"].map((key, i) => (
              <div key={key} className="form-group">
                <label>Dish {i+1}{i < 2 ? " *" : ""}</label>
                <input className="form-input" type="text" required={i < 2} placeholder={`e.g. ${["Butter Chicken","Pad Thai","Pasta Bolognese","Falafel Wrap","Sushi Roll"][i]}`} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Logistics */}
        <fieldset>
          <legend>4. Logistics</legend>
          <div className="form-group">
            <label>How many meals can you cook per week? *</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {["5-10", "10-20", "20-30", "30+"].map(v => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: `2px solid ${form.weekly_capacity === v ? "#FACA50" : "#E5E5E5"}`, borderRadius: "8px", cursor: "pointer", fontWeight: form.weekly_capacity === v ? 700 : 400, background: form.weekly_capacity === v ? "rgba(250,202,80,0.08)" : "white", fontSize: "0.9rem" }}>
                  <input type="radio" name="weekly_capacity" value={v} checked={form.weekly_capacity === v} onChange={e => setForm(f => ({ ...f, weekly_capacity: e.target.value }))} style={{ accentColor: "#111" }} />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Can you handle your own delivery? *</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {[{ val: "yes", label: "Yes, I can deliver" }, { val: "no", label: "No, need help" }, { val: "partial", label: "Partially" }].map(opt => (
                <label key={opt.val} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: `2px solid ${form.can_deliver === opt.val ? "#FACA50" : "#E5E5E5"}`, borderRadius: "8px", cursor: "pointer", fontWeight: form.can_deliver === opt.val ? 700 : 400, background: form.can_deliver === opt.val ? "rgba(250,202,80,0.08)" : "white", fontSize: "0.9rem" }}>
                  <input type="radio" name="can_deliver" value={opt.val} checked={form.can_deliver === opt.val} onChange={e => setForm(f => ({ ...f, can_deliver: e.target.value }))} style={{ accentColor: "#111" }} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Price per week you'd like to charge (AUD) *</label>
            <input className="form-input" type="number" required min="40" max="200" placeholder="e.g. 75" value={form.price_per_week} onChange={e => setForm(f => ({ ...f, price_per_week: e.target.value }))} style={{ maxWidth: "160px" }} />
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#9CA3AF" }}>You keep 80%. Platform fee is 20%.</p>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: "1rem", padding: "16px" }} disabled={loading}>
          {loading ? <><span className="spin">↻</span> Submitting…</> : "Submit Application →"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9CA3AF", marginTop: "12px" }}>We review all applications within 48 hours.</p>
      </form>
    </div>
  );
}

Object.assign(window.CC, { HowItWorksPage, BecomeAChefPage });
