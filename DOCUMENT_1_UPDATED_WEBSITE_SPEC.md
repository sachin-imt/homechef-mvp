# HomeChef Sydney - Complete Website Specification (UPDATED)
## Technical Specification for AI Agent / Developer

---

## PROJECT OVERVIEW

Build a three-tier home-cooked meal marketplace website:
1. **Customer homepage** with cuisine filtering and postcode search
2. **Chef detail pages** with daily menu displays (Monday-Friday) and week toggles
3. **Chef portal** for menu submission, pricing, and delivery area management

**Technology Stack:** Softr.io + Airtable (recommended) OR custom build with React/Next.js
**Timeline:** 3-5 days
**Core Function:** Display weekly rotating menus, filter by cuisine/location, capture subscriptions

---

## SITE STRUCTURE

```
homechefsydney.com.au
├── / (Homepage - Browse & Filter Chefs)
├── /chef/[chef-id] (Chef Detail Page with Daily Menus)
├── /subscribe (Customer Subscription Form)
├── /chef-portal (Chef Menu Submission Portal)
├── /how-it-works (Explainer Page)
└── /about (About Us Page)
```

---

## DATABASE SCHEMA (Airtable Tables)

### Table 1: Chefs
| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| chef_id | Auto-number | Yes | Primary key |
| chef_name | Single line text | Yes | Display name (e.g., "Chef Priya") |
| cuisine_type | Single select | Yes | Options: Indian, Thai, Italian, Mediterranean, Chinese, Lebanese, Vietnamese, Japanese, Korean, Mexican |
| email | Email | Yes | Contact email |
| phone | Phone number | Yes | Contact number |
| bio | Long text | Yes | Max 200 characters |
| photo_url | Attachment | Yes | Chef profile photo, 300x300px |
| price_per_week | Currency | Yes | Price customers pay (e.g., $75) |
| delivery_postcodes | Multiple select | Yes | Postcodes where chef delivers (e.g., 2042, 2204, 2203) |
| status | Single select | Yes | Options: Active, Paused, Offboarded |
| rating | Number | No | Average rating (0-5) |
| review_count | Number | No | Total reviews |
| total_orders | Number | No | Total completed orders |
| created_date | Date | Yes | Auto-filled |

### Table 2: Weekly Menus
| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| menu_id | Auto-number | Yes | Primary key |
| chef_id | Linked record | Yes | Links to Chefs table |
| week_start_date | Date | Yes | Monday of the week (e.g., Apr 1, 2025) |
| week_label | Formula | Yes | Auto-generates "Apr 1-5" from week_start_date |
| status | Single select | Yes | Options: Draft, Published, Archived |

### Table 3: Daily Menu Items
| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| item_id | Auto-number | Yes | Primary key |
| menu_id | Linked record | Yes | Links to Weekly Menus table |
| day_of_week | Single select | Yes | Options: Monday, Tuesday, Wednesday, Thursday, Friday |
| dish_name | Single line text | Yes | Name of dish (e.g., "Butter Chicken") |
| dish_type | Single select | Yes | Options: Main, Side, Bread, Accompaniment, Dessert, Snack |
| dish_photo | Attachment | Yes | Photo of dish, 600x400px |
| sort_order | Number | Yes | Display order within the day (1, 2, 3, 4) |

### Table 4: Customer Subscriptions
| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| subscription_id | Auto-number | Yes | Primary key |
| customer_name | Single line text | Yes | |
| email | Email | Yes | |
| phone | Phone number | Yes | |
| street_address | Long text | Yes | |
| suburb | Single line text | Yes | |
| postcode | Single line text | Yes | 4 digits |
| state | Single line text | Yes | NSW (fixed) |
| delivery_notes | Long text | No | |
| chef_id | Linked record | Yes | Links to Chefs table |
| menu_id | Linked record | Yes | Links to Weekly Menus table |
| week_subscribed | Date | Yes | Which week they're subscribing to |
| dietary_restrictions | Long text | No | |
| payment_method | Single select | Yes | Options: Bank Transfer, Stripe |
| payment_status | Single select | Yes | Options: Pending, Paid, Refunded |
| delivery_status | Single select | Yes | Options: Scheduled, Delivered, Failed, Cancelled |
| created_date | Date | Yes | Auto-filled |
| feedback_rating | Number | No | 1-5 stars |
| feedback_text | Long text | No | |

---

## PAGE 1: HOMEPAGE (Customer Browse & Filter)

### URL: `/`

### Layout Structure

**Header Section:**
```html
<header class="hero">
  <div class="container">
    <h1>Authentic Home-Cooked Meals Delivered Weekly</h1>
    <p>Subscribe to local chefs. Get 5 delicious meals. Support your community.</p>
  </div>
</header>
```

