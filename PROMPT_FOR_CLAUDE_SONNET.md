# Prompt for Claude Sonnet 4.5 (Artifacts / Code Generation)

**Copy and paste this prompt along with the DOCUMENT_1_UPDATED_WEBSITE_SPEC.md file:**

---

I need you to build a home-cooked meal marketplace website based on the attached technical specification. This is a real business MVP that will launch in Sydney, Australia.

## What I Need You To Build:

A three-page website system:
1. **Customer homepage** - Browse chefs with cuisine filtering and postcode search
2. **Chef detail page** - Display daily menus (Monday-Friday) with week toggle
3. **Chef portal** - Form for chefs to submit weekly menus and manage their profile

## Technical Stack:

Build this as a **single-page React application** using:
- React with hooks (useState, useEffect)
- Tailwind CSS for styling (use only core utility classes)
- Component-based architecture
- Mock data structure matching the Airtable schema in the spec

## Key Requirements:

### Homepage Must Have:
- Cuisine filter buttons (Indian, Thai, Italian, Mediterranean, Chinese, Lebanese, Vietnamese)
- Postcode search input (4-digit Australian postcodes)
- Grid of chef cards showing:
  - Chef photo, name, cuisine type
  - Rating and review count
  - Delivery postcodes (e.g., "📍 2042, 2204, 2203")
  - Preview of 4 dishes from current week
  - Price per week
  - "View Full Menu" button
- Filtering logic that works for both cuisine AND postcode

### Chef Detail Page Must Have:
- Chef header with profile photo, bio, tags, delivery areas
- Week selector (This Week / Next Week) - clickable tabs
- Notice banner: "Menus change weekly!"
- Daily menu display showing Monday-Friday in horizontal scroll
- Each day card shows:
  - Day name header (MONDAY, TUESDAY, etc.)
  - 3-5 dishes with photo placeholders, dish name, and dish type (Main, Side, Bread, etc.)
- Large "Subscribe to [Chef Name]" button at bottom
- Clicking week tabs switches between different menu data

### Chef Portal Must Have:
- Profile form:
  - Chef name, cuisine type dropdown, price per week
  - Bio textarea (200 char limit with counter)
  - Postcode manager (add/remove postcodes as tags)
- Menu submission form:
  - Week tabs (This Week / Next Week)
  - For each day (Mon-Fri):
    - Collapsible section
    - Add/remove dish entries
    - Each dish: name input, type dropdown, photo upload zone
  - "Save Menu" and "Preview" buttons

## Important Implementation Details:

1. **Use mock data** - Create realistic sample data for 3-5 chefs with different cuisines
2. **Functional filtering** - Cuisine and postcode filters should actually work
3. **State management** - Week toggle should switch displayed menu data
4. **Responsive design** - Must work on mobile (horizontal scroll for day cards)
5. **Component structure** - Break into reusable components (ChefCard, DayCard, DishEntry, etc.)
6. **Styling** - Follow the color palette and design from the spec:
   - Primary purple: #667eea
   - Accent green: #28a745
   - Use Tailwind utility classes only

## Mock Data Structure Example:

```javascript
const mockChefs = [
  {
    chef_id: 1,
    chef_name: "Chef Priya",
    cuisine_type: "Indian",
    bio: "I learned to cook from my grandmother in Punjab...",
    photo_url: "/placeholder-chef.jpg",
    price_per_week: 75,
    delivery_postcodes: ["2042", "2204", "2203"],
    rating: 4.8,
    review_count: 24,
    menus: {
      currentWeek: {
        week_label: "Apr 1-5",
        monday: [
          { dish_name: "Butter Chicken", dish_type: "Main", photo_url: "..." },
          { dish_name: "Jeera Rice", dish_type: "Side", photo_url: "..." },
          // ... more dishes
        ],
        tuesday: [...],
        // ... more days
      },
      nextWeek: {
        week_label: "Apr 8-12",
        monday: [...],
        // ... different menu
      }
    }
  },
  // ... more chefs
];
```

## What Success Looks Like:

- I can click cuisine filters and see only chefs of that cuisine
- I can enter a postcode and see only chefs who deliver there
- I can click "View Full Menu" and see the chef's detailed page
- I can toggle between "This Week" and "Next Week" menus
- I can see daily menus laid out Monday-Friday in scrollable cards
- The chef portal form allows adding/removing dishes dynamically
- Everything looks good on mobile and desktop

## Deliverables:

Build this as a **single React artifact** that I can preview immediately. Include:
- All three pages (use simple routing or tabs to switch between them)
- Working filters and toggles
- Realistic mock data for at least 3 chefs
- Clean, commented code
- Responsive design using Tailwind

## Additional Context:

This is an MVP for a business launching in 2-3 weeks. The design should feel warm and trustworthy (home cooking vibe), not corporate or sterile. Focus on:
- Clear typography
- Generous white space  
- High-quality food photography placeholders
- Easy navigation
- Mobile-first design

Start by building the homepage with working filters, then the chef detail page with the week toggle, then the chef portal. Test the filtering and state management thoroughly.

---

**Please confirm you understand the requirements, then build the React application.**

