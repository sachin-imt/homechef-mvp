// ─── CHEF MANAGEMENT + APPLICATIONS ───
window.ADM = window.ADM || {};
var {
  useState
} = React;
var CUISINE_OPTIONS = ['Indian', 'Mediterranean', 'Thai', 'Italian', 'Japanese', 'Chinese', 'Mexican', 'Vietnamese', 'Lebanese', 'Greek'];

// ─────────────────────────────────────────────
// Chef Applications Page
// ─────────────────────────────────────────────
function ApplicationsPage({
  applications: initialApps,
  onUpdate,
  onClearBadge
}) {
  var [apps, setApps] = useState(initialApps || []);
  var [detail, setDet] = useState(null);
  var [note, setNote] = useState('');
  React.useEffect(function () {
    onClearBadge && onClearBadge();
  }, []);
  // Keep in sync if parent reloads
  React.useEffect(function () {
    setApps(initialApps || []);
  }, [initialApps]);
  var handleApprove = app => {
    if (!confirm(`Approve ${app.full_name} and add them as an active chef?`)) return;
    var newChef = {
      chef_name: 'Chef ' + app.full_name.split(' ')[0],
      cuisine_type: app.cuisine_type,
      bio: app.cooking_background,
      highlights: [],
      delivery_postcodes: [],
      price_per_week: 0,
      rating: 5.0,
      commission_pct: 20,
      status: 'active',
      food_image: '',
      photo_url: '',
      menus: {},
      // Passed to API for approval email; stripped before DB insert
      applicant_email: app.email,
      applicant_name: app.full_name
    };
    setApps(prev => prev.filter(a => a.id !== app.id));
    setDet(null);
    window.ADM.addChef(newChef).then(function (createdChef) {
      if (!createdChef || createdChef.error) {
        alert('Error creating chef: ' + (createdChef?.error || 'Unknown error'));
        throw new Error(createdChef?.error || 'Chef creation failed');
      }
      return window.ADM.deleteApplication(app.id);
    }).then(function () {
      window.ADM.pushNotification('chef_approved', app.full_name + ' approved and added', app.id);
      onUpdate && onUpdate();
    }).catch(function (e) {
      alert('Error approving application: ' + e.message);
    });
  };
  var handleReject = app => {
    if (window.confirm(`Reject application from ${app.full_name}?`) === false) return;
    setApps(prev => prev.filter(a => a.id !== app.id));
    setDet(null);
    window.ADM.deleteApplication(app.id, {
      action: 'rejected',
      email: app.email,
      name: app.full_name
    }).then(function () {
      onUpdate && onUpdate();
    }).catch(function (e) {
      alert('Error: ' + e.message);
    });
  };
  var statusBadge = s => ({
    pending: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-yellow"
    }, "Pending Review"),
    approved: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green"
    }, "Approved"),
    rejected: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-red"
    }, "Rejected")
  })[s] || /*#__PURE__*/React.createElement("span", {
    className: "badge badge-gray"
  }, s);
  var pending = apps.filter(a => a.status === 'pending');
  var reviewed = apps.filter(a => a.status !== 'pending');
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "section-title"
  }, "Chef Applications"), /*#__PURE__*/React.createElement("p", {
    className: "section-subtitle"
  }, pending.length, " pending \xB7 ", reviewed.length, " reviewed"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F0F9FF',
      border: '1px solid #BAE6FD',
      borderRadius: '10px',
      padding: '14px 18px',
      marginBottom: '20px',
      fontSize: '0.85rem',
      color: '#0369A1',
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-info",
    style: {
      fontSize: '1.1rem',
      flexShrink: 0,
      marginTop: '1px'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Approval required before going live."), " Chefs who apply via the public site appear here. Only approved chefs are visible on the public website. When you approve a chef, they are added to the Active Chefs list \u2014 remember to fill in their delivery postcodes, price, and avatar.")), apps.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: 'center',
      padding: '48px',
      color: '#9CA3AF'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-user-check",
    style: {
      fontSize: '2.5rem',
      display: 'block',
      marginBottom: '12px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 600,
      color: '#5A5D66'
    }
  }, "No applications yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      marginTop: '4px'
    }
  }, "Applications from the \"Become a Chef\" form will appear here.")), pending.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#111',
      marginBottom: '12px'
    }
  }, "Awaiting Review (", pending.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Applicant"), /*#__PURE__*/React.createElement("th", null, "Cuisine"), /*#__PURE__*/React.createElement("th", null, "Suburb"), /*#__PURE__*/React.createElement("th", null, "Capacity"), /*#__PURE__*/React.createElement("th", null, "Submitted"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, pending.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, a.full_name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#9CA3AF'
    }
  }, a.email, " \xB7 ", a.phone)), /*#__PURE__*/React.createElement("td", null, a.cuisine_type), /*#__PURE__*/React.createElement("td", null, a.suburb), /*#__PURE__*/React.createElement("td", null, a.weekly_capacity, " meals/wk"), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#9CA3AF',
      fontSize: '0.82rem'
    }
  }, a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    onClick: () => {
      setDet(a);
      setNote('');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-eye"
  }), " Review"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success btn-sm",
    onClick: () => {
      setDet(a);
      setNote('');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-check"
  }), " Approve"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: () => handleReject(a)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }), " Reject"))))))))), reviewed.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#9CA3AF',
      marginBottom: '12px'
    }
  }, "Previously Reviewed (", reviewed.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Applicant"), /*#__PURE__*/React.createElement("th", null, "Cuisine"), /*#__PURE__*/React.createElement("th", null, "Submitted"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Reviewed"))), /*#__PURE__*/React.createElement("tbody", null, reviewed.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, a.full_name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: '#9CA3AF'
    }
  }, a.email)), /*#__PURE__*/React.createElement("td", null, a.cuisine_type), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#9CA3AF',
      fontSize: '0.82rem'
    }
  }, a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '—'), /*#__PURE__*/React.createElement("td", null, statusBadge(a.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#9CA3AF',
      fontSize: '0.82rem'
    }
  }, a.reviewed_at || '—'))))))), detail && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && setDet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: '560px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.05rem',
      fontWeight: 800,
      margin: 0
    }
  }, detail.full_name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: '#9CA3AF',
      margin: 0
    }
  }, detail.cuisine_type, " \xB7 Applied ", detail.submitted_at ? new Date(detail.submitted_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '—')), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setDet(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '16px'
    }
  }, [['Email', detail.email], ['Phone', detail.phone], ['Suburb', detail.suburb], ['Capacity', `${detail.weekly_capacity} meals/wk`]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#9CA3AF'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.8rem',
      marginBottom: '4px'
    }
  }, "Cooking Background"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.875rem',
      color: '#5A5D66',
      background: '#F8F8F8',
      padding: '10px',
      borderRadius: '8px',
      margin: 0
    }
  }, detail.cooking_background)), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.8rem',
      marginBottom: '4px'
    }
  }, "Sample Dishes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, (detail.sample_dishes || []).map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "tag"
  }, d)))), detail.delivery_days?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.8rem',
      marginBottom: '4px'
    }
  }, "Delivery Days"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.875rem'
    }
  }, detail.delivery_days.join(', '))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.8rem',
      marginBottom: '4px'
    }
  }, "Admin Note (optional)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: "e.g. Spoke on phone \u2014 great candidate"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => handleReject(detail)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }), " Reject"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => handleApprove(detail)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-check"
  }), " Approve & Add Chef")))));
}

