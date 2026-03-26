// ONE-TIME seed endpoint — call POST /api/seed to populate the DB
// with the default chefs and site content from cc-data.js defaults.
// Idempotent: skips records that already exist.
const db = require('./_db');
const { handle } = require('./_helpers');

const DEFAULT_CONTENT = {
  hero_badge:       "Sydney's Home-Cooked Meal Marketplace",
  hero_line1:       "Authentic",
  hero_line2:       "Home-Cooked",
  hero_line3:       "Meals, Weekly.",
  hero_subtext:     "Subscribe to a local home chef. Get 5 freshly cooked meals delivered Mon–Fri. Support your community.",
  hero_stat1:       "4.8 ⭐",  hero_stat1_label: "Avg chef rating",
  hero_stat2:       "5 meals", hero_stat2_label: "Delivered Mon–Fri",
  hero_stat3:       "Cancel",  hero_stat3_label: "Anytime, no lock-in",
  how_c1_title:     "1. Find Your Chef",
  how_c1_desc:      "Browse local passionate home chefs and culinary talent. From heritage family recipes to authentic homestyle masters, find a chef whose menu matches your cravings and dietary needs.",
  how_c2_title:     "2. Subscribe Weekly",
  how_c2_desc:      "Choose your starting week and subscribe. No lock-in contracts. You'll receive a curated menu of 5 restaurant-quality meals delivered every weekday.",
  how_c3_title:     "3. Gather & Enjoy",
  how_c3_desc:      "Your chef prepares your meals fresh daily. Delivered straight to your door in eco-friendly containers — simply sit down and savour the food together with family or friends.",
  how_ch1_title:    "1. Apply & Verify",
  how_ch1_desc:     "Submit your application with your cuisine style and sample menus. Our team reviews your background to ensure Home Meals home-cooking standards are met.",
  how_ch2_title:    "2. Build Your Audience",
  how_ch2_desc:     "Set how many subscribers you want. We provide the marketing and platform to connect you with hungry locals looking for your exact culinary style.",
  how_ch3_title:    "3. Cook & Earn",
  how_ch3_desc:     "Cook your weekly menu, deliver to subscribers, and get paid. Keep 80% of the subscription price. Current chefs earn $400–$900/week.",
  become_headline:  "Become a Home Meals Partner",
  become_subtext:   "Turn your home cooking into income. Set your own menu. Set your own pace.",
  become_earnings:  "Current chefs earn $400–$900/week",
  footer_tagline:   "Authentic home-cooked meals from Sydney's best home chefs. Delivered weekly.",
  contact_email:    "hello@homemeals.com.au",
};

const SEED_CHEFS = [
  {
    chef_id: 1, chef_name: "Chef Priya", cuisine_type: "Indian",
    bio: "I learned to cook from my grandmother in Punjab. Every dish is made with love using traditional recipes passed down through generations. I specialise in home-style North Indian cuisine with rich, authentic spices.",
    photo_url: "https://images.unsplash.com/photo-1556910103-1c02745a8731?w=200&q=80",
    price_per_week: 75, delivery_postcodes: ["2042","2203","2204","2048"],
    rating: 4.8, review_count: 24,
    tags: ["North Indian","Vegetarian Options","Halal","Authentic Recipes"],
    highlights: ["🍛 Butter Chicken","🥘 Dal Makhani","🍚 Veg Biryani","🫓 Garlic Naan"],
    food_image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=85",
    commission_pct: 20, status: "active", menus: {},
  },
  {
    chef_id: 2, chef_name: "Chef Asa", cuisine_type: "Mediterranean",
    bio: "Born in Athens, raised in Sydney, I bring the flavours of the Aegean to your table. Fresh herbs, quality olive oil, and the simplicity of real Mediterranean home cooking. No shortcuts, no compromises.",
    photo_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80",
    price_per_week: 70, delivery_postcodes: ["2016","2017","2018","2015"],
    rating: 4.7, review_count: 18,
    tags: ["Mediterranean","Gluten-Free Options","Dairy-Free","Fresh & Light"],
    highlights: ["🥗 Greek Salad","🍢 Souvlaki Platter","🧆 Falafel Bowl","🫐 Baklava"],
    food_image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=85",
    commission_pct: 20, status: "active", menus: {},
  },
  {
    chef_id: 3, chef_name: "Chef Som", cuisine_type: "Thai",
    bio: "I grew up in Chiang Mai and learnt to cook in my family's restaurant. My food is all about balance — the perfect harmony of sweet, sour, salty and spicy. I bring the real taste of Northern Thailand to Sydney.",
    photo_url: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&q=80",
    price_per_week: 72, delivery_postcodes: ["2010","2011","2021","2022"],
    rating: 4.9, review_count: 31,
    tags: ["Thai","Spicy Options","Gluten-Free","Traditional Recipes"],
    highlights: ["🍜 Pad Thai","🍲 Green Curry","🥗 Som Tum","🍡 Mango Sticky Rice"],
    food_image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=85",
    commission_pct: 20, status: "active", menus: {},
  },
  {
    chef_id: 4, chef_name: "Chef Marco", cuisine_type: "Italian",
    bio: "Born in Naples, trained in Rome, cooking in Sydney. I use my nonna's handwritten recipe book every single week. Everything is made from scratch—pasta, sauces, even the bread. Real Italian, no shortcuts.",
    photo_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    price_per_week: 80, delivery_postcodes: ["2010","2011","2000","2009"],
    rating: 4.9, review_count: 42,
    tags: ["Italian","Pasta","Gluten-Free Options","Made from Scratch"],
    highlights: ["🍝 Handmade Tagliatelle","🥩 Osso Buco","🍕 Focaccia","🍮 Tiramisu"],
    food_image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=85",
    commission_pct: 20, status: "active", menus: {},
  },
];

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const results = {};

  // Seed chefs (skip existing chef_ids)
  const { data: existingChefs } = await db.from('chefs').select('chef_id');
  const existingIds = (existingChefs || []).map(c => c.chef_id);
  const newChefs = SEED_CHEFS.filter(c => !existingIds.includes(c.chef_id));
  if (newChefs.length > 0) {
    const { error } = await db.from('chefs').insert(newChefs);
    results.chefs = error ? `error: ${error.message}` : `inserted ${newChefs.length}`;
  } else {
    results.chefs = 'already seeded';
  }

  // Seed site content
  const rows = Object.entries(DEFAULT_CONTENT).map(([key, value]) => ({ key, value: String(value) }));
  const { error: contentErr } = await db.from('site_content').upsert(rows, { onConflict: 'key', ignoreDuplicates: true });
  results.content = contentErr ? `error: ${contentErr.message}` : `upserted ${rows.length} keys`;

  return res.json({ ok: true, results });
});
