// ─── GLOBAL NAMESPACE ───
window.CC = window.CC || {};

// ─── POSTCODE → SUBURB MAP (editable via Admin portal) ───
var POSTCODE_SUBURB_MAP = {
  "2000": "Sydney CBD",
  "2007": "Ultimo",
  "2008": "Chippendale",
  "2009": "Pyrmont",
  "2010": "Darlinghurst",
  "2011": "Potts Point",
  "2015": "Alexandria",
  "2016": "Redfern",
  "2017": "Waterloo",
  "2018": "Rosebery",
  "2019": "Botany",
  "2020": "Mascot",
  "2021": "Paddington",
  "2022": "Bondi Junction",
  "2024": "Bronte",
  "2026": "Bondi",
  "2027": "Double Bay",
  "2031": "Coogee",
  "2032": "Kingsford",
  "2033": "Kensington",
  "2034": "Randwick",
  "2037": "Forest Lodge",
  "2038": "Annandale",
  "2039": "Rozelle",
  "2041": "Balmain",
  "2042": "Newtown",
  "2043": "Erskineville",
  "2044": "St Peters",
  "2045": "Leichhardt",
  "2046": "Burwood",
  "2047": "Drummoyne",
  "2048": "Stanmore",
  "2049": "Petersham",
  "2050": "Glebe",
  "2060": "North Sydney",
  "2065": "St Leonards",
  "2067": "Chatswood",
  "2203": "Dulwich Hill",
  "2204": "Marrickville",
  "2205": "Arncliffe",
  "2206": "Earlwood",
};