**Filter Bar (Sticky below hero):**
```html
<section class="filter-bar">
  <div class="container">
    <h3>🔍 Find Your Perfect Chef</h3>
    
    <!-- Cuisine Filter Buttons -->
    <div class="cuisine-filters">
      <button class="cuisine-btn active" data-cuisine="all">All Cuisines</button>
      <button class="cuisine-btn" data-cuisine="indian">Indian</button>
      <button class="cuisine-btn" data-cuisine="thai">Thai</button>
      <button class="cuisine-btn" data-cuisine="italian">Italian</button>
      <button class="cuisine-btn" data-cuisine="mediterranean">Mediterranean</button>
      <button class="cuisine-btn" data-cuisine="chinese">Chinese</button>
      <button class="cuisine-btn" data-cuisine="lebanese">Lebanese</button>
      <button class="cuisine-btn" data-cuisine="vietnamese">Vietnamese</button>
    </div>
    
    <!-- Postcode Search -->
    <div class="location-input">
      <span>📍</span>
      <input type="text" id="postcode-search" placeholder="Enter your postcode (e.g., 2042, 2204)" maxlength="4">
      <button id="find-chefs-btn">Find Chefs</button>
    </div>
    <p class="helper-text">We'll show you chefs who deliver to your area</p>
  </div>
</section>
```

**Chef Grid:**
```html
<section class="chef-grid-section">
  <div class="container">
    <div class="chef-grid" id="chef-grid">
      <!-- Chef cards dynamically populated here -->
    </div>
  </div>
</section>
```

### Chef Card Component (Individual Card)

```html
<div class="chef-card" data-cuisine="indian" data-postcodes="2042,2204,2203">
  <div class="chef-card-header">
    <img src="[chef_photo_url]" alt="Chef Priya" class="chef-avatar">
    <div class="chef-info">
      <h3>[chef_name]</h3>
      <div class="chef-cuisine">[cuisine_type]</div>
      <div class="chef-rating">⭐ [rating] ([review_count] reviews)</div>
      <div class="chef-delivery">📍 [delivery_postcodes]</div>
    </div>
  </div>
  
  <div class="menu-preview">
    <h4>This Week's Highlights</h4>
    <div class="menu-items-preview">
      <!-- Show 4 dishes from this week's Monday menu -->
      <div class="menu-item-small">🍛 [dish_name_1]</div>
      <div class="menu-item-small">🥘 [dish_name_2]</div>
      <div class="menu-item-small">🍚 [dish_name_3]</div>
      <div class="menu-item-small">🫓 [dish_name_4]</div>
    </div>
  </div>
  
  <div class="chef-card-footer">
    <div class="price-tag">$[price_per_week]/week</div>
    <a href="/chef/[chef_id]" class="view-menu-btn">View Full Menu</a>
  </div>
</div>
```

### Filtering Logic (JavaScript)

**Cuisine Filtering:**
```javascript
// When cuisine button clicked
document.querySelectorAll('.cuisine-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Update active state
    document.querySelectorAll('.cuisine-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const selectedCuisine = this.dataset.cuisine;
    
    // Filter chef cards
    document.querySelectorAll('.chef-card').forEach(card => {
      if (selectedCuisine === 'all') {
        card.style.display = 'block';
      } else {
        const cardCuisine = card.dataset.cuisine.toLowerCase();
        card.style.display = cardCuisine === selectedCuisine ? 'block' : 'none';
      }
    });
  });
});
```

**Postcode Filtering:**
```javascript
// When "Find Chefs" button clicked
document.getElementById('find-chefs-btn').addEventListener('click', function() {
  const enteredPostcode = document.getElementById('postcode-search').value.trim();
  
  if (!enteredPostcode || enteredPostcode.length !== 4) {
    alert('Please enter a valid 4-digit postcode');
    return;
  }
  
  // Filter chef cards by postcode
  document.querySelectorAll('.chef-card').forEach(card => {
    const chefPostcodes = card.dataset.postcodes.split(',');
    
    if (chefPostcodes.includes(enteredPostcode)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show "no results" message if needed
  const visibleCards = document.querySelectorAll('.chef-card[style="display: block"]').length;
  if (visibleCards === 0) {
    // Display "No chefs deliver to your area" message
  }
});
```

### Data Population

**How to fetch and display chef cards:**

**Option A (Softr + Airtable):**
- Softr automatically generates chef cards from Airtable "Chefs" table
- Filter by `status = "Active"`
- For each chef, fetch the LATEST published menu (status = "Published", week_start_date >= today)
- Fetch first 4 dishes from Monday of that menu to show in preview

**Option B (Custom build):**
```javascript
// Fetch chefs and their current week's menu
async function loadChefs() {
  const response = await fetch('/api/chefs?status=active');
  const chefs = await response.json();
  
  const chefGrid = document.getElementById('chef-grid');
  
  chefs.forEach(chef => {
    // Fetch this week's menu highlights (first 4 dishes from Monday)
    const highlights = chef.thisWeekMenu.monday.slice(0, 4);
    
    // Generate and append chef card HTML
    chefGrid.innerHTML += generateChefCard(chef, highlights);
  });
}
```

---

## PAGE 2: CHEF DETAIL PAGE (Full Weekly Menu)

### URL: `/chef/[chef_id]`

### Layout Structure

