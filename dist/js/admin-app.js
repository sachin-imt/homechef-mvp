// ─── ADMIN ROOT APP ───
window.ADM = window.ADM || {};
var {
  useState,
  useEffect
} = React;
function Badge({
  count
}) {
  if (!count) return null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: '#D0342C',
      color: 'white',
      borderRadius: '10px',
      fontSize: '0.62rem',
      padding: '1px 6px',
      fontWeight: 700,
      minWidth: '18px',
      textAlign: 'center'
    }
  }, count > 9 ? '9+' : count);
}

// ─────────────────────────────────────────────
// Login gate — Admin OR Chef
// ─────────────────────────────────────────────
function LoginGate({
  onAdminAuth,
  onChefAuth
}) {
  var [tab, setTab] = useState('admin');
  var [pwd, setPwd] = useState('');
  var [username, setUser] = useState('');
  var [chefPwd, setChefPwd] = useState('');
  var [showPwd, setShowPwd] = useState(false);
  var [err, setErr] = useState('');
  var [busy, setBusy] = useState(false);
  var handleAdminLogin = () => {
    setBusy(true);
    setErr('');
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'admin',
        password: pwd
      })
    }).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (data.ok) {
        onAdminAuth();
      } else {
        setErr(data.error || 'Incorrect password.');
      }
      setBusy(false);
    }).catch(function () {
      setErr('Login error. Please try again.');
      setBusy(false);
    });
  };
  var handleChefLogin = () => {
    if (!username.trim() || !chefPwd) {
      setErr('Please enter your username and password.');
      return;
    }
    setBusy(true);
    setErr('');
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'chef',
        username: username.trim(),
        chef_password: chefPwd
      })
    }).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (data.ok) {
        var sess = {
          chef_id: data.chef_id,
          chef_name: data.chef_name,
          username: data.username
        };
        sessionStorage.setItem('cc_chef_session', JSON.stringify(sess));
        onChefAuth(sess);
      } else {
        setErr(data.error || 'Invalid username or password. Contact Home Meal for access.');
      }
      setBusy(false);
    }).catch(function () {
      setErr('Login error. Please try again.');
      setBusy(false);
    });
  };
  var lbl = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.8rem',
    marginBottom: '5px'
  };
  var inEr = err ? {
    border: '1.5px solid #D0342C'
  } : {};
  return /*#__PURE__*/React.createElement("div", {
    className: "login-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-card",
    style: {
      maxWidth: '400px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      fontSize: '1.6rem',
      letterSpacing: '-0.05em',
      color: '#111',
      marginBottom: '6px'
    }
  }, "HOME", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bowl-food",
    style: {
      color: '#FACA50',
      fontSize: '1.1rem',
      margin: '0 1px'
    }
  }), "MEALS"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: '#5A5D66'
    }
  }, "Secure portal \u2014 authorised access only")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: '#F4F4F4',
      borderRadius: '10px',
      padding: '4px',
      gap: '4px',
      marginBottom: '24px'
    }
  }, [['admin', 'Admin Portal'], ['chef', 'Chef Portal']].map(([t, l]) => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => {
      setTab(t);
      setErr('');
    },
    style: {
      flex: 1,
      padding: '8px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '0.82rem',
      background: tab === t ? 'white' : 'transparent',
      color: tab === t ? '#111' : '#9CA3AF',
      boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.15s'
    }
  }, l))), tab === 'admin' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Admin Password"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "password",
    value: pwd,
    style: inEr,
    onChange: e => {
      setPwd(e.target.value);
      setErr('');
    },
    onKeyDown: e => e.key === 'Enter' && handleAdminLogin(),
    placeholder: "Enter admin password",
    autoFocus: true
  })), err && /*#__PURE__*/React.createElement("p", {
    style: {
      color: '#D0342C',
      fontSize: '0.8rem',
      margin: '-8px 0 12px'
    }
  }, err), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%'
    },
    onClick: handleAdminLogin,
    disabled: busy || !pwd
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-spinner spin"
  }), " Signing in\u2026") : 'Sign In →')) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F0F9FF',
      border: '1px solid #BAE6FD',
      borderRadius: '8px',
      padding: '10px 14px',
      marginBottom: '16px',
      fontSize: '0.8rem',
      color: '#0369A1'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-info",
    style: {
      marginRight: '6px'
    }
  }), "Credentials are provided by Home Meal. You cannot self-register."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Username"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    value: username,
    onChange: e => {
      setUser(e.target.value);
      setErr('');
    },
    onKeyDown: e => e.key === 'Enter' && handleChefLogin(),
    placeholder: "Your username",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Password"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: showPwd ? 'text' : 'password',
    value: chefPwd,
    style: {
      ...inEr,
      paddingRight: '40px'
    },
    onChange: e => {
      setChefPwd(e.target.value);
      setErr('');
    },
    onKeyDown: e => e.key === 'Enter' && handleChefLogin(),
    placeholder: "Your password"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPwd(s => !s),
    style: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9CA3AF',
      fontSize: '1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph-bold ${showPwd ? 'ph-eye-slash' : 'ph-eye'}`
  })))), err && /*#__PURE__*/React.createElement("p", {
    style: {
      color: '#D0342C',
      fontSize: '0.8rem',
      margin: '-8px 0 12px'
    }
  }, err), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%'
    },
    onClick: handleChefLogin,
    disabled: busy
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-spinner spin"
  }), " Signing in\u2026") : 'Sign In →'))));
}

