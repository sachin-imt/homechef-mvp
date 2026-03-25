// ─── SUBSCRIBERS PAGE ───
window.ADM = window.ADM || {};

function SubscribersPage({ chefs }) {
  var [subs]        = React.useState(window.ADM.subscribers || []);
  var [search, setSearch]   = React.useState('');
  var [filterChef, setFC]   = React.useState('all');
  var [filterWeek, setFW]   = React.useState('all');
  var [filterPay,  setFP]   = React.useState('all');
  var [selected,   setSel]  = React.useState(null);

  var weeks   = [...new Set(subs.map(s=>s.week))];
  var chefIds = [...new Set(subs.map(s=>s.chef_id))];

  var filtered = subs.filter(s => {
    if (filterChef !== 'all' && s.chef_id !== parseInt(filterChef)) return false;
    if (filterWeek !== 'all' && s.week !== filterWeek) return false;
    if (filterPay  !== 'all' && s.payment !== filterPay) return false;
    if (search) {
      var q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q);
    }
    return true;
  });

  var payBadge = p => p === 'Paid'
    ? <span className="badge badge-green"><i className="ph-fill ph-check-circle" style={{fontSize:'0.7rem'}}/>{p}</span>
    : <span className="badge badge-yellow">{p}</span>;

  var delBadge = d => ({
    Delivered: <span className="badge badge-green">Delivered</span>,
    Scheduled: <span className="badge badge-blue">Scheduled</span>,
    Pending:   <span className="badge badge-yellow">Pending</span>,
  }[d] || <span className="badge badge-gray">{d}</span>);

  // summary stats
  var paid    = filtered.filter(s=>s.payment==='Paid').length;
  var pending = filtered.filter(s=>s.payment==='Pending').length;

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Subscribers</h1>
          <p className="section-subtitle">{filtered.length} of {subs.length} subscribers shown</p>
        </div>
        <button className="btn btn-outline" onClick={()=>{
          var csv = ['ID,Name,Email,Phone,Chef,Suburb,Postcode,Week,Payment,Delivery,Dietary,Joined',
            ...filtered.map(s=>[s.id,s.name,s.email,s.phone,s.chef_name,s.suburb,s.postcode,s.week,s.payment,s.delivery,s.dietary||'',s.created].join(','))
          ].join('\n');
          var a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='subscribers.csv'; a.click();
        }}>
          <i className="ph-bold ph-export"/> Export CSV
        </button>
      </div>

      {/* Summary mini cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Total shown', value: filtered.length, icon:'ph-fill ph-users' },
          { label:'Paid',        value: paid,             icon:'ph-fill ph-check-circle', color:'#3A813D' },
          { label:'Pending',     value: pending,          icon:'ph-fill ph-clock',         color:'#F59E0B' },
          { label:'Revenue (est)', value: `$${filtered.filter(s=>s.payment==='Paid').reduce((a,s)=>{
              var c=chefs.find(c=>c.chef_id===s.chef_id); return a+(c?c.price_per_week:0);
            },0)}`, icon:'ph-fill ph-currency-circle-dollar', color:'#FACA50' },
        ].map(c=>(
          <div key={c.label} className="stat-card card-sm" style={{ flexDirection:'row', alignItems:'center', gap:'12px' }}>
            <i className={c.icon} style={{ fontSize:'1.4rem', color: c.color||'#9CA3AF' }}/>
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
        <select className="form-input" value={filterWeek} onChange={e=>setFW(e.target.value)} style={{ width:'160px' }}>
          <option value="all">All Weeks</option>
          {weeks.map(w=><option key={w} value={w}>{w}</option>)}
        </select>
        <select className="form-input" value={filterPay} onChange={e=>setFP(e.target.value)} style={{ width:'140px' }}>
          <option value="all">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        {(search||filterChef!=='all'||filterWeek!=='all'||filterPay!=='all') && (
          <button className="btn btn-outline btn-sm" onClick={()=>{setSearch('');setFC('all');setFW('all');setFP('all');}}>
            <i className="ph-bold ph-x"/> Clear
          </button>
        )}
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Contact</th><th>Chef</th>
              <th>Suburb</th><th>Week</th><th>Payment</th><th>Delivery</th><th>Dietary</th><th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s=>(
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
                <td style={{ fontSize:'0.82rem', whiteSpace:'nowrap' }}>{s.week}</td>
                <td>{payBadge(s.payment)}</td>
                <td>{delBadge(s.delivery)}</td>
                <td style={{ fontSize:'0.8rem', color: s.dietary?'#111':'#CCC' }}>{s.dietary||'—'}</td>
                <td style={{ fontSize:'0.78rem', color:'#9CA3AF', whiteSpace:'nowrap' }}>{s.created}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={10} style={{ textAlign:'center', color:'#9CA3AF', padding:'32px' }}>No subscribers match the filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSel(null)}>
          <div className="modal" style={{ maxWidth:'420px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize:'1rem', fontWeight:800, margin:0 }}>Subscriber Details</h2>
              <button className="btn-icon" onClick={()=>setSel(null)}><i className="ph-bold ph-x"/></button>
            </div>
            <div className="modal-body">
              {[
                ['Name',     selected.name],
                ['Email',    selected.email],
                ['Phone',    selected.phone],
                ['Chef',     selected.chef_name],
                ['Suburb',   `${selected.suburb} ${selected.postcode}`],
                ['Week',     selected.week],
                ['Payment',  selected.payment],
                ['Delivery', selected.delivery],
                ['Dietary',  selected.dietary||'None'],
                ['Joined',   selected.created],
              ].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F4F4F4', fontSize:'0.875rem' }}>
                  <span style={{ color:'#5A5D66', fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:600, color:'#111', textAlign:'right' }}>{v}</span>
                </div>
              ))}
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