**Chef Header:**
```html
<section class="chef-detail-header">
  <div class="container">
    <div class="chef-detail-top">
      <img src="[chef_photo_url]" alt="[chef_name]" class="chef-detail-avatar">
      <div class="chef-detail-info">
        <h1>[chef_name]</h1>
        <div class="rating-delivery">
          ⭐ [rating] ([review_count] reviews) • [total_orders]+ orders completed
        </div>
        <div class="tags">
          <span class="tag">[cuisine_type]</span>
          <span class="tag">Vegetarian Options</span>
          <span class="tag">Halal</span>
          <!-- Tags can be dynamic based on chef attributes -->
        </div>
        <p class="chef-bio">[chef_bio]</p>
        <div class="delivery-zones">
          <strong>📍 Delivery Areas:</strong> [formatted_delivery_postcodes_with_suburbs]
        </div>
      </div>
    </div>
  </div>
</section>
```

**Week Toggle:**
```html
<section class="week-selector-section">
  <div class="container">
    <div class="week-selector">
      <button class="week-btn active" data-week="current">This Week (Apr 1-5)</button>
      <button class="week-btn" data-week="next">Next Week (Apr 8-12)</button>
    </div>
  </div>
</section>
```

**Menu Notice Banner:**
```html
<section class="menu-notice-section">
  <div class="container">
    <div class="menu-notice">
      ℹ️ <strong>Menus change weekly!</strong> [chef_name] creates fresh menus every week. 
      Lock in this week's menu by subscribing before Wednesday. Each meal includes a main dish, 
      side, bread, and accompaniment.
    </div>
  </div>
</section>
```

**Daily Menu Display (Horizontal Scroll):**
```html
<section class="daily-menu-section">
  <div class="container">
    <h3>This Week's Daily Menu (Apr 1-5)</h3>
    
    <div class="daily-menu-scroll">
      <div class="daily-menu-flex" id="daily-menu-container">
        <!-- Day cards dynamically populated for Mon-Fri -->
      </div>
    </div>
  </div>
</section>
```

### Day Card Component (Individual Day)

```html
<div class="day-card">
  <div class="day-header">MONDAY</div>
  
  <!-- Dishes for this day (3-5 dishes, flexible) -->
  <div class="dish-item">
    <img src="[dish_photo_url]" alt="[dish_name]" class="dish-image">
    <div class="dish-name">[dish_name]</div>
    <div class="dish-type">[dish_type]</div>
  </div>
  
  <div class="dish-item">
    <img src="[dish_photo_url]" alt="[dish_name]" class="dish-image">
    <div class="dish-name">[dish_name]</div>
    <div class="dish-type">[dish_type]</div>
  </div>
  
  <div class="dish-item">
    <img src="[dish_photo_url]" alt="[dish_name]" class="dish-image">
    <div class="dish-name">[dish_name]</div>
    <div class="dish-type">[dish_type]</div>
  </div>
  
  <!-- Repeat for each dish on this day -->
</div>
```

### Week Toggle Logic

