// ─── ADMIN ROOT APP ───
window.ADM = window.ADM || {};
var { useState, useEffect } = React;

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{ marginLeft:'auto', background:'#D0342C', color:'white', borderRadius:'10px', fontSize:'0.62rem', padding:'1px 6px', fontWeight:700, minWidth:'18px', textAlign:'center' }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

function LoginGate({ onAuth }) {
  var [pwd, setPwd]   = useState('');
  var [err, setErr]   = useState('');
  var [busy, setBusy] = useState(false);

  var handle = () => {
    setBusy(true);
    setTimeout(() => {
      var stored = localStorage.getItem('cc_admin_pwd') || 'admin123';
      if (pwd === stored) { onAuth(); }
      else { setErr('Incorrect password. Try admin123'); setBusy(false); }
    }, 400);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontWeight:900, fontSize:'1.6rem', letterSpacing:'-0.05em', color:'#111', marginBottom:'6px' }}>
            CELEB<i className="ph-bold ph-x" style={{ color:'#FACA50', fontSize:'1.1rem', margin:'0 1px' }}/>CHEF
          </div>
          <div style={{ fontSize:'0.8rem', fontWeight:700, background:'#FACA50', color:'#111', display:'inline-block', padding:'2px 10px', borderRadius:'20px' }}>ADMIN</div>
          <p style={{ fontSize:'0.875rem', color:'#5A5D66', marginTop:'12px' }}>Sign in to the admin portal</p>
        </div>
        <div className="form-group">
          <label style={{ display:'block', fontWeight:600, fontSize:'0.8rem', marginBottom:'5px' }}>Password</label>
          <input className="form-input" type="password" value={pwd}
            onChange={e=>{setPwd(e.target.value);setErr('');}}
            onKeyDown={e=>e.key==='Enter'&&handle()}
            placeholder="Enter admin password" autoFocus/>
          {err && <p style={{ color:'#D0342C', fontSize:'0.8rem', marginTop:'6px' }}>{err}</p>}
        </div>
        <button className="btn btn-primary" style={{ width:'100%' }} onClick={handle} disabled={busy||!pwd}>
          {busy ? <><i className="ph-bold ph-spinner spin"/> Signing in…</> : 'Sign In →'}
        </button>
        <p style={{ fontSize:'0.75rem', color:'#9CA3AF', textAlign:'center', marginTop:'16px' }}>Default: admin123</p>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage, badges }) {
  var NAV = [
    { id:'dashboard',     label:'Dashboard',          icon:'ph-fill ph-squares-four',   section:'main'   },
    { id:'applications',  label:'Chef Applications',  icon:'ph-fill ph-user-check',      section:'main',  badgeKey:'applications' },
    { id:'chefs',         label:'Active Chefs',        icon:'ph-fill ph-chef-hat',        section:'main'   },
    { id:'menus',         label:'Menu Approvals',      icon:'ph-fill ph-fork-knife',      section:'main',  badgeKey:'pendingMenus' },
    { id:'subscribers',   label:'Subscribers',         icon:'ph-fill ph-users-three',     section:'main',  badgeKey:'newSubscribers' },
    { id:'content',       label:'Content',             icon:'ph-fill ph-article',         section:'manage' },
    { id:'settings',      label:'Settings',            icon:'ph-fill ph-gear',            section:'manage' },
  ];
  var sections = ['main','manage'];
  var sectionLabels = { main:'Overview', manage:'Manage' };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo">CELEB<i className="ph-bold ph-x"/>CHEF<span className="badge">ADMIN</span></div>
      </div>
      <nav className="sidebar-nav">
        {sections.map(sec => (
          <div key={sec}>
            <div className="nav-section-label">{sectionLabels[sec]}</div>
            {NAV.filter(n=>n.section===sec).map(n=>(
              <button key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>setPage(n.id)}>
                <i className={n.icon}/>
                {n.label}
                <Badge count={n.badgeKey ? badges[n.badgeKey] : 0}/>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <a href="app.html" target="_blank"><i className="ph-bold ph-house"/> View public site</a>
        <div style={{ marginTop:'8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:'0.72rem', color:'#333' }}>v1.0 MVP</span>
          <button style={{ background:'none', border:'none', cursor:'pointer', color:'#555', fontSize:'0.75rem', fontFamily:'inherit' }}
            onClick={()=>{ sessionStorage.removeItem('cc_admin_auth'); window.location.reload(); }}>
            <i className="ph-bold ph-sign-out"/> Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

function AdminApp() {
  var [authed,  setAuthed]  = useState(() => !!sessionStorage.getItem('cc_admin_auth'));
  var [page,    setPage]    = useState('dashboard');
  var [chefs,   setChefs]   = useState(window.ADM.adminChefs);
  var [content, setContent] = useState(window.ADM.siteContent);
  // live-reload counters so badges update when data changes
  var [tick, setTick] = useState(0);
  var refresh = () => setTick(t => t+1);

  var handleAuth = () => { sessionStorage.setItem('cc_admin_auth','1'); setAuthed(true); };

  useEffect(() => { window.scrollTo(0,0); }, [page]);

  if (!authed) return <LoginGate onAuth={handleAuth}/>;

  var { DashboardPage, ChefsPage, ApplicationsPage, MenuApprovalsPage, SubscribersPage, ContentPage, SettingsPage } = window.ADM;
  var subscribers  = window.ADM.subscribers || [];
  var applications = window.ADM.applications || [];

  var pendingMenuCount = (() => { try { return (JSON.parse(localStorage.getItem('cc_pending_menus')||'[]')).filter(m=>m.status==='pending').length; } catch(e) { return 0; } })();
  var badges = {
    applications:   applications.filter(a => a.status === 'pending').length,
    newSubscribers: subscribers.filter(s => s.status === 'Interested').length,
    pendingMenus:   pendingMenuCount,
  };

  var mainContent;
  if      (page === 'dashboard')    mainContent = <DashboardPage    chefs={chefs} subscribers={subscribers}/>;
  else if (page === 'applications') mainContent = <ApplicationsPage onUpdate={refresh}/>;
  else if (page === 'chefs')        mainContent = <ChefsPage        chefs={chefs} setChefs={setChefs}/>;
  else if (page === 'menus')        mainContent = <MenuApprovalsPage/>;
  else if (page === 'subscribers')  mainContent = <SubscribersPage  chefs={chefs} onUpdate={refresh}/>;
  else if (page === 'content')      mainContent = <ContentPage      content={content} setContent={setContent}/>;
  else if (page === 'settings')     mainContent = <SettingsPage/>;

  return (
    <div className="admin-layout">
      <Sidebar page={page} setPage={setPage} badges={badges}/>
      <main className="admin-main">{mainContent}</main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp/>);
