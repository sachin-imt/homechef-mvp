// ─── SUBSCRIBE PAGE ───
window.CC = window.CC || {};
var { useState, useEffect } = React;

// Defined OUTSIDE SubscribePage so it is stable across re-renders.
// If defined inside, every keystroke creates a new component type → React
// unmounts/remounts the field → input loses focus.
function SubField({ name, label, required, errors, children }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}{required && " *"}</label>
      {children}
      {(errors||{})[name] && <p style={{ color: "#D0342C", fontSize: "0.78rem", margin: "4px 0 0" }}>{(errors||{})[name]}</p>}
    </div>
  );
}

function SubscribePage({ chef, setPage }) {
  // Derive suburbs dynamically from chef's delivery postcodes
  var postcodeMap = window.CC.POSTCODE_SUBURB_MAP || {};
  var suburbOptions = chef
    ? chef.delivery_postcodes.map(pc => ({ postcode: pc, suburb: postcodeMap[pc] || pc }))
    : [];

  // ── Week options: always Mon–Fri, always starting from next Monday ──
  function localIso(d) {
    // Use local date parts to avoid UTC offset shifting the date
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function getMonIso(weeksAhead) {
    var d = new Date();
    var day = d.getDay();
    // Days until next Monday (always forward — never stays on current Monday)
    var daysToMon = day === 1 ? 7 : day === 0 ? 8 : (8 - day) % 7;
    d.setDate(d.getDate() + daysToMon + weeksAhead * 7);
    return localIso(d);
  }
  function fmtIso(iso) {
    var parts = iso.split('-').map(Number);
    var mon = new Date(parts[0], parts[1]-1, parts[2]); // parse as local date
    var fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return mon.getDate() + ' ' + M[mon.getMonth()] + ' – ' + fri.getDate() + ' ' + M[fri.getMonth()];
  }
  var unavailableWeeks = chef?.menus?.unavailable_weeks || [];
  // Always show next two Mon–Fri weeks
  var rawWeekOpts = [
    { val: 'this_week', iso: getMonIso(0), label: fmtIso(getMonIso(0)) },
    { val: 'next_week', iso: getMonIso(1), label: fmtIso(getMonIso(1)) },
  ];
  var weekOptions = rawWeekOpts.filter(function(o) { return !unavailableWeeks.includes(o.iso); });
  var defaultWeek = weekOptions.length > 0 ? weekOptions[0].val : 'this_week';

  var [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    street_address: "", suburb: "", postcode: "", state: "NSW", delivery_notes: "",
    start_week: defaultWeek, dietary_restrictions: "",
    payment_method: "bank_transfer", terms_accepted: false,
  });
  var [errors, setErrors] = useState({});
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);

  // Auto-fill postcode when suburb changes
  function handleSuburbChange(e) {
    var val = e.target.value;
    var match = suburbOptions.find(o => o.suburb === val);
    setForm(f => ({ ...f, suburb: val, postcode: match ? match.postcode : f.postcode }));
  }

  function validate() {
    var e = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Enter your full name";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!/^04[0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid AU mobile (04XX XXX XXX)";
    if (!form.street_address.trim() || form.street_address.trim().length < 5) e.street_address = "Enter your street address";
    if (!form.suburb) e.suburb = "Select a suburb";
    if (!form.terms_accepted) e.terms_accepted = "Please accept the terms";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    var selectedOpt = weekOptions.find(function(o) { return o.val === form.start_week; }) || weekOptions[0];
    var weekLabel = selectedOpt ? selectedOpt.label : '';
    var newSub = {
      name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      chef_id: chef?.chef_id,
      chef_name: chef?.chef_name,
      suburb: form.suburb,
      postcode: form.postcode,
      street_address: form.street_address.trim(),
      delivery_notes: form.delivery_notes.trim(),
      dietary: form.dietary_restrictions.trim(),
      starting_week: weekLabel || '',
      amount: chef?.price_per_week,
      status: 'Interested',
      status_notes: '',
      payments: [],
    };
    fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        setLoading(false);
        setSubmitted(true);
        window.scrollTo(0, 0);
      })
      .catch(function(err) {
        setErrors({ submit: 'Submission failed — please try again.' });
        setLoading(false);
      });
  }

  var weekLabels = {
    this_week: rawWeekOpts.find(function(o) { return o.val === 'this_week'; })?.label || '',
    next_week: rawWeekOpts.find(function(o) { return o.val === 'next_week'; })?.label || '',
  };

  if (submitted) {
    return (
      <div className="fade-in" style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "72px", height: "72px", background: "rgba(58,129,61,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <i className="ph-fill ph-check-circle" style={{ fontSize: "36px", color: "#3A813D" }}></i>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#111", marginBottom: "12px" }}>You're all set!</h1>
          <p style={{ color: "#5A5D66", fontSize: "1rem", maxWidth: "420px", margin: "0 auto 8px" }}>
            We've received your subscription request for <strong style={{ color: "#111" }}>{chef?.chef_name}</strong>.
          </p>
          <p style={{ color: "#5A5D66", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto" }}>
            Bank transfer details will be emailed to <strong style={{ color: "#111" }}>{form.email}</strong>. Your chef will contact you 24 hours before your first delivery.
          </p>
        </div>
        <div style={{ background: "#F4F4F4", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 16px", color: "#111" }}>Subscription Summary</h3>
          {[
            ["Chef", chef?.chef_name],
            ["Week", form.start_week === "this_week" ? weekLabels.this_week : weekLabels.next_week],
            ["Delivery to", `${form.street_address}, ${form.suburb} ${form.postcode}`],
            ["Weekly price", `$${chef?.price_per_week}`],
            ["Payment", "Bank Transfer (details emailed)"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E5E5", fontSize: "0.9rem" }}>
              <span style={{ color: "#5A5D66" }}>{label}</span>
              <span style={{ fontWeight: 600, color: "#111" }}>{val}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setPage({ name: "home" }); window.scrollTo(0, 0); }}>Browse More Chefs</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { setPage({ name: "detail", chef }); window.scrollTo(0, 0); }}>Back to {chef?.chef_name}</button>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "#9CA3AF", marginTop: "20px" }}>
          Questions? <a href="mailto:hello@homemeals.com.au" style={{ color: "#111", fontWeight: 600 }}>hello@homemeals.com.au</a>
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#111", marginBottom: "8px" }}>Complete Your Subscription</h1>
        <p style={{ color: "#5A5D66", margin: 0 }}>Fresh, chef-crafted meals delivered to your door.</p>
      </div>

      {/* Chef summary card */}
      {chef && (
        <div style={{ background: "white", border: "2px solid #FACA50", borderRadius: "12px", padding: "20px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={chef.photo_url} alt={chef.chef_name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #FACA50" }}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.chef_name)}&background=FACA50&color=111&size=60`; }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#111", fontSize: "1rem" }}>You're subscribing to: <strong>{chef.chef_name}</strong></p>
            <p style={{ margin: 0, color: "#5A5D66", fontSize: "0.88rem" }}>{chef.cuisine_type} · ${chef.price_per_week}/week · 5 Meals Mon–Fri</p>
          </div>
          <button onClick={() => setPage({ name: "detail", chef })} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#5A5D66", fontFamily: "inherit", fontSize: "0.82rem", textDecoration: "underline" }}>Change</button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Your Details */}
        <fieldset>
          <legend>Your Details</legend>
          <SubField errors={errors} name="full_name" label="Full Name" required>
            <input id="full_name" className="form-input" type="text" placeholder="e.g. Jane Smith" value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </SubField>
          <div className="addr-row">
            <SubField errors={errors} name="email" label="Email" required>
              <input id="email" className="form-input" type="email" placeholder="jane@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </SubField>
            <SubField errors={errors} name="phone" label="Phone (for delivery)" required>
              <input id="phone" className="form-input" type="tel" placeholder="0412 345 678" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </SubField>
          </div>
        </fieldset>

        {/* Delivery Address */}
        <fieldset>
          <legend>Delivery Address</legend>
          <SubField errors={errors} name="street_address" label="Street Address" required>
            <input id="street_address" className="form-input" type="text" placeholder="123 Example St" value={form.street_address}
              onChange={e => setForm(f => ({ ...f, street_address: e.target.value }))} />
          </SubField>
          <div className="addr-row">
            <SubField errors={errors} name="suburb" label="Suburb" required>
              <select id="suburb" className="form-input" value={form.suburb} onChange={handleSuburbChange}>
                <option value="">Select suburb</option>
                {suburbOptions.map(o => (
                  <option key={o.postcode} value={o.suburb}>{o.suburb}</option>
                ))}
              </select>
            </SubField>
            <SubField errors={errors} name="postcode" label="Postcode">
              <input id="postcode" className="form-input" type="text" value={form.postcode} readOnly style={{ background: "#F4F4F4", color: "#5A5D66" }} />
            </SubField>
            <SubField errors={errors} name="state" label="State">
              <input id="state" className="form-input" type="text" value="NSW" readOnly style={{ background: "#F4F4F4", color: "#5A5D66" }} />
            </SubField>
          </div>
          <SubField errors={errors} name="delivery_notes" label="Delivery Instructions (optional)">
            <textarea id="delivery_notes" className="form-input" rows={3} placeholder="Gate code, apartment number, leave at door, etc."
              value={form.delivery_notes} onChange={e => setForm(f => ({ ...f, delivery_notes: e.target.value }))} />
          </SubField>
        </fieldset>

        {/* Subscription Details */}
        <fieldset>
          <legend>Subscription Details</legend>
          <div className="form-group">
            <label>Start Week *</label>
            {weekOptions.length === 0 ? (
              <p style={{ color: "#D0342C", fontSize: "0.88rem", margin: "8px 0 0", padding: "12px 16px", background: "#FFF0F0", borderRadius: "8px", border: "1px solid #FCA5A5" }}>
                <i className="ph-fill ph-warning" style={{ marginRight: "6px" }}></i>
                {chef?.chef_name} is not available for the upcoming weeks. Please check back later.
              </p>
            ) : (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
                {weekOptions.map(opt => (
                  <label key={opt.val} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", border: `2px solid ${form.start_week === opt.val ? "#FACA50" : "#E5E5E5"}`, borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: form.start_week === opt.val ? 700 : 400, background: form.start_week === opt.val ? "rgba(250,202,80,0.08)" : "white" }}>
                    <input type="radio" name="start_week" value={opt.val} checked={form.start_week === opt.val} onChange={e => setForm(f => ({ ...f, start_week: e.target.value }))} style={{ accentColor: "#111" }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <SubField errors={errors} name="dietary_restrictions" label="Dietary Restrictions (optional)">
            <textarea className="form-input" rows={2} placeholder="Any allergies or dietary needs? e.g. nut-free, gluten-free"
              value={form.dietary_restrictions} onChange={e => setForm(f => ({ ...f, dietary_restrictions: e.target.value }))} />
          </SubField>
        </fieldset>

        {/* Payment */}
        <fieldset>
          <legend>Payment</legend>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", border: "2px solid #FACA50", borderRadius: "8px", background: "rgba(250,202,80,0.05)", cursor: "pointer" }}>
            <input type="radio" name="payment_method" value="bank_transfer" checked readOnly style={{ accentColor: "#111", marginTop: "2px" }} />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#111", fontSize: "0.9rem" }}>Bank Transfer</p>
              <p style={{ margin: 0, color: "#5A5D66", fontSize: "0.82rem" }}>Account details will be emailed to you after submission. Payment due within 24 hours.</p>
            </div>
          </label>
        </fieldset>

        {/* Terms */}
        <div className="form-group" style={{ marginBottom: "24px" }}>
          <div className="checkbox-row">
            <input type="checkbox" id="terms" checked={form.terms_accepted} onChange={e => setForm(f => ({ ...f, terms_accepted: e.target.checked }))} />
            <label htmlFor="terms" style={{ cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#111" }}>
              I agree to weekly payments via Bank Transfer until I cancel. No lock-in — cancel anytime.
            </label>
          </div>
          {errors.terms_accepted && <p style={{ color: "#D0342C", fontSize: "0.78rem", margin: "6px 0 0" }}>{errors.terms_accepted}</p>}
        </div>

        {errors.submit && <p style={{ color: "#D0342C", fontSize: "0.85rem", margin: "0 0 12px", textAlign: "center" }}>{errors.submit}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: "1rem", padding: "16px" }} disabled={loading}>
          {loading ? <><span className="spin">↻</span> Processing…</> : "Complete Subscription →"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9CA3AF", marginTop: "12px" }}>
          Cancel anytime. No commitment beyond the first week.
        </p>
      </form>
    </div>
  );
}

Object.assign(window.CC, { SubscribePage });