```javascript
document.querySelectorAll('.week-btn').forEach(btn => {
  btn.addEventListener('click', async function() {
    // Update button states
    document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const selectedWeek = this.dataset.week; // 'current' or 'next'
    const chefId = getChefIdFromURL();
    
    // Fetch menu for selected week
    const response = await fetch(`/api/chef/${chefId}/menu?week=${selectedWeek}`);
    const menuData = await response.json();
    
    // Update daily menu display
    renderDailyMenus(menuData);
    
    // Update subscribe button to reference correct week
    updateSubscribeButton(menuData.menu_id, menuData.week_label);
  });
});

function renderDailyMenus(menuData) {
  const container = document.getElementById('daily-menu-container');
  container.innerHTML = '';
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  days.forEach(day => {
    const dayDishes = menuData.dishes.filter(dish => dish.day_of_week === day)
                                      .sort((a, b) => a.sort_order - b.sort_order);
    
    const dayCardHTML = `
      <div class="day-card">
        <div class="day-header">${day.toUpperCase()}</div>
        ${dayDishes.map(dish => `
          <div class="dish-item">
            <img src="${dish.dish_photo}" alt="${dish.dish_name}" class="dish-image">
            <div class="dish-name">${dish.dish_name}</div>
            <div class="dish-type">${dish.dish_type}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    container.innerHTML += dayCardHTML;
  });
}
```

### Subscribe Section

```html
<section class="subscribe-section">
  <div class="container">
    <div class="subscribe-box">
      <div class="price">$[price_per_week]/week</div>
      <p class="price-note">5 days of authentic [cuisine_type] home cooking • Delivered Mon-Fri 5-8pm</p>
      <a href="/subscribe?chef=[chef_id]&menu=[menu_id]" class="subscribe-btn-large">
        Subscribe to [chef_name] - This Week
      </a>
      <p class="terms">Cancel anytime • First week money-back guarantee • No long-term commitment</p>
    </div>
  </div>
</section>
```

### Data Fetching Requirements

**On page load:**
1. Fetch chef details by chef_id from URL
2. Fetch "This Week's" menu (menu where week_start_date is the current week Monday)
3. Fetch all Daily Menu Items for that menu_id, grouped by day_of_week
4. Render day cards Monday-Friday

**When "Next Week" button clicked:**
1. Fetch "Next Week's" menu (menu where week_start_date is next Monday)
2. Fetch all Daily Menu Items for that menu_id
3. Re-render day cards

**Backend API Endpoints Needed:**
```
GET /api/chef/:chef_id
  Returns: chef object with all fields

GET /api/chef/:chef_id/menu?week=current|next
  Returns: {
    menu_id: 123,
    week_start_date: "2025-04-01",
    week_label: "Apr 1-5",
    dishes: [
      {
        dish_name: "Butter Chicken",
        dish_type: "Main",
        dish_photo: "url",
        day_of_week: "Monday",
        sort_order: 1
      },
      ...
    ]
  }
```

---

## PAGE 3: CHEF PORTAL (Menu Submission)

### URL: `/chef-portal`

### Authentication (If Implemented)

**Simple password-based access:**
- Each chef has a unique access link: `/chef-portal?token=[unique_token]`
- Token validates against chef_id in database
- OR: Simple email + password login

**For MVP (No Auth):**
- Open form, chef enters their email
- System matches email to chef_id
- All subsequent forms pre-fill with their chef_id

### Layout Structure

**Portal Header:**
```html
<header class="portal-header">
  <h1>Chef Menu Management Portal</h1>
  <p>Welcome, [chef_name]! Upload your weekly menus and manage pricing & delivery areas.</p>
</header>
```

### Section 1: Chef Profile & Pricing

```html
<section class="form-section">
  <div class="container">
    <h2>📋 Chef Profile & Pricing</h2>
    
    <form id="chef-profile-form">
      <input type="hidden" name="chef_id" value="[chef_id]">
      
      <div class="form-group">
        <label>Chef Name *</label>
        <input type="text" name="chef_name" required value="[chef_name]">
      </div>
      
      <div class="form-group-inline">
        <div class="form-group">
          <label>Cuisine Type *</label>
          <select name="cuisine_type" required>
            <option value="indian">Indian</option>
            <option value="thai">Thai</option>
            <option value="italian">Italian</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="chinese">Chinese</option>
            <option value="lebanese">Lebanese</option>
            <option value="vietnamese">Vietnamese</option>
            <option value="japanese">Japanese</option>
            <option value="korean">Korean</option>
            <option value="mexican">Mexican</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Price Per Week (AUD) *</label>
          <input type="number" name="price_per_week" required min="50" max="150" value="[price_per_week]">
          <p class="helper-text">Amount customers pay (you keep 80%)</p>
        </div>
      </div>
      
      <div class="form-group">
        <label>Chef Bio (max 200 characters) *</label>
        <textarea name="bio" required maxlength="200" rows="3">[chef_bio]</textarea>
        <p class="helper-text"><span id="bio-char-count">0</span>/200 characters</p>
      </div>
      
      <div class="form-group">
        <label>Chef Profile Photo *</label>
        <input type="file" name="chef_photo" accept="image/*">
        <p class="helper-text">Square photo (300x300px recommended), max 2MB</p>
        <img src="[current_photo_url]" alt="Current photo" class="photo-preview" style="display: [if photo exists: block; else: none]">
      </div>
      
      <div class="form-group">
        <label>Delivery Postcodes *</label>
        <div class="postcode-manager" id="postcode-manager">
          <div class="postcode-tags" id="postcode-tags">
            <!-- Existing postcodes rendered as tags -->
            <span class="postcode-tag">
              2042 
              <button type="button" class="remove-postcode" data-postcode="2042">×</button>
            </span>
            <span class="postcode-tag">
              2204 
              <button type="button" class="remove-postcode" data-postcode="2204">×</button>
            </span>
          </div>
          
          <div class="postcode-input-row">
            <input type="text" id="new-postcode" placeholder="e.g., 2042" maxlength="4" pattern="[0-9]{4}">
            <button type="button" id="add-postcode-btn">Add Postcode</button>
          </div>
          <p class="helper-text">Add all postcodes where you can deliver (within 5km of your location)</p>
        </div>
        
        <!-- Hidden input to store postcodes array -->
        <input type="hidden" name="delivery_postcodes" id="delivery-postcodes-hidden" value="2042,2204,2203">
      </div>
      
      <button type="submit" class="save-btn">💾 Save Profile Changes</button>
    </form>
  </div>
</section>
```

**Postcode Manager JavaScript:**
```javascript
const postcodesArray = ['2042', '2204', '2203']; // Load from database

function renderPostcodeTags() {
  const container = document.getElementById('postcode-tags');
  container.innerHTML = postcodesArray.map(postcode => `
    <span class="postcode-tag">
      ${postcode}
      <button type="button" class="remove-postcode" data-postcode="${postcode}">×</button>
    </span>
  `).join('');
  
  // Update hidden input
  document.getElementById('delivery-postcodes-hidden').value = postcodesArray.join(',');
  
  // Attach remove listeners
  document.querySelectorAll('.remove-postcode').forEach(btn => {
    btn.addEventListener('click', function() {
      const postcodeToRemove = this.dataset.postcode;
      const index = postcodesArray.indexOf(postcodeToRemove);
      if (index > -1) {
        postcodesArray.splice(index, 1);
        renderPostcodeTags();
      }
    });
  });
}

document.getElementById('add-postcode-btn').addEventListener('click', function() {
  const input = document.getElementById('new-postcode');
  const newPostcode = input.value.trim();
  
  if (newPostcode.length !== 4 || !/^\d{4}$/.test(newPostcode)) {
    alert('Please enter a valid 4-digit postcode');
    return;
  }
  
  if (postcodesArray.includes(newPostcode)) {
    alert('This postcode is already added');
    return;
  }
  
  postcodesArray.push(newPostcode);
  renderPostcodeTags();
  input.value = '';
});

renderPostcodeTags();
```

### Section 2: Weekly Menu Submission

```html
<section class="form-section">
  <div class="container">
    <h2>🍽️ Weekly Menu Submission</h2>
    
    <!-- Week Tabs -->
    <div class="week-tabs">
      <button type="button" class="week-tab active" data-week="current">
        This Week (Apr 1-5)
      </button>
      <button type="button" class="week-tab" data-week="next">
        Next Week (Apr 8-12)
      </button>
    </div>
    
    <div class="notice-box">
      ⚠️ <strong>Important:</strong> You must submit menus for BOTH this week and next week. 
      The two menus must be different from each other (no repeating the same dishes across both weeks).
    </div>
    
    <form id="weekly-menu-form">
      <input type="hidden" name="chef_id" value="[chef_id]">
      <input type="hidden" name="menu_id" value="[menu_id or empty for new]">
      <input type="hidden" name="week_start_date" id="week-start-date" value="2025-04-01">
      
      <!-- Monday Menu Builder -->
      <div class="day-menu-builder" data-day="monday">
        <h3>📅 MONDAY Menu</h3>
        
        <div id="monday-dishes-container">
          <!-- Dish entries dynamically added -->
        </div>
        
        <button type="button" class="add-dish-btn" data-day="monday">
          + Add Dish to Monday
        </button>
      </div>
      
      <!-- Tuesday Menu Builder -->
      <div class="day-menu-builder collapsed" data-day="tuesday">
        <h3>📅 TUESDAY Menu <span class="expand-hint">(click to expand)</span></h3>
        
        <div id="tuesday-dishes-container" style="display: none;">
          <!-- Dish entries dynamically added -->
        </div>
        
        <button type="button" class="add-dish-btn" data-day="tuesday" style="display: none;">
          + Add Dish to Tuesday
        </button>
      </div>
      
      <!-- Wednesday, Thursday, Friday (same structure) -->
      <!-- ... -->
      
      <div class="action-buttons">
        <button type="submit" class="save-btn">💾 Save This Week's Menu</button>
        <button type="button" class="preview-btn">👁️ Preview How It Looks</button>
      </div>
    </form>
    
    <div class="reminder-box">
      ⏰ <strong>Submission Deadline:</strong> Submit both this week's and next week's menus by Sunday 6pm. 
      Customers will see next week's menu starting Monday morning.
    </div>
  </div>
</section>
```

### Dish Entry Component (Repeatable)

```html
<div class="dish-entry" data-dish-index="[index]">
  <div class="dish-entry-header">
    <h4>Dish #[index]</h4>
    <button type="button" class="remove-dish-btn">Remove</button>
  </div>
  
  <div class="form-group">
    <label>Dish Name *</label>
    <input type="text" name="dishes[monday][0][name]" placeholder="e.g., Butter Chicken" required>
  </div>
  
  <div class="form-group">
    <label>Dish Type *</label>
    <select name="dishes[monday][0][type]" required>
      <option value="">Select type</option>
      <option value="main">Main</option>
      <option value="side">Side</option>
      <option value="bread">Bread</option>
      <option value="accompaniment">Accompaniment</option>
      <option value="dessert">Dessert</option>
      <option value="snack">Snack</option>
    </select>
  </div>
  
  <div class="form-group">
    <label>Dish Photo *</label>
    <div class="file-upload-zone">
      <input type="file" name="dishes[monday][0][photo]" accept="image/*" required>
      <div class="upload-placeholder">
        <p>📸 Click to upload photo or drag & drop</p>
        <p class="file-hint">JPG or PNG, max 5MB</p>
      </div>
      <img src="" alt="Preview" class="photo-preview" style="display: none;">
    </div>
  </div>
  
  <input type="hidden" name="dishes[monday][0][sort_order]" value="[index]">
</div>
```

### Dynamic Dish Management JavaScript

```javascript
let mondayDishCount = 0;

document.querySelector('[data-day="monday"] .add-dish-btn').addEventListener('click', function() {
  mondayDishCount++;
  const container = document.getElementById('monday-dishes-container');
  
  const dishHTML = `
    <div class="dish-entry" data-dish-index="${mondayDishCount}">
      <div class="dish-entry-header">
        <h4>Dish #${mondayDishCount}</h4>
        <button type="button" class="remove-dish-btn">Remove</button>
      </div>
      
      <div class="form-group">
        <label>Dish Name *</label>
        <input type="text" name="dishes[monday][${mondayDishCount}][name]" placeholder="e.g., Butter Chicken" required>
      </div>
      
      <div class="form-group">
        <label>Dish Type *</label>
        <select name="dishes[monday][${mondayDishCount}][type]" required>
          <option value="">Select type</option>
          <option value="main">Main</option>
          <option value="side">Side</option>
          <option value="bread">Bread</option>
          <option value="accompaniment">Accompaniment</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Dish Photo *</label>
        <div class="file-upload-zone">
          <input type="file" name="dishes[monday][${mondayDishCount}][photo]" accept="image/*" required>
          <div class="upload-placeholder">
            <p>📸 Click to upload photo or drag & drop</p>
            <p class="file-hint">JPG or PNG, max 5MB</p>
          </div>
        </div>
      </div>
      
      <input type="hidden" name="dishes[monday][${mondayDishCount}][sort_order]" value="${mondayDishCount}">
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', dishHTML);
  
  // Attach remove listener to new entry
  container.lastElementChild.querySelector('.remove-dish-btn').addEventListener('click', function() {
    this.closest('.dish-entry').remove();
  });
});