// ─────────────────────────────────────────────
// Chef modal (add / edit)
// ─────────────────────────────────────────────
function ChefModal({
  chef,
  onSave,
  onClose
}) {
  var isNew = !chef.chef_id;
  var [form, setForm] = useState(chef);
  var [pcInput, setPcInput] = useState('');
  var [saving, setSaving] = useState(false);
  var set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  var addPc = () => {
    var pc = pcInput.trim();
    if (pc && !/^\d{4}$/.test(pc)) return alert('Postcode must be 4 digits');
    if (pc && !(form.delivery_postcodes || []).includes(pc)) set('delivery_postcodes', [...(form.delivery_postcodes || []), pc]);
    setPcInput('');
  };
  var removePc = pc => set('delivery_postcodes', form.delivery_postcodes.filter(p => p !== pc));
  var handleSave = () => {
    if (!form.chef_name?.trim()) return alert('Chef name required');
    if (!form.cuisine_type) return alert('Select a cuisine');
    if (!form.price_per_week || form.price_per_week < 1) return alert('Price required');
    if ((form.status || 'Active').toLowerCase() === 'active' && !(form.delivery_postcodes || []).length) {
      return alert('Add at least one delivery postcode before setting this chef to Active.');
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave(form);
    }, 600);
  };
  var lbl = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.8rem',
    marginBottom: '5px',
    color: '#111'
  };
  var row2 = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.1rem',
      fontWeight: 800,
      margin: 0
    }
  }, isNew ? 'Add New Chef' : `Edit ${chef.chef_name}`), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Chef Name"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.chef_name || '',
    onChange: e => set('chef_name', e.target.value),
    placeholder: "e.g. Chef Priya"
  })), /*#__PURE__*/React.createElement("div", {
    style: row2
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Cuisine"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.cuisine_type || '',
    onChange: e => set('cuisine_type', e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), CUISINE_OPTIONS.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Price / Week ($)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    value: form.price_per_week || '',
    onChange: e => set('price_per_week', parseFloat(e.target.value) || 0),
    placeholder: "150"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Rating"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    step: "0.1",
    min: "1",
    max: "5",
    value: form.rating || '',
    onChange: e => set('rating', parseFloat(e.target.value) || 0)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Platform Commission %"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    max: "100",
    step: "1",
    value: form.commission_pct ?? 20,
    onChange: e => set('commission_pct', parseInt(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#9CA3AF',
      marginTop: '3px'
    }
  }, "Chef keeps ", 100 - (form.commission_pct ?? 20), "%")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.status || 'Active',
    onChange: e => set('status', e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "Active"
  }, "Active"), /*#__PURE__*/React.createElement("option", {
    value: "Paused"
  }, "Paused")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Short Bio"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-input",
    rows: 3,
    value: form.bio || '',
    onChange: e => set('bio', e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: row2
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Food Photo URL"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.food_image || '',
    onChange: e => set('food_image', e.target.value),
    placeholder: "https://\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Chef Avatar URL"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: form.photo_url || '',
    onChange: e => set('photo_url', e.target.value),
    placeholder: "https://\u2026"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Highlight Tags (comma-separated)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: (form.highlights || []).join(', '),
    onChange: e => set('highlights', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Dietary / Style Tags (shown on public profile)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: (form.tags || []).join(', '),
    onChange: e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean)),
    placeholder: "e.g. Gluten-Free Options, Dairy-Free, Halal, Vegetarian"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#9CA3AF',
      marginTop: '3px'
    }
  }, "Shown as pills under the chef name on the Browse & Detail pages")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Delivery Postcodes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: pcInput,
    onChange: e => setPcInput(e.target.value),
    onKeyDown: e => e.key === 'Enter' && addPc(),
    placeholder: "4-digit postcode",
    style: {
      width: '150px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    onClick: addPc
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-plus"
  }), " Add")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, (form.delivery_postcodes || []).map(pc => /*#__PURE__*/React.createElement("span", {
    key: pc,
    className: "tag"
  }, pc, /*#__PURE__*/React.createElement("button", {
    onClick: () => removePc(pc)
  }, "\xD7"))), !(form.delivery_postcodes || []).length && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#9CA3AF'
    }
  }, "None added")))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-spinner spin"
  }), " Saving\u2026") : isNew ? 'Add Chef' : 'Save Changes'))));
}

