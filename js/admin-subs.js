// ─── SUBSCRIBERS PAGE ───
window.ADM = window.ADM || {};

function SubscribersPage({ chefs }) {
  var [subs, setSubs]           = React.useState(() => window.ADM.subscribers || []);
  var [search, setSearch]       = React.useState('');
  var [filterChef, setFC]       = React.useState('all');
  var [filterPay,  setFP]       = React.useState('all');
  var [selected,   setSel]      = React.useState(null);

  var persist = (updated) => {
    setSubs(updated);
    window.ADM.subscribers = updated;
    window.ADM.saveSubscribers(updated);
  };

  var confirmPayment = (subId, week) => {
    var updated = subs.map(s => {
      if (s.id !== subId) return s;
      return {
        ...s,
        payments: s.payments.map(p =>
          p.week === week
            ? { ...p, status: 'Paid', confirmed: true, confirmed_at: new Date().toISOString().slice(0,10) }
            : p
        ),
      };
    });
    persist(updated);
    // keep detail view in sync
    setSel(updated.find(s => s.id === subId) || null);
  };

  var unconfirmPayment = (subId, week) => {
    var updated = subs.map(s => {
      if (s.id !== subId) return s;
      return {
        ...s,
        payments: s.payments.map(p =>
          p.week === week
            ? { ...p, status: 'Pending', confirmed: false, confirmed_at: null }
            : p
        ),
      };
    });
    persist(updated);
    setSel(updated.find(s => s.id === subId) || null);
  };

  var filtered = subs.filter(s => {
    if (filterChef !== 'all' && s.chef_id !== parseInt(filterChef)) return false;
    if (filterPay === 'all_paid'     && !s.payments.every(p => p.confirmed)) return false;
    if (filterPay === 'has_pending'  && !s.payments.some(p => !p.confirmed))  return false;
    if (search) {
      var q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q);
    }
    return true;
  });

  // summary stats
  var confirmedRevenue = subs.reduce((total, s) => {
    var chef = chefs.find(c => c.chef_id === s.chef_id);
    if (!chef) return total;
    var confirmedWeeks = s.payments.filter(p => p.confirmed).length;
    return total + confirmedWeeks * chef.price_per_week;
  }, 0);

  var pendingCount = subs.reduce((t, s) => t + s.payments.filter(p => !p.confirmed).length, 0);

  var payBadge = (p) => p.confirmed
    ? <span className="badge badge-green" style={{ fontSize:'0.68rem' }}><i className="ph-fill ph-check-circle" style={{ fontSize:'0.65rem' }}/>Confirmed</span>
    : <span className="badge badge-yellow" style={{ fontSize:'0.68rem' }}>Pending</span>;

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Subscribers</h1>
          <p className="section-subtitle">{subs.length} subscriber{subs.length!==1?'s':''} · {pendingCount} payment{pendingCount!==1?'s':''} awaiting confirmation</p>
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
          { label:'Total Subscribers', value: subs.length,          icon:'ph-fill ph-users',                  color:'#9CA3AF' },
          { label:'Payments Confirmed', value: subs.reduce((t,s)=>t+s.payments.filter(p=>p.confirmed).length,0), icon:'ph-fill ph-check-circle', color:'#3A813D' },
          { label:'Payments Pending',  value: pendingCount,          icon:'ph-fill ph-clock',                  color:'#F59E0B' },
          { label:'Confirmed Revenue', value: `$${confirmedRevenue}`, icon:'ph-fill ph-currency-circle-dollar', color:'#FACA50' },
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
                <th>Suburb</th><th>Dietary</th><th>Starting Week</th><th>Payments</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                var conf = s.payments.filter(p=>p.confirmed).length;
                var pend = s.payments.filter(p=>!p.confirmed).length;
                return (
                  <tr key={s.id}>
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
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={()=>setSel(s)}>
                        View / Confirm
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

      {/* Detail + payment confirmation drawer */}
      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSel(null)}>
          <div className="modal" style={{ maxWidth:'480px' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>{selected.name}</h2>
                <p style={{ fontSize:'0.78rem', color:'#9CA3AF', margin:0 }}>{selected.chef_name} · Started {selected.starting_week}</p>
              </div>
              <button className="btn-icon" onClick={()=>setSel(null)}><i className="ph-bold ph-x"/></button>
            </div>
            <div className="modal-body">
              {/* Contact details */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'20px' }}>
                {[
                  ['Email',   selected.email],
                  ['Phone',   selected.phone],
                  ['Suburb',  `${selected.suburb} ${selected.postcode}`],
                  ['Dietary', selected.dietary||'None'],
                  ['Joined',  selected.created],
                ].map(([l,v])=>(
                  <div key={l} style={{ fontSize:'0.8rem' }}>
                    <div style={{ color:'#9CA3AF', marginBottom:'2px' }}>{l}</div>
                    <div style={{ fontWeight:600, color:'#111' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Weekly payments */}
              <h4 style={{ fontSize:'0.85rem', fontWeight:700, marginBottom:'10px', color:'#111' }}>Weekly Payments</h4>
              {selected.payments.length === 0 && (
                <p style={{ fontSize:'0.85rem', color:'#9CA3AF' }}>No payment records yet.</p>
              )}
              {selected.payments.map((p, i) => {
                var chef = chefs.find(c => c.chef_id === selected.chef_id);
                var amount = chef ? chef.price_per_week : 0;
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:'8px', background: p.confirmed?'#F0FDF4':'#FFFBEB', border:`1px solid ${p.confirmed?'#BBF7D0':'#FDE68A'}`, marginBottom:'8px' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{p.week}</div>
                      <div style={{ fontSize:'0.75rem', color:'#9CA3AF' }}>
                        ${amount} · {p.confirmed ? `Confirmed ${p.confirmed_at}` : 'Awaiting confirmation'}
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      {payBadge(p)}
                      {p.confirmed
                        ? <button className="btn btn-outline btn-sm" onClick={()=>unconfirmPayment(selected.id, p.week)} style={{ fontSize:'0.72rem' }}>Undo</button>
                        : <button className="btn btn-success btn-sm" onClick={()=>confirmPayment(selected.id, p.week)}>
                            <i className="ph-bold ph-check"/> Confirm
                          </button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setSel(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window.ADM, { SubscribersPage });
