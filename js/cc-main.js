// ─── ROOT APP + RENDER ───
window.CC = window.CC || {};
var { useState, useEffect } = React;
var {
  mockChefs, Nav, Footer,
  HomePage, ChefDetailPage, SubscribePage,
  HowItWorksPage, BecomeAChefPage,
  ChefPortalPage, AdminPortalPage,
} = window.CC;

function App() {
  var [chefs, setChefs] = useState(mockChefs);
  var [page, setPage] = useState({ name: "home" });

  // Scroll to top on page change
  useEffect(() => { window.scrollTo(0, 0); }, [page.name]);

  function renderPage() {
    switch (page.name) {
      case "home":
        return <HomePage chefs={chefs} setPage={setPage} />;
      case "detail":
        return page.chef
          ? <ChefDetailPage chef={page.chef} setPage={setPage} />
          : <HomePage chefs={chefs} setPage={setPage} />;
      case "subscribe":
        return <SubscribePage chef={page.chef} setPage={setPage} />;
      case "how":
        return <HowItWorksPage setPage={setPage} />;
      case "become":
        return <BecomeAChefPage setPage={setPage} />;
      case "portal":
        return <ChefPortalPage />;
      case "admin":
        return <AdminPortalPage chefs={chefs} setChefs={setChefs} />;
      default:
        return <HomePage chefs={chefs} setPage={setPage} />;
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav page={page} setPage={setPage} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

// Fetch live chefs and content from API before rendering so the public site
// always shows data from the database, not static defaults.
Promise.all([
  fetch('/api/chefs').then(function(r) { return r.json(); }).catch(function() { return null; }),
  fetch('/api/content').then(function(r) { return r.json(); }).catch(function() { return null; }),
]).then(function(results) {
  var chefsData  = results[0];
  var contentData = results[1];
  if (chefsData  && Array.isArray(chefsData))        window.CC.mockChefs   = chefsData;
  if (contentData && typeof contentData === 'object') window.CC.siteContent = Object.assign({}, window.CC.siteContent, contentData);
}).catch(function() {
  // fall through to static defaults
}).then(function() {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});