// ─────────────────────────────────────────────
// Chef Portal Access (credentials) modal
// ─────────────────────────────────────────────
function ChefAccessModal({
  chef,
  onClose
}) {
  var [existing, setExisting] = useState(null);
  var [username, setUsername] = useState('');
  var [password, setPassword] = useState('');
  var [chefEmail, setChefEmail] = useState('');
  var [sendEmail, setSendEmail] = useState(true);
  var [active, setActive] = useState(true);
  var [showPwd, setShowPwd] = useState(false);
  var [saved, setSaved] = useState(false);

  // Load existing account on mount
  React.useEffect(function () {
    window.ADM.loadChefAccounts().then(function (accounts) {
      var found = accounts.find(function (a) {
        return a.chef_id === chef.chef_id;
      }) || null;
      setExisting(found);
      if (found) {
        setUsername(found.username || '');
        setPassword(found.password || '');
        setChefEmail(found.chef_email || '');
        setActive(found.active !== false);
      }
    }).catch(function () {});
  }, []);
  var handleSave = () => {
    if (!username.trim()) return alert('Username required');
    if (!password.trim()) return alert('Password required');
    window.ADM.upsertChefAccount({
      chef_id: chef.chef_id,
      chef_name: chef.chef_name,
      username: username.trim(),
      password: password.trim(),
      chef_email: chefEmail.trim() || null,
      active: active,
      send_credentials_email: sendEmail && !!chefEmail.trim()
    }).then(function (result) {
      if (result && result.error) {
        alert('Error saving credentials: ' + result.error);
        return;
      }
      setSaved(true);
      setTimeout(onClose, 900);
    }).catch(function (e) {
      alert('Error saving credentials: ' + e.message);
    });
  };
  var handleRevoke = () => {
    if (!confirm(`Revoke portal access for ${chef.chef_name}?`)) return;
    window.ADM.deleteChefAccount(chef.chef_id).then(onClose).catch(function (e) {
      alert('Error revoking access: ' + e.message);
    });
  };
  var lbl = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.8rem',
    marginBottom: '5px'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: '440px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      margin: 0
    }
  }, "Chef Portal Access"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: '#9CA3AF',
      margin: 0
    }
  }, chef.chef_name)), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, existing && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#D4EDDA',
      border: '1px solid #A8D5B5',
      borderRadius: '8px',
      padding: '10px 14px',
      marginBottom: '16px',
      fontSize: '0.82rem',
      color: '#3A813D'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-check-circle",
    style: {
      marginRight: '6px'
    }
  }), "Portal access is currently ", /*#__PURE__*/React.createElement("strong", null, "active"), " \xB7 Account created ", existing.created), !existing && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFF7ED',
      border: '1px solid #FED7AA',
      borderRadius: '8px',
      padding: '10px 14px',
      marginBottom: '16px',
      fontSize: '0.82rem',
      color: '#92400E'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-warning",
    style: {
      marginRight: '6px'
    }
  }), "No portal access yet. Create credentials below and share them with the chef."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Username"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    value: username,
    onChange: e => setUsername(e.target.value),
    placeholder: "e.g. chef_priya"
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
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "Set a strong password",
    style: {
      paddingRight: '44px'
    }
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
      color: '#9CA3AF'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `ph-bold ${showPwd ? 'ph-eye-slash' : 'ph-eye'}`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Chef's Email ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: '#9CA3AF'
    }
  }, "(to send credentials)")), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    value: chefEmail,
    onChange: e => setChefEmail(e.target.value),
    placeholder: "chef@example.com"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 0 10px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "send-email",
    checked: sendEmail,
    onChange: e => setSendEmail(e.target.checked),
    style: {
      accentColor: '#111',
      width: '16px',
      height: '16px'
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "send-email",
    style: {
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, "Email credentials to chef on save")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 0 10px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "acc-active",
    checked: active,
    onChange: e => setActive(e.target.checked),
    style: {
      accentColor: '#111',
      width: '16px',
      height: '16px'
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "acc-active",
    style: {
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, "Account active (chef can log in)"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, existing && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: handleRevoke
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-lock-open"
  }), " Revoke Access"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleSave,
    disabled: saved
  }, saved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-check-circle"
  }), " Saved!") : existing ? 'Update Credentials' : 'Create Access'))));
}
function DeleteConfirm({
  chef,
  onConfirm,
  onCancel
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "confirm-box"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontWeight: 800,
      marginBottom: '8px'
    }
  }, "Delete ", chef.chef_name, "?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.875rem',
      color: '#5A5D66',
      marginBottom: '20px'
    }
  }, "This will permanently remove the chef. This cannot be undone."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: onConfirm
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-trash"
  }), " Delete"))));
}