// Repeat similar logic for Tuesday, Wednesday, Thursday, Friday
```

### Expandable Day Sections

```javascript
document.querySelectorAll('.day-menu-builder.collapsed h3').forEach(header => {
  header.addEventListener('click', function() {
    const builder = this.closest('.day-menu-builder');
    builder.classList.remove('collapsed');
    builder.querySelector('[id$="-dishes-container"]').style.display = 'block';
    builder.querySelector('.add-dish-btn').style.display = 'block';
    this.querySelector('.expand-hint').remove();
  });
});
```

### Week Tab Switching

```javascript
document.querySelectorAll('.week-tab').forEach(tab => {
  tab.addEventListener('click', async function() {
    // Update active state
    document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    const selectedWeek = this.dataset.week; // 'current' or 'next'
    const chefId = getChefIdFromAuth(); // Get from session/token
    
    // Fetch existing menu for this week (if exists)
    const response = await fetch(`/api/chef-portal/${chefId}/menu?week=${selectedWeek}`);
    const menuData = await response.json();
    
    // Update form with existing data or clear for new entry
    if (menuData.exists) {
      populateMenuForm(menuData);
    } else {
      clearMenuForm();
    }
    
    // Update week_start_date hidden input
    document.getElementById('week-start-date').value = menuData.week_start_date;
  });
});
```

### Form Submission

```javascript
document.getElementById('weekly-menu-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  
  // Validate: Each day must have at least 2 dishes
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  for (const day of days) {
    const dishCount = document.querySelectorAll(`[data-day="${day}"] .dish-entry`).length;
    if (dishCount < 2) {
      alert(`${day.charAt(0).toUpperCase() + day.slice(1)} must have at least 2 dishes`);
      return;
    }
  }
  
  // Submit to backend
  const response = await fetch('/api/chef-portal/save-menu', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    alert('Menu saved successfully!');
    // Optionally redirect or refresh
  } else {
    const error = await response.json();
    alert(`Error: ${error.message}`);
  }
});
```

### Preview Functionality

```javascript
document.querySelector('.preview-btn').addEventListener('click', function() {
  // Collect all dish data from form
  const previewData = collectFormData();
  
  // Open preview modal or new tab showing how the menu will look to customers
  window.open(`/chef-portal/preview?data=${encodeURIComponent(JSON.stringify(previewData))}`, '_blank');
});
```

---

## PAGE 4: SUBSCRIPTION FORM (/subscribe)

### URL: `/subscribe?chef=[chef_id]&menu=[menu_id]`

**This page remains largely the same as in Document 1, with these additions:**

### Pre-filled Fields from URL Parameters

```javascript
// On page load
const urlParams = new URLSearchParams(window.location.search);
const chefId = urlParams.get('chef');
const menuId = urlParams.get('menu');

