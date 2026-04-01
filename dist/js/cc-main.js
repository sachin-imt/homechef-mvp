// ─── ROOT APP + RENDER ───
window.CC = window.CC || {};
var {
  useState,
  useEffect
} = React;
var {
  mockChefs,
  Nav,
  Footer,
  HomePage,
  ChefDetailPage,
  SubscribePage,
  HowItWorksPage,
  BecomeAChefPage,
  ChefPortalPage,
  AdminPortalPage
} = window.CC;
function App() {
  // Use window.CC.mockChefs so it picks up the API-fetched data (set before render)
  var [chefs, setChefs] = useState(window.CC.mockChefs || mockChefs);
  var [page, setPage] = useState({
    name: "home"
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page.name]);
  function renderPage() {
    switch (page.name) {
      case "home":
        return /*#__PURE__*/React.createElement(HomePage, {
          chefs: chefs,
          setPage: setPage
        });
      case "detail":
        return page.chef ? /*#__PURE__*/React.createElement(ChefDetailPage, {
          chef: page.chef,
          setPage: setPage
        }) : /*#__PURE__*/React.createElement(HomePage, {
          chefs: chefs,
          setPage: setPage
        });
      case "subscribe":
        return /*#__PURE__*/React.createElement(SubscribePage, {
          chef: page.chef,
          setPage: setPage
        });
      case "how":
        return /*#__PURE__*/React.createElement(HowItWorksPage, {
          setPage: setPage
        });
      case "become":
        return /*#__PURE__*/React.createElement(BecomeAChefPage, {
          setPage: setPage
        });
      case "portal":
        return /*#__PURE__*/React.createElement(ChefPortalPage, null);
      case "admin":
        return /*#__PURE__*/React.createElement(AdminPortalPage, {
          chefs: chefs,
          setChefs: setChefs
        });
      default:
        return /*#__PURE__*/React.createElement(HomePage, {
          chefs: chefs,
          setPage: setPage
        });
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Nav, {
    page: page,
    setPage: setPage
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1
    }
  }, renderPage()), /*#__PURE__*/React.createElement(Footer, {
    setPage: setPage
  }));
}

// Fetch live chefs and content from API before rendering so the public site
// always shows data from the database, not static defaults.
Promise.all([fetch('/api/chefs').then(function (r) {
  return r.json();
}).catch(function () {
  return null;
}), fetch('/api/content').then(function (r) {
  return r.json();
}).catch(function () {
  return null;
})]).then(function (results) {
  var chefsData = results[0];
  var contentData = results[1];
  if (chefsData && Array.isArray(chefsData)) window.CC.mockChefs = chefsData;
  if (contentData && typeof contentData === 'object') window.CC.siteContent = Object.assign({}, window.CC.siteContent, contentData);
}).catch(function () {
  // fall through to static defaults
}).then(function () {
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
});