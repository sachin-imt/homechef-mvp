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
  var [loadingChef, setLoadingChef] = useState(true);

  var emptyMenu = () => DAYS.reduce((acc, d) => ({ ...acc, [d]: [{ dish_name: "", dish_type: "Main", dish_image: "" }] }), {});

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
    return { currentWeek: convert(chef.currentWeek || chef.menus?.currentWeek), nextWeek: convert(chef.nextWeek || chef.menus?.nextWeek) };
  }

  var [profile,  setProfile]  = useState({
    name:    session?.chef_name || "",
    cuisine: "",
    price:   "",
    bio:     "",
  });
  var [postcodes, setPostcodes] = useState([]);
  var [bioLen,    setBioLen]    = useState(0);
  var [menus,     setMenus]     = useState({ currentWeek: emptyMenu(), nextWeek: emptyMenu() });
  var [openDays,  setOpenDays]  = useState({ monday: true, tuesday: false, wednesday: false, thursday: false, friday: false });

  // Load chef data from API on mount
  var { useEffect } = React;
  useEffect(function() {
    if (!session || !session.chef_id) { setLoadingChef(false); return; }
    fetch('/api/chefs/' + session.chef_id)
      .then(function(r) { return r.json(); })
      .then(function(chef) {
        if (chef && !chef.error) {
          setProfile({
            name:    chef.chef_name    || session.chef_name || "",
            cuisine: chef.cuisine_type || "",
            price:   chef.price_per_week || "",
            bio:     chef.bio          || "",
          });
          setPostcodes(chef.delivery_postcodes || []);
          setBioLen((chef.bio || "").length);
          setMenus(buildMenusFromChef(chef));
        }
        setLoadingChef(false);
      })
      .catch(function() { setLoadingChef(false); });
  }, [session && session.chef_id]);

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
    if (!session || !session.chef_id) return;
    var updates = {
      chef_name:          profile.name,
      cuisine_type:       profile.cuisine,
      price_per_week:     parseFloat(profile.price) || 0,
      bio:                profile.bio,
      delivery_postcodes: postcodes,
      menus: {
        currentWeek: menus.currentWeek,
        nextWeek:    menus.nextWeek,
      },
    };
    fetch('/api/chefs/' + session.chef_id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(function(r) { return r.json(); })
      .then(function() {
        setSaved(true);
        setTimeout(function() { setSaved(false); }, 2000);
      })
      .catch(function() {
        alert('Failed to save profile. Please try again.');
      });
  }

  function handleSubmitForApproval() {
    var entry = {
      chef_id: session?.chef_id || null,
      chef_name: profile.name || session?.chef_name || "Chef",
      chef_cuisine: profile.cuisine,
      week_key: weekTab,
      week_label: weekTab === "currentWeek" ? "This Week" : "Next Week",
      days: menus[weekTab],
      status: "pending",
    };
    fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
      .then(function(r) {
        if (!r.ok) return r.json().then(function(d) { throw new Error(d.error || 'Server error'); });
        return r.json();
      })
      .then(function() {
        setSubmitMsg("Menu submitted for admin approval!");
        setTimeout(function() { setSubmitMsg(""); }, 4000);
      })
      .catch(function(e) {
        setSubmitMsg("Submission failed — " + (e.message || "please try again."));
        setTimeout(function() { setSubmitMsg(""); }, 4000);
      });
  }

  if (loadingChef) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:"12px" }}>
        <i className="ph-bold ph-spinner spin" style={{ fontSize:"1.8rem", color:"#FACA50" }}/>
        <p style={{ color:"#5A5D66", fontSize:"0.88rem" }}>Loading your profile…</p>
      </div>
    );
  }

  var initials = (profile.name || "?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  var card = { background:"white", borderRadius:"16px", border:"1px solid #EBEBEB", padding:"28px", marginBottom:"20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" };
  var sectionHead = { display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", paddingBottom:"14px", borderBottom:"1px solid #F0F0F0" };
  var sectionIcon = { width:"32px", height:"32px", borderRadius:"8px", background:"#FFFBEB", border:"1px solid #FDE68A", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
  var lbl = { display:"block", fontWeight:600, fontSize:"0.8rem", color:"#444", marginBottom:"6px" };
  var row2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" };

  return (
    <div style={{ background:"#F6F6F6", minHeight:"100vh", padding:"32px 24px 80px" }}>
      <div style={{ maxWidth:"860px", margin:"0 auto" }}>

        {/* ── Profile hero banner ── */}
        <div style={{ background:"linear-gradient(135deg,#111 0%,#2A2A2A 100%)", borderRadius:"20px", padding:"28px 32px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap" }}>
          {/* Avatar circle */}
          <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"#FACA50", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"1.3rem", color:"#111", flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:900, fontSize:"1.4rem", color:"white", letterSpacing:"-0.02em" }}>{profile.name || "Your Name"}</div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"4px" }}>
              {profile.cuisine && <span style={{ background:"rgba(250,202,80,0.15)", color:"#FACA50", border:"1px solid rgba(250,202,80,0.3)", borderRadius:"20px", fontSize:"0.75rem", fontWeight:700, padding:"2px 10px" }}>{profile.cuisine}</span>}
              {profile.price && <span style={{ color:"#888", fontSize:"0.82rem" }}>${profile.price}/week</span>}
            </div>
          </div>
          {/* Tab switcher */}
          <div style={{ display:"flex", background:"rgba(255,255,255,0.08)", borderRadius:"10px", padding:"3px", gap:"3px" }}>
            {[{ key:"profile", label:"My Profile", icon:"ph-user" }, { key:"menu", label:"Menu", icon:"ph-fork-knife" }].map(t => (
              <button key={t.key} onClick={() => setProfileTab(t.key)} style={{
                padding:"8px 16px", borderRadius:"8px", border:"none", cursor:"pointer", fontFamily:"inherit",
                fontSize:"0.82rem", fontWeight:700, transition:"all 0.15s", display:"flex", alignItems:"center", gap:"6px",
                background: profileTab===t.key ? "#FACA50" : "transparent",
                color:       profileTab===t.key ? "#111"    : "#888",
              }}>
                <i className={`ph-bold ${t.icon}`}/>{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── PROFILE TAB ── */}
        {profileTab === "profile" && (
          <div className="fade-in">

            {/* Profile Details card */}
            <div style={card}>
              <div style={sectionHead}>
                <div style={sectionIcon}><i className="ph-fill ph-user" style={{ color:"#FACA50" }}/></div>
                <div>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:"#111" }}>Profile Details</div>
                  <div style={{ fontSize:"0.78rem", color:"#9CA3AF" }}>This info appears on your public chef card</div>
                </div>
              </div>
              <div style={row2}>
                <div className="form-group">
                  <label style={lbl}>Chef Name *</label>
                  <input className="form-input" type="text" placeholder="Chef Jane" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label style={lbl}>Cuisine Type *</label>
                  <select className="form-input" value={profile.cuisine} onChange={e => setProfile(p => ({ ...p, cuisine: e.target.value }))}>
                    <option value="">Select cuisine…</option>
                    {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ maxWidth:"200px" }} className="form-group">
                <label style={lbl}>Price Per Week (AUD) *</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#9CA3AF", fontWeight:600 }}>$</span>
                  <input className="form-input" type="number" min="40" max="200" placeholder="75" value={profile.price}
                    onChange={e => setProfile(p => ({ ...p, price: e.target.value }))} style={{ paddingLeft:"28px" }}/>
                </div>
              </div>
              <div className="form-group">
                <label style={lbl}>Bio <span style={{ fontWeight:400, color:"#9CA3AF" }}>(max 200 chars)</span></label>
                <textarea className="form-input" rows={3} maxLength={200}
                  placeholder="Tell customers about your cooking background and style…"
                  value={profile.bio}
                  onChange={e => { setProfile(p => ({ ...p, bio: e.target.value })); setBioLen(e.target.value.length); }}/>
                <div style={{ fontSize:"0.75rem", color: bioLen>180?"#D0342C":"#9CA3AF", textAlign:"right", marginTop:"4px" }}>{bioLen}/200</div>
              </div>
            </div>

            {/* Delivery Postcodes card */}
            <div style={card}>
              <div style={sectionHead}>
                <div style={sectionIcon}><i className="ph-fill ph-map-pin" style={{ color:"#FACA50" }}/></div>
                <div>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:"#111" }}>Delivery Postcodes</div>
                  <div style={{ fontSize:"0.78rem", color:"#9CA3AF" }}>Determines which suburbs appear in the subscriber dropdown</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
                <input className="form-input" type="text" placeholder="e.g. 2042" value={postcodeInput} maxLength={4}
                  onChange={e => setPostcodeInput(e.target.value.replace(/\D/g,""))}
                  onKeyDown={e => e.key==="Enter" && (e.preventDefault(), addPostcode())}
                  style={{ maxWidth:"140px" }}/>
                <button type="button" className="btn btn-outline btn-sm" onClick={addPostcode}><i className="ph-bold ph-plus"/> Add</button>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {postcodes.length===0 && <p style={{ color:"#C0C0C0", fontSize:"0.85rem", margin:0, fontStyle:"italic" }}>No postcodes added yet</p>}
                {postcodes.map(pc => (
                  <span key={pc} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"20px", padding:"5px 12px", fontSize:"0.82rem", fontWeight:600, color:"#111" }}>
                    <i className="ph-fill ph-map-pin" style={{ color:"#FACA50", fontSize:"0.75rem" }}/>
                    {pc}{window.CC.POSTCODE_SUBURB_MAP?.[pc] ? ` · ${window.CC.POSTCODE_SUBURB_MAP[pc]}` : ""}
                    <button onClick={() => setPostcodes(p=>p.filter(x=>x!==pc))}
                      style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:"0 2px", fontSize:"0.9rem", lineHeight:1 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <button className="btn btn-primary" style={{ minWidth:"150px", padding:"12px 28px", fontSize:"0.95rem" }} onClick={handleSave}>
                {saved ? <><i className="ph-fill ph-check-circle"/> Saved!</> : <><i className="ph-bold ph-floppy-disk"/> Save Profile</>}
              </button>
              {saved && <span style={{ fontSize:"0.82rem", color:"#3A813D" }}>Changes will appear on the public site</span>}
            </div>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {profileTab === "menu" && (
          <div className="fade-in">

            {/* Week selector card */}
            <div style={{ ...card, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:"0.95rem", color:"#111" }}>Weekly Menu Submission</div>
                <div style={{ fontSize:"0.78rem", color:"#9CA3AF", marginTop:"2px" }}>Fill in your dishes for each day, then submit for admin approval</div>
              </div>
              <div style={{ display:"flex", background:"#F4F4F4", borderRadius:"10px", padding:"3px", gap:"3px" }}>
                {[{ key:"currentWeek", label:"This Week" }, { key:"nextWeek", label:"Next Week" }].map(t => (
                  <button key={t.key} onClick={() => setWeekTab(t.key)} style={{
                    padding:"8px 18px", borderRadius:"8px", border:"none", cursor:"pointer", fontFamily:"inherit",
                    fontSize:"0.85rem", fontWeight:700, transition:"all 0.15s",
                    background: weekTab===t.key ? "white" : "transparent",
                    color:       weekTab===t.key ? "#111"  : "#9CA3AF",
                    boxShadow:   weekTab===t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  }}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Day accordions */}
            {DAYS.map((day, di) => {
              var isOpen = openDays[day];
              var dishCount = menus[weekTab][day].length;
              var hasDishes = menus[weekTab][day].some(d=>d.dish_name);
              return (
                <div key={day} style={{ background:"white", border:`1px solid ${isOpen?"#111":"#EBEBEB"}`, borderRadius:"14px", marginBottom:"10px", overflow:"hidden", transition:"border-color 0.2s", boxShadow: isOpen?"0 2px 12px rgba(0,0,0,0.08)":"none" }}>
                  <button onClick={() => setOpenDays(o=>({...o,[day]:!o[day]}))}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:"14px", padding:"16px 22px", background: isOpen?"#111":"white", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"50%", background: isOpen?"#FACA50":"#F4F4F4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontWeight:800, fontSize:"0.75rem", color: isOpen?"#111":"#9CA3AF" }}>{di+1}</span>
                    </div>
                    <span style={{ fontWeight:700, fontSize:"0.92rem", color: isOpen?"#FACA50":"#111", flex:1, textAlign:"left", letterSpacing:"0.03em" }}>{DAY_LABELS[day]}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      {hasDishes && !isOpen && <span style={{ background:"#D4EDDA", color:"#3A813D", borderRadius:"20px", fontSize:"0.7rem", padding:"2px 8px", fontWeight:700 }}>{dishCount} dishes</span>}
                      <i className={`ph-bold ${isOpen?"ph-caret-up":"ph-caret-down"}`} style={{ color: isOpen?"#FACA50":"#C0C0C0", fontSize:"0.85rem" }}/>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding:"20px 22px", background:"#FAFAFA" }}>
                      {menus[weekTab][day].map((dish, idx) => (
                        <div key={idx} style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:"12px", padding:"16px", marginBottom:"12px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                          {/* Dish preview + name + type row */}
                          <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"12px" }}>
                            {dish.dish_image ? (
                              <img src={dish.dish_image} alt="dish" style={{ width:"52px", height:"52px", borderRadius:"10px", objectFit:"cover", flexShrink:0, border:"1px solid #EBEBEB" }} onError={e=>{e.target.style.display='none';}}/>
                            ) : (
                              <div style={{ width:"52px", height:"52px", borderRadius:"10px", background:"#F4F4F4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px dashed #D0D0D0" }}>
                                <i className="ph-bold ph-image" style={{ color:"#C0C0C0", fontSize:"1.3rem" }}/>
                              </div>
                            )}
                            <input className="form-input" type="text" placeholder={`Dish ${idx+1} name`} value={dish.dish_name}
                              onChange={e => updateDish(day, idx, "dish_name", e.target.value)} style={{ flex:2, fontWeight:600 }}/>
                            <select className="form-input" value={dish.dish_type}
                              onChange={e => updateDish(day, idx, "dish_type", e.target.value)} style={{ flex:"0 0 110px" }}>
                              {DISH_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                            <button type="button" onClick={() => removeDish(day, idx)}
                              style={{ background:"none", border:"1px solid #EBEBEB", borderRadius:"8px", cursor:"pointer", padding:"8px 10px", color:"#C0C0C0", fontSize:"1rem", lineHeight:1, flexShrink:0 }}
                              title="Remove dish">×</button>
                          </div>
                          {/* Photo URL row */}
                          <div style={{ background:"#F8F8F8", borderRadius:"8px", padding:"10px 12px", display:"flex", alignItems:"center", gap:"8px" }}>
                            <i className="ph-bold ph-image" style={{ color:"#C0C0C0", fontSize:"0.9rem", flexShrink:0 }}/>
                            <input className="form-input" type="url" placeholder="Paste dish photo URL…"
                              value={dish.dish_image||""} onChange={e => updateDish(day, idx, "dish_image", e.target.value)}
                              style={{ flex:1, fontSize:"0.82rem", background:"transparent", border:"none", padding:"0", boxShadow:"none" }}/>
                          </div>
                          <div style={{ fontSize:"0.7rem", color:"#C0C0C0", marginTop:"6px", paddingLeft:"2px" }}>
                            Required: <strong>800 × 500 px</strong> · JPG/PNG · max <strong>1.5 MB</strong> · landscape
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addDish(day)}
                        style={{ display:"flex", alignItems:"center", gap:"6px", padding:"10px 16px", border:"1.5px dashed #D0D0D0", borderRadius:"10px", background:"transparent", cursor:"pointer", color:"#9CA3AF", fontFamily:"inherit", fontSize:"0.85rem", fontWeight:600, width:"100%", justifyContent:"center", transition:"all 0.15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="#FACA50";e.currentTarget.style.color="#111";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#D0D0D0";e.currentTarget.style.color="#9CA3AF";}}>
                        <i className="ph-bold ph-plus"/> Add Dish
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {submitMsg && (
              <div style={{ background:"#D4EDDA", border:"1px solid #A8D5B5", borderRadius:"10px", padding:"12px 18px", marginTop:"4px", fontSize:"0.875rem", color:"#3A813D", display:"flex", alignItems:"center", gap:"10px" }}>
                <i className="ph-fill ph-check-circle" style={{ fontSize:"1.1rem" }}/> {submitMsg}
              </div>
            )}
            <div style={{ display:"flex", gap:"12px", marginTop:"20px", flexWrap:"wrap" }}>
              <button className="btn btn-outline" style={{ minWidth:"130px" }} onClick={handleSave}>
                {saved ? <><i className="ph-fill ph-check-circle"/> Draft Saved</> : <><i className="ph-bold ph-floppy-disk"/> Save Draft</>}
              </button>
              <button className="btn btn-primary" style={{ minWidth:"200px", padding:"12px 24px" }} onClick={handleSubmitForApproval}>
                <i className="ph-bold ph-paper-plane-tilt"/> Submit for Approval
              </button>
            </div>
            <p style={{ fontSize:"0.75rem", color:"#C0C0C0", marginTop:"10px" }}>Menus go to admin for review before going live. Chefs cannot repeat the same dishes week over week.</p>
          </div>
        )}
      </div>
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
