// ─── ADMIN ROOT APP ───
window.ADM = window.ADM || {};
var { useState, useEffect } = React;

var NAV_ITEMS = [
  { id:'dashboard',    label:'Dashboard',       icon:'ph-fill ph-squares-four',       section:'main'     },
  { id:'chefs',        label:'Chefs',           icon:'ph-fill ph-chef-hat',            section:'main'     },
  { id:'subscribers',  label:'Subscribers',     icon:'ph-fill ph-users-three',         section:'main'     },
  { id:'content',      label:'Content',         icon:'ph-fill ph-article',             section:'manage'   },
  { id:'settings',     label:'Settings',        icon:'ph-fill ph-gear',                section:'manage'   },
];

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
          <input
            className="form-input" type="password" value={pwd}
            onChange={e=>{setPwd(e.target.value);setErr('');}}
            onKeyDown={e=>e.key==='Enter'&&handle()}
            placeholder="Enter admin password"
            autoFocus
          />
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

function Sidebar({ page, setPage }) {
  var sections = ['main', 'manage'];
  var sectionLabels = { main: 'Overview', manage: 'Manage' };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo">
          CELEB<i className="ph-bold ph-x"/>CHEF
          <span className="badge">ADMIN</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {sections.map(sec => (
          <div key={sec}>
            <div className="nav-section-label">{sectionLabels[sec]}</div>
            {NAV_ITEMS.filter(n=>n.section===sec).map(n=>(
              <button key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>setPage(n.id)}>
                <i className={n.icon}/>
                {n.label}
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
            onClick={()=>{ localStorage.removeItem('cc_admin_auth'); window.location.reload(); }}>
            <i className="ph-bold ph-sign-out"/> Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

function AdminApp() {
  var [authed, setAuthed] = useState(() => !!sessionStorage.getItem('cc_admin_auth'));
  var [page, setPage]     = useState('dashboard');
  var [chefs, setChefs]   = useState(window.ADM.adminChefs);
  var [content, setContent] = useState(window.ADM.siteContent);

  var handleAuth = () => {
    sessionStorage.setItem('cc_admin_auth', '1');
    setAuthed(true);
  };

  useEffect(() => { window.scrollTo(0,0); }, [page]);

  if (!authed) return <LoginGate onAuth={handleAuth}/>;

  var { DashboardPage, ChefsPage, SubscribersPage, ContentPage, SettingsPage } = window.ADM;
  var { mockSubscribers } = window.ADM;

  var mainContent;
  if      (page === 'dashboard')   mainContent = <DashboardPage   chefs={chefs} subscribers={mockSubscribers}/>;
  else if (page === 'chefs')       mainContent = <ChefsPage       chefs={chefs} setChefs={setChefs}/>;
  else if (page === 'subscribers') mainContent = <SubscribersPage chefs={chefs}/>;
  else if (page === 'content')     mainContent = <ContentPage     content={content} setContent={setContent}/>;
  else if (page === 'settings')    mainContent = <SettingsPage/>;

  return (
    <div className="admin-layout">
      <Sidebar page={page} setPage={setPage}/>
      <main className="admin-main">
        {mainContent}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp/>);
