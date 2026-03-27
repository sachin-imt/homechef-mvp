// ─── SUBSCRIBERS PAGE ───
window.ADM = window.ADM || {};

// Generate a Mon–Fri week label from a YYYY-MM-DD ISO string (local date)
function generateWeekLabel(mondayIso) {
  var parts = mondayIso.split('-').map(Number);
  var d = new Date(parts[0], parts[1]-1, parts[2]); // parse as local date
  var end = new Date(d); end.setDate(d.getDate() + 4);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var s = months[d.getMonth()] + ' ' + d.getDate();
  var e = (d.getMonth() !== end.getMonth() ? months[end.getMonth()] + ' ' : '') + end.getDate();
  return s + '–' + e;
}

// Next 8 Mon–Fri week options starting from next Monday
function weekOptions() {
  var today = new Date();
  var day = today.getDay();
  // Always go to next Monday (if today is Monday, go to NEXT Monday)
  var diff = day === 1 ? 7 : day === 0 ? 8 : (8 - day) % 7;
  var monday = new Date(today); monday.setDate(today.getDate() + diff);
  var opts = [];
  for (var i = 0; i < 8; i++) {
    var m = new Date(monday); m.setDate(monday.getDate() + i * 7);
    // Use local date parts to avoid UTC offset issues
    var iso = m.getFullYear() + '-' + String(m.getMonth()+1).padStart(2,'0') + '-' + String(m.getDate()).padStart(2,'0');
    opts.push({ value: iso, label: generateWeekLabel(iso) });
  }
  return opts;
}

function AddPaymentForm({ sub, chefs, onAdd, onClose }) {
  var weeks = weekOptions();
  var existing = (sub.payments||[]).map(p=>p.week_iso||p.week);
  var available = weeks.filter(w => !existing.includes(w.value) && !existing.includes(w.label));

  var chef       = chefs.find(c => c.chef_id === sub.chef_id);
  var defaultAmt = chef ? chef.price_per_week : 0;

  var [weekIso, setWeekIso] = React.useState(available[0]?.value || '');
  var [status,  setStatus]  = React.useState('Pending');
  var [note,    setNote]    = React.useState('');
  var [amount,  setAmount]  = React.useState(defaultAmt);

  if (!available.length) {
    return (
      <div style={{ padding:'16px', background:'#F8F8F8', borderRadius:'8px', fontSize:'0.85rem', color:'#5A5D66' }}>
        All upcoming weeks already have payment records.
        <button className="btn btn-outline btn-sm" style={{ marginLeft:'10px' }} onClick={onClose}>Cancel</button>
      </div>
    );
  }

  var selectedWeek = weeks.find(w => w.value === weekIso);
  var commPct = chef?.commission_pct || 20;
  var celebShare = Math.round((amount || 0) * commPct / 100);
  var chefShare  = (amount || 0) - celebShare;

  return (
    <div style={{ background:'#F8FAFF', border:'1px solid #D1E4FF', borderRadius:'10px', padding:'16px', marginBottom:'8px' }}>
      <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'12px', color:'#111' }}>
        <i className="ph-bold ph-plus-circle" style={{ marginRight:'6px', color:'#FACA50' }}/>
        Add Payment Record
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'10px' }}>
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Week</label>
          <select className="form-input" value={weekIso} onChange={e=>setWeekIso(e.target.value)} style={{ fontSize:'0.82rem' }}>
            {available.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Amount Received ($)</label>
          <input className="form-input" type="number" min="0" step="1" value={amount} onChange={e=>setAmount(parseFloat(e.target.value)||0)} style={{ fontSize:'0.82rem' }}/>
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Status</label>
          <select className="form-input" value={status} onChange={e=>setStatus(e.target.value)} style={{ fontSize:'0.82rem' }}>
            <option value="Pending">Pending — not yet confirmed</option>
            <option value="Paid">Paid — confirmed</option>
          </select>
        </div>
      </div>
      {amount > 0 && (
        <div style={{ display:'flex', gap:'16px', marginBottom:'10px', background:'#FFFBEB', borderRadius:'8px', padding:'8px 12px', fontSize:'0.78rem' }}>
          <span>Home Meals ({commPct}%): <strong>${celebShare}</strong></span>
          <span>Chef keeps: <strong>${chefShare}</strong></span>
        </div>
      )}
      <div style={{ marginBottom:'10px' }}>
        <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#5A5D66', marginBottom:'4px' }}>Note (optional)</label>
        <input className="form-input" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Bank transfer ref #123" style={{ fontSize:'0.82rem' }}/>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:'8px' }}>
        <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={()=>onAdd({ week: selectedWeek?.label, week_iso: weekIso, status, amount, confirmed: status==='Paid', confirmed_at: status==='Paid' ? new Date().toISOString().slice(0,10) : null, note, added_by: 'admin', added_at: new Date().toISOString().slice(0,10) })}>
          <i className="ph-bold ph-check"/> Add
        </button>
      </div>
    </div>
  );
}