// ─── MOCK CHEF DATA ───
var mockChefs = [
  {
    chef_id: 1,
    chef_name: "Chef Priya",
    cuisine_type: "Indian",
    bio: "I learned to cook from my grandmother in Punjab. Every dish is made with love using traditional recipes passed down through generations. I specialise in home-style North Indian cuisine with rich, authentic spices.",
    photo_url: "https://images.unsplash.com/photo-1556910103-1c02745a8731?w=200&q=80",
    price_per_week: 75,
    delivery_postcodes: ["2042", "2203", "2204", "2048"],
    rating: 4.8,
    review_count: 24,
    tags: ["North Indian", "Vegetarian Options", "Halal", "Authentic Recipes"],
    highlights: ["🍛 Butter Chicken", "🥘 Dal Makhani", "🍚 Veg Biryani", "🫓 Garlic Naan"],
    food_image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=85",
    menus: {
      currentWeek: {
        week_label: "Mar 24–28",
        monday: [
          { dish_name: "Butter Chicken", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Jeera Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Garlic Naan", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Cucumber Raita", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Palak Paneer", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Dal Makhani", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Basmati Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Tandoori Roti", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Vegetable Biryani", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80" },
          { dish_name: "Baingan Bharta", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Mint Raita", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Roasted Papad", dish_type: "Snack", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Chole Masala", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Bhature", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Pickled Onions", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Fresh Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Paneer Tikka Masala", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Pulao Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Butter Naan", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Gulab Jamun", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      },
      nextWeek: {
        week_label: "Mar 31–Apr 4",
        monday: [
          { dish_name: "Chicken Korma", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Saffron Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Garlic Naan", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Mango Lassi", dish_type: "Drink", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Malai Kofta", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Chana Dal", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Jeera Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Paratha", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Lamb Rogan Josh", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Aloo Gobi", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Pulao", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Onion Kulcha", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Saag Chicken", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80" },
          { dish_name: "Tadka Dal", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Steamed Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Phulka Roti", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Hyderabadi Biryani", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=400&q=80" },
          { dish_name: "Shorba", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Mirchi Ka Salan", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Shahi Tukda", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      }
    }
  },
  {
    chef_id: 2,
    chef_name: "Chef Asa",
    cuisine_type: "Mediterranean",
    bio: "Born in Lebanon, raised between Beirut and Sydney. I bring the vibrant flavours of the Eastern Mediterranean—fresh herbs, olive oil, slow-cooked meats, and fragrant spices—to your table every week.",
    photo_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80",
    price_per_week: 72,
    delivery_postcodes: ["2016", "2017", "2008", "2010"],
    rating: 4.9,
    review_count: 31,
    tags: ["Mediterranean", "Lebanese", "Halal", "Dairy-Free Options"],
    highlights: ["🥙 Falafel Platter", "🥗 Tabbouleh", "🫔 Shawarma Bowl", "🧆 Hummus & Pita"],
    food_image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    menus: {
      currentWeek: {
        week_label: "Mar 24–28",
        monday: [
          { dish_name: "Chicken Shawarma Bowl", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
          { dish_name: "Fattoush Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Garlic Toum", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Warm Pita", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Falafel & Hummus Platter", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Tabbouleh", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Pickled Vegetables", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Sesame Flatbread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Slow-Cooked Lamb Kafta", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
          { dish_name: "Lebanese Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Tzatziki", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Pita Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Baked Spiced Salmon", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Roasted Cauliflower", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Chermoula Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Couscous", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Moussaka", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Greek Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Pita Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Baklava", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      },
      nextWeek: {
        week_label: "Mar 31–Apr 4",
        monday: [
          { dish_name: "Mezze Platter", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Stuffed Vine Leaves", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Hummus", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Pita Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Grilled Halloumi & Veg", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
          { dish_name: "Quinoa Tabbouleh", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Tahini Dressing", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Za'atar Flatbread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Lamb Tagine", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Couscous", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Harissa", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Moroccan Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Chicken Bastilla", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
          { dish_name: "Roasted Root Vegetables", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Preserved Lemon Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Semolina Roll", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Stuffed Capsicum", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Bulgur Pilaf", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Labneh", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Semolina Cake", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      }
    }
  },
  {
    chef_id: 3,
    chef_name: "Chef Som",
    cuisine_type: "Thai",
    bio: "I grew up in Chiang Mai and moved to Sydney 8 years ago. Thai cooking is all about balance—sweet, sour, salty, spicy. My family recipes have been perfected over three generations of street-food cooks.",
    photo_url: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=200&q=80",
    price_per_week: 68,
    delivery_postcodes: ["2042", "2050", "2049", "2045"],
    rating: 4.7,
    review_count: 18,
    tags: ["Thai", "Gluten-Free Options", "Spicy", "Street Food Style"],
    highlights: ["🍜 Pad Thai", "🍛 Green Curry", "🥟 Spring Rolls", "🍚 Jasmine Rice"],
    food_image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    menus: {
      currentWeek: {
        week_label: "Mar 24–28",
        monday: [
          { dish_name: "Pad Thai", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
          { dish_name: "Tom Yum Soup", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Spring Rolls", dish_type: "Snack", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Jasmine Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Green Curry Chicken", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Steamed Jasmine Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Thai Cucumber Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Mango Sticky Rice", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Massaman Beef Curry", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Roti Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Steamed Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Satay Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Larb Gai", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Sticky Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Som Tum Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
          { dish_name: "Nam Jim Dipping Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Pad Krapow Moo", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
          { dish_name: "Fried Egg", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
          { dish_name: "Jasmine Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Thai Iced Tea", dish_type: "Drink", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
        ],
      },
      nextWeek: {
        week_label: "Mar 31–Apr 4",
        monday: [
          { dish_name: "Drunken Noodles", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
          { dish_name: "Thai Fish Cakes", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Sweet Chilli Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Jasmine Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Red Curry Prawns", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Thai Basil Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Prawn Crackers", dish_type: "Snack", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
          { dish_name: "Coconut Milk Pudding", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Tom Kha Gai Soup", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Steamed Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Fresh Herbs & Chilli", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Crispy Shallots", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Crying Tiger Beef", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Sticky Rice", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Jaew Dipping Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Green Papaya Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Khao Mun Gai", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
          { dish_name: "Ginger Broth", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { dish_name: "Fermented Soybean Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Tub Tim Krob", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      }
    }
  },
  {
    chef_id: 4,
    chef_name: "Chef Marco",
    cuisine_type: "Italian",
    bio: "Born in Naples, trained in Rome, cooking in Sydney. I use my nonna's handwritten recipe book every single week. Everything is made from scratch—pasta, sauces, even the bread. Real Italian, no shortcuts.",
    photo_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    price_per_week: 80,
    delivery_postcodes: ["2010", "2011", "2000", "2009"],
    rating: 4.9,
    review_count: 42,
    tags: ["Italian", "Pasta", "Gluten-Free Options", "Made from Scratch"],
    highlights: ["🍝 Handmade Tagliatelle", "🥩 Osso Buco", "🍕 Focaccia", "🍮 Tiramisu"],
    food_image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
    menus: {
      currentWeek: {
        week_label: "Mar 24–28",
        monday: [
          { dish_name: "Tagliatelle al Ragù", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Mixed Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Rosemary Focaccia", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Tiramisu", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Risotto ai Funghi", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Insalata Caprese", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Ciabatta", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Panna Cotta", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Osso Buco alla Milanese", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Saffron Risotto", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Gremolata", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Focaccia", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Pappardelle al Cinghiale", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Roasted Broccolini", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Grissini", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Cannoli", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Branzino al Forno", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Roasted Potatoes", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
          { dish_name: "Lemon & Caper Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Sfogliatelle", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      },
      nextWeek: {
        week_label: "Mar 31–Apr 4",
        monday: [
          { dish_name: "Lasagna Bolognese", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Mixed Green Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Garlic Bread", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Affogato", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        tuesday: [
          { dish_name: "Pollo alla Cacciatora", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Polenta", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&q=80" },
          { dish_name: "Olive Ciabatta", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Zabaglione", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        wednesday: [
          { dish_name: "Gnocchi al Pesto", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Cherry Tomato Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Focaccia", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Ricotta Tart", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        thursday: [
          { dish_name: "Veal Milanese", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
          { dish_name: "Arugula & Parmesan Salad", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Ciabatta", dish_type: "Bread", photo_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { dish_name: "Gelato", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
        friday: [
          { dish_name: "Seafood Risotto", dish_type: "Main", photo_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
          { dish_name: "Insalata Mista", dish_type: "Side", photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { dish_name: "Lemon Butter Sauce", dish_type: "Accompaniment", photo_url: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?w=400&q=80" },
          { dish_name: "Torta Caprese", dish_type: "Dessert", photo_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        ],
      }
    }
  }
];

// ─── CONSTANTS ───
var CUISINES = ["All", "Indian", "Mediterranean", "Thai", "Italian", "Chinese", "Lebanese", "Vietnamese"];
var DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
var DAY_LABELS = { monday: "MONDAY", tuesday: "TUESDAY", wednesday: "WEDNESDAY", thursday: "THURSDAY", friday: "FRIDAY" };
var DISH_TYPE_COLORS = {
  Main: { bg: "#FFF3CD", color: "#856404" },
  Side: { bg: "#D1ECF1", color: "#0C5460" },
  Bread: { bg: "#FDEBD0", color: "#784212" },
  Accompaniment: { bg: "#D4EDDA", color: "#155724" },
  Dessert: { bg: "#FCE4EC", color: "#880E4F" },
  Snack: { bg: "#FFE0B2", color: "#BF360C" },
  Drink: { bg: "#E3F2FD", color: "#0D47A1" },
};
var CUISINE_OPTIONS = ["North Indian", "South Indian", "Thai", "Italian", "Mediterranean", "Chinese", "Lebanese", "Vietnamese", "Japanese", "Korean", "Mexican"];
var DISH_TYPES = ["Main", "Side", "Bread", "Accompaniment", "Dessert", "Snack", "Drink"];

// ─── EXPORT TO NAMESPACE ───
Object.assign(window.CC, {
  POSTCODE_SUBURB_MAP,
  mockChefs,
  CUISINES,
  DAYS,
  DAY_LABELS,
  DISH_TYPE_COLORS,
  CUISINE_OPTIONS,
  DISH_TYPES,
});
