// ─── CHEF MANAGEMENT + APPLICATIONS ───
window.ADM = window.ADM || {};
var { useState } = React;

var CUISINE_OPTIONS = ['Indian','Mediterranean','Thai','Italian','Japanese','Chinese','Mexican','Vietnamese','Lebanese','Greek'];

// ─────────────────────────────────────────────
// Chef Applications Page
// ─────────────────────────────────────────────
function ApplicationsPage({ applications: initialApps, onUpdate, onClearBadge }) {
  var [apps, setApps]   = useState(initialApps || []);
  var [detail, setDet]  = useState(null);
  var [note,   setNote] = useState('');

  React.useEffect(function() { onClearBadge && onClearBadge(); }, []);
  // Keep in sync if parent reloads
  React.useEffect(function() { setApps(initialApps || []); }, [initialApps]);

  var handleApprove = (app) => {
    if (!confirm(`Approve ${app.full_name} and add them as an active chef?`)) return;
    var newChef = {
      chef_name: 'Chef ' + app.full_name.split(' ')[0],
      cuisine_type: app.cuisine_type,
      bio: app.cooking_background,
      highlights: [],
      delivery_postcodes: [],
      price_per_week: 0,
      rating: 5.0,
      commission_pct: 20,
      status: 'active',
      food_image: '', photo_url: '',
      menus: {},
    };
    window.ADM.addChef(newChef).then(function(createdChef) {
      if (!createdChef || createdChef.error) {
        alert('Error creating chef: ' + (createdChef?.error || 'Unknown error'));
        throw new Error(createdChef?.error || 'Chef creation failed');
      }
      return window.ADM.deleteApplication(app.id);
    }).then(function() {
      window.ADM.pushNotification('chef_approved', app.full_name + ' approved and added', app.id);
      onUpdate && onUpdate();
    }).catch(function(e) { alert('Error approving application: ' + e.message); });
    setDet(null);
  };

  var handleReject = (app) => {
    if (!confirm(`Reject application from ${app.full_name}?`)) return;
    window.ADM.deleteApplication(app.id)
      .then(function() { onUpdate && onUpdate(); })
      .catch(function(e) { alert('Error: ' + e.message); });
    setDet(null);
  };

  var statusBadge = s => ({
    pending:  <span className="badge badge-yellow">Pending Review</span>,
    approved: <span className="badge badge-green">Approved</span>,
    rejected: <span className="badge badge-red">Rejected</span>,
  }[s] || <span className="badge badge-gray">{s}</span>);

  var pending = apps.filter(a=>a.status==='pending');
  var reviewed = apps.filter(a=>a.status!=='pending');

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Chef Applications</h1>
          <p className="section-subtitle">{pending.length} pending · {reviewed.length} reviewed</p>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background:'#F0F9FF', border:'1px solid #BAE6FD', borderRadius:'10px', padding:'14px 18px', marginBottom:'20px', fontSize:'0.85rem', color:'#0369A1', display:'flex', gap:'10px' }}>
        <i className="ph-fill ph-info" style={{ fontSize:'1.1rem', flexShrink:0, marginTop:'1px' }}/>
        <div>
          <strong>Approval required before going live.</strong> Chefs who apply via the public site appear here. Only approved chefs are visible on the public website. When you approve a chef, they are added to the Active Chefs list — remember to fill in their delivery postcodes, price, and avatar.
        </div>
      </div>

      {apps.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'48px', color:'#9CA3AF' }}>
          <i className="ph-fill ph-user-check" style={{ fontSize:'2.5rem', display:'block', marginBottom:'12px' }}/>
          <p style={{ fontWeight:600, color:'#5A5D66' }}>No applications yet</p>
          <p style={{ fontSize:'0.85rem', marginTop:'4px' }}>Applications from the "Become a Chef" form will appear here.</p>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#111', marginBottom:'12px' }}>Awaiting Review ({pending.length})</h3>
          <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:'24px' }}>
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Cuisine</th><th>Suburb</th><th>Capacity</th><th>Submitted</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(a=>(
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{a.full_name}</div>
                      <div style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>{a.email} · {a.phone}</div>
                    </td>
                    <td>{a.cuisine_type}</td>
                    <td>{a.suburb}</td>
                    <td>{a.weekly_capacity} meals/wk</td>
                    <td style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>{a.submitted}</td>
                    <td>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button className="btn btn-outline btn-sm" onClick={()=>{ setDet(a); setNote(''); }}>
                          <i className="ph-bold ph-eye"/> Review
                        </button>
                        <button className="btn btn-success btn-sm" onClick={()=>{ setDet(a); setNote(''); }}>
                          <i className="ph-bold ph-check"/> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={()=>handleReject(a)}>
                          <i className="ph-bold ph-x"/> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#9CA3AF', marginBottom:'12px' }}>Previously Reviewed ({reviewed.length})</h3>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Cuisine</th><th>Submitted</th><th>Status</th><th>Reviewed</th></tr></thead>
              <tbody>
                {reviewed.map(a=>(
                  <tr key={a.id}>
                    <td><div style={{ fontWeight:600 }}>{a.full_name}</div><div style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>{a.email}</div></td>
                    <td>{a.cuisine_type}</td>
                    <td style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>{a.submitted}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>{a.reviewed_at||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Application detail modal */}
      {detail && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDet(null)}>
          <div className="modal" style={{ maxWidth:'560px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize:'1.05rem', fontWeight:800, margin:0 }}>{detail.full_name}</h2>
                <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>{detail.cuisine_type} · Applied {detail.submitted}</p>
              </div>
              <button className="btn-icon" onClick={()=>setDet(null)}><i className="ph-bold ph-x"/></button>
            </div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
                {[['Email',detail.email],['Phone',detail.phone],['Suburb',detail.suburb],['Capacity',`${detail.weekly_capacity} meals/wk`]].map(([l,v])=>(
                  <div key={l}><div style={{ fontSize:'0.72rem', color:'#9CA3AF' }}>{l}</div><div style={{ fontWeight:600, fontSize:'0.875rem' }}>{v}</div></div>
                ))}
              </div>
              <div className="form-group">
                <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'4px' }}>Cooking Background</label>
                <p style={{ fontSize:'0.875rem', color:'#5A5D66', background:'#F8F8F8', padding:'10px', borderRadius:'8px', margin:0 }}>{detail.cooking_background}</p>
              </div>
              <div className="form-group">
                <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'4px' }}>Sample Dishes</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {(detail.sample_dishes||[]).map((d,i)=><span key={i} className="tag">{d}</span>)}
                </div>
              </div>
              {detail.delivery_days?.length > 0 && (
                <div className="form-group">
                  <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'4px' }}>Delivery Days</label>
                  <div style={{ fontSize:'0.875rem' }}>{detail.delivery_days.join(', ')}</div>
                </div>
              )}
              <div className="form-group">
                <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'4px' }}>Admin Note (optional)</label>
                <input className="form-input" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Spoke on phone — great candidate"/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={()=>handleReject(detail)}>
                <i className="ph-bold ph-x"/> Reject
              </button>
              <button className="btn btn-primary" onClick={()=>handleApprove(detail)}>
                <i className="ph-bold ph-check"/> Approve & Add Chef
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Chef modal (add / edit)
// ─────────────────────────────────────────────
function ChefModal({ chef, onSave, onClose }) {
  var isNew = !chef.chef_id;
  var [form, setForm] = useState(chef);
  var [pcInput, setPcInput] = useState('');
  var [saving, setSaving] = useState(false);
  var set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  var addPc = () => {
    var pc = pcInput.trim();
    if (pc && !/^\d{4}$/.test(pc)) return alert('Postcode must be 4 digits');
    if (pc && !(form.delivery_postcodes||[]).includes(pc)) set('delivery_postcodes',[...(form.delivery_postcodes||[]),pc]);
    setPcInput('');
  };
  var removePc = (pc) => set('delivery_postcodes', form.delivery_postcodes.filter(p=>p!==pc));

  var handleSave = () => {
    if (!form.chef_name?.trim()) return alert('Chef name required');
    if (!form.cuisine_type) return alert('Select a cuisine');
    if (!form.price_per_week || form.price_per_week < 1) return alert('Price required');
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(form); }, 600);
  };

  var lbl = { display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px', color:'#111' };
  var row2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize:'1.1rem', fontWeight:800, margin:0 }}>{isNew?'Add New Chef':`Edit ${chef.chef_name}`}</h2>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">
          <div className="form-group"><label style={lbl}>Chef Name</label>
            <input className="form-input" value={form.chef_name||''} onChange={e=>set('chef_name',e.target.value)} placeholder="e.g. Chef Priya"/></div>
          <div style={row2}>
            <div className="form-group"><label style={lbl}>Cuisine</label>
              <select className="form-input" value={form.cuisine_type||''} onChange={e=>set('cuisine_type',e.target.value)}>
                <option value="">Select…</option>
                {CUISINE_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="form-group"><label style={lbl}>Price / Week ($)</label>
              <input className="form-input" type="number" value={form.price_per_week||''} onChange={e=>set('price_per_week',parseFloat(e.target.value)||0)} placeholder="150"/></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
            <div className="form-group"><label style={lbl}>Rating</label>
              <input className="form-input" type="number" step="0.1" min="1" max="5" value={form.rating||''} onChange={e=>set('rating',parseFloat(e.target.value)||0)}/></div>
            <div className="form-group">
              <label style={lbl}>Platform Commission %</label>
              <input className="form-input" type="number" min="0" max="100" step="1" value={form.commission_pct ?? 20} onChange={e=>set('commission_pct',parseInt(e.target.value)||0)}/>
              <div style={{ fontSize:'0.72rem', color:'#9CA3AF', marginTop:'3px' }}>Chef keeps {100-(form.commission_pct ?? 20)}%</div>
            </div>
            <div className="form-group"><label style={lbl}>Status</label>
              <select className="form-input" value={form.status||'Active'} onChange={e=>set('status',e.target.value)}>
                <option value="Active">Active</option><option value="Paused">Paused</option>
              </select></div>
          </div>
          <div className="form-group"><label style={lbl}>Short Bio</label>
            <textarea className="form-input" rows={3} value={form.bio||''} onChange={e=>set('bio',e.target.value)}/></div>
          <div style={row2}>
            <div className="form-group"><label style={lbl}>Food Photo URL</label>
              <input className="form-input" value={form.food_image||''} onChange={e=>set('food_image',e.target.value)} placeholder="https://…"/></div>
            <div className="form-group"><label style={lbl}>Chef Avatar URL</label>
              <input className="form-input" value={form.photo_url||''} onChange={e=>set('photo_url',e.target.value)} placeholder="https://…"/></div>
          </div>
          <div className="form-group"><label style={lbl}>Highlight Tags (comma-separated)</label>
            <input className="form-input" value={(form.highlights||[]).join(', ')} onChange={e=>set('highlights',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/></div>
          <div className="form-group">
            <label style={lbl}>Delivery Postcodes</label>
            <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
              <input className="form-input" value={pcInput} onChange={e=>setPcInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPc()} placeholder="4-digit postcode" style={{ width:'150px' }}/>
              <button className="btn btn-outline btn-sm" onClick={addPc}><i className="ph-bold ph-plus"/> Add</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {(form.delivery_postcodes||[]).map(pc=>(
                <span key={pc} className="tag">{pc}<button onClick={()=>removePc(pc)}>×</button></span>
              ))}
              {!(form.delivery_postcodes||[]).length && <span style={{ fontSize:'0.8rem', color:'#9CA3AF' }}>None added</span>}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="ph-bold ph-spinner spin"/> Saving…</> : (isNew?'Add Chef':'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Chef Portal Access (credentials) modal
// ─────────────────────────────────────────────
function ChefAccessModal({ chef, onClose }) {
  var [existing,  setExisting]  = useState(null);
  var [username,  setUsername]  = useState('');
  var [password,  setPassword]  = useState('');
  var [active,    setActive]    = useState(true);
  var [showPwd,   setShowPwd]   = useState(false);
  var [saved,     setSaved]     = useState(false);

  // Load existing account on mount
  React.useEffect(function() {
    window.ADM.loadChefAccounts().then(function(accounts) {
      var found = accounts.find(function(a) { return a.chef_id === chef.chef_id; }) || null;
      setExisting(found);
      if (found) { setUsername(found.username || ''); setPassword(found.password || ''); setActive(found.active !== false); }
    }).catch(function() {});
  }, []);

  var handleSave = () => {
    if (!username.trim()) return alert('Username required');
    if (!password.trim()) return alert('Password required');
    window.ADM.upsertChefAccount({
      chef_id: chef.chef_id, chef_name: chef.chef_name,
      username: username.trim(), password: password.trim(),
      active: active,
    }).then(function(result) {
      if (result && result.error) { alert('Error saving credentials: ' + result.error); return; }
      setSaved(true);
      setTimeout(onClose, 900);
    }).catch(function(e) { alert('Error saving credentials: ' + e.message); });
  };

  var handleRevoke = () => {
    if (!confirm(`Revoke portal access for ${chef.chef_name}?`)) return;
    window.ADM.deleteChefAccount(chef.chef_id).then(onClose).catch(function(e) { alert('Error revoking access: ' + e.message); });
  };

  var lbl = { display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px' };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:'440px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>Chef Portal Access</h2>
            <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>{chef.chef_name}</p>
          </div>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">
          {existing && (
            <div style={{ background:'#D4EDDA', border:'1px solid #A8D5B5', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'0.82rem', color:'#3A813D' }}>
              <i className="ph-fill ph-check-circle" style={{ marginRight:'6px' }}/>
              Portal access is currently <strong>active</strong> · Account created {existing.created}
            </div>
          )}
          {!existing && (
            <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'0.82rem', color:'#92400E' }}>
              <i className="ph-fill ph-warning" style={{ marginRight:'6px' }}/>
              No portal access yet. Create credentials below and share them with the chef.
            </div>
          )}
          <div className="form-group">
            <label style={lbl}>Username</label>
            <input className="form-input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="e.g. chef_priya"/>
          </div>
          <div className="form-group">
            <label style={lbl}>Password</label>
            <div style={{ position:'relative' }}>
              <input className="form-input" type={showPwd?'text':'password'} value={password}
                onChange={e=>setPassword(e.target.value)} placeholder="Set a strong password"
                style={{ paddingRight:'44px' }}/>
              <button type="button" onClick={()=>setShowPwd(s=>!s)}
                style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
                <i className={`ph-bold ${showPwd?'ph-eye-slash':'ph-eye'}`}/>
              </button>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0' }}>
            <input type="checkbox" id="acc-active" checked={active} onChange={e=>setActive(e.target.checked)} style={{ accentColor:'#111', width:'16px', height:'16px' }}/>
            <label htmlFor="acc-active" style={{ fontSize:'0.875rem', fontWeight:500, cursor:'pointer' }}>Account active (chef can log in)</label>
          </div>
          <div style={{ background:'#F8F8F8', borderRadius:'8px', padding:'12px', fontSize:'0.8rem', color:'#5A5D66', marginTop:'4px' }}>
            <strong>Share these credentials with the chef:</strong><br/>
            Portal URL: <code style={{ background:'#E5E5E5', padding:'1px 6px', borderRadius:'4px' }}>admin.html</code><br/>
            Select <strong>Chef Portal</strong> tab on the login screen.
          </div>
        </div>
        <div className="modal-footer">
          {existing && (
            <button className="btn btn-danger" onClick={handleRevoke}>
              <i className="ph-bold ph-lock-open"/> Revoke Access
            </button>
          )}
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saved}>
            {saved ? <><i className="ph-fill ph-check-circle"/> Saved!</> : (existing ? 'Update Credentials' : 'Create Access')}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ chef, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-box">
        <h3 style={{ fontWeight:800, marginBottom:'8px' }}>Delete {chef.chef_name}?</h3>
        <p style={{ fontSize:'0.875rem', color:'#5A5D66', marginBottom:'20px' }}>This will permanently remove the chef. This cannot be undone.</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}><i className="ph-bold ph-trash"/> Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Unavailable Weeks Modal
// ─────────────────────────────────────────────
function UnavailableWeeksModal({ chef, onClose, onSave }) {
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function getMonIso(weeksAhead) {
    var d = new Date();
    var daysToMon = d.getDay() === 0 ? 1 : (8 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + daysToMon + weeksAhead * 7);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  function fmtIso(iso) {
    var mon = new Date(iso + 'T00:00:00');
    var fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    return mon.getDate() + ' ' + M[mon.getMonth()] + ' – ' + fri.getDate() + ' ' + M[fri.getMonth()];
  }

  var upcomingWeeks = [0, 1, 2, 3, 4].map(function(i) {
    var iso = getMonIso(i);
    return { iso: iso, label: fmtIso(iso) };
  });

  var existing = (chef.menus || {}).unavailable_weeks || [];
  var [unavailable, setUnavailable] = useState(existing);
  var [saving, setSaving] = useState(false);

  var toggle = function(iso) {
    setUnavailable(function(prev) {
      return prev.includes(iso) ? prev.filter(function(d) { return d !== iso; }) : [...prev, iso];
    });
  };

  var handleSave = function() {
    setSaving(true);
    var updatedMenus = Object.assign({}, chef.menus || {}, { unavailable_weeks: unavailable });
    window.ADM.updateChef(Object.assign({}, chef, { menus: updatedMenus }))
      .then(function(updated) {
        setSaving(false);
        onSave(updated);
        onClose();
      })
      .catch(function(e) { alert('Error: ' + e.message); setSaving(false); });
  };

  return (
    <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
            <i className="ph-bold ph-calendar-x" style={{ marginRight: '8px', color: '#D0342C' }}/>
            Unavailable Weeks — {chef.chef_name}
          </h2>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: '#5A5D66', margin: '0 0 16px' }}>
            Toggle weeks when {chef.chef_name} cannot cook. Toggled-off weeks will not appear as subscription options for customers.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingWeeks.map(function(w) {
              var off = unavailable.includes(w.iso);
              return (
                <label key={w.iso} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '2px solid ' + (off ? '#FCA5A5' : '#E5E5E5'), borderRadius: '10px', cursor: 'pointer', background: off ? '#FFF5F5' : 'white', transition: 'all 0.15s' }}>
                  <input type="checkbox" checked={off} onChange={function() { toggle(w.iso); }} style={{ accentColor: '#D0342C', width: '16px', height: '16px' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: off ? '#D0342C' : '#111' }}>{w.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{w.iso}</div>
                  </div>
                  {off && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D0342C', background: '#FEE2E2', padding: '2px 8px', borderRadius: '20px' }}>UNAVAILABLE</span>}
                </label>
              );
            })}
          </div>
          {unavailable.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: '#D0342C', margin: '12px 0 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <i className="ph-fill ph-warning"/>
              {unavailable.length} week{unavailable.length > 1 ? 's' : ''} marked unavailable — these won't show in the subscribe form.
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="ph-bold ph-spinner spin"/> Saving…</> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Active Chefs Page
// ─────────────────────────────────────────────
function ChefsPage({ chefs, setChefs }) {
  var [modal,   setModal]   = useState(null);
  var [delChef, setDel]     = useState(null);
  var [access,  setAccess]  = useState(null); // chef whose access modal is open
  var [weeksModal, setWeeksModal] = useState(null); // chef for unavailable weeks modal
  var [search,  setSearch]  = useState('');

  var filtered = chefs.filter(c =>
    !search || c.chef_name.toLowerCase().includes(search.toLowerCase()) ||
    c.cuisine_type.toLowerCase().includes(search.toLowerCase())
  );

  var handleSave = (form) => {
    if (!form.chef_id) {
      // New chef
      window.ADM.addChef(form).then(function(created) {
        setChefs(function(prev) { return [...prev, created]; });
      }).catch(function(e) { alert('Error adding chef: ' + e.message); });
    } else {
      // Update existing
      window.ADM.updateChef(form).then(function(updated) {
        setChefs(function(prev) { return prev.map(function(c) { return c.chef_id === form.chef_id ? updated : c; }); });
      }).catch(function(e) { alert('Error saving chef: ' + e.message); });
    }
    setModal(null);
  };

  var handleDelete = () => {
    window.ADM.deleteChef(delChef.chef_id).then(function() {
      setChefs(function(prev) { return prev.filter(function(c) { return c.chef_id !== delChef.chef_id; }); });
    }).catch(function(e) { alert('Error deleting chef: ' + e.message); });
    setDel(null);
  };

  var newChef = { chef_name:'', cuisine_type:'', price_per_week:'', rating:4.8, bio:'', highlights:[], delivery_postcodes:[], status:'Active', food_image:'', avatar:'', currentWeek:{}, nextWeek:{} };

  var statusBadge = s => (s||'active').toLowerCase()==='active'
    ? <span className="badge badge-green"><i className="ph-fill ph-circle" style={{fontSize:'0.5rem'}}/>Active</span>
    : <span className="badge badge-yellow">Paused</span>;

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Active Chefs</h1>
          <p className="section-subtitle">{chefs.length} chefs · {chefs.filter(c=>(c.status||'active').toLowerCase()==='active').length} active</p>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chefs…"/>
          <button className="btn btn-primary" onClick={()=>setModal({chef:{...newChef}})}>
            <i className="ph-bold ph-plus"/> Add Chef
          </button>
        </div>
      </div>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Chef</th><th>Cuisine</th><th>Price/Week</th><th>Commission</th><th>Rating</th><th>Subscribers</th><th>Postcodes</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c => {
              var subCount = (window.ADM.subscribers||[]).filter(s=>s.chef_id===c.chef_id).length;
              return (
                <tr key={c.chef_id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      {c.avatar ? <img src={c.avatar} alt={c.chef_name} style={{ width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover' }}/> : <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#F4F4F4', display:'flex', alignItems:'center', justifyContent:'center' }}><i className="ph-fill ph-user" style={{ color:'#9CA3AF' }}/></div>}
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{c.chef_name}</div>
                        <div style={{ fontSize:'0.72rem', color:'#9CA3AF', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.bio?.slice(0,50)}{c.bio?.length>50?'…':''}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{c.cuisine_type}</span></td>
                  <td style={{ fontWeight:700 }}>${c.price_per_week}</td>
                  <td>
                    <div style={{ fontSize:'0.78rem', fontWeight:600 }}>{c.commission_pct ?? 20}%</div>
                    <div style={{ fontSize:'0.7rem', color:'#9CA3AF' }}>Chef {100-(c.commission_pct ?? 20)}%</div>
                  </td>
                  <td>⭐ {c.rating}</td>
                  <td>{subCount}</td>
                  <td>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                      {(c.delivery_postcodes||[]).slice(0,3).map(p=><span key={p} className="badge badge-gray">{p}</span>)}
                      {(c.delivery_postcodes||[]).length > 3 && <span className="badge badge-gray">+{c.delivery_postcodes.length-3}</span>}
                    </div>
                  </td>
                  <td>{statusBadge(c.status)}</td>
                  <td>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button className="btn-icon" title="Edit" onClick={()=>setModal({chef:{...c}})}><i className="ph-bold ph-pencil"/></button>
                      <button className="btn-icon" title="Portal access" onClick={()=>setAccess(c)}
                        style={{ color: '#9CA3AF' }}>
                        <i className="ph-bold ph-key"/>
                      </button>
                      <button className="btn-icon" title="Unavailable weeks" onClick={()=>setWeeksModal(c)}
                        style={{ color: (c.menus?.unavailable_weeks?.length > 0) ? '#D0342C' : '#9CA3AF' }}>
                        <i className="ph-bold ph-calendar-x"/>
                      </button>
                      <button className="btn-icon" title="Toggle status" onClick={()=>{
                        var newStatus = (c.status||'active').toLowerCase()==='active' ? 'active' : 'paused';
                        window.ADM.updateChef({ ...c, status: newStatus }).then(function(updated) {
                          setChefs(function(prev) { return prev.map(function(ch) { return ch.chef_id===c.chef_id ? updated : ch; }); });
                        });
                      }}><i className={`ph-bold ${(c.status||'active').toLowerCase()==='active'?'ph-pause':'ph-play'}`}/></button>
                      <button className="btn-icon" style={{ color:'#D0342C' }} onClick={()=>setDel(c)}><i className="ph-bold ph-trash"/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && <tr><td colSpan={8} style={{ textAlign:'center', color:'#9CA3AF', padding:'32px' }}>No chefs found</td></tr>}
          </tbody>
        </table>
      </div>
      {modal      && <ChefModal           chef={modal.chef} onSave={handleSave} onClose={()=>setModal(null)}/>}
      {delChef    && <DeleteConfirm        chef={delChef}   onConfirm={handleDelete} onCancel={()=>setDel(null)}/>}
      {access     && <ChefAccessModal      chef={access}    onClose={()=>setAccess(null)}/>}
      {weeksModal && <UnavailableWeeksModal chef={weeksModal} onClose={()=>setWeeksModal(null)}
        onSave={function(updated) {
          setChefs(function(prev) { return prev.map(function(ch) { return ch.chef_id===updated.chef_id ? updated : ch; }); });
        }}/>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Menu Approvals Page
// ─────────────────────────────────────────────
var DAY_LABELS_MAP = { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri' };

function MenuApprovalsPage({ menus: initialMenus, onUpdate, onClearBadge }) {
  var [menus, setMenus] = useState(initialMenus || []);
  var [detail, setDetail] = useState(null);

  React.useEffect(function() { onClearBadge && onClearBadge(); }, []);
  // Keep in sync if parent reloads
  React.useEffect(function() { setMenus(initialMenus || []); }, [initialMenus]);

  var persist = (id, status, reason) => {
    window.ADM.updateMenu(id, status, reason).then(function() {
      onUpdate && onUpdate();
    }).catch(function(e) { alert('Error: ' + e.message); });
  };

  // Check if this submission repeats dishes from a different week for the same chef
  var findRepeats = (submission) => {
    var others = menus.filter(m => m.chef_id === submission.chef_id && m.id !== submission.id && m.status === 'approved');
    var allOtherDishes = new Set();
    others.forEach(m => {
      Object.values(m.dishes_by_day||{}).forEach(dishes => {
        (dishes||[]).forEach(d => { if(d.dish_name) allOtherDishes.add(d.dish_name.toLowerCase().trim()); });
      });
    });
    var repeats = [];
    Object.values(submission.dishes_by_day||{}).forEach(dishes => {
      (dishes||[]).forEach(d => {
        if (d.dish_name && allOtherDishes.has(d.dish_name.toLowerCase().trim())) repeats.push(d.dish_name);
      });
    });
    return [...new Set(repeats)];
  };

  var handleApprove = (sub) => {
    // API handles applying approved menu to chef record server-side
    persist(sub.id, 'approved', null);
    setDetail(null);
  };

  var handleReject = (sub, reason) => {
    persist(sub.id, 'rejected', reason);
    setDetail(null);
  };

  var pending  = menus.filter(m => m.status === 'pending');
  var reviewed = menus.filter(m => m.status !== 'pending');

  var statusBadge = s => ({
    pending:  <span className="badge badge-yellow">Pending Review</span>,
    approved: <span className="badge badge-green">Approved</span>,
    rejected: <span className="badge badge-red">Rejected</span>,
  }[s] || <span className="badge badge-gray">{s}</span>);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Menu Approvals</h1>
          <p className="section-subtitle">{pending.length} pending · {reviewed.length} reviewed</p>
        </div>
      </div>

      <div style={{ background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:'10px', padding:'14px 18px', marginBottom:'20px', fontSize:'0.85rem', color:'#92400E', display:'flex', gap:'10px' }}>
        <i className="ph-fill ph-warning" style={{ fontSize:'1.1rem', flexShrink:0, marginTop:'1px' }}/>
        <div>
          <strong>Menu repeat rule:</strong> Chefs cannot submit the same dishes two consecutive weeks. Repeated dishes will be highlighted in red — reject and ask the chef to revise their menu.
        </div>
      </div>

      {menus.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'48px', color:'#9CA3AF' }}>
          <i className="ph-fill ph-calendar-blank" style={{ fontSize:'2.5rem', display:'block', marginBottom:'12px' }}/>
          <p style={{ fontWeight:600, color:'#5A5D66' }}>No menu submissions yet</p>
          <p style={{ fontSize:'0.85rem', marginTop:'4px' }}>Menus submitted by chefs via the Chef Portal will appear here for review.</p>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, marginBottom:'12px' }}>Awaiting Review ({pending.length})</h3>
          <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:'24px' }}>
            <table className="data-table">
              <thead><tr><th>Chef</th><th>Week</th><th>Submitted</th><th>Dishes</th><th>Repeat?</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map(sub => {
                  var totalDishes = Object.values(sub.dishes_by_day||{}).reduce((t,d)=>t+(d||[]).filter(x=>x.dish_name).length,0);
                  var repeats = findRepeats(sub);
                  return (
                    <tr key={sub.id}>
                      <td><div style={{ fontWeight:600 }}>{sub.chef_name}</div></td>
                      <td style={{ fontSize:'0.82rem' }}>{sub.week_key==='currentWeek'?'This Week':'Next Week'}<br/><span style={{ color:'#9CA3AF', fontSize:'0.75rem' }}>{sub.week_label||''}</span></td>
                      <td style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>{sub.submitted}</td>
                      <td><span className="badge badge-blue">{totalDishes} dishes</span></td>
                      <td>
                        {repeats.length > 0
                          ? <span className="badge badge-red" title={repeats.join(', ')}>⚠ {repeats.length} repeat{repeats.length>1?'s':''}</span>
                          : <span className="badge badge-green">✓ All new</span>}
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:'6px' }}>
                          <button className="btn btn-outline btn-sm" onClick={()=>setDetail(sub)}><i className="ph-bold ph-eye"/> Review</button>
                          {repeats.length === 0 && <button className="btn btn-success btn-sm" onClick={()=>handleApprove(sub)}><i className="ph-bold ph-check"/> Approve</button>}
                          <button className="btn btn-danger btn-sm" onClick={()=>handleReject(sub,'Menu contains repeated dishes or other issue')}><i className="ph-bold ph-x"/> Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'#9CA3AF', marginBottom:'12px' }}>Reviewed ({reviewed.length})</h3>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <table className="data-table">
              <thead><tr><th>Chef</th><th>Week</th><th>Status</th><th>Reviewed</th><th></th></tr></thead>
              <tbody>
                {reviewed.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight:600 }}>{sub.chef_name}</td>
                    <td style={{ fontSize:'0.82rem' }}>{sub.week_key==='currentWeek'?'This Week':'Next Week'}</td>
                    <td>{statusBadge(sub.status)}</td>
                    <td style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>{sub.reviewed_at||'—'}</td>
                    <td><button className="btn btn-outline btn-sm" onClick={()=>setDetail(sub)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
          <div className="modal" style={{ maxWidth:'600px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>{detail.chef_name} — {detail.week_key==='currentWeek'?'This Week':'Next Week'}</h2>
                <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>Submitted {detail.submitted} · {detail.chef_cuisine}</p>
              </div>
              <button className="btn-icon" onClick={()=>setDetail(null)}><i className="ph-bold ph-x"/></button>
            </div>
            <div className="modal-body">
              {(() => {
                var repeats = new Set(findRepeats(detail).map(r=>r.toLowerCase().trim()));
                return Object.entries(detail.dishes_by_day||{}).map(([day, dishes]) => {
                  var named = (dishes||[]).filter(d=>d.dish_name);
                  if (!named.length) return null;
                  return (
                    <div key={day} style={{ marginBottom:'16px' }}>
                      <div style={{ fontWeight:700, fontSize:'0.82rem', color:'#5A5D66', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{DAY_LABELS_MAP[day]||day}</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        {named.map((d,i) => {
                          var isRepeat = repeats.has((d.dish_name||'').toLowerCase().trim());
                          return (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'6px 10px', background: isRepeat?'#FEF2F2':'#F8F8F8', borderRadius:'8px', border: isRepeat?'1px solid #FECACA':'none' }}>
                              {d.dish_image && <img src={d.dish_image} style={{ width:'36px', height:'36px', objectFit:'cover', borderRadius:'6px' }} onError={e=>e.target.style.display='none'}/>}
                              <span style={{ fontWeight:600, fontSize:'0.875rem', color: isRepeat?'#D0342C':'#111' }}>{d.dish_name}</span>
                              <span className="badge badge-gray" style={{ fontSize:'0.68rem', marginLeft:'auto' }}>{d.dish_type}</span>
                              {isRepeat && <span className="badge badge-red" style={{ fontSize:'0.68rem' }}>Repeat!</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            {detail.status === 'pending' && (
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={()=>handleReject(detail,'Menu contains repeated dishes')}>
                  <i className="ph-bold ph-x"/> Reject
                </button>
                <button className="btn btn-primary" onClick={()=>handleApprove(detail)}>
                  <i className="ph-bold ph-check"/> Approve Menu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window.ADM, { ChefsPage, ApplicationsPage, MenuApprovalsPage });
