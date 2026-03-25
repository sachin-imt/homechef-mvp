// ─── SUBSCRIBERS PAGE ───
window.ADM = window.ADM || {};

// Generate a list of week labels (Mon–Fri) starting from a given date
function generateWeekLabel(mondayDate) {
  var d = new Date(mondayDate);
  var end = new Date(d); end.setDate(d.getDate() + 4);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var s = `${months[d.getMonth()]} ${d.getDate()}`;
  var e = `${d.getMonth()!==end.getMonth()?months[end.getMonth()]+' ':''}${end.getDate()}`;
  return `${s}–${e}`;
}

// Next 8 Mon–Fri week options from today
function weekOptions() {
  var today = new Date();
  var day = today.getDay();
  var diff = day <= 1 ? 1 - day : 8 - day; // next Monday
  var monday = new Date(today); monday.setDate(today.getDate() + diff);
  var opts = [];
  for (var i = 0; i < 8; i++) {
    var m = new Date(monday); m.setDate(monday.getDate() + i * 7);
    var iso = m.toISOString().slice(0,10);
    opts.push({ value: iso, label: generateWeekLabel(iso) });
  }
  return opts;
}

function AddPaymentForm({ sub, chefs, onAdd, onClose }) {
  var weeks = weekOptions();
  var existing = (sub.payments||[]).map(p=>p.week_iso||p.week);
  var available = weeks.filter(w => !existing.includes(w.value) && !existing.includes(w.label));

  var [weekIso,  setWeekIso]  = React.useState(available[0]?.value || '');
  var [status,   setStatus]   = React.useState('Pending');
  var [note,     setNote]     = React.useState('');

  if (!available.length) {
    return (
      <div style={{ padding:'16px', background:'#F8F8F8', borderRadius:'8px', fontSize:'0.85rem', color:'#5A5D66' }}>
        All upcoming weeks already have payment records.
        <button className="btn btn-outline btn-sm" style={{ marginLeft:'10px' }} onClick={onClose}>Cancel</button>
      </div>
    );
  }

  var chef = chefs.find(c => c.chef_id === sub.chef_id);
  var amount = chef ? chef.price_per_week : 0;
  var selectedWeek = weeks.find(w => w.value === weekIso);

  return (
    <div style={{ background:'#F8FAFF', border:'1px solid #D1E4FF', borderRadius:'10px', padding:'16px', marginBottom:'8px' }}>
      <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'12px', color:'#111' }}>
        <i className="ph-bold ph-plus-circle" style={{ marginRight:'6px', color:'#FACA50' }}/>
        Add Payment Record
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Week</label>
          <select className="form-input" value={weekIso} onChange={e=>setWeekIso(e.target.value)} style={{ fontSize:'0.82rem' }}>
            {available.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Status</label>
          <select className="form-input" value={status} onChange={e=>setStatus(e.target.value)} style={{ fontSize:'0.82rem' }}>
            <option value="Pending">Pending — payment not yet received</option>
            <option value="Paid">Paid — confirm immediately</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom:'10px' }}>
        <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Note (optional)</label>
        <input className="form-input" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Bank transfer ref #123" style={{ fontSize:'0.82rem' }}/>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>
          {selectedWeek?.label} · ${amount}
        </span>
        <div style={{ display:'flex', gap:'8px' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={()=>onAdd({ week: selectedWeek?.label, week_iso: weekIso, status, confirmed: status==='Paid', confirmed_at: status==='Paid' ? new Date().toISOString().slice(0,10) : null, note, added_by: 'admin', added_at: new Date().toISOString().slice(0,10) })}>
            <i className="ph-bold ph-check"/> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriberDetail({ sub, chefs, onUpdate, onClose }) {
  var [showAddForm, setShowAddForm] = React.useState(false);

  var chef = chefs.find(c => c.chef_id === sub.chef_id);
  var amount = chef ? chef.price_per_week : 0;

  var handleConfirm = (weekLabel) => {
    onUpdate({ ...sub, payments: sub.payments.map(p => p.week===weekLabel ? { ...p, status:'Paid', confirmed:true, confirmed_at: new Date().toISOString().slice(0,10) } : p) });
  };
  var handleUnconfirm = (weekLabel) => {
    onUpdate({ ...sub, payments: sub.payments.map(p => p.week===weekLabel ? { ...p, status:'Pending', confirmed:false, confirmed_at:null } : p) });
  };
  var handleDelete = (weekLabel) => {
    onUpdate({ ...sub, payments: sub.payments.filter(p => p.week !== weekLabel) });
  };
  var handleAdd = (entry) => {
    onUpdate({ ...sub, payments: [...sub.payments, entry] });
    setShowAddForm(false);
  };

  // Sort payments newest-first by week_iso, fallback to order
  var sorted = [...sub.payments].sort((a,b) => (b.week_iso||'') > (a.week_iso||'') ? 1 : -1);

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:'520px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>{sub.name}</h2>
            <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>{sub.chef_name} · Started {sub.starting_week}</p>
          </div>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">

          {/* Contact details */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid #F4F4F4' }}>
            {[
              ['Email',   sub.email],
              ['Phone',   sub.phone],
              ['Suburb',  `${sub.suburb} ${sub.postcode}`],
              ['Dietary', sub.dietary||'None'],
              ['Joined',  sub.created],
              ['Chef',    sub.chef_name],
            ].map(([l,v])=>(
              <div key={l} style={{ fontSize:'0.8rem' }}>
                <div style={{ color:'#9CA3AF', marginBottom:'2px' }}>{l}</div>
                <div style={{ fontWeight:600, color:'#111' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Payment log header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <h4 style={{ fontSize:'0.875rem', fontWeight:700, color:'#111', margin:0 }}>
              Payment Log
              <span style={{ marginLeft:'8px', fontSize:'0.75rem', fontWeight:400, color:'#9CA3AF' }}>
                {sub.payments.filter(p=>p.confirmed).length} confirmed · {sub.payments.filter(p=>!p.confirmed).length} pending
              </span>
            </h4>
            {!showAddForm && (
              <button className="btn btn-primary btn-sm" onClick={()=>setShowAddForm(true)}>
                <i className="ph-bold ph-plus"/> Add Week
              </button>
            )}
          </div>

          {/* Add payment form */}
          {showAddForm && <AddPaymentForm sub={sub} chefs={chefs} onAdd={handleAdd} onClose={()=>setShowAddForm(false)}/>}

          {/* Payment entries */}
          {sorted.length === 0 && !showAddForm && (
            <div style={{ textAlign:'center', padding:'24px', color:'#CCC', fontSize:'0.85rem' }}>
              No payment records yet. Click "Add Week" to record the first payment.
            </div>
          )}
          {sorted.map((p, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', justifyContent:'space-between',
              padding:'12px 14px', borderRadius:'8px', marginBottom:'8px',
              background: p.confirmed ? '#F0FDF4' : '#FFFBEB',
              border: `1px solid ${p.confirmed ? '#BBF7D0' : '#FDE68A'}`,
            }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                  <span style={{ fontWeight:700, fontSize:'0.875rem' }}>{p.week}</span>
                  {p.confirmed
                    ? <span className="badge badge-green" style={{ fontSize:'0.65rem' }}><i className="ph-fill ph-check-circle" style={{ fontSize:'0.65rem' }}/>Confirmed</span>
                    : <span className="badge badge-yellow" style={{ fontSize:'0.65rem' }}>Pending</span>
                  }
                  {p.added_by === 'admin' && (
                    <span className="badge badge-gray" style={{ fontSize:'0.62rem' }}>manual</span>
                  )}
                </div>
                <div style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>
                  ${amount}
                  {p.confirmed && p.confirmed_at && ` · Confirmed ${p.confirmed_at}`}
                  {!p.confirmed && ' · Awaiting payment'}
                  {p.note && ` · ${p.note}`}
                </div>
              </div>
              <div style={{ display:'flex', gap:'6px', flexShrink:0, marginLeft:'12px' }}>
                {p.confirmed
                  ? <button className="btn btn-outline btn-sm" style={{ fontSize:'0.72rem' }} onClick={()=>handleUnconfirm(p.week)}>Undo</button>
                  : <button className="btn btn-success btn-sm" onClick={()=>handleConfirm(p.week)}>
                      <i className="ph-bold ph-check"/> Confirm
                    </button>
                }
                <button className="btn-icon" title="Remove record" style={{ color:'#D0342C' }} onClick={()=>{ if(confirm(`Remove ${p.week} payment record?`)) handleDelete(p.week); }}>
                  <i className="ph-bold ph-trash" style={{ fontSize:'0.8rem' }}/>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div style={{ fontSize:'0.8rem', color:'#9CA3AF', marginRight:'auto' }}>
            Total confirmed: <strong style={{ color:'#111' }}>${sub.payments.filter(p=>p.confirmed).length * amount}</strong>
          </div>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function AddSubscriberModal({ chefs, onSave, onClose }) {
  var weeks = weekOptions();
  var [form, setForm] = React.useState({
    name:'', email:'', phone:'', chef_id: chefs[0]?.chef_id||'', suburb:'', postcode:'', dietary:'',
    starting_week: weeks[0]?.label||'', starting_week_iso: weeks[0]?.value||'',
    first_payment: 'Pending',
  });
  var [saving, setSaving] = React.useState(false);
  var set = (k,v) => setForm(f=>({...f,[k]:v}));

  var selectedChef = chefs.find(c=>c.chef_id===parseInt(form.chef_id));
  var postcodes = selectedChef?.delivery_postcodes || [];
  var suburbMap = (window.CC && window.CC.POSTCODE_SUBURB_MAP) || {};

  var validate = () => {
    if (!form.name.trim())  return 'Name required';
    if (!form.email.trim()) return 'Email required';
    if (!form.chef_id)      return 'Select a chef';
    if (!form.suburb.trim()) return 'Suburb required';
    return null;
  };

  var handleSave = () => {
    var err = validate();
    if (err) return alert(err);
    setSaving(true);
    setTimeout(() => {
      var weekLabel = weeks.find(w=>w.value===form.starting_week_iso)?.label || form.starting_week;
      onSave({
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        chef_id: parseInt(form.chef_id), chef_name: selectedChef?.chef_name||'',
        suburb: form.suburb.trim(), postcode: form.postcode.trim(),
        dietary: form.dietary.trim(), created: new Date().toISOString().slice(0,10),
        starting_week: weekLabel,
        payments: [{
          week: weekLabel, week_iso: form.starting_week_iso,
          status: form.first_payment, confirmed: form.first_payment==='Paid',
          confirmed_at: form.first_payment==='Paid' ? new Date().toISOString().slice(0,10) : null,
          note: '', added_by: 'admin', added_at: new Date().toISOString().slice(0,10),
        }],
      });
    }, 500);
  };

  var lbl = { display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px', color:'#111' };
  var row2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:'560px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize:'1.05rem', fontWeight:800, margin:0 }}>Add Subscriber</h2>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">
          <div style={row2}>
            <div className="form-group">
              <label style={lbl}>Full Name</label>
              <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Sarah Johnson"/>
            </div>
            <div className="form-group">
              <label style={lbl}>Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="sarah@gmail.com"/>
            </div>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={lbl}>Phone</label>
              <input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="04XX XXX XXX"/>
            </div>
            <div className="form-group">
              <label style={lbl}>Dietary Requirements</label>
              <input className="form-input" value={form.dietary} onChange={e=>set('dietary',e.target.value)} placeholder="e.g. Gluten-free, Halal"/>
            </div>
          </div>
          <div className="form-group">
            <label style={lbl}>Chef</label>
            <select className="form-input" value={form.chef_id} onChange={e=>{ set('chef_id',e.target.value); set('suburb',''); set('postcode',''); }}>
              <option value="">Select chef…</option>
              {chefs.filter(c=>(c.status||'Active')==='Active').map(c=><option key={c.chef_id} value={c.chef_id}>{c.chef_name} — {c.cuisine_type}</option>)}
            </select>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={lbl}>Suburb</label>
              {postcodes.length > 0 ? (
                <select className="form-input" value={form.suburb} onChange={e=>{
                  var pc = postcodes.find(p => (suburbMap[p]||p) === e.target.value);
                  set('suburb', e.target.value);
                  set('postcode', pc||'');
                }}>
                  <option value="">Select suburb…</option>
                  {postcodes.map(pc=><option key={pc} value={suburbMap[pc]||pc}>{suburbMap[pc]||pc}</option>)}
                </select>
              ) : (
                <input className="form-input" value={form.suburb} onChange={e=>set('suburb',e.target.value)} placeholder="Newtown"/>
              )}
            </div>
            <div className="form-group">
              <label style={lbl}>Postcode</label>
              <input className="form-input" value={form.postcode} onChange={e=>set('postcode',e.target.value)} placeholder="2042"/>
            </div>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={lbl}>Starting Week</label>
              <select className="form-input" value={form.starting_week_iso} onChange={e=>{
                set('starting_week_iso', e.target.value);
                set('starting_week', weeks.find(w=>w.value===e.target.value)?.label||'');
              }}>
                {weeks.map(w=><option key={w.value} value={w.value}>{w.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={lbl}>First Week Payment</label>
              <select className="form-input" value={form.first_payment} onChange={e=>set('first_payment',e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid — confirm now</option>
              </select>
            </div>
          </div>
          {selectedChef && (
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:'8px', padding:'10px 14px', fontSize:'0.82rem', color:'#856404' }}>
              <i className="ph-fill ph-info"/> ${selectedChef.price_per_week}/week · {selectedChef.cuisine_type}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="ph-bold ph-spinner spin"/> Saving…</> : 'Add Subscriber'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscribersPage({ chefs }) {
  var [subs, setSubs]         = React.useState(() => window.ADM.subscribers || []);
  var [search, setSearch]     = React.useState('');
  var [filterChef, setFC]     = React.useState('all');
  var [filterPay,  setFP]     = React.useState('all');
  var [selected,   setSel]    = React.useState(null);
  var [showAdd,    setShowAdd] = React.useState(false);

  var persist = (updated) => {
    setSubs(updated);
    window.ADM.subscribers = updated;
    window.ADM.saveSubscribers(updated);
  };

  var handleUpdate = (updatedSub) => {
    var updated = subs.map(s => s.id === updatedSub.id ? updatedSub : s);
    persist(updated);
    setSel(updatedSub);
  };

  var handleAddSubscriber = (newSub) => {
    var newId = Math.max(...subs.map(s=>s.id), 0) + 1;
    var updated = [...subs, { ...newSub, id: newId }];
    persist(updated);
    setShowAdd(false);
  };

  var filtered = subs.filter(s => {
    if (filterChef !== 'all' && s.chef_id !== parseInt(filterChef)) return false;
    if (filterPay === 'all_paid'    && !s.payments.every(p=>p.confirmed))   return false;
    if (filterPay === 'has_pending' && !s.payments.some(p=>!p.confirmed))   return false;
    if (search) {
      var q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q);
    }
    return true;
  });

  var confirmedRevenue = subs.reduce((total, s) => {
    var chef = chefs.find(c => c.chef_id === s.chef_id);
    return total + (s.payments||[]).filter(p=>p.confirmed).length * (chef?.price_per_week||0);
  }, 0);
  var pendingCount = subs.reduce((t,s) => t + (s.payments||[]).filter(p=>!p.confirmed).length, 0);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Subscribers</h1>
          <p className="section-subtitle">{subs.length} subscriber{subs.length!==1?'s':''} · {pendingCount} payment{pendingCount!==1?'s':''} awaiting confirmation</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>
          <i className="ph-bold ph-user-plus"/> Add Subscriber
        </button>
        <button className="btn btn-outline" onClick={() => {
          var csv = ['ID,Name,Email,Phone,Chef,Suburb,Postcode,Dietary,Joined,Starting Week,Weeks Confirmed,Weeks Pending',
            ...subs.map(s => {
              var conf = s.payments.filter(p=>p.confirmed).length;
              var pend = s.payments.filter(p=>!p.confirmed).length;
              return [s.id,s.name,s.email,s.phone,s.chef_name,s.suburb,s.postcode,s.dietary||'',s.created,s.starting_week,conf,pend].join(',');
            })
          ].join('\n');
          var a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='subscribers.csv'; a.click();
        }}>
          <i className="ph-bold ph-export"/> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Total Subscribers',  value: subs.length,            icon:'ph-fill ph-users',                  color:'#9CA3AF' },
          { label:'Payments Confirmed', value: subs.reduce((t,s)=>t+s.payments.filter(p=>p.confirmed).length,0), icon:'ph-fill ph-check-circle', color:'#3A813D' },
          { label:'Payments Pending',   value: pendingCount,            icon:'ph-fill ph-clock',                  color:'#F59E0B' },
          { label:'Confirmed Revenue',  value: `$${confirmedRevenue}`,  icon:'ph-fill ph-currency-circle-dollar', color:'#FACA50' },
        ].map(c => (
          <div key={c.label} className="stat-card card-sm" style={{ flexDirection:'row', alignItems:'center', gap:'12px' }}>
            <i className={c.icon} style={{ fontSize:'1.4rem', color: c.color }}/>
            <div>
              <div style={{ fontSize:'1.25rem', fontWeight:800 }}>{c.value}</div>
              <div style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'16px', alignItems:'center' }}>
        <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, suburb…" style={{ width:'220px' }}/>
        <select className="form-input" value={filterChef} onChange={e=>setFC(e.target.value)} style={{ width:'160px' }}>
          <option value="all">All Chefs</option>
          {chefs.map(c=><option key={c.chef_id} value={c.chef_id}>{c.chef_name}</option>)}
        </select>
        <select className="form-input" value={filterPay} onChange={e=>setFP(e.target.value)} style={{ width:'180px' }}>
          <option value="all">All Payment Statuses</option>
          <option value="all_paid">All Weeks Confirmed</option>
          <option value="has_pending">Has Pending Payment</option>
        </select>
        {(search||filterChef!=='all'||filterPay!=='all') && (
          <button className="btn btn-outline btn-sm" onClick={()=>{setSearch('');setFC('all');setFP('all');}}>
            <i className="ph-bold ph-x"/> Clear
          </button>
        )}
      </div>

      {subs.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'48px', color:'#9CA3AF' }}>
          <i className="ph-fill ph-users-three" style={{ fontSize:'2.5rem', marginBottom:'12px', display:'block' }}/>
          <p style={{ fontWeight:600, color:'#5A5D66' }}>No subscribers yet</p>
          <p style={{ fontSize:'0.85rem', marginTop:'4px' }}>Subscribers will appear here once people sign up on the public site.</p>
        </div>
      ) : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Contact</th><th>Chef</th>
                <th>Suburb</th><th>Dietary</th><th>Starting Week</th><th>Payments</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                var conf = s.payments.filter(p=>p.confirmed).length;
                var pend = s.payments.filter(p=>!p.confirmed).length;
                return (
                  <tr key={s.id} style={{ cursor:'pointer' }} onClick={()=>setSel(s)}>
                    <td style={{ color:'#9CA3AF', fontSize:'0.78rem' }}>{s.id}</td>
                    <td style={{ fontWeight:600 }}>{s.name}</td>
                    <td>
                      <div style={{ fontSize:'0.8rem' }}>{s.email}</div>
                      <div style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>{s.phone}</div>
                    </td>
                    <td><span className="badge badge-blue">{s.chef_name}</span></td>
                    <td>
                      <div style={{ fontSize:'0.85rem' }}>{s.suburb}</div>
                      <div style={{ fontSize:'0.72rem', color:'#9CA3AF' }}>{s.postcode}</div>
                    </td>
                    <td style={{ fontSize:'0.8rem', color: s.dietary?'#111':'#CCC' }}>{s.dietary||'—'}</td>
                    <td style={{ fontSize:'0.82rem', whiteSpace:'nowrap', fontWeight:600 }}>{s.starting_week}</td>
                    <td>
                      <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
                        {conf > 0 && <span className="badge badge-green" style={{ fontSize:'0.68rem' }}>{conf} confirmed</span>}
                        {pend > 0 && <span className="badge badge-yellow" style={{ fontSize:'0.68rem' }}>{pend} pending</span>}
                        {conf === 0 && pend === 0 && <span style={{ color:'#CCC', fontSize:'0.78rem' }}>—</span>}
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={e=>{e.stopPropagation();setSel(s);}}>
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={9} style={{ textAlign:'center', color:'#9CA3AF', padding:'32px' }}>No subscribers match the filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <SubscriberDetail
          sub={selected}
          chefs={chefs}
          onUpdate={handleUpdate}
          onClose={()=>setSel(null)}
        />
      )}
      {showAdd && (
        <AddSubscriberModal
          chefs={chefs}
          onSave={handleAddSubscriber}
          onClose={()=>setShowAdd(false)}
        />
      )}
    </div>
  );
}

Object.assign(window.ADM, { SubscribersPage });