// ─────────────────────────────────────────────
// Unavailable Weeks Modal
// ─────────────────────────────────────────────
function UnavailableWeeksModal({
  chef,
  onClose,
  onSave
}) {
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function getMonIso(weeksAhead) {
    var d = new Date();
    var daysToMon = d.getDay() === 0 ? 1 : (8 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + daysToMon + weeksAhead * 7);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }
  function fmtIso(iso) {
    var mon = new Date(iso + 'T00:00:00');
    var fri = new Date(mon);
    fri.setDate(mon.getDate() + 4);
    return mon.getDate() + ' ' + M[mon.getMonth()] + ' – ' + fri.getDate() + ' ' + M[fri.getMonth()];
  }
  var upcomingWeeks = [0, 1, 2, 3, 4].map(function (i) {
    var iso = getMonIso(i);
    return {
      iso: iso,
      label: fmtIso(iso)
    };
  });
  var existing = (chef.menus || {}).unavailable_weeks || [];
  var [unavailable, setUnavailable] = useState(existing);
  var [saving, setSaving] = useState(false);
  var toggle = function (iso) {
    setUnavailable(function (prev) {
      return prev.includes(iso) ? prev.filter(function (d) {
        return d !== iso;
      }) : [...prev, iso];
    });
  };
  var handleSave = function () {
    setSaving(true);
    var updatedMenus = Object.assign({}, chef.menus || {}, {
      unavailable_weeks: unavailable
    });
    window.ADM.updateChef(Object.assign({}, chef, {
      menus: updatedMenus
    })).then(function (updated) {
      setSaving(false);
      onSave(updated);
      onClose();
    }).catch(function (e) {
      alert('Error: ' + e.message);
      setSaving(false);
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function (e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: '440px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.1rem',
      fontWeight: 800,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-calendar-x",
    style: {
      marginRight: '8px',
      color: '#D0342C'
    }
  }), "Unavailable Weeks \u2014 ", chef.chef_name), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: '#5A5D66',
      margin: '0 0 16px'
    }
  }, "Toggle weeks when ", chef.chef_name, " cannot cook. Toggled-off weeks will not appear as subscription options for customers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, upcomingWeeks.map(function (w) {
    var off = unavailable.includes(w.iso);
    return /*#__PURE__*/React.createElement("label", {
      key: w.iso,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        border: '2px solid ' + (off ? '#FCA5A5' : '#E5E5E5'),
        borderRadius: '10px',
        cursor: 'pointer',
        background: off ? '#FFF5F5' : 'white',
        transition: 'all 0.15s'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: off,
      onChange: function () {
        toggle(w.iso);
      },
      style: {
        accentColor: '#D0342C',
        width: '16px',
        height: '16px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: '0.9rem',
        color: off ? '#D0342C' : '#111'
      }
    }, w.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: '#9CA3AF'
      }
    }, w.iso)), off && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#D0342C',
        background: '#FEE2E2',
        padding: '2px 8px',
        borderRadius: '20px'
      }
    }, "UNAVAILABLE"));
  })), unavailable.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.8rem',
      color: '#D0342C',
      margin: '12px 0 0',
      display: 'flex',
      gap: '6px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-warning"
  }), unavailable.length, " week", unavailable.length > 1 ? 's' : '', " marked unavailable \u2014 these won't show in the subscribe form.")), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleSave,
    disabled: saving
  }, saving ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-spinner spin"
  }), " Saving\u2026") : 'Save'))));
}

