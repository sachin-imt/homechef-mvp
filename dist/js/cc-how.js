// ─── HOW IT WORKS + BECOME A CHEF ───
window.CC = window.CC || {};
var {
  useState
} = React;
function HowItWorksPage({
  setPage
}) {
  var sc = window.CC.siteContent || {};
  var [tab, setTab] = useState("customer");
  var customerSteps = [{
    icon: "ph-fill ph-magnifying-glass",
    title: sc.how_c1_title,
    desc: sc.how_c1_desc
  }, {
    icon: "ph-fill ph-calendar-check",
    title: sc.how_c2_title,
    desc: sc.how_c2_desc
  }, {
    icon: "ph-fill ph-users-three",
    title: sc.how_c3_title,
    desc: sc.how_c3_desc
  }];
  var chefSteps = [{
    icon: "ph-fill ph-pencil-simple",
    title: sc.how_ch1_title,
    desc: sc.how_ch1_desc
  }, {
    icon: "ph-fill ph-users",
    title: sc.how_ch2_title,
    desc: sc.how_ch2_desc
  }, {
    icon: "ph-fill ph-wallet",
    title: sc.how_ch3_title,
    desc: sc.how_ch3_desc
  }];
  var steps = tab === "customer" ? customerSteps : chefSteps;
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in",
    style: {
      maxWidth: "860px",
      margin: "0 auto",
      padding: "60px 24px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "48px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "2.5rem",
      fontWeight: 900,
      color: "#111",
      marginBottom: "12px"
    }
  }, "How Home Meal Works"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#5A5D66",
      fontSize: "1.1rem",
      margin: 0
    }
  }, "Choose your journey.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "48px"
    }
  }, [{
    val: "customer",
    label: "For Customers"
  }, {
    val: "chef",
    label: "For Chefs"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.val,
    onClick: () => setTab(t.val),
    style: {
      padding: "12px 32px",
      borderRadius: "9999px",
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.15s",
      background: tab === t.val ? "rgba(250,202,80,0.12)" : "transparent",
      border: tab === t.val ? "2px solid #111" : "2px solid #E5E5E5",
      color: tab === t.val ? "#111" : "#5A5D66"
    }
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }
  }, steps.map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: "28px",
      background: "white",
      border: "1px solid #E5E5E5",
      borderRadius: "16px",
      padding: "28px 32px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "72px",
      height: "72px",
      background: "rgba(250,202,80,0.15)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: step.icon,
    style: {
      fontSize: "32px",
      color: "#111"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "1.3rem",
      fontWeight: 700,
      margin: "0 0 8px",
      color: "#111"
    }
  }, step.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "1rem",
      lineHeight: 1.65,
      color: "#5A5D66"
    }
  }, step.desc))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: "48px"
    }
  }, tab === "customer" ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      fontSize: "1rem",
      padding: "14px 40px"
    },
    onClick: () => setPage({
      name: "home"
    })
  }, "Browse Chefs") : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      fontSize: "1rem",
      padding: "14px 40px"
    },
    onClick: () => setPage({
      name: "become"
    })
  }, "Apply Now")));
}
function BecomeAChefPage({
  setPage
}) {
  var [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    suburb: "",
    cuisine_type: "",
    cooking_background: "",
    dish1: "",
    dish2: "",
    dish3: "",
    dish4: "",
    dish5: "",
    weekly_capacity: "5-10",
    can_deliver: "yes",
    delivery_days: [],
    price_per_week: ""
  });
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);
  var [charCount, setCharCount] = useState(0);
  var perks = [{
    icon: "ph ph-cooking-pot",
    title: "1. You cook",
    desc: "5–15 meals per week"
  }, {
    icon: "ph ph-megaphone",
    title: "2. We market",
    desc: "Find customers easily"
  }, {
    icon: "ph ph-bicycle",
    title: "3. You deliver",
    desc: "Or we arrange it"
  }, {
    icon: "ph ph-wallet",
    title: "4. Get Paid",
    desc: "Keep 80% of price"
  }];
  function handleDayToggle(day) {
    setForm(f => ({
      ...f,
      delivery_days: f.delivery_days.includes(day) ? f.delivery_days.filter(d => d !== day) : [...f.delivery_days, day]
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    var newApp = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      suburb: form.suburb,
      cuisine_type: form.cuisine_type,
      cooking_background: form.cooking_background,
      sample_dishes: [form.dish1, form.dish2, form.dish3, form.dish4, form.dish5].filter(Boolean),
      weekly_capacity: form.weekly_capacity,
      delivery_days: form.delivery_days,
      status: 'pending'
    };
    fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newApp)
    }).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (data.error) throw new Error(data.error);
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }).catch(function () {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    });
  }
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-in",
      style: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "80px 24px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "80px",
        height: "80px",
        background: "rgba(58,129,61,0.12)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-fill ph-check-circle",
      style: {
        fontSize: "40px",
        color: "#3A813D"
      }
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: "2rem",
        fontWeight: 900,
        color: "#111",
        marginBottom: "12px"
      }
    }, "Application Received!"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#5A5D66",
        fontSize: "1rem",
        marginBottom: "8px"
      }
    }, "Thanks for applying to become a Home Meal partner."), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#5A5D66",
        fontSize: "0.9rem",
        marginBottom: "32px"
      }
    }, "We'll review your application and contact you within 48 hours at ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#111"
      }
    }, form.email), "."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      style: {
        fontSize: "1rem",
        padding: "14px 36px"
      },
      onClick: () => {
        setPage({
          name: "home"
        });
        window.scrollTo(0, 0);
      }
    }, "Back to Home"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in",
    style: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "60px 24px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "48px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "2.2rem",
      fontWeight: 900,
      color: "#111",
      marginBottom: "12px"
    }
  }, "Become a Home Meal Partner"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "1.1rem",
      color: "#5A5D66",
      maxWidth: "520px",
      margin: "0 auto 20px"
    }
  }, "Turn your home cooking into income. Set your own menu. Set your own pace."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(250,202,80,0.15)",
      border: "1px solid #FACA50",
      borderRadius: "8px",
      padding: "12px 24px",
      fontWeight: 700,
      fontSize: "1rem",
      color: "#111"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-money",
    style: {
      color: "#FACA50",
      fontSize: "1.2rem"
    }
  }), "Current chefs earn $400\u2013$900/week")), /*#__PURE__*/React.createElement("div", {
    className: "perks-grid",
    style: {
      marginBottom: "48px"
    }
  }, perks.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "perk-card"
  }, /*#__PURE__*/React.createElement("i", {
    className: p.icon,
    style: {
      fontSize: "32px",
      color: "#FACA50"
    }
  }), /*#__PURE__*/React.createElement("h4", null, p.title), /*#__PURE__*/React.createElement("p", null, p.desc)))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "1. About You"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Full Name *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    required: true,
    placeholder: "Your full name",
    value: form.full_name,
    onChange: e => setForm(f => ({
      ...f,
      full_name: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "addr-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Email *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    required: true,
    placeholder: "you@example.com",
    value: form.email,
    onChange: e => setForm(f => ({
      ...f,
      email: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Phone *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "tel",
    required: true,
    placeholder: "04XX XXX XXX",
    value: form.phone,
    onChange: e => setForm(f => ({
      ...f,
      phone: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Suburb (where you will cook) *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    required: true,
    placeholder: "e.g. Newtown",
    value: form.suburb,
    onChange: e => setForm(f => ({
      ...f,
      suburb: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "2. Your Cooking"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Cuisine Type *"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    required: true,
    value: form.cuisine_type,
    onChange: e => setForm(f => ({
      ...f,
      cuisine_type: e.target.value
    }))
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select cuisine type\u2026"), (window.CC.CUISINE_OPTIONS || ['Indian', 'Mediterranean', 'Thai', 'Italian', 'Japanese', 'Chinese', 'Mexican', 'Vietnamese', 'Lebanese', 'Greek', 'Continental', 'Middle Eastern']).map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c,
      value: c
    }, c);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Cooking Background * ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: "#9CA3AF"
    }
  }, "(max 200 chars)")), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    required: true,
    rows: 4,
    maxLength: 200,
    placeholder: "I grew up learning my family's traditional recipes...",
    value: form.cooking_background,
    onChange: e => {
      setForm(f => ({
        ...f,
        cooking_background: e.target.value
      }));
      setCharCount(e.target.value.length);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "char-count"
  }, charCount, "/200"))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "3. Sample Menu"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 20px",
      fontSize: "0.9rem",
      color: "#5A5D66"
    }
  }, "What 5 dishes would you cook for a sample week?"), /*#__PURE__*/React.createElement("div", {
    className: "addr-row"
  }, ["dish1", "dish2", "dish3", "dish4", "dish5"].map((key, i) => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Dish ", i + 1, i < 2 ? " *" : ""), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "text",
    required: i < 2,
    placeholder: `e.g. ${["Butter Chicken", "Pad Thai", "Pasta Bolognese", "Falafel Wrap", "Sushi Roll"][i]}`,
    value: form[key],
    onChange: e => setForm(f => ({
      ...f,
      [key]: e.target.value
    }))
  }))))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "4. Logistics"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "How many meals can you cook per week? *"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "8px"
    }
  }, ["5-10", "10-20", "20-30", "30+"].map(v => /*#__PURE__*/React.createElement("label", {
    key: v,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      border: `2px solid ${form.weekly_capacity === v ? "#FACA50" : "#E5E5E5"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: form.weekly_capacity === v ? 700 : 400,
      background: form.weekly_capacity === v ? "rgba(250,202,80,0.08)" : "white",
      fontSize: "0.9rem"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "weekly_capacity",
    value: v,
    checked: form.weekly_capacity === v,
    onChange: e => setForm(f => ({
      ...f,
      weekly_capacity: e.target.value
    })),
    style: {
      accentColor: "#111"
    }
  }), v)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Can you handle your own delivery? *"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "8px"
    }
  }, [{
    val: "yes",
    label: "Yes, I can deliver"
  }, {
    val: "no",
    label: "No, need help"
  }, {
    val: "partial",
    label: "Partially"
  }].map(opt => /*#__PURE__*/React.createElement("label", {
    key: opt.val,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      border: `2px solid ${form.can_deliver === opt.val ? "#FACA50" : "#E5E5E5"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: form.can_deliver === opt.val ? 700 : 400,
      background: form.can_deliver === opt.val ? "rgba(250,202,80,0.08)" : "white",
      fontSize: "0.9rem"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "can_deliver",
    value: opt.val,
    checked: form.can_deliver === opt.val,
    onChange: e => setForm(f => ({
      ...f,
      can_deliver: e.target.value
    })),
    style: {
      accentColor: "#111"
    }
  }), opt.label)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Price per week you'd like to charge (AUD) *"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    required: true,
    min: "40",
    max: "200",
    placeholder: "e.g. 75",
    value: form.price_per_week,
    onChange: e => setForm(f => ({
      ...f,
      price_per_week: e.target.value
    })),
    style: {
      maxWidth: "160px"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "0.78rem",
      color: "#9CA3AF"
    }
  }, "You keep 80%. Platform fee is 20%."))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    style: {
      width: "100%",
      fontSize: "1rem",
      padding: "16px"
    },
    disabled: loading
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "spin"
  }, "\u21BB"), " Submitting\u2026") : "Submit Application →"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      fontSize: "0.8rem",
      color: "#9CA3AF",
      marginTop: "12px"
    }
  }, "We review all applications within 48 hours.")));
}
Object.assign(window.CC, {
  HowItWorksPage,
  BecomeAChefPage
});