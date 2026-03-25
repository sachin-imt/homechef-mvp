// ─── CHEF MANAGEMENT + MENU APPROVALS ───
window.ADM = window.ADM || {};
var { useState, useRef } = React;

var CUISINE_OPTIONS = ['Indian','Mediterranean','Thai','Italian','Japanese','Chinese','Mexican','Vietnamese','Lebanese','Greek'];
var STATUS_OPTIONS  = ['Active','Paused'];

function ChefModal({ chef, onSave, onClose }) {
  var isNew = !chef.chef_id;
  var [form, setForm] = useState(chef);
  var [pcInput, setPcInput] = useState('');
  var [saving, setSaving] = useState(false);

  var set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  var addPc = () => {
    var pc = pcInput.trim();
    if (pc && !/^\d{4}$/.test(pc)) return alert('Postcode must be 4 digits');
    if (pc && !(form.delivery_postcodes || []).includes(pc)) {
      set('delivery_postcodes', [...(form.delivery_postcodes || []), pc]);
    }
    setPcInput('');
  };
  var removePc = (pc) => set('delivery_postcodes', form.delivery_postcodes.filter(p => p !== pc));

  var handleSave = () => {
    if (!form.chef_name?.trim()) return alert('Chef name required');
    if (!form.cuisine_type) return alert('Select a cuisine');
    if (!form.price_per_week || form.price_per_week < 1) return alert('Price required');
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(form); }, 600);
  };

  var labelStyle = { display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px', color:'#111' };
  var row2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize:'1.1rem', fontWeight:800, margin:0 }}>{isNew ? 'Add New Chef' : `Edit ${chef.chef_name}`}</h2>
          <button className="btn-icon" onClick={onClose}><i className="ph-bold ph-x"/></button>
        </div>
        <div className="modal-body">
          {/* Basic info */}
          <div className="form-group">
            <label style={labelStyle}>Chef Name</label>
            <input className="form-input" value={form.chef_name||''} onChange={e=>set('chef_name',e.target.value)} placeholder="e.g. Chef Priya"/>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={labelStyle}>Cuisine Type</label>
              <select className="form-input" value={form.cuisine_type||''} onChange={e=>set('cuisine_type',e.target.value)}>
                <option value="">Select cuisine…</option>
                {CUISINE_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Price / Week ($)</label>
              <input className="form-input" type="number" value={form.price_per_week||''} onChange={e=>set('price_per_week',parseFloat(e.target.value)||0)} placeholder="e.g. 150"/>
            </div>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={labelStyle}>Rating</label>
              <input className="form-input" type="number" step="0.1" min="1" max="5" value={form.rating||''} onChange={e=>set('rating',parseFloat(e.target.value)||0)} placeholder="4.8"/>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Status</label>
              <select className="form-input" value={form.status||'Active'} onChange={e=>set('status',e.target.value)}>
                {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label style={labelStyle}>Short Bio</label>
            <textarea className="form-input" rows={3} value={form.bio||''} onChange={e=>set('bio',e.target.value)} placeholder="A short description shown on chef cards…"/>
          </div>
          <div style={row2}>
            <div className="form-group">
              <label style={labelStyle}>Food Photo URL</label>
              <input className="form-input" value={form.food_image||''} onChange={e=>set('food_image',e.target.value)} placeholder="https://…"/>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Chef Avatar URL</label>
              <input className="form-input" value={form.avatar||''} onChange={e=>set('avatar',e.target.value)} placeholder="https://…"/>
            </div>
          </div>
          <div className="form-group">
            <label style={labelStyle}>Highlight Tags (comma-separated)</label>
            <input className="form-input" value={(form.highlights||[]).join(', ')} onChange={e=>set('highlights',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} placeholder="Halal, Gluten-Free, Family Recipes"/>
          </div>
          {/* Delivery postcodes */}
          <div className="form-group">
            <label style={labelStyle}>Delivery Postcodes</label>
            <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
              <input className="form-input" value={pcInput} onChange={e=>setPcInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPc()} placeholder="4-digit postcode" style={{ width:'150px' }}/>
              <button className="btn btn-outline btn-sm" onClick={addPc}><i className="ph-bold ph-plus"/> Add</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {(form.delivery_postcodes||[]).map(pc=>(
                <span key={pc} className="tag">{pc}<button onClick={()=>removePc(pc)}>×</button></span>
              ))}
              {!(form.delivery_postcodes||[]).length && <span style={{ fontSize:'0.8rem', color:'#9CA3AF' }}>No postcodes added yet</span>}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="ph-bold ph-spinner spin"/> Saving…</> : (isNew ? 'Add Chef' : 'Save Changes')}
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
        <p style={{ fontSize:'0.875rem', color:'#5A5D66', marginBottom:'20px' }}>This will permanently remove the chef and all associated data. This action cannot be undone.</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}><i className="ph-bold ph-trash"/> Delete</button>
        </div>
      </div>
    </div>
  );
}

