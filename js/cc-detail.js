// ─── CHEF DETAIL PAGE ───
window.CC = window.CC || {};
var { useState } = React;
var { DAYS, DAY_LABELS, DISH_TYPE_COLORS, POSTCODE_SUBURB_MAP } = window.CC;

function DishItem({ dish }) {
  var style = DISH_TYPE_COLORS[dish.dish_type] || { bg: "#F4F4F4", color: "#5A5D66" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F4F4F4" }}>
      <img
        src={dish.photo_url || dish.dish_image || ""}
        alt={dish.dish_name}
        style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
        onError={e => { e.target.style.background = "#F4F4F4"; e.target.src = ""; }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dish.dish_name}</p>
        <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: style.bg, color: style.color, display: "inline-block", marginTop: "2px" }}>
          {dish.dish_type}
        </span>
      </div>
    </div>
  );
}

function DayCard({ day, dishes }) {
  return (
    <div style={{ minWidth: "220px", maxWidth: "240px", background: "white", borderRadius: "12px", border: "1px solid #E5E5E5", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ background: "#111", color: "white", padding: "10px 16px" }}>
        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", color: "#FACA50", textTransform: "uppercase" }}>{DAY_LABELS[day]}</p>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#9CA3AF" }}>{dishes.length} items</p>
      </div>
      <div style={{ padding: "0 14px 8px" }}>
        {dishes.map((d, i) => <DishItem key={i} dish={d} />)}
      </div>
    </div>
  );
}

function computeWeekLabel(weeksAhead) {
  var d = new Date();
  var day = d.getDay();
  var daysToMon = day === 0 ? 1 : (8 - day) % 7 || 7;
  var mon = new Date(d); mon.setDate(d.getDate() + daysToMon + weeksAhead * 7);
  var fri = new Date(mon); fri.setDate(mon.getDate() + 4);
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mon.getDate() + ' ' + M[mon.getMonth()] + ' – ' + fri.getDate() + ' ' + M[fri.getMonth()];
}

function ChefDetailPage({ chef, setPage }) {
  var [activeWeek, setActiveWeek] = useState("currentWeek");
  var menu = (chef.menus && chef.menus[activeWeek]) || {};

  var currentWeekLabel = (chef.menus && chef.menus.currentWeek && chef.menus.currentWeek.week_label) || computeWeekLabel(0);
  var nextWeekLabel    = (chef.menus && chef.menus.nextWeek    && chef.menus.nextWeek.week_label)    || computeWeekLabel(1);

  var suburbs = chef.delivery_postcodes.map(pc => {
    var name = (window.CC.POSTCODE_SUBURB_MAP || {})[pc] || pc;
    return name;
  });

  return (
    <div className="fade-in">
      {/* Back */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px 0" }}>
        <button
          onClick={() => setPage({ name: "home" })}
          style={{ background: "white", border: "1.5px solid #E5E5E5", borderRadius: "8px", cursor: "pointer", color: "#111", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#F4F4F4"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.background = "white"; }}
        >
          <i className="ph-bold ph-arrow-left"></i> Back to chefs
        </button>
      </div>

      {/* Chef header */}
      <div style={{ background: "#F4F4F4", marginTop: "16px", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <img
            src={chef.photo_url}
            alt={chef.chef_name}
            style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "4px solid white", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.chef_name)}&background=FACA50&color=111&size=110`; }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0, color: "#111" }}>{chef.chef_name}</h1>
              <span style={{ background: "#FACA50", color: "#111", fontWeight: 700, fontSize: "0.82rem", padding: "4px 14px", borderRadius: "20px" }}>{chef.cuisine_type}</span>
              <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem" }}>⭐ {chef.rating} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({chef.review_count} reviews)</span></span>
            </div>
            <p style={{ color: "#5A5D66", margin: "8px 0 16px", maxWidth: "600px", lineHeight: 1.6, fontSize: "0.95rem" }}>{chef.bio}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
              {chef.tags.map((t, i) => (
                <span key={i} className="tag"><i className="ph-fill ph-check-circle" style={{ color: "#3A813D", fontSize: "0.85rem" }}></i>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#5A5D66", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="ph-fill ph-map-pin" style={{ color: "#FACA50" }}></i>
              Delivers to: <strong style={{ color: "#111" }}>{suburbs.join(", ")}</strong>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#111", lineHeight: 1 }}>${chef.price_per_week}</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.85rem", marginBottom: "16px" }}>per week</div>
            <button
              className="btn btn-primary"
              onClick={() => { setPage({ name: "subscribe", chef }); window.scrollTo(0, 0); }}
            >
              Subscribe to {chef.chef_name} →
            </button>
          </div>
        </div>
      </div>

      {/* Menu section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Week toggle + notice */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px", color: "#111" }}>Weekly Menu</h2>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#9CA3AF", display: "flex", alignItems: "center", gap: "4px" }}>
              <i className="ph-fill ph-warning" style={{ color: "#F59E0B" }}></i>
              Menus change weekly — order by Sunday to lock in your week
            </p>
          </div>
          <div style={{ display: "flex", background: "#F4F4F4", borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {[
              { key: "currentWeek", label: `This Week (${currentWeekLabel})` },
              { key: "nextWeek", label: `Next Week (${nextWeekLabel})` },
            ].map(w => (
              <button
                key={w.key}
                onClick={() => setActiveWeek(w.key)}
                style={{
                  padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.15s",
                  background: activeWeek === w.key ? "white" : "transparent",
                  color: activeWeek === w.key ? "#111" : "#5A5D66",
                  boxShadow: activeWeek === w.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >{w.label}</button>
            ))}
          </div>
        </div>

        {/* Day cards horizontal scroll */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
          {DAYS.map(day => {
            var dishes = (menu[day] || []).filter(d => d.dish_name && d.dish_name.trim());
            return dishes.length > 0 && (
              <DayCard key={day} day={day} dishes={dishes} />
            );
          })}
        </div>

        {/* Big subscribe CTA */}
        <div style={{ marginTop: "48px", background: "#F4F4F4", borderRadius: "16px", padding: "40px 32px", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111", margin: "0 0 8px" }}>Ready to subscribe?</h3>
          <p style={{ color: "#5A5D66", margin: "0 0 24px" }}>
            ${chef.price_per_week}/week · 5 meals · Mon–Fri delivery · Cancel anytime
          </p>
          <button
            className="btn btn-primary"
            style={{ fontSize: "1rem", padding: "14px 40px" }}
            onClick={() => { setPage({ name: "subscribe", chef }); window.scrollTo(0, 0); }}
          >
            Subscribe to {chef.chef_name}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window.CC, { DishItem, DayCard, ChefDetailPage });