// Fetch chef and menu details
async function loadSubscriptionDetails() {
  const chefResponse = await fetch(`/api/chef/${chefId}`);
  const chef = await chefResponse.json();
  
  const menuResponse = await fetch(`/api/menu/${menuId}`);
  const menu = await menuResponse.json();
  
  // Display subscription summary
  document.getElementById('subscription-summary').innerHTML = `
    <h2>You're subscribing to: ${chef.chef_name}</h2>
    <p>${chef.cuisine_type} • $${chef.price_per_week}/week</p>
    <p>Week of ${menu.week_label}</p>
  `;
  
  // Pre-fill hidden form fields
  document.getElementById('chef-id-input').value = chefId;
  document.getElementById('menu-id-input').value = menuId;
}

loadSubscriptionDetails();
```

### Form Fields (Same as Document 1, plus):

```html
<form id="subscription-form">
  <!-- Hidden fields -->
  <input type="hidden" name="chef_id" id="chef-id-input">
  <input type="hidden" name="menu_id" id="menu-id-input">
  <input type="hidden" name="week_subscribed" id="week-subscribed-input">
  
  <!-- Rest of form fields from Document 1 -->
  <!-- ... -->
</form>
```

---

## DESIGN SPECIFICATIONS

### Color Palette

```css
:root {
  /* Primary Colors */
  --primary-purple: #667eea;
  --primary-purple-dark: #764ba2;
  --accent-green: #28a745;
  
  /* Secondary Colors */
  --secondary-orange: #ff9800;
  --secondary-blue: #2196f3;
  --secondary-red: #dc3545;
  
  /* Neutral Colors */
  --gray-50: #f8f9fa;
  --gray-100: #f0f0f0;
  --gray-200: #e0e0e0;
  --gray-300: #ccc;
  --gray-600: #666;
  --gray-900: #333;
  
  /* Background */
  --bg-light: #fafbfc;
  --bg-white: #ffffff;
  
  /* Borders */
  --border-light: #e0e0e0;
  --border-medium: #ccc;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 20px rgba(0,0,0,0.15);
}
```

### Typography

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--gray-900);
}

h1 { font-size: 42px; font-weight: 700; line-height: 1.2; }
h2 { font-size: 32px; font-weight: 600; line-height: 1.3; }
h3 { font-size: 24px; font-weight: 600; line-height: 1.4; }
h4 { font-size: 18px; font-weight: 600; line-height: 1.4; }

@media (max-width: 768px) {
  h1 { font-size: 32px; }
  h2 { font-size: 24px; }
  h3 { font-size: 20px; }
}
```