// ─────────────────────────────────────────────
// Chef view wrapper (shown after chef login)
// ─────────────────────────────────────────────
function ChefView({
  session,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F0F0F',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      fontSize: '1.1rem',
      letterSpacing: '-0.05em',
      color: 'white'
    }
  }, "HOME", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bowl-food",
    style: {
      color: '#FACA50',
      margin: '0 1px'
    }
  }), "MEALS", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.65rem',
      fontWeight: 700,
      background: '#FACA50',
      color: '#111',
      padding: '2px 8px',
      borderRadius: '20px',
      marginLeft: '10px'
    }
  }, "CHEF PORTAL")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      color: '#888'
    }
  }, "Logged in as ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'white'
    }
  }, session.username)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    style: {
      borderColor: '#444',
      color: '#888',
      fontSize: '0.78rem'
    },
    onClick: () => {
      sessionStorage.removeItem('cc_chef_session');
      onLogout();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-sign-out"
  }), " Log out"))), /*#__PURE__*/React.createElement(ChefPortalPage, {
    session: session
  }));
}

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────
function Sidebar({
  page,
  setPage,
  badges
}) {
  var NAV = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'ph-fill ph-squares-four',
    section: 'main'
  }, {
    id: 'applications',
    label: 'Chef Applications',
    icon: 'ph-fill ph-user-check',
    section: 'main',
    badgeKey: 'applications'
  }, {
    id: 'chefs',
    label: 'Active Chefs',
    icon: 'ph-fill ph-chef-hat',
    section: 'main'
  }, {
    id: 'menus',
    label: 'Menu Approvals',
    icon: 'ph-fill ph-fork-knife',
    section: 'main',
    badgeKey: 'pendingMenus'
  }, {
    id: 'subscribers',
    label: 'Subscribers',
    icon: 'ph-fill ph-users-three',
    section: 'main',
    badgeKey: 'newSubscribers'
  }, {
    id: 'content',
    label: 'Content',
    icon: 'ph-fill ph-article',
    section: 'manage'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'ph-fill ph-gear',
    section: 'manage'
  }];
  var sections = ['main', 'manage'];
  var sectionLabels = {
    main: 'Overview',
    manage: 'Manage'
  };
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }, "HOME", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bowl-food"
  }), "MEALS", /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, "ADMIN"))), /*#__PURE__*/React.createElement("nav", {
    className: "sidebar-nav"
  }, sections.map(sec => /*#__PURE__*/React.createElement("div", {
    key: sec
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, sectionLabels[sec]), NAV.filter(n => n.section === sec).map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: `nav-item ${page === n.id ? 'active' : ''}`,
    onClick: () => setPage(n.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: n.icon
  }), n.label, /*#__PURE__*/React.createElement(Badge, {
    count: n.badgeKey ? badges[n.badgeKey] : 0
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, /*#__PURE__*/React.createElement("a", {
    href: "app.html",
    target: "_blank"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-house"
  }), " View public site"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: '#333'
    }
  }, "v1.0 MVP"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#555',
      fontSize: '0.75rem',
      fontFamily: 'inherit'
    },
    onClick: () => {
      sessionStorage.removeItem('cc_admin_auth');
      window.location.reload();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-sign-out"
  }), " Log out"))));
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
function AdminApp() {
  var [authed, setAuthed] = useState(() => !!sessionStorage.getItem('cc_admin_auth'));
  var [chefSession, setChefSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('cc_chef_session'));
    } catch (e) {
      return null;
    }
  });
  var [page, setPage] = useState('dashboard');
  var [loading, setLoading] = useState(false);
  var [chefs, setChefs] = useState([]);
  var [content, setContent] = useState(window.ADM.defaultContent);
  var [subscribers, setSubscribers] = useState([]);
  var [applications, setApplications] = useState([]);
  var [pendingMenus, setPendingMenus] = useState([]);
  // Track when admin last viewed each section — badges auto-clear on open
  var [subsBadgeSeen, setSubsBadgeSeen] = useState(function () {
    return parseInt(sessionStorage.getItem('cc_subs_seen') || '0');
  });
  var [appsBadgeSeen, setAppsBadgeSeen] = useState(function () {
    return parseInt(sessionStorage.getItem('cc_apps_seen') || '0');
  });
  var [menusBadgeSeen, setMenusBadgeSeen] = useState(function () {
    return parseInt(sessionStorage.getItem('cc_menus_seen') || '0');
  });
  var clearSubsBadge = function () {
    var n = Date.now();
    sessionStorage.setItem('cc_subs_seen', n);
    setSubsBadgeSeen(n);
  };
  var clearAppsBadge = function () {
    var n = Date.now();
    sessionStorage.setItem('cc_apps_seen', n);
    setAppsBadgeSeen(n);
  };
  var clearMenusBadge = function () {
    var n = Date.now();
    sessionStorage.setItem('cc_menus_seen', n);
    setMenusBadgeSeen(n);
  };
  var handleAdminAuth = () => {
    sessionStorage.setItem('cc_admin_auth', '1');
    setAuthed(true);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Load all data when admin logs in
  useEffect(function () {
    if (!authed) return;
    setLoading(true);
    Promise.all([window.ADM.loadChefs().catch(function () {
      return [];
    }), window.ADM.loadContent().catch(function () {
      return window.ADM.defaultContent;
    }), window.ADM.loadSubscribers().catch(function () {
      return [];
    }), window.ADM.loadApplications().catch(function () {
      return [];
    }), window.ADM.loadPendingMenus().catch(function () {
      return [];
    })]).then(function (results) {
      var chefList = results[0] || [];
      var contentMap = results[1] || window.ADM.defaultContent;
      var subList = results[2] || [];
      var appList = results[3] || [];
      var menuList = results[4] || [];
      window.ADM.adminChefs = chefList;
      window.ADM.siteContent = contentMap;
      window.ADM.subscribers = subList;
      window.ADM.applications = appList;
      setChefs(chefList);
      setContent(contentMap);
      setSubscribers(subList);
      setApplications(appList);
      setPendingMenus(menuList);
      setLoading(false);
    }).catch(function () {
      setLoading(false);
    });
  }, [authed]);
  var refresh = function () {
    Promise.all([window.ADM.loadSubscribers().catch(function () {
      return [];
    }), window.ADM.loadApplications().catch(function () {
      return [];
    }), window.ADM.loadPendingMenus().catch(function () {
      return [];
    }), window.ADM.loadChefs().catch(function () {
      return [];
    })]).then(function (results) {
      var subList = results[0] || [];
      var appList = results[1] || [];
      var menuList = results[2] || [];
      var chefList = results[3] || [];
      window.ADM.subscribers = subList;
      window.ADM.applications = appList;
      window.ADM.adminChefs = chefList;
      setSubscribers(subList);
      setApplications(appList);
      setPendingMenus(menuList);
      setChefs(chefList);
    });
  };

  // Not logged in at all
  if (!authed && !chefSession) {
    return /*#__PURE__*/React.createElement(LoginGate, {
      onAdminAuth: handleAdminAuth,
      onChefAuth: setChefSession
    });
  }

  // Chef is logged in → show chef portal only
  if (chefSession) {
    return /*#__PURE__*/React.createElement(ChefView, {
      session: chefSession,
      onLogout: () => setChefSession(null)
    });
  }

  // Loading state
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-spinner spin",
      style: {
        fontSize: '2rem',
        color: '#FACA50'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: '#5A5D66',
        fontSize: '0.9rem'
      }
    }, "Loading admin data\u2026"));
  }

  // Admin is logged in → full admin portal
  var {
    DashboardPage,
    ChefsPage,
    ApplicationsPage,
    MenuApprovalsPage,
    SubscribersPage,
    ContentPage,
    SettingsPage
  } = window.ADM;

  // Badges: count items added since admin last visited that section
  var newSubsCount = subscribers.filter(function (s) {
    return new Date(s.created_at).getTime() > subsBadgeSeen;
  }).length;
  var newAppsCount = applications.filter(function (a) {
    return new Date(a.created_at || a.submitted || 0).getTime() > appsBadgeSeen;
  }).length;
  var newMenusCount = pendingMenus.filter(function (m) {
    return m.status === 'pending' && new Date(m.submitted_at || m.created_at || 0).getTime() > menusBadgeSeen;
  }).length;
  var badges = {
    applications: newAppsCount,
    newSubscribers: newSubsCount,
    pendingMenus: newMenusCount
  };
  var mainContent;
  if (page === 'dashboard') mainContent = /*#__PURE__*/React.createElement(DashboardPage, {
    chefs: chefs,
    subscribers: subscribers
  });else if (page === 'applications') mainContent = /*#__PURE__*/React.createElement(ApplicationsPage, {
    applications: applications,
    onClearBadge: clearAppsBadge,
    onUpdate: refresh
  });else if (page === 'chefs') mainContent = /*#__PURE__*/React.createElement(ChefsPage, {
    chefs: chefs,
    setChefs: setChefs
  });else if (page === 'menus') mainContent = /*#__PURE__*/React.createElement(MenuApprovalsPage, {
    menus: pendingMenus,
    onClearBadge: clearMenusBadge,
    onUpdate: refresh
  });else if (page === 'subscribers') mainContent = /*#__PURE__*/React.createElement(SubscribersPage, {
    chefs: chefs,
    subscribers: subscribers,
    onClearBadge: clearSubsBadge,
    onUpdate: function (updated) {
      setSubscribers(updated);
      window.ADM.subscribers = updated;
    }
  });else if (page === 'content') mainContent = /*#__PURE__*/React.createElement(ContentPage, {
    content: content,
    setContent: setContent
  });else if (page === 'settings') mainContent = /*#__PURE__*/React.createElement(SettingsPage, null);
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-layout"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: page,
    setPage: setPage,
    badges: badges
  }), /*#__PURE__*/React.createElement("main", {
    className: "admin-main"
  }, mainContent));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AdminApp, null));