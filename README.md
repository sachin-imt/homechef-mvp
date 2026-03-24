# HomeChef Sydney MVP
This is the custom HTML/CSS/JS frontend for the HomeChef MVP, designed to be deployed directly to Vercel with zero build configuration. It uses Airtable as its backend database.

## 🚀 Deployment
1. Connect your Github repository to **Vercel** or drop this folder into the Vercel dashboard.
2. Vercel will automatically detect this as a static site. No build command is necessary.
3. Your site is live!

## 💾 Airtable Setup
In the `Airtable_Setup/` folder, there are 4 CSV files:
- `Chefs.csv`
- `Weekly_Menus.csv`
- `Subscriptions.csv`
- `Chef_Applications.csv`

1. Create a new Base in Airtable.
2. Click **"Add or import" -> "CSV file"** and upload each of these files to pre-build your tables with mock data and the correct schema.

## 🔄 Operations Manual

### How to update chef menus
1. Open your Airtable Base.
2. Go to the **Weekly_Menus** table.
3. Edit the existing record or create a new one, set the `Start_Date` and `End_Date`, and fill out `Dish_1` through `Dish_5`.
4. *(Frontend Note: Because this is a static MVP web page without server-side rendering, to show new menus on the live website, you will need to manually open `index.html` in an editor and overwrite the text for the new dishes, then push to Vercel. Future iterations of this project can use Vercel Serverless Functions to dynamically fetch the Airtable API).*

### How to add new chefs
1. Open the **Chefs** table in Airtable and add their details.
2. To display them on the website, open `index.html`, copy an existing `<div class="chef-card">` and paste it below. 
3. Swap out the Name, Photo URL, Menu, and Subscription link parameter (e.g., `subscribe.html?chef=new_chef_name`).

### How to configure email notifications
1. Go to your Airtable Base.
2. Click **Automations** at the top right.
3. **Trigger:** Select "When a record is created" -> Choose the `Subscriptions` (or `Chef_Applications`) table.
4. **Action:** Select "Send email" -> Create an email template using the dynamic data fields from the new record (e.g. `Customer_Name`, `Chef_ID`, `Payment_Method`).

### How to view customer submissions
1. Open the **Subscriptions** table in Airtable.
2. You will see incoming orders populate immediately (once you hook the JS `fetch` request in `js/app.js` up to your final Airtable Webhook endpoint).
