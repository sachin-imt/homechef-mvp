// ─── CONTENT MANAGEMENT + SETTINGS ───
window.ADM = window.ADM || {};

var CONTENT_FIELDS = [
  { section: 'Hero Banner', fields: [
    { key:'hero_badge',       label:'Hero Badge Text',    type:'text'     },
    { key:'hero_line1',       label:'Headline Line 1',    type:'text'     },
    { key:'hero_line2',       label:'Headline Line 2 (yellow)', type:'text' },
    { key:'hero_line3',       label:'Headline Line 3',    type:'text'     },
    { key:'hero_subtext',     label:'Sub-Headline',       type:'textarea' },
    { key:'hero_stat1',       label:'Stat 1 Value',       type:'text'     },
    { key:'hero_stat1_label', label:'Stat 1 Label',       type:'text'     },
    { key:'hero_stat2',       label:'Stat 2 Value',       type:'text'     },
    { key:'hero_stat2_label', label:'Stat 2 Label',       type:'text'     },
    { key:'hero_stat3',       label:'Stat 3 Value',       type:'text'     },
    { key:'hero_stat3_label', label:'Stat 3 Label',       type:'text'     },
  ]},
  { section: 'How It Works — Customers', fields: [
    { key:'how_c1_title', label:'Step 1 Title', type:'text'     },
    { key:'how_c1_desc',  label:'Step 1 Desc',  type:'textarea' },
    { key:'how_c2_title', label:'Step 2 Title', type:'text'     },
    { key:'how_c2_desc',  label:'Step 2 Desc',  type:'textarea' },
    { key:'how_c3_title', label:'Step 3 Title', type:'text'     },
    { key:'how_c3_desc',  label:'Step 3 Desc',  type:'textarea' },
  ]},
  { section: 'How It Works — Chefs', fields: [
    { key:'how_ch1_title', label:'Step 1 Title', type:'text'     },
    { key:'how_ch1_desc',  label:'Step 1 Desc',  type:'textarea' },
    { key:'how_ch2_title', label:'Step 2 Title', type:'text'     },
    { key:'how_ch2_desc',  label:'Step 2 Desc',  type:'textarea' },
    { key:'how_ch3_title', label:'Step 3 Title', type:'text'     },
    { key:'how_ch3_desc',  label:'Step 3 Desc',  type:'textarea' },
  ]},
  { section: 'Become a Chef Section', fields: [
    { key:'become_headline', label:'Headline',           type:'text'     },
    { key:'become_subtext',  label:'Sub-text',           type:'textarea' },
    { key:'become_earnings', label:'Earnings Highlight', type:'text'     },
  ]},
  { section: 'Footer & Contact', fields: [
    { key:'footer_tagline',  label:'Footer Tagline', type:'textarea' },
    { key:'contact_email',   label:'Contact Email',  type:'text'     },
  ]},
];