### Component Styles

**Hero Section:**
```css
.hero {
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-purple-dark) 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.hero h1 {
  margin: 0 0 15px 0;
}

.hero p {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}
```

**Filter Bar:**
```css
.filter-bar {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin: -30px auto 30px;
  max-width: 900px;
  box-shadow: var(--shadow-md);
}

.cuisine-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cuisine-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-light);
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cuisine-btn.active {
  background: var(--primary-purple);
  color: white;
  border-color: var(--primary-purple);
}

.cuisine-btn:hover {
  border-color: var(--primary-purple);
}
```

**Chef Card (Homepage):**
```css
.chef-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.chef-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.chef-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.price-tag {
  font-size: 22px;
  font-weight: bold;
  color: var(--primary-purple);
}

.view-menu-btn {
  padding: 10px 18px;
  background: var(--primary-purple);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s ease;
}

.view-menu-btn:hover {
  background: var(--primary-purple-dark);
}
```

**Day Card (Chef Detail Page):**
```css
.day-card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  min-width: 260px;
  flex-shrink: 0;
}

.day-header {
  background: #2c3e50;
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.dish-item {
  padding: 12px;
  border-bottom: 1px solid var(--gray-100);
}

.dish-item:last-child {
  border-bottom: none;
}

.dish-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.dish-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: var(--gray-900);
}

.dish-type {
  color: var(--gray-600);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

**Buttons:**
```css
.subscribe-btn-large {
  background: var(--accent-green);
  color: white;
  border: none;
  padding: 16px 50px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.25);
  transition: all 0.3s ease;
}

.subscribe-btn-large:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.35);
}

