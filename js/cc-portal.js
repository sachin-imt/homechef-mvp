// ─── CHEF PORTAL + ADMIN PORTAL ───
window.CC = window.CC || {};
var { useState } = React;
var { DAYS, DAY_LABELS, DISH_TYPES, CUISINE_OPTIONS } = window.CC;

// ─── CHEF PORTAL ───
function ChefPortalPage({ session }) {
  var [profileTab, setProfileTab] = useState("profile");
  var [weekTab, setWeekTab] = useState("currentWeek");
  var [saved, setSaved] = useState(false);
  var [postcodeInput, setPostcodeInput] = useState("");

  // ── Load chef data from CC store on mount ──
  var emptyMenu = () => DAYS.reduce((acc, d) => ({ ...acc, [d]: [{ dish_name: "", dish_type: "Main", dish_image: "" }] }), {});

  function chefFromStore() {
    // Prefer fresh copy from localStorage (admin edits land there)
    try {
      var saved = localStorage.getItem('cc_chefs');
      var chefs = saved ? JSON.parse(saved) : (window.CC.mockChefs || []);
      if (session && session.chef_id) return chefs.find(c => c.chef_id === session.chef_id) || null;
    } catch(e) {}
    return null;
  }

  function buildMenusFromChef(chef) {
    var convert = (weekData) => {
      var out = emptyMenu();
      if (!weekData) return out;
      DAYS.forEach(d => {
        var dishes = weekData[d];
        if (dishes && dishes.length) out[d] = dishes.map(dish => ({ dish_name: dish.dish_name || dish.name || "", dish_type: dish.dish_type || dish.type || "Main", dish_image: dish.dish_image || dish.image || "" }));
      });
      return out;
    };
    return { currentWeek: convert(chef.currentWeek), nextWeek: convert(chef.nextWeek) };
  }

  var initChef = chefFromStore();
  var [profile,  setProfile]  = useState({
    name:    initChef?.chef_name    || session?.chef_name || "",
    cuisine: initChef?.cuisine_type || "",
    price:   initChef?.price_per_week || "",
    bio:     initChef?.bio          || "",
  });
  var [postcodes, setPostcodes] = useState(initChef?.delivery_postcodes || []);
  var [bioLen,    setBioLen]    = useState((initChef?.bio || "").length);
  var [menus,     setMenus]     = useState(() => initChef ? buildMenusFromChef(initChef) : { currentWeek: emptyMenu(), nextWeek: emptyMenu() });
  var [openDays,  setOpenDays]  = useState({ monday: true, tuesday: false, wednesday: false, thursday: false, friday: false });

  function addPostcode() {
    var pc = postcodeInput.trim();
    if (pc.length === 4 && /^\d{4}$/.test(pc) && !postcodes.includes(pc)) {
      setPostcodes(p => [...p, pc]);
    }
    setPostcodeInput("");
  }

  function addDish(day) {
    setMenus(m => ({
      ...m,
      [weekTab]: { ...m[weekTab], [day]: [...m[weekTab][day], { dish_name: "", dish_type: "Main", dish_image: "" }] }
    }));
  }

  function removeDish(day, idx) {
    setMenus(m => ({
      ...m,
      [weekTab]: { ...m[weekTab], [day]: m[weekTab][day].filter((_, i) => i !== idx) }
    }));
  }

  function updateDish(day, idx, field, val) {
    setMenus(m => {
      var dishes = [...m[weekTab][day]];
      dishes[idx] = { ...dishes[idx], [field]: val };
      return { ...m, [weekTab]: { ...m[weekTab], [day]: dishes } };
    });
  }

  var [submitMsg, setSubmitMsg] = useState("");

  function handleSave() {
    // Write profile + menus back to the chef record in localStorage
    try {
      var stored = localStorage.getItem('cc_chefs');
      var chefs  = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(window.CC.mockChefs || []));
      var idx    = session?.chef_id ? chefs.findIndex(c => c.chef_id === session.chef_id) : -1;
      if (idx >= 0) {
        chefs[idx] = {
          ...chefs[idx],
          chef_name:         profile.name,
          cuisine_type:      profile.cuisine,
          price_per_week:    parseFloat(profile.price) || chefs[idx].price_per_week,
          bio:               profile.bio,
          delivery_postcodes: postcodes,
          currentWeek:       menus.currentWeek,
          nextWeek:          menus.nextWeek,
        };
        localStorage.setItem('cc_chefs', JSON.stringify(chefs));
        if (window.CC) window.CC.mockChefs = chefs;
      }
    } catch(e) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSubmitForApproval() {
    var chef = chefFromStore();
    var entry = {
      id: Date.now(),
      chef_id: session?.chef_id || null,
      chef_name: profile.name || session?.chef_name || "Chef",
      chef_cuisine: profile.cuisine,
      week_key: weekTab,
      week_label: weekTab === "currentWeek" ? "This Week" : "Next Week",
      dishes_by_day: menus[weekTab],
      submitted: new Date().toISOString().slice(0,10),
      status: "pending",
    };
    try {
      var pending = JSON.parse(localStorage.getItem('cc_pending_menus') || '[]');
      pending.unshift(entry);
      localStorage.setItem('cc_pending_menus', JSON.stringify(pending));
    } catch(e) {}
    setSubmitMsg("Menu submitted for admin approval!");
    setTimeout(() => setSubmitMsg(""), 4000);
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#111", marginBottom: "4px" }}>Chef Portal</h1>
        <p style={{ color: "#5A5D66", margin: 0 }}>Manage your profile and weekly menus.</p>
      </div>

      {/* Portal tabs */}
      <div style={{ display: "flex", background: "#F4F4F4", borderRadius: "10px", padding: "4px", gap: "4px", marginBottom: "32px", width: "fit-content" }}>
        {[{ key: "profile", label: "My Profile" }, { key: "menu", label: "Menu Submission" }].map(t => (
          <button key={t.key} onClick={() => setProfileTab(t.key)} style={{
            padding: "9px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, transition: "all 0.15s",
            background: profileTab === t.key ? "white" : "transparent",
            color: profileTab === t.key ? "#111" : "#5A5D66",
            boxShadow: profileTab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {profileTab === "profile" && (
        <div className="fade-in">
          <fieldset>
            <legend>Profile Details</legend>
            <div className="addr-row">
              <div className="form-group">
                <label>Chef Name *</label>
                <input className="form-input" type="text" placeholder="Chef Jane" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Cuisine Type *</label>
                <select className="form-input" value={profile.cuisine} onChange={e => setProfile(p => ({ ...p, cuisine: e.target.value }))}>
                  <option value="">Select cuisine</option>
                  {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: "200px" }}>
              <label>Price Per Week (AUD) *</label>
              <input className="form-input" type="number" min="40" max="200" placeholder="75" value={profile.price} onChange={e => setProfile(p => ({ ...p, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Bio <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(max 200 chars)</span></label>
              <textarea className="form-input" rows={4} maxLength={200} placeholder="Tell customers about your cooking background and style…" value={profile.bio}
                onChange={e => { setProfile(p => ({ ...p, bio: e.target.value })); setBioLen(e.target.value.length); }} />
              <div className="char-count">{bioLen}/200</div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Delivery Postcodes</legend>
            <p style={{ margin: "0 0 16px", fontSize: "0.88rem", color: "#5A5D66" }}>Add the Sydney postcodes where you can deliver. These determine which suburbs appear in the subscriber dropdown.</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 2042"
                value={postcodeInput}
                maxLength={4}
                onChange={e => setPostcodeInput(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPostcode())}
                style={{ maxWidth: "160px" }}
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={addPostcode}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {postcodes.length === 0 && <p style={{ color: "#9CA3AF", fontSize: "0.85rem", margin: 0 }}>No postcodes added yet.</p>}
              {postcodes.map(pc => (
                <span key={pc} className="tag">
                  <i className="ph-fill ph-map-pin" style={{ color: "#FACA50", fontSize: "0.8rem" }}></i>
                  {pc} {window.CC.POSTCODE_SUBURB_MAP[pc] ? `· ${window.CC.POSTCODE_SUBURB_MAP[pc]}` : ""}
                  <button onClick={() => setPostcodes(p => p.filter(x => x !== pc))}>×</button>
                </span>
              ))}
            </div>
          </fieldset>

          <button className="btn btn-primary" style={{ minWidth: "140px" }} onClick={handleSave}>
            {saved ? <><i className="ph-fill ph-check-circle"></i> Saved!</> : "Save Profile"}
          </button>
        </div>
      )}

      {profileTab === "menu" && (
        <div className="fade-in">
          {/* Week tabs */}
          <div style={{ display: "flex", background: "#F4F4F4", borderRadius: "10px", padding: "4px", gap: "4px", marginBottom: "24px", width: "fit-content" }}>
            {[{ key: "currentWeek", label: "This Week" }, { key: "nextWeek", label: "Next Week" }].map(t => (
              <button key={t.key} onClick={() => setWeekTab(t.key)} style={{
                padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, transition: "all 0.15s",
                background: weekTab === t.key ? "white" : "transparent",
                color: weekTab === t.key ? "#111" : "#5A5D66",
                boxShadow: weekTab === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Day accordions */}
          {DAYS.map(day => (
            <div key={day} style={{ marginBottom: "12px", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden" }}>
              <button
                onClick={() => setOpenDays(o => ({ ...o, [day]: !o[day] }))}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: openDays[day] ? "#111" : "white", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: openDays[day] ? "#FACA50" : "#111", letterSpacing: "0.05em" }}>{DAY_LABELS[day]}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.78rem", color: openDays[day] ? "#9CA3AF" : "#5A5D66" }}>{menus[weekTab][day].length} dish{menus[weekTab][day].length !== 1 ? "es" : ""}</span>
                  <i className={`ph-bold ${openDays[day] ? "ph-caret-up" : "ph-caret-down"}`} style={{ color: openDays[day] ? "#FACA50" : "#9CA3AF" }}></i>
                </span>
              </button>
              {openDays[day] && (
                <div style={{ padding: "16px 20px", background: "#FAFAFA" }}>
                  {menus[weekTab][day].map((dish, idx) => (
                    <div key={idx} style={{ marginBottom: "14px", background: "white", border: "1px solid #E5E5E5", borderRadius: "10px", padding: "12px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                        {dish.dish_image ? (
                          <img src={dish.dish_image} alt="dish" style={{ width:"44px", height:"44px", borderRadius:"8px", objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display='none'}/>
                        ) : (
                          <div style={{ width:"44px", height:"44px", borderRadius:"8px", background:"#F4F4F4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <i className="ph-bold ph-image" style={{ color:"#9CA3AF", fontSize:"1.2rem" }}></i>
                          </div>
                        )}
                        <input
                          className="form-input"
                          type="text"
                          placeholder={`Dish ${idx+1} name`}
                          value={dish.dish_name}
                          onChange={e => updateDish(day, idx, "dish_name", e.target.value)}
                          style={{ flex: 2 }}
                        />
                        <select
                          className="form-input"
                          value={dish.dish_type}
                          onChange={e => updateDish(day, idx, "dish_type", e.target.value)}
                          style={{ flex: 1, minWidth: "100px" }}
                        >
                          {DISH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeDish(day, idx)}
                          style={{ background: "none", border: "1px solid #E5E5E5", borderRadius: "8px", cursor: "pointer", padding: "8px 10px", color: "#9CA3AF", fontSize: "1rem", lineHeight: 1, flexShrink:0 }}
                          title="Remove dish"
                        >×</button>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <i className="ph-bold ph-link" style={{ color:"#9CA3AF", fontSize:"0.9rem", flexShrink:0 }}></i>
                        <input
                          className="form-input"
                          type="url"
                          placeholder="Dish photo URL (paste from Google, Unsplash, etc.)"
                          value={dish.dish_image || ""}
                          onChange={e => updateDish(day, idx, "dish_image", e.target.value)}
                          style={{ flex: 1, fontSize:"0.82rem" }}
                        />
                      </div>
                      <div style={{ fontSize:"0.72rem", color:"#9CA3AF", marginTop:"4px", paddingLeft:"22px" }}>
                        📐 Required: <strong>800 × 500 px</strong> · JPG or PNG · max <strong>1.5 MB</strong> · landscape format only
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => addDish(day)} style={{ marginTop: "4px" }}>
                    <i className="ph-bold ph-plus"></i> Add Dish
                  </button>
                </div>
              )}
            </div>
          ))}

          {submitMsg && (
            <div style={{ background:"#D4EDDA", border:"1px solid #A8D5B5", borderRadius:"8px", padding:"10px 16px", marginTop:"16px", fontSize:"0.875rem", color:"#3A813D", display:"flex", alignItems:"center", gap:"8px" }}>
              <i className="ph-fill ph-check-circle"></i> {submitMsg}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button className="btn btn-outline" style={{ minWidth: "130px" }} onClick={handleSave}>
              {saved ? <><i className="ph-fill ph-check-circle"></i> Draft Saved</> : "Save Draft"}
            </button>
            <button className="btn btn-primary" style={{ minWidth: "180px" }} onClick={handleSubmitForApproval}>
              <i className="ph-bold ph-paper-plane-tilt"></i> Submit for Approval
            </button>
          </div>
          <p style={{ fontSize:"0.78rem", color:"#9CA3AF", marginTop:"10px" }}>Submitted menus go to admin for review before going live. Chefs cannot repeat dishes from the previous week.</p>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PORTAL ───
function AdminPortalPage({ chefs, setChefs }) {
  var [activeSection, setActiveSection] = useState("chefs");
  var [editingChefId, setEditingChefId] = useState(null);
  var [pcInput, setPcInput] = useState("");
  var [mapEntry, setMapEntry] = useState({ postcode: "", suburb: "" });
  var [mapData, setMapData] = useState(() => ({ ...window.CC.POSTCODE_SUBURB_MAP }));
  var [saved, setSaved] = useState(false);

  function addPostcodeToChef(chefId, pc) {
    pc = pc.trim();
    if (!/^\d{4}$/.test(pc)) return;
    setChefs(prev => prev.map(c => c.chef_id === chefId && !c.delivery_postcodes.includes(pc)
      ? { ...c, delivery_postcodes: [...c.delivery_postcodes, pc] }
      : c
    ));
  }

  function removePostcodeFromChef(chefId, pc) {
    setChefs(prev => prev.map(c => c.chef_id === chefId
      ? { ...c, delivery_postcodes: c.delivery_postcodes.filter(p => p !== pc) }
      : c
    ));
  }

  function addMapEntry() {
    var pc = mapEntry.postcode.trim();
    var sb = mapEntry.suburb.trim();
    if (pc.length === 4 && sb) {
      var updated = { ...mapData, [pc]: sb };
      setMapData(updated);
      window.CC.POSTCODE_SUBURB_MAP = updated;
      setMapEntry({ postcode: "", suburb: "" });
    }
  }

  function removeMapEntry(pc) {
    var updated = { ...mapData };
    delete updated[pc];
    setMapData(updated);
    window.CC.POSTCODE_SUBURB_MAP = updated;
  }

  function handleSave() {
    window.CC.POSTCODE_SUBURB_MAP = { ...mapData };
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#111", margin: 0 }}>Admin Portal</h1>
        <span style={{ background: "#FFF3CD", color: "#856404", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: "1px solid #FACA50" }}>Dev Preview</span>
      </div>
      <p style={{ color: "#5A5D66", margin: "0 0 32px", fontSize: "0.9rem" }}>
        Manage delivery areas and suburb names. Changes take effect immediately in this session.<br />
        <strong style={{ color: "#111" }}>Connect to Airtable for persistence across sessions.</strong>
      </p>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#F4F4F4", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
        {[{ key: "chefs", label: "Chef Delivery Areas" }, { key: "map", label: "Postcode → Suburb Map" }].map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
            padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, transition: "all 0.15s",
            background: activeSection === s.key ? "white" : "transparent",
            color: activeSection === s.key ? "#111" : "#5A5D66",
            boxShadow: activeSection === s.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>{s.label}</button>
        ))}
      </div>

      {activeSection === "chefs" && (
        <div className="fade-in">
          <p style={{ color: "#5A5D66", fontSize: "0.88rem", margin: "0 0 20px" }}>
            Each chef's delivery postcodes control which suburbs appear in their subscriber signup form.
          </p>
          {chefs.map(chef => (
            <div key={chef.chef_id} style={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", marginBottom: "16px", overflow: "hidden" }}>
              <button
                onClick={() => setEditingChefId(editingChefId === chef.chef_id ? null : chef.chef_id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              >
                <img src={chef.photo_url} alt={chef.chef_name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.chef_name)}&background=FACA50&color=111&size=40`; }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#111", fontSize: "0.95rem" }}>{chef.chef_name}</p>
                  <p style={{ margin: 0, color: "#5A5D66", fontSize: "0.8rem" }}>{chef.cuisine_type} · {chef.delivery_postcodes.join(", ")}</p>
                </div>
                <i className={`ph-bold ${editingChefId === chef.chef_id ? "ph-caret-up" : "ph-caret-down"}`} style={{ color: "#9CA3AF" }}></i>
              </button>
              {editingChefId === chef.chef_id && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F4F4F4" }}>
                  <p style={{ margin: "16px 0 10px", fontSize: "0.82rem", fontWeight: 700, color: "#5A5D66", textTransform: "uppercase", letterSpacing: "0.06em" }}>Delivery Postcodes</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                    {chef.delivery_postcodes.map(pc => (
                      <span key={pc} className="tag">
                        <i className="ph-fill ph-map-pin" style={{ color: "#FACA50", fontSize: "0.8rem" }}></i>
                        {pc}{mapData[pc] ? ` · ${mapData[pc]}` : ""}
                        <button onClick={() => removePostcodeFromChef(chef.chef_id, pc)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Add postcode (e.g. 2042)"
                      maxLength={4}
                      value={editingChefId === chef.chef_id ? pcInput : ""}
                      onChange={e => setPcInput(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPostcodeToChef(chef.chef_id, pcInput), setPcInput(""))}
                      style={{ maxWidth: "200px" }}
                    />
                    <button className="btn btn-outline btn-sm" onClick={() => { addPostcodeToChef(chef.chef_id, pcInput); setPcInput(""); }}>Add</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === "map" && (
        <div className="fade-in">
          <p style={{ color: "#5A5D66", fontSize: "0.88rem", margin: "0 0 20px" }}>
            This map converts postcodes into suburb names shown on the subscribe form. Add any postcode your chefs serve.
          </p>
          {/* Add new entry */}
          <div style={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111", fontSize: "0.9rem" }}>Add / Update Entry</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: "4px", color: "#111" }}>Postcode</label>
                <input className="form-input" type="text" maxLength={4} placeholder="2042" value={mapEntry.postcode}
                  onChange={e => setMapEntry(m => ({ ...m, postcode: e.target.value.replace(/\D/g, "") }))} style={{ width: "100px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: "4px", color: "#111" }}>Suburb Name</label>
                <input className="form-input" type="text" placeholder="Newtown" value={mapEntry.suburb}
                  onChange={e => setMapEntry(m => ({ ...m, suburb: e.target.value }))} style={{ width: "200px" }} />
              </div>
              <button className="btn btn-primary btn-sm" onClick={addMapEntry}>Save Entry</button>
            </div>
          </div>
          {/* Table */}
          <div style={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden" }}>
            <table className="admin-table">
              <thead><tr><th>Postcode</th><th>Suburb</th><th style={{ width: "80px" }}>Action</th></tr></thead>
              <tbody>
                {Object.entries(mapData).sort((a,b) => a[0].localeCompare(b[0])).map(([pc, suburb]) => (
                  <tr key={pc}>
                    <td style={{ fontWeight: 600, color: "#111" }}>{pc}</td>
                    <td>{suburb}</td>
                    <td><button onClick={() => removeMapEntry(pc)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D0342C", fontSize: "0.82rem", fontFamily: "inherit" }}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? <><i className="ph-fill ph-check-circle"></i> Saved to session!</> : "Apply Changes"}
            </button>
            <p style={{ color: "#9CA3AF", fontSize: "0.78rem", margin: "auto 0" }}>Changes apply immediately to the subscribe form in this session.</p>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window.CC, { ChefPortalPage, AdminPortalPage });