function ChefsPage({ chefs, setChefs }) {
  var [modal, setModal]   = useState(null); // null | { mode:'add'|'edit', chef }
  var [delChef, setDel]   = useState(null);
  var [search, setSearch] = useState('');
  var [tab, setTab]       = useState('chefs'); // 'chefs' | 'approvals'

  var { pendingMenus } = window.ADM;
  var [menus, setMenus]   = useState(pendingMenus);

  var filtered = chefs.filter(c =>
    !search || c.chef_name.toLowerCase().includes(search.toLowerCase()) ||
    c.cuisine_type.toLowerCase().includes(search.toLowerCase())
  );

  var handleSave = (form) => {
    var isNew = !form.chef_id;
    var updated;
    if (isNew) {
      var newId = Math.max(...chefs.map(c=>c.chef_id), 0) + 1;
      updated = [...chefs, { ...form, chef_id: newId, currentWeek: form.currentWeek||{}, nextWeek: form.nextWeek||{} }];
    } else {
      updated = chefs.map(c => c.chef_id === form.chef_id ? form : c);
    }
    setChefs(updated);
    window.ADM.saveChefs(updated);
    setModal(null);
  };

  var handleDelete = () => {
    var updated = chefs.filter(c => c.chef_id !== delChef.chef_id);
    setChefs(updated);
    window.ADM.saveChefs(updated);
    setDel(null);
  };

  var handleMenuAction = (menuId, action) => {
    setMenus(ms => ms.map(m => m.id === menuId ? { ...m, status: action } : m));
  };

  var newChef = {
    chef_name:'', cuisine_type:'', price_per_week:'', rating:4.8,
    bio:'', highlights:[], delivery_postcodes:[], status:'Active',
    food_image:'', avatar:'', currentWeek:{}, nextWeek:{},
  };

  var statusBadge = s => s === 'Active'
    ? <span className="badge badge-green"><i className="ph-fill ph-circle" style={{fontSize:'0.5rem'}}/>{s}</span>
    : <span className="badge badge-yellow">{s}</span>;

  var menuBadge = s => ({
    pending:  <span className="badge badge-yellow">Pending</span>,
    approved: <span className="badge badge-green">Approved</span>,
    rejected: <span className="badge badge-red">Rejected</span>,
  }[s] || <span className="badge badge-gray">{s}</span>);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Chef Management</h1>
          <p className="section-subtitle">{chefs.length} chefs registered · {chefs.filter(c=>(c.status||'Active')==='Active').length} active</p>
        </div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div className="tab-bar">
            <button className={`tab-pill ${tab==='chefs'?'active':''}`} onClick={()=>setTab('chefs')}>Chefs</button>
            <button className={`tab-pill ${tab==='approvals'?'active':''}`} onClick={()=>setTab('approvals')}>
              Menu Approvals
              {menus.filter(m=>m.status==='pending').length > 0 && (
                <span style={{ marginLeft:'6px', background:'#D0342C', color:'white', borderRadius:'10px', fontSize:'0.65rem', padding:'1px 6px', fontWeight:700 }}>
                  {menus.filter(m=>m.status==='pending').length}
                </span>
              )}
            </button>
          </div>
          {tab==='chefs' && (
            <button className="btn btn-primary" onClick={()=>setModal({mode:'add', chef:{...newChef}})}>
              <i className="ph-bold ph-plus"/> Add Chef
            </button>
          )}
        </div>
      </div>

      {tab === 'chefs' && (
        <>
          <div style={{ marginBottom:'16px' }}>
            <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chefs…"/>
          </div>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Chef</th><th>Cuisine</th><th>Price/Week</th><th>Rating</th>
                  <th>Subscribers</th><th>Postcodes</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  var subCount = window.ADM.mockSubscribers.filter(s=>s.chef_id===c.chef_id).length;
                  return (
                    <tr key={c.chef_id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          {c.avatar
                            ? <img src={c.avatar} alt={c.chef_name} style={{ width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover' }}/>
                            : <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#F4F4F4', display:'flex', alignItems:'center', justifyContent:'center' }}><i className="ph-fill ph-user" style={{ color:'#9CA3AF' }}/></div>
                          }
                          <div>
                            <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{c.chef_name}</div>
                            <div style={{ fontSize:'0.72rem', color:'#9CA3AF', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.bio?.slice(0,50)}{c.bio?.length>50?'…':''}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-blue">{c.cuisine_type}</span></td>
                      <td style={{ fontWeight:700 }}>${c.price_per_week}</td>
                      <td>⭐ {c.rating}</td>
                      <td>{subCount}</td>
                      <td>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                          {(c.delivery_postcodes||[]).slice(0,3).map(p=><span key={p} className="badge badge-gray">{p}</span>)}
                          {(c.delivery_postcodes||[]).length > 3 && <span className="badge badge-gray">+{c.delivery_postcodes.length-3}</span>}
                        </div>
                      </td>
                      <td>{statusBadge(c.status||'Active')}</td>
                      <td>
                        <div style={{ display:'flex', gap:'6px' }}>
                          <button className="btn-icon" title="Edit" onClick={()=>setModal({mode:'edit', chef:{...c}})}>
                            <i className="ph-bold ph-pencil"/>
                          </button>
                          <button className="btn-icon" title="Toggle status" onClick={()=>{
                            var upd = chefs.map(ch=>ch.chef_id===c.chef_id?{...ch,status:(c.status||'Active')==='Active'?'Paused':'Active'}:ch);
                            setChefs(upd); window.ADM.saveChefs(upd);
                          }}>
                            <i className={`ph-bold ${(c.status||'Active')==='Active'?'ph-pause':'ph-play'}`}/>
                          </button>
                          <button className="btn-icon" title="Delete" style={{ color:'#D0342C' }} onClick={()=>setDel(c)}>
                            <i className="ph-bold ph-trash"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={8} style={{ textAlign:'center', color:'#9CA3AF', padding:'32px' }}>No chefs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'approvals' && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <table className="data-table">
            <thead>
              <tr><th>Chef</th><th>Cuisine</th><th>Week</th><th>Submitted</th><th>Dishes</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {menus.map(m=>(
                <tr key={m.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <img src={m.photo} alt={m.chef_name} style={{ width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover' }}/>
                      <span style={{ fontWeight:600 }}>{m.chef_name}</span>
                    </div>
                  </td>
                  <td>{m.cuisine}</td>
                  <td style={{ fontWeight:600 }}>{m.week}</td>
                  <td style={{ color:'#9CA3AF' }}>{m.submitted}</td>
                  <td>{m.dishes} dishes</td>
                  <td>{menuBadge(m.status)}</td>
                  <td>
                    {m.status === 'pending' ? (
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button className="btn btn-success btn-sm" onClick={()=>handleMenuAction(m.id,'approved')}>
                          <i className="ph-bold ph-check"/> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={()=>handleMenuAction(m.id,'rejected')}>
                          <i className="ph-bold ph-x"/> Reject
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-outline btn-sm" onClick={()=>handleMenuAction(m.id,'pending')}>Reset</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <ChefModal chef={modal.chef} onSave={handleSave} onClose={()=>setModal(null)}/>}
      {delChef && <DeleteConfirm chef={delChef} onConfirm={handleDelete} onCancel={()=>setDel(null)}/>}
    </div>
  );
}

Object.assign(window.ADM, { ChefsPage });