// ─────────────────────────────────────────────
// Active Chefs Page
// ─────────────────────────────────────────────
function ChefsPage({
  chefs,
  setChefs
}) {
  var [modal, setModal] = useState(null);
  var [delChef, setDel] = useState(null);
  var [access, setAccess] = useState(null); // chef whose access modal is open
  var [weeksModal, setWeeksModal] = useState(null); // chef for unavailable weeks modal
  var [search, setSearch] = useState('');
  var filtered = chefs.filter(c => !search || c.chef_name.toLowerCase().includes(search.toLowerCase()) || c.cuisine_type.toLowerCase().includes(search.toLowerCase()));
  var handleSave = form => {
    if (!form.chef_id) {
      // New chef
      window.ADM.addChef(form).then(function (created) {
        setChefs(function (prev) {
          return [...prev, created];
        });
        setModal(null);
      }).catch(function (e) {
        alert('Error adding chef: ' + e.message);
      });
    } else {
      // Update existing
      window.ADM.updateChef(form).then(function (updated) {
        setChefs(function (prev) {
          return prev.map(function (c) {
            return c.chef_id === form.chef_id ? updated : c;
          });
        });
        setModal(null);
      }).catch(function (e) {
        alert('Error saving chef: ' + e.message);
      });
    }
  };
  var handleDelete = () => {
    window.ADM.deleteChef(delChef.chef_id).then(function () {
      setChefs(function (prev) {
        return prev.filter(function (c) {
          return c.chef_id !== delChef.chef_id;
        });
      });
    }).catch(function (e) {
      alert('Error deleting chef: ' + e.message);
    });
    setDel(null);
  };
  var newChef = {
    chef_name: '',
    cuisine_type: '',
    price_per_week: '',
    rating: 4.8,
    bio: '',
    highlights: [],
    delivery_postcodes: [],
    status: 'Active',
    food_image: '',
    avatar: '',
    currentWeek: {},
    nextWeek: {}
  };
  var statusBadge = s => (s || 'active').toLowerCase() === 'active' ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-green"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-circle",
    style: {
      fontSize: '0.5rem'
    }
  }), "Active") : /*#__PURE__*/React.createElement("span", {
    className: "badge badge-yellow"
  }, "Paused");
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "section-title"
  }, "Active Chefs"), /*#__PURE__*/React.createElement("p", {
    className: "section-subtitle"
  }, chefs.length, " chefs \xB7 ", chefs.filter(c => (c.status || 'active').toLowerCase() === 'active').length, " active")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "search-input",
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search chefs\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setModal({
      chef: {
        ...newChef
      }
    })
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-plus"
  }), " Add Chef"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Chef"), /*#__PURE__*/React.createElement("th", null, "Cuisine"), /*#__PURE__*/React.createElement("th", null, "Price/Week"), /*#__PURE__*/React.createElement("th", null, "Commission"), /*#__PURE__*/React.createElement("th", null, "Rating"), /*#__PURE__*/React.createElement("th", null, "Subscribers"), /*#__PURE__*/React.createElement("th", null, "Postcodes"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(c => {
    var subCount = (window.ADM.subscribers || []).filter(s => s.chef_id === c.chef_id).length;
    return /*#__PURE__*/React.createElement("tr", {
      key: c.chef_id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }
    }, c.avatar ? /*#__PURE__*/React.createElement("img", {
      src: c.avatar,
      alt: c.chef_name,
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#F4F4F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-fill ph-user",
      style: {
        color: '#9CA3AF'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: '0.875rem'
      }
    }, c.chef_name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: '#9CA3AF',
        maxWidth: '160px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.bio?.slice(0, 50), c.bio?.length > 50 ? '…' : '')))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, c.cuisine_type)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700
      }
    }, "$", c.price_per_week), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        fontWeight: 600
      }
    }, c.commission_pct ?? 20, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.7rem',
        color: '#9CA3AF'
      }
    }, "Chef ", 100 - (c.commission_pct ?? 20), "%")), /*#__PURE__*/React.createElement("td", null, "\u2B50 ", c.rating), /*#__PURE__*/React.createElement("td", null, subCount), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
      }
    }, (c.delivery_postcodes || []).slice(0, 3).map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      className: "badge badge-gray"
    }, p)), (c.delivery_postcodes || []).length > 3 && /*#__PURE__*/React.createElement("span", {
      className: "badge badge-gray"
    }, "+", c.delivery_postcodes.length - 3))), /*#__PURE__*/React.createElement("td", null, statusBadge(c.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '6px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "Edit",
      onClick: () => setModal({
        chef: {
          ...c
        }
      })
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-pencil"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "Portal access",
      onClick: () => setAccess(c),
      style: {
        color: '#9CA3AF'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-key"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "Unavailable weeks",
      onClick: () => setWeeksModal(c),
      style: {
        color: c.menus?.unavailable_weeks?.length > 0 ? '#D0342C' : '#9CA3AF'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-calendar-x"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      title: "Toggle status",
      onClick: () => {
        var newStatus = (c.status || 'active').toLowerCase() === 'active' ? 'active' : 'paused';
        window.ADM.updateChef({
          ...c,
          status: newStatus
        }).then(function (updated) {
          setChefs(function (prev) {
            return prev.map(function (ch) {
              return ch.chef_id === c.chef_id ? updated : ch;
            });
          });
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `ph-bold ${(c.status || 'active').toLowerCase() === 'active' ? 'ph-pause' : 'ph-play'}`
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-icon",
      style: {
        color: '#D0342C'
      },
      onClick: () => setDel(c)
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-trash"
    })))));
  }), !filtered.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      textAlign: 'center',
      color: '#9CA3AF',
      padding: '32px'
    }
  }, "No chefs found"))))), modal && /*#__PURE__*/React.createElement(ChefModal, {
    chef: modal.chef,
    onSave: handleSave,
    onClose: () => setModal(null)
  }), delChef && /*#__PURE__*/React.createElement(DeleteConfirm, {
    chef: delChef,
    onConfirm: handleDelete,
    onCancel: () => setDel(null)
  }), access && /*#__PURE__*/React.createElement(ChefAccessModal, {
    chef: access,
    onClose: () => setAccess(null)
  }), weeksModal && /*#__PURE__*/React.createElement(UnavailableWeeksModal, {
    chef: weeksModal,
    onClose: () => setWeeksModal(null),
    onSave: function (updated) {
      setChefs(function (prev) {
        return prev.map(function (ch) {
          return ch.chef_id === updated.chef_id ? updated : ch;
        });
      });
    }
  }));
}

