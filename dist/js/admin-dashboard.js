// ─── DASHBOARD ───
window.ADM = window.ADM || {};
var {
  useState
} = React;

// ── Mini SVG Line Chart ──
function LineChart({
  data,
  color = '#FACA50',
  height = 120
}) {
  if (!data || data.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: height + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#CCC',
        fontSize: '0.85rem'
      }
    }, "No data yet");
  }
  var w = 600,
    h = height,
    padX = 40,
    padY = 16;
  var cW = w - padX * 2,
    cH = h - padY * 2;
  var max = Math.max(...data.map(d => d.v), 1);
  var pts = data.map((d, i) => ({
    x: padX + i / Math.max(data.length - 1, 1) * cW,
    y: padY + cH - d.v / max * cH
  }));
  var linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  var areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${padY + cH} L${pts[0].x.toFixed(1)},${padY + cH}Z`;
  var step = Math.ceil(data.length / 8);
  return /*#__PURE__*/React.createElement("div", {
    className: "chart-wrap"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    style: {
      width: '100%',
      display: 'block',
      overflow: 'visible'
    }
  }, [0, 0.5, 1].map(t => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("line", {
    x1: padX,
    y1: padY + cH * (1 - t),
    x2: padX + cW,
    y2: padY + cH * (1 - t),
    stroke: "#F0F0F0",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: padX - 6,
    y: padY + cH * (1 - t) + 4,
    textAnchor: "end",
    fontSize: "10",
    fill: "#CCC"
  }, Math.round(max * t)))), /*#__PURE__*/React.createElement("path", {
    d: areaPath,
    fill: color,
    fillOpacity: "0.08"
  }), /*#__PURE__*/React.createElement("path", {
    d: linePath,
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.filter((_, i) => i % step === 0 || i === data.length - 1).map((p, idx) => {
    var di = idx * step;
    return /*#__PURE__*/React.createElement("g", {
      key: idx
    }, /*#__PURE__*/React.createElement("circle", {
      cx: p.x,
      cy: p.y,
      r: "3.5",
      fill: color
    }), /*#__PURE__*/React.createElement("text", {
      x: p.x,
      y: padY + cH + 14,
      textAnchor: "middle",
      fontSize: "9",
      fill: "#AAA"
    }, data[di]?.lbl || ''));
  })));
}

// ── Bar Chart ──
function BarChart({
  bars
}) {
  if (!bars || bars.every(b => b.v === 0)) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '130px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#CCC',
        fontSize: '0.85rem'
      }
    }, "No subscribers yet");
  }
  var max = Math.max(...bars.map(b => b.v), 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      height: '130px',
      padding: '0 4px 24px'
    }
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      height: '100%',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      fontWeight: 700,
      color: '#111'
    }
  }, b.v), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      background: '#FACA50',
      borderRadius: '4px 4px 0 0',
      height: `${b.v / max * 90}px`,
      minHeight: b.v > 0 ? '4px' : '0',
      transition: 'height 0.4s ease'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.68rem',
      color: '#9CA3AF',
      textAlign: 'center',
      maxWidth: '64px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, b.label))));
}

// ── Ratio bar ──
function RatioBar({
  value,
  total,
  color = '#FACA50',
  label
}) {
  var pct = total ? Math.round(value / total * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: '#5A5D66'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#111'
    }
  }, value, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#9CA3AF',
      fontWeight: 400
    }
  }, "(", pct, "%)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px',
      background: '#F4F4F4',
      borderRadius: '3px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: '3px',
      transition: 'width 0.4s'
    }
  })));
}
function EmptyState({
  icon,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      color: '#CCC',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: '2rem'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem'
    }
  }, text));
}
function DashboardPage({
  chefs,
  subscribers
}) {
  var activeChefs = chefs.filter(c => (c.status || 'Active').toLowerCase() === 'active').length;
  var totalSubs = subscribers.length;

  // Payments: each subscriber has a payments[] array with { week, confirmed }
  var confirmedPayments = subscribers.reduce((t, s) => t + (s.payments || []).filter(p => p.confirmed).length, 0);
  var pendingPayments = subscribers.reduce((t, s) => t + (s.payments || []).filter(p => !p.confirmed).length, 0);
  var confirmedRevenue = subscribers.reduce((total, s) => {
    var chef = chefs.find(c => c.chef_id === s.chef_id);
    if (!chef) return total;
    return total + (s.payments || []).filter(p => p.confirmed).length * chef.price_per_week;
  }, 0);
  var platformFee = Math.round(confirmedRevenue * 0.2);
  var chefSubCounts = chefs.map(c => ({
    label: c.chef_name.replace('Chef ', ''),
    v: subscribers.filter(s => s.chef_id === c.chef_id).length
  }));
  var paymentBreakdown = [{
    label: 'Confirmed',
    v: confirmedPayments
  }, {
    label: 'Pending',
    v: pendingPayments
  }];
  var recentActivity = subscribers.slice(-6).reverse().map(s => ({
    icon: 'ph-fill ph-user-plus',
    color: '#3A813D',
    text: `${s.name} subscribed to ${s.chef_name}`,
    time: s.created
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "section-title"
  }, "Dashboard"), /*#__PURE__*/React.createElement("p", {
    className: "section-subtitle"
  }, "Overview of your Home Meal marketplace"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '16px',
      marginBottom: '24px'
    }
  }, [{
    label: 'Total Subscribers',
    value: totalSubs,
    delta: totalSubs === 0 ? 'No subscribers yet' : `${totalSubs} active`,
    cls: 'neutral',
    icon: 'ph-fill ph-users-three'
  }, {
    label: 'Active Chefs',
    value: activeChefs,
    delta: `${chefs.length - activeChefs} paused`,
    cls: 'neutral',
    icon: 'ph-fill ph-chef-hat'
  }, {
    label: 'Confirmed Revenue',
    value: `$${confirmedRevenue}`,
    delta: `${confirmedPayments} week payment${confirmedPayments !== 1 ? 's' : ''} confirmed`,
    cls: 'neutral',
    icon: 'ph-fill ph-currency-circle-dollar'
  }, {
    label: 'Platform Fee (20%)',
    value: `$${platformFee}`,
    delta: pendingPayments > 0 ? `${pendingPayments} pending confirmation` : 'All payments confirmed',
    cls: 'neutral',
    icon: 'ph-fill ph-trend-up'
  }].map(card => /*#__PURE__*/React.createElement("div", {
    key: card.label,
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-label"
  }, card.label), /*#__PURE__*/React.createElement("i", {
    className: card.icon,
    style: {
      fontSize: '1.1rem',
      color: '#FACA50'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "stat-value"
  }, card.value), /*#__PURE__*/React.createElement("span", {
    className: `stat-delta ${card.cls}`
  }, card.delta)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      margin: '0 0 16px'
    }
  }, "Subscribers by Chef"), /*#__PURE__*/React.createElement(BarChart, {
    bars: chefSubCounts
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      margin: '0 0 16px'
    }
  }, "Payment Status"), confirmedPayments + pendingPayments > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, paymentBreakdown.map(p => /*#__PURE__*/React.createElement(RatioBar, {
    key: p.label,
    label: p.label,
    value: p.v,
    total: confirmedPayments + pendingPayments,
    color: p.label === 'Confirmed' ? '#3A813D' : '#F59E0B'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: '#5A5D66',
      borderTop: '1px solid #F4F4F4',
      paddingTop: '12px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total payment records"), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#111'
    }
  }, confirmedPayments + pendingPayments))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "ph-fill ph-credit-card",
    text: "No payments yet"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      margin: '0 0 16px'
    }
  }, "Subscribers by Cuisine"), totalSubs > 0 ? (() => {
    var byCuisine = {};
    chefs.forEach(c => {
      var key = c.cuisine_type || 'Other';
      var count = subscribers.filter(s => s.chef_id === c.chef_id).length;
      byCuisine[key] = (byCuisine[key] || 0) + count;
    });
    return Object.entries(byCuisine).map(([cuisine, count]) => /*#__PURE__*/React.createElement(RatioBar, {
      key: cuisine,
      label: cuisine,
      value: count,
      total: totalSubs,
      color: "#FACA50"
    }));
  })() : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "ph-fill ph-bowl-food",
    text: "No subscribers yet"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      margin: '0 0 16px'
    }
  }, "Recent Activity"), recentActivity.length > 0 ? recentActivity.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      paddingBottom: '12px',
      marginBottom: '12px',
      borderBottom: i < recentActivity.length - 1 ? '1px solid #F4F4F4' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(58,129,61,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: a.icon,
    style: {
      fontSize: '0.9rem',
      color: a.color
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.85rem',
      color: '#111',
      fontWeight: 500
    }
  }, a.text), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.75rem',
      color: '#9CA3AF'
    }
  }, a.time)))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "ph-fill ph-clock-clockwise",
    text: "No activity yet \u2014 subscribers will appear here"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      margin: '0 0 16px'
    }
  }, "Chefs at a Glance"), chefs.map(c => {
    var count = subscribers.filter(s => s.chef_id === c.chef_id).length;
    var status = c.status || 'Active';
    return /*#__PURE__*/React.createElement("div", {
      key: c.chef_id,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #F4F4F4'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }
    }, c.avatar ? /*#__PURE__*/React.createElement("img", {
      src: c.avatar,
      alt: c.chef_name,
      style: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: '32px',
        height: '32px',
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
        fontSize: '0.85rem',
        fontWeight: 600
      }
    }, c.chef_name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: '#9CA3AF'
      }
    }, c.cuisine_type))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.85rem',
        fontWeight: 700
      }
    }, count, " subs"), /*#__PURE__*/React.createElement("span", {
      className: `badge ${status === 'Active' ? 'badge-green' : 'badge-yellow'}`,
      style: {
        fontSize: '0.65rem'
      }
    }, status)));
  }))));
}
Object.assign(window.ADM, {
  DashboardPage,
  LineChart,
  BarChart
});