// ─── DASHBOARD ───
window.ADM = window.ADM || {};
var { useState } = React;

// ── Mini SVG Line Chart ──
function LineChart({ data, color = '#FACA50', height = 120 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: height + 'px', display:'flex', alignItems:'center', justifyContent:'center', color:'#CCC', fontSize:'0.85rem' }}>
        No data yet
      </div>
    );
  }
  var w = 600, h = height, padX = 40, padY = 16;
  var cW = w - padX * 2, cH = h - padY * 2;
  var max = Math.max(...data.map(d => d.v), 1);
  var pts = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * cW,
    y: padY + cH - (d.v / max) * cH,
  }));
  var linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  var areaPath = `${linePath} L${pts[pts.length-1].x.toFixed(1)},${padY+cH} L${pts[0].x.toFixed(1)},${padY+cH}Z`;
  var step = Math.ceil(data.length / 8);
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', display:'block', overflow:'visible' }}>
        {[0, 0.5, 1].map(t => (
          <g key={t}>
            <line x1={padX} y1={padY + cH * (1-t)} x2={padX+cW} y2={padY + cH * (1-t)} stroke="#F0F0F0" strokeWidth="1"/>
            <text x={padX-6} y={padY + cH * (1-t) + 4} textAnchor="end" fontSize="10" fill="#CCC">{Math.round(max * t)}</text>
          </g>
        ))}
        <path d={areaPath} fill={color} fillOpacity="0.08"/>
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.filter((_, i) => i % step === 0 || i === data.length-1).map((p, idx) => {
          var di = idx * step;
          return (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="3.5" fill={color}/>
              <text x={p.x} y={padY+cH+14} textAnchor="middle" fontSize="9" fill="#AAA">{data[di]?.lbl || ''}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Bar Chart ──
function BarChart({ bars }) {
  if (!bars || bars.every(b => b.v === 0)) {
    return (
      <div style={{ height:'130px', display:'flex', alignItems:'center', justifyContent:'center', color:'#CCC', fontSize:'0.85rem' }}>
        No subscribers yet
      </div>
    );
  }
  var max = Math.max(...bars.map(b => b.v), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'130px', padding:'0 4px 24px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', height:'100%', justifyContent:'flex-end' }}>
          <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#111' }}>{b.v}</span>
          <div style={{ width:'100%', background:'#FACA50', borderRadius:'4px 4px 0 0', height:`${(b.v/max)*90}px`, minHeight: b.v > 0 ? '4px' : '0', transition:'height 0.4s ease' }}/>
          <span style={{ fontSize:'0.68rem', color:'#9CA3AF', textAlign:'center', maxWidth:'64px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Ratio bar ──
function RatioBar({ value, total, color = '#FACA50', label }) {
  var pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom:'10px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'0.8rem', color:'#5A5D66' }}>{label}</span>
        <span style={{ fontSize:'0.8rem', fontWeight:700, color:'#111' }}>{value} <span style={{ color:'#9CA3AF', fontWeight:400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height:'6px', background:'#F4F4F4', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'3px', transition:'width 0.4s' }}/>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 16px', color:'#CCC', gap:'8px' }}>
      <i className={icon} style={{ fontSize:'2rem' }}/>
      <span style={{ fontSize:'0.85rem' }}>{text}</span>
    </div>
  );
}

function DashboardPage({ chefs, subscribers }) {
  var activeChefs = chefs.filter(c => (c.status || 'Active').toLowerCase() === 'active').length;
  var totalSubs   = subscribers.length;

  // Payments: each subscriber has a payments[] array with { week, confirmed }
  var confirmedPayments = subscribers.reduce((t, s) => t + (s.payments||[]).filter(p=>p.confirmed).length, 0);
  var pendingPayments   = subscribers.reduce((t, s) => t + (s.payments||[]).filter(p=>!p.confirmed).length, 0);

  var confirmedRevenue = subscribers.reduce((total, s) => {
    var chef = chefs.find(c => c.chef_id === s.chef_id);
    if (!chef) return total;
    return total + (s.payments||[]).filter(p=>p.confirmed).length * chef.price_per_week;
  }, 0);

  var platformFee = Math.round(confirmedRevenue * 0.2);

  var chefSubCounts = chefs.map(c => ({
    label: c.chef_name.replace('Chef ', ''),
    v: subscribers.filter(s => s.chef_id === c.chef_id).length,
  }));

  var paymentBreakdown = [
    { label: 'Confirmed', v: confirmedPayments },
    { label: 'Pending',   v: pendingPayments   },
  ];

  var recentActivity = subscribers.slice(-6).reverse().map(s => ({
    icon:'ph-fill ph-user-plus', color:'#3A813D',
    text: `${s.name} subscribed to ${s.chef_name}`,
    time: s.created,
  }));

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Overview of your Home Meal marketplace</p>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[
          { label:'Total Subscribers',  value: totalSubs,            delta: totalSubs === 0 ? 'No subscribers yet' : `${totalSubs} active`, cls:'neutral', icon:'ph-fill ph-users-three' },
          { label:'Active Chefs',       value: activeChefs,          delta: `${chefs.length - activeChefs} paused`,      cls:'neutral', icon:'ph-fill ph-chef-hat' },
          { label:'Confirmed Revenue',  value: `$${confirmedRevenue}`, delta: `${confirmedPayments} week payment${confirmedPayments!==1?'s':''} confirmed`, cls:'neutral', icon:'ph-fill ph-currency-circle-dollar' },
          { label:'Platform Fee (20%)', value: `$${platformFee}`,    delta: pendingPayments > 0 ? `${pendingPayments} pending confirmation` : 'All payments confirmed', cls:'neutral', icon:'ph-fill ph-trend-up' },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
              <span className="stat-label">{card.label}</span>
              <i className={card.icon} style={{ fontSize:'1.1rem', color:'#FACA50' }}/>
            </div>
            <span className="stat-value">{card.value}</span>
            <span className={`stat-delta ${card.cls}`}>{card.delta}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {/* Subscribers by chef */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Subscribers by Chef</h3>
          <BarChart bars={chefSubCounts}/>
        </div>

        {/* Payment status */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Payment Status</h3>
          {(confirmedPayments + pendingPayments) > 0 ? (
            <>
              {paymentBreakdown.map(p => (
                <RatioBar key={p.label} label={p.label} value={p.v} total={confirmedPayments + pendingPayments}
                  color={p.label==='Confirmed'?'#3A813D':'#F59E0B'}/>
              ))}
              <div style={{ marginTop:'16px', display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#5A5D66', borderTop:'1px solid #F4F4F4', paddingTop:'12px' }}>
                <span>Total payment records</span><strong style={{ color:'#111' }}>{confirmedPayments + pendingPayments}</strong>
              </div>
            </>
          ) : (
            <EmptyState icon="ph-fill ph-credit-card" text="No payments yet"/>
          )}
        </div>

        {/* Cuisine distribution */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Subscribers by Cuisine</h3>
          {totalSubs > 0 ? (() => {
            var byCuisine = {};
            chefs.forEach(c => {
              var key = c.cuisine_type || 'Other';
              var count = subscribers.filter(s => s.chef_id === c.chef_id).length;
              byCuisine[key] = (byCuisine[key] || 0) + count;
            });
            return Object.entries(byCuisine).map(([cuisine, count]) => (
              <RatioBar key={cuisine} label={cuisine} value={count} total={totalSubs} color="#FACA50"/>
            ));
          })() : (
            <EmptyState icon="ph-fill ph-bowl-food" text="No subscribers yet"/>
          )}
        </div>
      </div>

      {/* Recent activity + chefs overview */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'16px' }}>
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Recent Activity</h3>
          {recentActivity.length > 0 ? recentActivity.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start', paddingBottom:'12px', marginBottom:'12px', borderBottom: i < recentActivity.length-1 ? '1px solid #F4F4F4' : 'none' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(58,129,61,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className={a.icon} style={{ fontSize:'0.9rem', color:a.color }}/>
              </div>
              <div>
                <p style={{ margin:0, fontSize:'0.85rem', color:'#111', fontWeight:500 }}>{a.text}</p>
                <p style={{ margin:0, fontSize:'0.75rem', color:'#9CA3AF' }}>{a.time}</p>
              </div>
            </div>
          )) : (
            <EmptyState icon="ph-fill ph-clock-clockwise" text="No activity yet — subscribers will appear here"/>
          )}
        </div>

        {/* Chefs at a glance */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Chefs at a Glance</h3>
          {chefs.map(c => {
            var count = subscribers.filter(s => s.chef_id === c.chef_id).length;
            var status = c.status || 'Active';
            return (
              <div key={c.chef_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F4F4F4' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {c.avatar
                    ? <img src={c.avatar} alt={c.chef_name} style={{ width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover' }}/>
                    : <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'#F4F4F4', display:'flex', alignItems:'center', justifyContent:'center' }}><i className="ph-fill ph-user" style={{ color:'#9CA3AF' }}/></div>
                  }
                  <div>
                    <div style={{ fontSize:'0.85rem', fontWeight:600 }}>{c.chef_name}</div>
                    <div style={{ fontSize:'0.72rem', color:'#9CA3AF' }}>{c.cuisine_type}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{count} subs</div>
                  <span className={`badge ${status==='Active'?'badge-green':'badge-yellow'}`} style={{ fontSize:'0.65rem' }}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window.ADM, { DashboardPage, LineChart, BarChart });
