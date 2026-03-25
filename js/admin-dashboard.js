// ─── DASHBOARD + CHARTS ───
window.ADM = window.ADM || {};
var { useState, useMemo } = React;

// ── Mini SVG Line Chart ──
function LineChart({ data, color = '#FACA50', height = 120 }) {
  var w = 600, h = height, padX = 40, padY = 16;
  var cW = w - padX * 2, cH = h - padY * 2;
  var max = Math.max(...data.map(d => d.v), 1);
  var pts = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * cW,
    y: padY + cH - (d.v / max) * cH,
  }));
  var linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  var areaPath = `${linePath} L${pts[pts.length-1].x.toFixed(1)},${padY+cH} L${pts[0].x.toFixed(1)},${padY+cH}Z`;
  var yTicks = [0, 0.5, 1];
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
        {yTicks.map(t => (
          <g key={t}>
            <line x1={padX} y1={padY + cH * (1-t)} x2={padX+cW} y2={padY + cH * (1-t)} stroke="#F0F0F0" strokeWidth="1"/>
            <text x={padX-6} y={padY + cH * (1-t) + 4} textAnchor="end" fontSize="10" fill="#CCC">{Math.round(max * t)}</text>
          </g>
        ))}
        <path d={areaPath} fill={color} fillOpacity="0.08"/>
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.filter((_, i) => i % Math.ceil(data.length / 8) === 0 || i === data.length-1).map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color}/>
            <text x={p.x} y={padY+cH+14} textAnchor="middle" fontSize="9" fill="#AAA">{data[i * Math.ceil(data.length/8)]?.lbl || ''}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Bar Chart ──