// ─────────────────────────────────────────────
// Menu Approvals Page
// ─────────────────────────────────────────────
var DAY_LABELS_MAP = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri'
};
function MenuApprovalsPage({
  menus: initialMenus,
  onUpdate,
  onClearBadge
}) {
  var [menus, setMenus] = useState(initialMenus || []);
  var [detail, setDetail] = useState(null);
  React.useEffect(function () {
    onClearBadge && onClearBadge();
  }, []);
  // Keep in sync if parent reloads
  React.useEffect(function () {
    setMenus(initialMenus || []);
  }, [initialMenus]);
  var persist = (id, status, reason) => {
    window.ADM.updateMenu(id, status, reason).then(function () {
      onUpdate && onUpdate();
    }).catch(function (e) {
      alert('Error: ' + e.message);
    });
  };

  // Check if this submission repeats dishes from a different week for the same chef
  var findRepeats = submission => {
    var others = menus.filter(m => m.chef_id === submission.chef_id && m.id !== submission.id && m.status === 'approved');
    var allOtherDishes = new Set();
    others.forEach(m => {
      Object.values(m.menu_data || {}).forEach(dishes => {
        (dishes || []).forEach(d => {
          if (d.dish_name) allOtherDishes.add(d.dish_name.toLowerCase().trim());
        });
      });
    });
    var repeats = [];
    Object.values(submission.menu_data || {}).forEach(dishes => {
      (dishes || []).forEach(d => {
        if (d.dish_name && allOtherDishes.has(d.dish_name.toLowerCase().trim())) repeats.push(d.dish_name);
      });
    });
    return [...new Set(repeats)];
  };
  var handleApprove = sub => {
    // API handles applying approved menu to chef record server-side
    persist(sub.id, 'approved', null);
    setDetail(null);
  };
  var handleReject = (sub, reason) => {
    persist(sub.id, 'rejected', reason);
    setDetail(null);
  };
  var pending = menus.filter(m => m.status === 'pending');
  var reviewed = menus.filter(m => m.status !== 'pending');
  var statusBadge = s => ({
    pending: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-yellow"
    }, "Pending Review"),
    approved: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green"
    }, "Approved"),
    rejected: /*#__PURE__*/React.createElement("span", {
      className: "badge badge-red"
    }, "Rejected")
  })[s] || /*#__PURE__*/React.createElement("span", {
    className: "badge badge-gray"
  }, s);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "section-title"
  }, "Menu Approvals"), /*#__PURE__*/React.createElement("p", {
    className: "section-subtitle"
  }, pending.length, " pending \xB7 ", reviewed.length, " reviewed"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFF7ED',
      border: '1px solid #FED7AA',
      borderRadius: '10px',
      padding: '14px 18px',
      marginBottom: '20px',
      fontSize: '0.85rem',
      color: '#92400E',
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-warning",
    style: {
      fontSize: '1.1rem',
      flexShrink: 0,
      marginTop: '1px'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Menu repeat rule:"), " Chefs cannot submit the same dishes two consecutive weeks. Repeated dishes will be highlighted in red \u2014 reject and ask the chef to revise their menu.")), menus.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      textAlign: 'center',
      padding: '48px',
      color: '#9CA3AF'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-calendar-blank",
    style: {
      fontSize: '2.5rem',
      display: 'block',
      marginBottom: '12px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 600,
      color: '#5A5D66'
    }
  }, "No menu submissions yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      marginTop: '4px'
    }
  }, "Menus submitted by chefs via the Chef Portal will appear here for review.")), pending.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      marginBottom: '12px'
    }
  }, "Awaiting Review (", pending.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Chef"), /*#__PURE__*/React.createElement("th", null, "Week"), /*#__PURE__*/React.createElement("th", null, "Submitted"), /*#__PURE__*/React.createElement("th", null, "Dishes"), /*#__PURE__*/React.createElement("th", null, "Repeat?"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, pending.map(sub => {
    var totalDishes = Object.values(sub.menu_data || {}).reduce((t, d) => t + (d || []).filter(x => x.dish_name).length, 0);
    var repeats = findRepeats(sub);
    return /*#__PURE__*/React.createElement("tr", {
      key: sub.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, sub.chef_name)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: '0.82rem'
      }
    }, sub.week === 'currentWeek' ? 'This Week' : 'Next Week'), /*#__PURE__*/React.createElement("td", {
      style: {
        color: '#9CA3AF',
        fontSize: '0.82rem'
      }
    }, sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "badge badge-blue"
    }, totalDishes, " dishes")), /*#__PURE__*/React.createElement("td", null, repeats.length > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "badge badge-red",
      title: repeats.join(', ')
    }, "\u26A0 ", repeats.length, " repeat", repeats.length > 1 ? 's' : '') : /*#__PURE__*/React.createElement("span", {
      className: "badge badge-green"
    }, "\u2713 All new")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '6px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-outline btn-sm",
      onClick: () => setDetail(sub)
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-eye"
    }), " Review"), repeats.length === 0 && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-success btn-sm",
      onClick: () => handleApprove(sub)
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-check"
    }), " Approve"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-danger btn-sm",
      onClick: () => handleReject(sub, 'Menu contains repeated dishes or other issue')
    }, /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-x"
    }), " Reject"))));
  }))))), reviewed.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: '#9CA3AF',
      marginBottom: '12px'
    }
  }, "Reviewed (", reviewed.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "data-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Chef"), /*#__PURE__*/React.createElement("th", null, "Week"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Reviewed"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, reviewed.map(sub => /*#__PURE__*/React.createElement("tr", {
    key: sub.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, sub.chef_name), /*#__PURE__*/React.createElement("td", {
    style: {
      fontSize: '0.82rem'
    }
  }, sub.week === 'currentWeek' ? 'This Week' : 'Next Week'), /*#__PURE__*/React.createElement("td", null, statusBadge(sub.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: '#9CA3AF',
      fontSize: '0.82rem'
    }
  }, sub.reviewed_at || '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm",
    onClick: () => setDetail(sub)
  }, "View")))))))), detail && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && setDetail(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: {
      maxWidth: '600px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1rem',
      fontWeight: 800,
      margin: 0
    }
  }, detail.chef_name, " \u2014 ", detail.week === 'currentWeek' ? 'This Week' : 'Next Week'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: '#9CA3AF',
      margin: 0
    }
  }, "Submitted ", detail.submitted_at ? new Date(detail.submitted_at).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '—')), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setDetail(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, (() => {
    var repeats = new Set(findRepeats(detail).map(r => r.toLowerCase().trim()));
    return Object.entries(detail.menu_data || {}).map(([day, dishes]) => {
      var named = (dishes || []).filter(d => d.dish_name);
      if (!named.length) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: day,
        style: {
          marginBottom: '16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700,
          fontSize: '0.82rem',
          color: '#5A5D66',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }
      }, DAY_LABELS_MAP[day] || day), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }
      }, named.map((d, i) => {
        var isRepeat = repeats.has((d.dish_name || '').toLowerCase().trim());
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            background: isRepeat ? '#FEF2F2' : '#F8F8F8',
            borderRadius: '8px',
            border: isRepeat ? '1px solid #FECACA' : 'none'
          }
        }, d.dish_image && /*#__PURE__*/React.createElement("img", {
          src: d.dish_image,
          style: {
            width: '36px',
            height: '36px',
            objectFit: 'cover',
            borderRadius: '6px'
          },
          onError: e => e.target.style.display = 'none'
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: isRepeat ? '#D0342C' : '#111'
          }
        }, d.dish_name), /*#__PURE__*/React.createElement("span", {
          className: "badge badge-gray",
          style: {
            fontSize: '0.68rem',
            marginLeft: 'auto'
          }
        }, d.dish_type), isRepeat && /*#__PURE__*/React.createElement("span", {
          className: "badge badge-red",
          style: {
            fontSize: '0.68rem'
          }
        }, "Repeat!"));
      })));
    });
  })()), detail.status === 'pending' && /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => handleReject(detail, 'Menu contains repeated dishes')
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }), " Reject"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => handleApprove(detail)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-check"
  }), " Approve Menu")))));
}
Object.assign(window.ADM, {
  ChefsPage,
  ApplicationsPage,
  MenuApprovalsPage
});