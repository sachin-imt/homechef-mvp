// ─── NAV + FOOTER ───
window.CC = window.CC || {};
var {
  useState
} = React;
function Nav({
  page,
  setPage
}) {
  var [mobileOpen, setMobileOpen] = useState(false);
  var navItems = [{
    label: "Our Chefs",
    target: "home"
  }, {
    label: "How It Works",
    target: "how"
  }, {
    label: "Become a Chef",
    target: "become"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "cc-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-header-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-nav-left"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cc-logo",
    onClick: () => {
      setPage({
        name: "home"
      });
      setMobileOpen(false);
    }
  }, "HOME", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bowl-food"
  }), "MEALS"), /*#__PURE__*/React.createElement("nav", {
    className: "cc-nav-links"
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.target,
    className: page.name === item.target ? "active" : "",
    onClick: () => setPage({
      name: item.target
    })
  }, item.label)))), /*#__PURE__*/React.createElement("div", {
    className: "cc-nav-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => {
      if (page.name === "home") {
        document.getElementById("chef-grid")?.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        setPage({
          name: "home"
        });
        setTimeout(() => document.getElementById("chef-grid")?.scrollIntoView({
          behavior: "smooth"
        }), 100);
      }
    }
  }, "Order Now"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMobileOpen(o => !o),
    style: {
      display: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px"
    },
    className: "md:hidden",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph-bold ${mobileOpen ? "ph-x" : "ph-list"}`,
    style: {
      fontSize: "24px"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: `mobile-nav ${mobileOpen ? "open" : ""}`
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.target,
    onClick: () => {
      setPage({
        name: item.target
      });
      setMobileOpen(false);
    }
  }, item.label)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      marginTop: "8px",
      borderRadius: "8px"
    },
    onClick: () => {
      setMobileOpen(false);
      if (page.name === "home") {
        document.getElementById("chef-grid")?.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        setPage({
          name: "home"
        });
        setTimeout(() => document.getElementById("chef-grid")?.scrollIntoView({
          behavior: "smooth"
        }), 100);
      }
    }
  }, "Order Now")));
}
function Footer({
  setPage
}) {
  var sc = window.CC.siteContent || {};
  return /*#__PURE__*/React.createElement("footer", {
    className: "cc-footer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1200px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "32px",
      marginBottom: "40px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-logo",
    style: {
      marginBottom: "12px"
    }
  }, "HOME", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bowl-food"
  }), "MEALS"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#aaa",
      fontSize: "0.9rem",
      maxWidth: "260px",
      margin: 0
    }
  }, sc.footer_tagline)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "48px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "white",
      fontWeight: 700,
      fontSize: "0.85rem",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    }
  }, "Explore"), [{
    label: "Our Chefs",
    target: "home"
  }, {
    label: "How It Works",
    target: "how"
  }, {
    label: "Become a Chef",
    target: "become"
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.target,
    style: {
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      setPage({
        name: item.target
      });
      window.scrollTo(0, 0);
    }
  }, item.label)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "white",
      fontWeight: 700,
      fontSize: "0.85rem",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    }
  }, "Contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:" + sc.contact_email
  }, sc.contact_email)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Instagram")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Facebook"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid #333",
      paddingTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#666",
      fontSize: "0.82rem",
      margin: 0
    }
  }, "\xA9 2026 Home Meal. All rights reserved. Sydney, Australia."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#666",
      fontSize: "0.82rem",
      margin: 0
    }
  }, "ABN: 00 000 000 000 (placeholder)"))));
}
Object.assign(window.CC, {
  Nav,
  Footer
});