function statusBadgeFor(status) {
  var s = (window.ADM.SUBSCRIBER_STATUSES||[]).find(x=>x.value===status);
  if (!s) return <span className="badge badge-gray">{status||'—'}</span>;
  return <span className="badge" style={{ background:s.bg, color:s.color }}>{status}</span>;
}

function SubscriberDetail({ sub, chefs, onUpdate, onClose }) {
  var [showAddForm,  setShowAddForm]  = React.useState(false);
  var [noteText,     setNoteText]     = React.useState(sub.status_notes||'');
  var [newStatus,    setNewStatus]    = React.useState(sub.status||'Interested');
  var [saveError,    setSaveError]    = React.useState('');
  var [payments,     setPayments]     = React.useState(sub.payments||[]);

  var chef = chefs.find(c => c.chef_id === sub.chef_id);
  var amount = chef ? chef.price_per_week : 0;

  var handleConfirm = (weekLabel) => {
    var updated = payments.map(p => p.week===weekLabel ? { ...p, status:'Paid', confirmed:true, confirmed_at: new Date().toISOString().slice(0,10) } : p);
    setPayments(updated);
  };
  var handleUnconfirm = (weekLabel) => {
    var updated = payments.map(p => p.week===weekLabel ? { ...p, status:'Pending', confirmed:false, confirmed_at:null } : p);
    setPayments(updated);
  };
  var handleDelete = (weekLabel) => {
    setPayments(payments.filter(p => p.week !== weekLabel));
  };
  var handleAdd = (entry) => {
    setPayments([...payments, entry]);
    setShowAddForm(false);
    setSaveError('');
  };

  var handleSave = () => {
    // Require at least one payment entry when setting status to Payment Made
    if (newStatus === 'Payment Made' && payments.length === 0) {
      setSaveError('Please add at least one payment record before marking as "Payment Made".');
      setShowAddForm(true);
      return;
    }
    setSaveError('');
    var updated = { ...sub, status: newStatus, status_notes: noteText, payments };
    onUpdate(updated);
    if (newStatus === 'Deactivated' && sub.status !== 'Deactivated') {
      window.ADM.pushNotification('subscriber_withdrawn', `${sub.name} has been deactivated — notify ${sub.chef_name}`, sub.id);
    }
    onClose();
  };

  var sorted = [...payments].sort((a,b) => (b.week_iso||'') > (a.week_iso||'') ? 1 : -1);
  var STATUSES = window.ADM.SUBSCRIBER_STATUSES || [];
  var statusChanged = newStatus !== sub.status;

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{ maxWidth:'540px' }}>
        <div className="modal-header">
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div>
              <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>{sub.name}</h2>
              <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>{sub.chef_name} · Started {sub.starting_week}</p>
            </div>
            {statusBadgeFor(sub.status)}
          </div>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">

          {/* Status + Note — always visible */}
          <div style={{ background:'#F8F8F8', borderRadius:'10px', padding:'14px', marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700, color:'#111', marginBottom:'8px' }}>Subscriber Status</label>
            <select className="form-input" value={newStatus} onChange={e=>{ setNewStatus(e.target.value); setSaveError(''); }} style={{ marginBottom:'8px' }}>
              {STATUSES.map(s=><option key={s.value} value={s.value}>{s.value} — {s.desc}</option>)}
            </select>
            {statusChanged && newStatus === 'Payment Made' && payments.length === 0 && (
              <div style={{ fontSize:'0.78rem', color:'#D0342C', background:'#FFF0F0', border:'1px solid #FCA5A5', borderRadius:'6px', padding:'8px 10px', marginBottom:'8px' }}>
                <i className="ph-bold ph-warning" style={{ marginRight:'5px' }}/>
                A payment record is required before saving as "Payment Made". Add one below.
              </div>
            )}
            <textarea className="form-input" rows={2} value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Add a note (e.g. called subscriber, confirmed payment)..." />
          </div>

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
                {payments.filter(p=>p.confirmed).length} confirmed · {payments.filter(p=>!p.confirmed).length} pending
              </span>
            </h4>
            {!showAddForm && (
              <button className="btn btn-primary btn-sm" onClick={()=>setShowAddForm(true)}>
                <i className="ph-bold ph-plus"/> Add Week
              </button>
            )}
          </div>

          {/* Add payment form */}
          {showAddForm && <AddPaymentForm sub={{ ...sub, payments }} chefs={chefs} onAdd={handleAdd} onClose={()=>setShowAddForm(false)}/>}

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
                  ${p.amount != null ? p.amount : amount}
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

          {saveError && (
            <div style={{ fontSize:'0.82rem', color:'#D0342C', background:'#FFF0F0', border:'1px solid #FCA5A5', borderRadius:'6px', padding:'10px 12px', marginTop:'8px' }}>
              <i className="ph-bold ph-warning" style={{ marginRight:'5px' }}/>{saveError}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div style={{ fontSize:'0.8rem', color:'#9CA3AF', marginRight:'auto' }}>
            Total confirmed: <strong style={{ color:'#111' }}>${payments.filter(p=>p.confirmed).reduce(function(t,p){ return t + (p.amount != null ? p.amount : amount); }, 0)}</strong>
          </div>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}><i className="ph-bold ph-check"/> Save Changes</button>
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
              {chefs.filter(c=>(c.status||'active').toLowerCase()==='active').map(c=><option key={c.chef_id} value={c.chef_id}>{c.chef_name} — {c.cuisine_type}</option>)}
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

var WORKFLOW_STEPS = [
  { status:'Interested',        action:'Call subscriber to confirm interest and request payment', icon:'ph-fill ph-phone', next:'Payment Made' },
  { status:'Payment Made',      action:'Confirm with chef they can take the delivery', icon:'ph-fill ph-chef-hat', next:'Active Deliveries' },
  { status:'Active Deliveries', action:'Deliveries underway — monitor weekly payments', icon:'ph-fill ph-truck', next:null },
  { status:'No payment after 1 week', action:'Call subscriber — if not interested, notify chef and deactivate', icon:'ph-fill ph-warning', next:'Deactivated', warn:true },
];

function WorkflowGuide({ onClose }) {
  return (
    <div style={{ background:'white', border:'1px solid #E5E5E5', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:800, margin:0 }}>Subscriber Workflow</h3>
        <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: step.warn ? '#FEE2E2' : '#FFFBEB', border:`2px solid ${step.warn?'#FECACA':'#FACA50'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className={step.icon} style={{ fontSize:'0.85rem', color: step.warn ? '#D0342C' : '#FACA50' }}/>
              </div>
              {i < WORKFLOW_STEPS.length-1 && <div style={{ width:'2px', height:'24px', background:'#E5E5E5' }}/>}
            </div>
            <div style={{ paddingBottom:'16px', paddingTop:'4px' }}>
              <div style={{ fontWeight:700, fontSize:'0.82rem', color: step.warn ? '#D0342C' : '#111' }}>{step.status}</div>
              <div style={{ fontSize:'0.8rem', color:'#5A5D66', marginTop:'2px' }}>{step.action}</div>
              {step.next && <div style={{ fontSize:'0.75rem', color:'#9CA3AF', marginTop:'2px' }}>→ move to <strong>{step.next}</strong></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscribersPage({ chefs, subscribers: initialSubs, onUpdate: notifyParent, onClearBadge }) {
  var [subs, setSubs]            = React.useState(initialSubs || []);
  var [search, setSearch]        = React.useState('');
  var [filterChef, setFC]        = React.useState('all');
  var [filterStatus, setFS]      = React.useState('all');
  var [selected,   setSel]       = React.useState(null);
  var [showAdd,    setShowAdd]   = React.useState(false);
  var [showGuide,  setShowGuide] = React.useState(false);
  var [sortField,  setSortField] = React.useState('id');
  var [sortDir,    setSortDir]   = React.useState('desc');

  // Auto-clear the sidebar badge as soon as admin opens this page
  React.useEffect(function() { onClearBadge && onClearBadge(); }, []);

  // Keep in sync if parent reloads
  React.useEffect(function() { setSubs(initialSubs || []); }, [initialSubs]);

  var toggleSort = function(field) {
    if (sortField === field) { setSortDir(function(d) { return d === 'asc' ? 'desc' : 'asc'; }); }
    else { setSortField(field); setSortDir('asc'); }
  };
  var SortIcon = function({ field }) {
    if (sortField !== field) return React.createElement('span', { style:{ color:'#CCC', marginLeft:'4px', fontSize:'0.65rem' } }, '⇅');
    return React.createElement('span', { style:{ color:'#FACA50', marginLeft:'4px', fontSize:'0.65rem' } }, sortDir === 'asc' ? '▲' : '▼');
  };

  var STATUSES = (window.ADM.SUBSCRIBER_STATUSES || []).map(function(s) { return s.value; });

  var handleUpdate = (updatedSub) => {
    window.ADM.updateSubscriber(updatedSub).then(function(saved) {
      var merged = saved || updatedSub;
      var updated = subs.map(function(s) { return s.id === merged.id ? merged : s; });
      setSubs(updated);
      window.ADM.subscribers = updated;
      notifyParent && notifyParent(updated);
      // modal closes itself after calling onUpdate — don't reopen via setSel
    }).catch(function(e) { alert('Error saving subscriber: ' + e.message); });
  };

  var handleAddSubscriber = (newSub) => {
    var subData = { ...newSub, status: 'Interested', status_notes: '' };
    window.ADM.addSubscriberAPI(subData).then(function(created) {
      if (!created || created.error) { alert('Error saving subscriber: ' + (created?.error || 'Unknown error')); return; }
      var updated = [...subs, created];
      setSubs(updated);
      window.ADM.subscribers = updated;
      notifyParent && notifyParent(updated);
      window.ADM.pushNotification('new_subscriber', 'New subscriber: ' + newSub.name + ' → ' + newSub.chef_name, created.id);
      setShowAdd(false);
    }).catch(function(e) { alert('Error adding subscriber: ' + e.message); });
  };

  var filtered = subs.filter(s => {
    if (filterChef  !== 'all' && s.chef_id !== parseInt(filterChef)) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (search) {
      var q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q);
    }
    return true;
  });

  // Sort filtered results
  var sorted = filtered.slice().sort(function(a, b) {
    var av, bv;
    if      (sortField === 'id')            { av = a.id;           bv = b.id; }
    else if (sortField === 'name')          { av = (a.name||'').toLowerCase(); bv = (b.name||'').toLowerCase(); }
    else if (sortField === 'chef')          { av = (a.chef_name||'').toLowerCase(); bv = (b.chef_name||'').toLowerCase(); }
    else if (sortField === 'status')        { av = (a.status||'').toLowerCase(); bv = (b.status||'').toLowerCase(); }
    else if (sortField === 'dietary')       { av = (a.dietary||'').toLowerCase(); bv = (b.dietary||'').toLowerCase(); }
    else if (sortField === 'starting_week') { av = a.starting_week||''; bv = b.starting_week||''; }
    else if (sortField === 'payments')      { av = (a.payments||[]).filter(function(p){return p.confirmed;}).length; bv = (b.payments||[]).filter(function(p){return p.confirmed;}).length; }
    else                                    { av = a.id; bv = b.id; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  var confirmedRevenue = subs.reduce((total, s) => {
    var chef = chefs.find(c => c.chef_id === s.chef_id);
    return total + (s.payments||[]).filter(p=>p.confirmed).length * (chef?.price_per_week||0);
  }, 0);
  var pendingCount    = subs.reduce((t,s) => t + (s.payments||[]).filter(p=>!p.confirmed).length, 0);
  var interestedCount = subs.filter(s=>s.status==='Interested').length;

  return (
    <div className="fade-in">
      {showGuide && <WorkflowGuide onClose={()=>setShowGuide(false)}/>}
      <div className="section-header">
        <div>
          <h1 className="section-title">Subscribers</h1>
          <p className="section-subtitle">
            {subs.length} total
            {interestedCount > 0 && <span style={{ marginLeft:'8px', background:'#DBEAFE', color:'#1D4ED8', borderRadius:'10px', fontSize:'0.72rem', padding:'1px 8px', fontWeight:700 }}>{interestedCount} need follow-up</span>}
          </p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button className="btn btn-outline" onClick={()=>setShowGuide(g=>!g)}>
            <i className="ph-bold ph-question"/> Workflow
          </button>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>
            <i className="ph-bold ph-user-plus"/> Add Subscriber
          </button>
        </div>
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
        <select className="form-input" value={filterStatus} onChange={e=>setFS(e.target.value)} style={{ width:'180px' }}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {(search||filterChef!=='all'||filterStatus!=='all') && (
          <button className="btn btn-outline btn-sm" onClick={()=>{setSearch('');setFC('all');setFS('all');}}>
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
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('id')}># <SortIcon field="id"/></th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('name')}>Name <SortIcon field="name"/></th>
                <th>Contact</th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('chef')}>Chef <SortIcon field="chef"/></th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('status')}>Status <SortIcon field="status"/></th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('dietary')}>Dietary <SortIcon field="dietary"/></th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('starting_week')}>Starting Week <SortIcon field="starting_week"/></th>
                <th style={{ cursor:'pointer', userSelect:'none' }} onClick={()=>toggleSort('payments')}>Payments <SortIcon field="payments"/></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                var conf = s.payments.filter(p=>p.confirmed).length;
                var pend = s.payments.filter(p=>!p.confirmed).length;
                var isInterested = s.status === 'Interested';
                return (
                  <tr key={s.id} style={{ cursor:'pointer', background: isInterested ? '#FFFDF0' : undefined }} onClick={()=>setSel(s)}>
                    <td style={{ color:'#9CA3AF', fontSize:'0.78rem' }}>{s.id}</td>
                    <td style={{ fontWeight:600 }}>{s.name}</td>
                    <td>
                      <div style={{ fontSize:'0.8rem' }}>{s.email}</div>
                      <div style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>{s.phone}</div>
                    </td>
                    <td><span className="badge badge-blue" style={{ fontSize:'0.72rem' }}>{s.chef_name}</span></td>
                    <td>{statusBadgeFor(s.status)}</td>
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