.save-btn {
  background: var(--accent-green);
  color: white;
  border: none;
  padding: 14px 35px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

.preview-btn {
  background: var(--primary-purple);
  color: white;
  border: none;
  padding: 14px 35px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
```

**Notice Boxes:**
```css
.menu-notice {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 15px 20px;
  margin-bottom: 25px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
}

.delivery-zones {
  margin-top: 15px;
  padding: 15px;
  background: #f0f7ff;
  border-left: 4px solid var(--secondary-blue);
  border-radius: 4px;
  font-size: 14px;
}
```

### Responsive Design

**Breakpoints:**
```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 768px) {
  .chef-grid {
    grid-template-columns: 1fr;
  }
  
  .daily-menu-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .cuisine-filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
  }
  
  .form-group-inline {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .chef-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .chef-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .container {
    max-width: 1200px;
  }
}
```

---

## BACKEND API REQUIREMENTS

### Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chefs` | GET | List all active chefs with current week menus |
| `/api/chefs?cuisine=[type]` | GET | Filter chefs by cuisine |
| `/api/chefs?postcode=[code]` | GET | Filter chefs by delivery postcode |
| `/api/chef/:id` | GET | Get single chef details |
| `/api/chef/:id/menu` | GET | Get chef's menu for specific week (query: ?week=current\|next) |
| `/api/chef-portal/save-profile` | POST | Save chef profile updates |
| `/api/chef-portal/save-menu` | POST | Save weekly menu (with photos) |
| `/api/subscription` | POST | Submit customer subscription |

### Data Validation Rules

**Chefs Table:**
- `chef_name`: Required, 2-50 characters
- `cuisine_type`: Required, must match predefined list
- `bio`: Required, max 200 characters
- `price_per_week`: Required, number between 50-150
- `delivery_postcodes`: Required, array of 4-digit Australian postcodes starting with 2

**Weekly Menus Table:**
- `week_start_date`: Required, must be a Monday
- Must have menu items for all 5 days (Mon-Fri)
- Each day must have 2-5 dishes

**Daily Menu Items Table:**
- `dish_name`: Required, 3-100 characters
- `dish_type`: Required, must match predefined list
- `dish_photo`: Required, valid image file (JPG/PNG), max 5MB
- `sort_order`: Required, positive integer

**Customer Subscriptions:**
- `postcode`: Required, 4-digit Australian postcode
- Must validate that chef delivers to customer's postcode
- Cannot subscribe to a menu in the past

### File Upload Handling

**Chef Photos:**
- Resize to 300x300px
- Compress to < 200KB
- Store in cloud storage (S3, Cloudinary, or Airtable attachments)
- Return public URL

**Dish Photos:**
- Resize to 600x400px
- Compress to < 300KB
- Store in cloud storage
- Return public URL

---

## DEPLOYMENT CHECKLIST

### Pre-Launch

- [ ] Domain registered and DNS configured
- [ ] SSL certificate installed (HTTPS enabled)
- [ ] Database (Airtable) set up with all 4 tables
- [ ] All form submissions tested end-to-end
- [ ] Email notifications working (admin receives alerts)
- [ ] Image uploads tested and displaying correctly
- [ ] Postcode filtering working correctly
- [ ] Week toggle switching menus correctly
- [ ] Mobile responsive on iPhone and Android
- [ ] Analytics (Google Analytics) installed

### Launch Week

- [ ] Onboard 3-5 chefs manually
- [ ] Chef portal tested with real chefs
- [ ] Both "This Week" and "Next Week" menus populated
- [ ] At least 10 high-quality dish photos uploaded
- [ ] Pricing finalized for all chefs
- [ ] Delivery postcodes verified for each chef
- [ ] Subscription form tested with test payments

### Post-Launch Monitoring

- [ ] Monitor form submissions daily
- [ ] Check for broken images
- [ ] Verify menu updates display correctly each Monday
- [ ] Track page load times (< 3 seconds)
- [ ] Monitor mobile vs desktop traffic split
- [ ] Collect user feedback on filtering UX

---

## PERFORMANCE OPTIMIZATION

### Image Optimization
- Use lazy loading for images below the fold
- Serve WebP format with JPG fallback
- Use CDN for image delivery
- Implement responsive images (srcset)

### Caching Strategy
- Cache chef cards for 15 minutes
- Cache weekly menus for 1 hour
- Invalidate cache when chef updates menu

### Database Queries
- Index on: `chef_id`, `cuisine_type`, `week_start_date`, `status`
- Limit homepage to show max 20 chefs initially
- Implement "Load More" for additional chefs

---

## FUTURE ENHANCEMENTS (Phase 2)

**Not included in MVP but plan for:**
1. Customer accounts with order history
2. Automated email confirmations
3. Stripe payment integration
4. Chef self-service dashboard with analytics
5. Customer reviews and ratings submission
6. Automated menu reminders for chefs
7. Delivery partner integration
8. Mobile app (iOS/Android)
9. Recommendation algorithm based on preferences
10. Corporate/office catering option

---

## SUCCESS METRICS TO TRACK

**Week 1:**
- Total website visitors
- Chefs browsed per visitor
- Cuisine filter usage (which cuisines are popular)
- Postcode searches performed
- Subscription form submissions
- Conversion rate (visitors → subscriptions)

**Month 1:**
- Active chefs
- Total subscriptions
- Retention rate (week 2 reorders)
- Average menu update time by chefs
- Mobile vs desktop traffic
- Most popular cuisines
- Average dishes per day across all chefs

---

## TECHNICAL NOTES FOR AI AGENT

**Critical Implementation Requirements:**

1. **Flexible Dish Count:** Each day can have 2-5 dishes. Do not enforce exactly 3 or 4.

2. **Cuisine-Postcode Association:** When filtering by postcode, also show cuisine type for each result.

3. **Week Calculation:** "This Week" = current Monday, "Next Week" = next Monday. Always calculate dynamically.

4. **Photo Handling:** Ensure all photo uploads are validated, compressed, and stored with unique filenames to prevent conflicts.

5. **Postcode Validation:** Only accept 4-digit Australian postcodes starting with 2 (NSW). Display suburb names if possible.

6. **Menu Uniqueness:** When chef submits "Next Week" menu, validate it's different from "This Week" (at least 50% of dishes are different).

7. **Mobile First:** Test extensively on mobile devices. Horizontal scroll for day cards must work smoothly.

8. **Error Handling:** Graceful degradation if images fail to load. Show placeholder with dish name.

9. **Loading States:** Show skeleton loaders while fetching chef data and menus.

10. **Accessibility:** All images must have alt text. Forms must be keyboard navigable. Color contrast must meet WCAG AA standards.

---

END OF SPECIFICATION

**This spec is ready to hand to an AI agent or developer for implementation.**