function ContentPage({ content, setContent }) {
  var [local,   setLocal]   = React.useState({ ...content });
  var [saved,   setSaved]   = React.useState(false);
  var [openSec, setOpenSec] = React.useState(CONTENT_FIELDS[0].section);

  var handleChange = (k, v) => setLocal(c => ({ ...c, [k]: v }));

  var handleSave = () => {
    setContent(local);
    window.ADM.saveContent(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  var handleReset = () => {
    if (!confirm('Reset all content to defaults?')) return;
    setLocal({ ...window.ADM.defaultContent });
  };

  var isDirty = JSON.stringify(local) !== JSON.stringify(content);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Content Management</h1>
          <p className="section-subtitle">Edit the text displayed on the public-facing website</p>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button className="btn btn-outline" onClick={handleReset}>
            <i className="ph-bold ph-arrow-counter-clockwise"/> Reset Defaults
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!isDirty && !saved}>
            {saved
              ? <><i className="ph-bold ph-check"/> Saved!</>
              : <><i className="ph-bold ph-floppy-disk"/> Save Changes</>
            }
          </button>
        </div>
      </div>

      {isDirty && (
        <div style={{ background:'#FFF3CD', border:'1px solid #FFD700', borderRadius:'8px', padding:'10px 16px', marginBottom:'16px', fontSize:'0.85rem', color:'#856404', display:'flex', alignItems:'center', gap:'8px' }}>
          <i className="ph-fill ph-warning"/> You have unsaved changes
        </div>
      )}

      <div style={{ display:'flex', gap:'16px' }}>
        {/* Section nav */}
        <div style={{ width:'220px', flexShrink:0 }}>
          <div className="card" style={{ padding:'8px 0' }}>
            {CONTENT_FIELDS.map(sec=>(
              <button key={sec.section}
                onClick={()=>setOpenSec(sec.section)}
                style={{
                  display:'block', width:'100%', textAlign:'left', padding:'10px 16px',
                  background: openSec===sec.section ? 'rgba(250,202,80,0.1)' : 'none',
                  border:'none', borderLeft: openSec===sec.section ? '3px solid #FACA50' : '3px solid transparent',
                  cursor:'pointer', fontSize:'0.83rem', fontWeight: openSec===sec.section ? 700 : 500,
                  color: openSec===sec.section ? '#111' : '#5A5D66',
                  fontFamily:'inherit',
                }}>
                {sec.section}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div style={{ flex:1 }}>
          {CONTENT_FIELDS.filter(s=>s.section===openSec).map(sec=>(
            <div key={sec.section} className="card">
              <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'20px' }}>{sec.section}</h3>
              {sec.fields.map(f=>(
                <div key={f.key} className="form-group">
                  <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px', color:'#111' }}>{f.label}</label>
                  {f.type === 'textarea'
                    ? <textarea className="form-input" rows={3} value={local[f.key]||''} onChange={e=>handleChange(f.key,e.target.value)}/>
                    : <input className="form-input" value={local[f.key]||''} onChange={e=>handleChange(f.key,e.target.value)}/>
                  }
                  {local[f.key] !== content[f.key] && (
                    <div style={{ fontSize:'0.72rem', color:'#F59E0B', marginTop:'3px' }}>
                      <i className="ph-fill ph-pencil-simple"/> Modified
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  var [pwd,     setPwd]     = React.useState('');
  var [newPwd,  setNewPwd]  = React.useState('');
  var [confirm, setConfirm] = React.useState('');
  var [msg,     setMsg]     = React.useState(null);

  var handleChangePwd = () => {
    var stored = localStorage.getItem('cc_admin_pwd') || 'admin123';
    if (pwd !== stored) return setMsg({ type:'error', text:'Current password incorrect' });
    if (newPwd.length < 6) return setMsg({ type:'error', text:'New password must be at least 6 characters' });
    if (newPwd !== confirm) return setMsg({ type:'error', text:'Passwords do not match' });
    localStorage.setItem('cc_admin_pwd', newPwd);
    setPwd(''); setNewPwd(''); setConfirm('');
    setMsg({ type:'success', text:'Password updated successfully' });
    setTimeout(()=>setMsg(null), 3000);
  };

  var handleClearData = (key, label) => {
    if (!confirm(`Clear ${label}? This cannot be undone.`)) return;
    localStorage.removeItem(key);
    setMsg({ type:'success', text:`${label} cleared. Refresh to see defaults.` });
    setTimeout(()=>setMsg(null), 3000);
  };

  // ── Export all localStorage data as JSON download ──
  var handleExport = () => {
    var KEYS = ['cc_chefs','cc_content','cc_subscribers','cc_chef_applications','cc_chef_accounts','cc_notifications','cc_pending_menus','cc_postcode_map'];
    var snapshot = { export_date: new Date().toISOString(), version: '1.0' };
    KEYS.forEach(k => {
      try { var v = localStorage.getItem(k); if (v) snapshot[k] = JSON.parse(v); } catch(e) {}
    });
    var blob = new Blob([JSON.stringify(snapshot, null, 2)], { type:'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `celebchef-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    setMsg({ type:'success', text:'Backup downloaded. Save this file to your /backups folder.' });
    setTimeout(()=>setMsg(null), 4000);
  };

  // ── Import from JSON backup ──
  var handleImport = (e) => {
    var file = e.target.files?.[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = (ev) => {
      try {
        var data = JSON.parse(ev.target.result);
        var count = 0;
        Object.entries(data).forEach(([k, v]) => {
          if (k !== 'export_date' && k !== 'version') {
            localStorage.setItem(k, JSON.stringify(v));
            count++;
          }
        });
        setMsg({ type:'success', text:`Restored ${count} data collections. Refresh the page to apply.` });
        setTimeout(()=>setMsg(null), 5000);
      } catch(err) {
        setMsg({ type:'error', text:'Invalid backup file. Please use a file exported from this portal.' });
        setTimeout(()=>setMsg(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="section-subtitle">Admin portal configuration</p>
        </div>
      </div>

      {msg && (
        <div style={{ background: msg.type==='success'?'#D4EDDA':'#F8D7DA', border:`1px solid ${msg.type==='success'?'#B8DFC4':'#F5C6CB'}`, borderRadius:'8px', padding:'10px 16px', marginBottom:'16px', fontSize:'0.875rem', color: msg.type==='success'?'#155724':'#721C24' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Change password */}
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'16px' }}>Change Admin Password</h3>
          <div className="form-group">
            <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px' }}>Current Password</label>
            <input className="form-input" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••"/>
          </div>
          <div className="form-group">
            <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px' }}>New Password</label>
            <input className="form-input" type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="Min 6 characters"/>
          </div>
          <div className="form-group">
            <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px' }}>Confirm New Password</label>
            <input className="form-input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••"/>
          </div>
          <button className="btn btn-primary" onClick={handleChangePwd} style={{ width:'100%' }}>
            <i className="ph-bold ph-lock-key"/> Update Password
          </button>
        </div>

        {/* Data management */}
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'16px' }}>Data Management</h3>
          <p style={{ fontSize:'0.85rem', color:'#5A5D66', marginBottom:'16px' }}>Admin changes are stored in your browser's localStorage. Use these to reset to defaults.</p>
          {[
            { key:'cc_chefs',   label:'Chef Data',       desc:'Resets all chef profiles to defaults' },
            { key:'cc_content', label:'Site Content',    desc:'Resets all text content to defaults'  },
            { key:'cc_admin_pwd', label:'Admin Password', desc:'Resets password to admin123'         },
          ].map(item=>(
            <div key={item.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F4F4F4' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{item.label}</div>
                <div style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>{item.desc}</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={()=>handleClearData(item.key, item.label)}>
                <i className="ph-bold ph-trash"/> Clear
              </button>
            </div>
          ))}
        </div>

        {/* Backup & Restore */}
        <div className="card" style={{ gridColumn:'1/-1' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'4px' }}>Backup & Restore</h3>
          <p style={{ fontSize:'0.82rem', color:'#5A5D66', marginBottom:'20px' }}>Export a full snapshot of all live data (chefs, subscribers, applications, accounts). Restore from any previous export. Run <code style={{ background:'#F4F4F4', padding:'1px 6px', borderRadius:'4px', fontSize:'0.78rem' }}>node scripts/backup.js</code> to generate CSV files automatically.</p>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
            <button className="btn btn-primary" onClick={handleExport}>
              <i className="ph-bold ph-download-simple"/> Export All Data (JSON)
            </button>
            <label className="btn btn-outline" style={{ cursor:'pointer', margin:0 }}>
              <i className="ph-bold ph-upload-simple"/> Import Backup
              <input type="file" accept=".json" onChange={handleImport} style={{ display:'none' }}/>
            </label>
            <span style={{ fontSize:'0.78rem', color:'#9CA3AF' }}>· Exports include chefs, subscribers, applications, chef accounts (passwords excluded from CSV exports)</span>
          </div>
        </div>

        {/* Site info */}
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'16px' }}>Site Information</h3>
          {[
            ['Platform', 'CelebChef Marketplace'],
            ['Version',  '1.0.0 MVP'],
            ['Region',   'Sydney, NSW, Australia'],
            ['Currency', 'AUD ($)'],
            ['Chef cut', '80% of subscription price'],
            ['Platform fee', '20% of subscription price'],
          ].map(([l,v])=>(
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F4F4F4', fontSize:'0.875rem' }}>
              <span style={{ color:'#5A5D66' }}>{l}</span>
              <span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="card">
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'16px' }}>Quick Links</h3>
          {[
            { label:'View Public Site',   href:'app.html',   icon:'ph-bold ph-house'        },
            { label:'Chef Portal',        href:'app.html#portal', icon:'ph-bold ph-cooking-pot' },
            { label:'GitHub Repository',  href:'#',          icon:'ph-bold ph-github-logo'  },
          ].map(l=>(
            <a key={l.label} href={l.href} target="_blank"
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid #F4F4F4', textDecoration:'none', color:'#111', fontSize:'0.875rem' }}>
              <i className={l.icon} style={{ color:'#FACA50', fontSize:'1rem', width:'18px' }}/>
              {l.label}
              <i className="ph-bold ph-arrow-up-right" style={{ marginLeft:'auto', color:'#9CA3AF', fontSize:'0.8rem' }}/>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window.ADM, { ContentPage, SettingsPage });
