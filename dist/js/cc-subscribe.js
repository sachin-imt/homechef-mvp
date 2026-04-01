// ─── SUBSCRIBE PAGE ───
window.CC = window.CC || {};
var {
  useState,
  useEffect
} = React;

// Defined OUTSIDE SubscribePage so it is stable across re-renders.
// If defined inside, every keystroke creates a new component type → React
// unmounts/remounts the field → input loses focus.
function SubField({
  name,
  label,
  required,
  errors,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: name
  }, label, required && " *"), children, (errors || {})[name] && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#D0342C",
      fontSize: "0.78rem",
      margin: "4px 0 0"
    }
  }, (errors || {})[name]));
}
function SubscribePage({
  chef,
  setPage
}) {
  // Derive suburbs dynamically from chef's delivery postcodes
  var postcodeMap = window.CC.POSTCODE_SUBURB_MAP || {};
  var suburbOptions = chef ? chef.delivery_postcodes.map(pc => ({
    postcode: pc,
    suburb: postcodeMap[pc] || pc
  })) : [];

  // ── Week options: always Mon–Fri, always starting from next Monday ──
  function localIso(d) {
    // Use local date parts to avoid UTC offset shifting the date
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function getMonIso(weeksAhead) {
    var d = new Date();
    var day = d.getDay();
    // Days until next Monday (always forward — never stays on current Monday)
    var daysToMon = day === 1 ? 7 : day === 0 ? 8 : (8 - day) % 7;
    d.setDate(d.getDate() + daysToMon + weeksAhead * 7);
    return localIso(d);
  }
  function fmtIso(iso) {
    var parts = iso.split('-').map(Number);
    var mon = new Date(parts[0], parts[1] - 1, parts[2]); // parse as local date
    var fri = new Date(mon);
    fri.setDate(mon.getDate() + 4);
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return mon.getDate() + ' ' + M[mon.getMonth()] + ' – ' + fri.getDate() + ' ' + M[fri.getMonth()];
  }
  var unavailableWeeks = chef?.menus?.unavailable_weeks || [];
  // Always show next two Mon–Fri weeks
  var rawWeekOpts = [{
    val: 'this_week',
    iso: getMonIso(0),
    label: fmtIso(getMonIso(0))
  }, {
    val: 'next_week',
    iso: getMonIso(1),
    label: fmtIso(getMonIso(1))
  }];
  var weekOptions = rawWeekOpts.filter(function (o) {
    return !unavailableWeeks.includes(o.iso);
  });
  var defaultWeek = weekOptions.length > 0 ? weekOptions[0].val : 'this_week';
  var [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    street_address: "",
    suburb: "",
    postcode: "",
    state: "NSW",
    delivery_notes: "",
    start_week: defaultWeek,
    dietary_restrictions: "",
    payment_method: "bank_transfer",
    terms_accepted: false
  });
  var [errors, setErrors] = useState({});
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);

  // Auto-fill postcode when suburb changes
  function handleSuburbChange(e) {
    var val = e.target.value;
    var match = suburbOptions.find(o => o.suburb === val);
    setForm(f => ({
      ...f,
      suburb: val,
      postcode: match ? match.postcode : f.postcode
    }));
  }
  function validate() {
    var e = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Enter your full name";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!/^04[0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid AU mobile (04XX XXX XXX)";
    if (!form.street_address.trim() || form.street_address.trim().length < 5) e.street_address = "Enter your street address";
    if (!form.suburb) e.suburb = "Select a suburb";
    if (!form.terms_accepted) e.terms_accepted = "Please accept the terms";
    return e;
  }
  function handleSubmit(e) {
    e.preventDefault();
    var errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    var selectedOpt = weekOptions.find(function (o) {
      return o.val === form.start_week;
    }) || weekOptions[0];
    var weekLabel = selectedOpt ? selectedOpt.label : '';
    var newSub = {
      name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      chef_id: chef?.chef_id,
      chef_name: chef?.chef_name,
      suburb: form.suburb,
      postcode: form.postcode,
      street_address: form.street_address.trim(),
      delivery_notes: form.delivery_notes.trim(),
      dietary: form.dietary_restrictions.trim(),
      starting_week: weekLabel || '',
      amount: chef?.price_per_week,
      status: 'Interested',
      status_notes: '',
      payments: []
    };
    fetch('/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSub)
    }).then(function (r) {
      return r.json();
    }).then(function (data) {
      if (data.error) throw new Error(data.error);
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }).catch(function (err) {
      setErrors({
        submit: 'Submission failed — please try again.'
      });
      setLoading(false);
    });
  }
  var weekLabels = {
    this_week: rawWeekOpts.find(function (o) {
      return o.val === 'this_week';
    })?.label || '',
    next_week: rawWeekOpts.find(function (o) {
      return o.val === 'next_week';
    })?.label || ''
  };
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-in",
      style: {
        maxWidth: "640px",
        margin: "0 auto",
        padding: "60px 24px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: "40px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "72px",
        height: "72px",
        background: "rgba(58,129,61,0.12)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-fill ph-check-circle",
      style: {
        fontSize: "36px",
        color: "#3A813D"
      }
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: "1.8rem",
        fontWeight: 900,
        color: "#111",
        marginBottom: "12px"
      }
    }, "You're all set!"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#5A5D66",
        fontSize: "1rem",
        maxWidth: "420px",
        margin: "0 auto 8px"
      }
    }, "We've received your subscription request for ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#111"
      }
    }, chef?.chef_name), "."), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#5A5D66",
        fontSize: "0.9rem",
        maxWidth: "420px",
        margin: "0 auto"
      }
    }, "Bank transfer details will be emailed to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "#111"
      }
    }, form.email), ". Your chef will contact you 24 hours before your first delivery.")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#F4F4F4",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "32px"
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: "1rem",
        fontWeight: 700,
        margin: "0 0 16px",
        color: "#111"
      }
    }, "Subscription Summary"), [["Chef", chef?.chef_name], ["Week", form.start_week === "this_week" ? weekLabels.this_week : weekLabels.next_week], ["Delivery to", `${form.street_address}, ${form.suburb} ${form.postcode}`], ["Weekly price", `$${chef?.price_per_week}`], ["Payment", "Bank Transfer (details emailed)"]].map(([label, val]) => /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #E5E5E5",
        fontSize: "0.9rem"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#5A5D66"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: "#111"
      }
    }, val)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      style: {
        flex: 1
      },
      onClick: () => {
        setPage({
          name: "home"
        });
        window.scrollTo(0, 0);
      }
    }, "Browse More Chefs"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-outline",
      style: {
        flex: 1
      },
      onClick: () => {
        setPage({
          name: "detail",
          chef
        });
        window.scrollTo(0, 0);
      }
    }, "Back to ", chef?.chef_name)), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        fontSize: "0.82rem",
        color: "#9CA3AF",
        marginTop: "20px"
      }
    }, "Questions? ", /*#__PURE__*/React.createElement("a", {
      href: "mailto:hello@homemeals.com.au",
      style: {
        color: "#111",
        fontWeight: 600
      }
    }, "hello@homemeals.com.au")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in",
    style: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 24px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "40px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "2rem",
      fontWeight: 900,
      color: "#111",
      marginBottom: "8px"
    }
  }, "Complete Your Subscription"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#5A5D66",
      margin: 0
    }
  }, "Fresh, chef-crafted meals delivered to your door.")), chef && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "white",
      border: "2px solid #FACA50",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: chef.photo_url,
    alt: chef.chef_name,
    style: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #FACA50"
    },
    onError: e => {
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.chef_name)}&background=FACA50&color=111&size=60`;
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      color: "#111",
      fontSize: "1rem"
    }
  }, "You're subscribing to: ", /*#__PURE__*/React.createElement("strong", null, chef.chef_name)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "#5A5D66",
      fontSize: "0.88rem"
    }
  }, chef.cuisine_type, " \xB7 $", chef.price_per_week, "/week \xB7 5 Meals Mon\u2013Fri")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage({
      name: "detail",
      chef
    }),
    style: {
      marginLeft: "auto",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#5A5D66",
      fontFamily: "inherit",
      fontSize: "0.82rem",
      textDecoration: "underline"
    }
  }, "Change")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Your Details"), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "full_name",
    label: "Full Name",
    required: true
  }, /*#__PURE__*/React.createElement("input", {
    id: "full_name",
    className: "form-input",
    type: "text",
    placeholder: "e.g. Jane Smith",
    value: form.full_name,
    onChange: e => setForm(f => ({
      ...f,
      full_name: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "addr-row"
  }, /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "email",
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement("input", {
    id: "email",
    className: "form-input",
    type: "email",
    placeholder: "jane@example.com",
    value: form.email,
    onChange: e => setForm(f => ({
      ...f,
      email: e.target.value
    }))
  })), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "phone",
    label: "Phone (for delivery)",
    required: true
  }, /*#__PURE__*/React.createElement("input", {
    id: "phone",
    className: "form-input",
    type: "tel",
    placeholder: "0412 345 678",
    value: form.phone,
    onChange: e => setForm(f => ({
      ...f,
      phone: e.target.value
    }))
  })))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Delivery Address"), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "street_address",
    label: "Street Address",
    required: true
  }, /*#__PURE__*/React.createElement("input", {
    id: "street_address",
    className: "form-input",
    type: "text",
    placeholder: "123 Example St",
    value: form.street_address,
    onChange: e => setForm(f => ({
      ...f,
      street_address: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "addr-row"
  }, /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "suburb",
    label: "Suburb",
    required: true
  }, /*#__PURE__*/React.createElement("select", {
    id: "suburb",
    className: "form-input",
    value: form.suburb,
    onChange: handleSuburbChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select suburb"), suburbOptions.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.postcode,
    value: o.suburb
  }, o.suburb)))), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "postcode",
    label: "Postcode"
  }, /*#__PURE__*/React.createElement("input", {
    id: "postcode",
    className: "form-input",
    type: "text",
    value: form.postcode,
    readOnly: true,
    style: {
      background: "#F4F4F4",
      color: "#5A5D66"
    }
  })), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "state",
    label: "State"
  }, /*#__PURE__*/React.createElement("input", {
    id: "state",
    className: "form-input",
    type: "text",
    value: "NSW",
    readOnly: true,
    style: {
      background: "#F4F4F4",
      color: "#5A5D66"
    }
  }))), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "delivery_notes",
    label: "Delivery Instructions (optional)"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "delivery_notes",
    className: "form-input",
    rows: 3,
    placeholder: "Gate code, apartment number, leave at door, etc.",
    value: form.delivery_notes,
    onChange: e => setForm(f => ({
      ...f,
      delivery_notes: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Subscription Details"), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Start Week *"), weekOptions.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#D0342C",
      fontSize: "0.88rem",
      margin: "8px 0 0",
      padding: "12px 16px",
      background: "#FFF0F0",
      borderRadius: "8px",
      border: "1px solid #FCA5A5"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-warning",
    style: {
      marginRight: "6px"
    }
  }), chef?.chef_name, " is not available for the upcoming weeks. Please check back later.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "8px"
    }
  }, weekOptions.map(opt => /*#__PURE__*/React.createElement("label", {
    key: opt.val,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      border: `2px solid ${form.start_week === opt.val ? "#FACA50" : "#E5E5E5"}`,
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: form.start_week === opt.val ? 700 : 400,
      background: form.start_week === opt.val ? "rgba(250,202,80,0.08)" : "white"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "start_week",
    value: opt.val,
    checked: form.start_week === opt.val,
    onChange: e => setForm(f => ({
      ...f,
      start_week: e.target.value
    })),
    style: {
      accentColor: "#111"
    }
  }), opt.label)))), /*#__PURE__*/React.createElement(SubField, {
    errors: errors,
    name: "dietary_restrictions",
    label: "Dietary Restrictions (optional)"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 2,
    placeholder: "Any allergies or dietary needs? e.g. nut-free, gluten-free",
    value: form.dietary_restrictions,
    onChange: e => setForm(f => ({
      ...f,
      dietary_restrictions: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Payment"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px 16px",
      border: "2px solid #FACA50",
      borderRadius: "8px",
      background: "rgba(250,202,80,0.05)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "payment_method",
    value: "bank_transfer",
    checked: true,
    readOnly: true,
    style: {
      accentColor: "#111",
      marginTop: "2px"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      color: "#111",
      fontSize: "0.9rem"
    }
  }, "Bank Transfer"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "#5A5D66",
      fontSize: "0.82rem"
    }
  }, "Account details will be emailed to you after submission. Payment due within 24 hours.")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    style: {
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "checkbox-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "terms",
    checked: form.terms_accepted,
    onChange: e => {
      setForm(f => ({
        ...f,
        terms_accepted: e.target.checked
      }));
      if (e.target.checked) setErrors(err => {
        var {
          terms_accepted,
          ...rest
        } = err;
        return rest;
      });
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "terms",
    style: {
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#111"
    }
  }, "I agree to weekly payments via Bank Transfer until I cancel. No lock-in \u2014 cancel anytime.")), errors.terms_accepted && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#D0342C",
      fontSize: "0.78rem",
      margin: "6px 0 0"
    }
  }, errors.terms_accepted)), errors.submit && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#D0342C",
      fontSize: "0.85rem",
      margin: "0 0 12px",
      textAlign: "center"
    }
  }, errors.submit), /*#__PURE__*/React.createElement("button", {
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
  }, "\u21BB"), " Processing\u2026") : "Complete Subscription →"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      fontSize: "0.8rem",
      color: "#9CA3AF",
      marginTop: "12px"
    }
  }, "Cancel anytime. No commitment beyond the first week.")));
}
Object.assign(window.CC, {
  SubscribePage
});