function BarChart({ bars }) {
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

// ── Donut / ratio display ──
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

function DashboardPage({ chefs, subscribers }) {
  var { analyticsRaw } = window.ADM;
  var [period, setPeriod] = useState('14');
  var days = parseInt(period);

  var slice = analyticsRaw.slice(-days);

  var totalVisitors   = slice.reduce((a, d) => a + d.visitors, 0);
  var totalNewSubs    = slice.reduce((a, d) => a + d.newSubs, 0);
  var totalUnsubs     = slice.reduce((a, d) => a + d.unsubs, 0);
  var latestTotalSubs = analyticsRaw[analyticsRaw.length-1]?.totalSubs || 0;
  var activeChefs     = chefs.filter(c => (c.status || 'Active') === 'Active').length;
  var weeklyRevenue   = subscribers.filter(s => s.week === 'Mar 24–28').length *
    (chefs.reduce((a, c) => a + (c.price_per_week || 0), 0) / (chefs.length || 1));
  var conversionRate  = totalVisitors ? ((totalNewSubs / totalVisitors) * 100).toFixed(1) : '0.0';

  var visitorData = slice.map((d, i) => ({ v: d.visitors, lbl: i % Math.ceil(days/8) === 0 ? d.date : '' }));
  var subData     = slice.map((d, i) => ({ v: d.newSubs,  lbl: i % Math.ceil(days/8) === 0 ? d.date : '' }));

  var chefSubCounts = chefs.map(c => ({
    label: c.chef_name.replace('Chef ', ''),
    v: subscribers.filter(s => s.chef_id === c.chef_id).length,
  }));

  var paymentBreakdown = [
    { label: 'Paid',    v: subscribers.filter(s => s.payment === 'Paid').length },
    { label: 'Pending', v: subscribers.filter(s => s.payment === 'Pending').length },
  ];

  var prevSlice = analyticsRaw.slice(-(days*2), -days);
  var prevVisitors = prevSlice.reduce((a,d)=>a+d.visitors,0);
  var delta = (pct) => pct >= 0 ? `↑ ${pct}% vs prev period` : `↓ ${Math.abs(pct)}% vs prev period`;
  var visitorDelta = prevVisitors ? Math.round(((totalVisitors-prevVisitors)/prevVisitors)*100) : 0;

  var recentActivity = [
    ...subscribers.slice(-5).reverse().map(s => ({
      icon:'ph-fill ph-user-plus', color:'#3A813D',
      text: `${s.name} subscribed to ${s.chef_name}`, time: s.created,
    })),
  ].slice(0, 6);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Overview of your CelebChef marketplace</p>
        </div>
        <div className="tab-bar">
          {[['7','7 days'],['14','14 days'],['30','30 days']].map(([v,l]) => (
            <button key={v} className={`tab-pill ${period===v?'active':''}`} onClick={()=>setPeriod(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
        {[
          { label:'Total Subscribers', value: latestTotalSubs, delta:`↑ ${totalNewSubs} new this period`, cls:'up', icon:'ph-fill ph-users-three' },
          { label:'Site Visitors', value: totalVisitors.toLocaleString(), delta: delta(visitorDelta), cls: visitorDelta>=0?'up':'down', icon:'ph-fill ph-eye' },
          { label:'Active Chefs', value: activeChefs, delta:`${chefs.length - activeChefs} paused`, cls:'neutral', icon:'ph-fill ph-chef-hat' },
          { label:'Conversion Rate', value: `${conversionRate}%`, delta:`${totalNewSubs} subscribed / ${totalVisitors} visitors`, cls:'neutral', icon:'ph-fill ph-trend-up' },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
              <span className="stat-label">{card.label}</span>
              <i className={card.icon} style={{ fontSize:'1.1rem', color:'#FACA50' }}></i>
            </div>
            <span className="stat-value">{card.value}</span>
            <span className={`stat-delta ${card.cls}`}>{card.delta}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {/* Visitor chart */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:0 }}>Site Visitors</h3>
            <span style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>Last {days} days</span>
          </div>
          <LineChart data={visitorData} color="#FACA50"/>
        </div>
        {/* Subs chart */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:0 }}>New Subscriptions</h3>
            <span style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>Last {days} days</span>
          </div>
          <LineChart data={subData} color="#3A813D" height={120}/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginBottom:'24px' }}>
        {/* Subs by chef */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Subscribers by Chef</h3>
          <BarChart bars={chefSubCounts}/>
        </div>
        {/* Payment breakdown */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Payment Status</h3>
          {paymentBreakdown.map(p => (
            <RatioBar key={p.label} label={p.label} value={p.v} total={subscribers.length}
              color={p.label==='Paid'?'#3A813D':'#F59E0B'}/>
          ))}
          <div style={{ marginTop:'16px', display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'#5A5D66', borderTop:'1px solid #F4F4F4', paddingTop:'12px' }}>
            <span>Total subscribers</span><strong style={{ color:'#111' }}>{subscribers.length}</strong>
          </div>
        </div>
        {/* Cuisine distribution */}
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Subscribers by Cuisine</h3>
          {chefs.map(c => {
            var count = subscribers.filter(s => s.chef_id === c.chef_id).length;
            return <RatioBar key={c.chef_id} label={c.cuisine_type} value={count} total={subscribers.length} color="#FACA50"/>;
          })}
        </div>
      </div>

      {/* Recent activity + weekly revenue */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'16px' }}>
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Recent Activity</h3>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start', paddingBottom:'12px', marginBottom:'12px', borderBottom: i < recentActivity.length-1 ? '1px solid #F4F4F4' : 'none' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(58,129,61,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className={a.icon} style={{ fontSize:'0.9rem', color:a.color }}></i>
              </div>
              <div>
                <p style={{ margin:0, fontSize:'0.85rem', color:'#111', fontWeight:500 }}>{a.text}</p>
                <p style={{ margin:0, fontSize:'0.75rem', color:'#9CA3AF' }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize:'0.95rem', fontWeight:700, margin:'0 0 16px' }}>Weekly Revenue Estimate</h3>
          {chefs.filter(c=>(c.status||'Active')==='Active').map(c => {
            var count = subscribers.filter(s=>s.chef_id===c.chef_id && s.week==='Mar 24–28').length;
            var rev = count * (c.price_per_week || 0);
            return (
              <div key={c.chef_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #F4F4F4' }}>
                <span style={{ fontSize:'0.85rem', color:'#111' }}>{c.chef_name}</span>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:'0.9rem', fontWeight:700, color:'#111' }}>${rev}</span>
                  <span style={{ fontSize:'0.72rem', color:'#9CA3AF', marginLeft:'4px' }}>{count} subs</span>
                </div>
              </div>
            );
          })}
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'12px', marginTop:'4px' }}>
            <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#111' }}>Platform fee (20%)</span>
            <span style={{ fontSize:'0.9rem', fontWeight:800, color:'#FACA50' }}>
              ${Math.round(subscribers.filter(s=>s.week==='Mar 24–28').reduce((a,s)=>{
                var chef=chefs.find(c=>c.chef_id===s.chef_id);
                return a+(chef?chef.price_per_week*0.2:0);
              },0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window.ADM, { DashboardPage, LineChart, BarChart });
