# CelebChef — Build Verification Test Suite

> **For automated agents:** Run `node tests/bvt-runner.js` from the project root.
> **Report output:** `tests/bvt-results/bvt-<timestamp>.json`
> **Pass criteria:** 0 failures (exit code 0)

---

## Coverage Summary

| Section | Tests | What it checks |
|---------|-------|----------------|
| S1 File Existence | BVT-001–018 | All HTML + JS files present |
| S2 Routing & Config | BVT-020–024 | Vercel redirect, module loading, branding |
| S3 Data Layer | BVT-030–036 | Chef data, postcodes, subscriber statuses, localStorage helpers |
| S4 Public Site | BVT-040–045 | HomePage, ChefCard, DetailPage, Subscribe, BecomeAChef |
| S5 Admin Portal | BVT-050–058 | Login gate, all pages, chef management, subscribers |
| S6 Chef Portal | BVT-060–064 | Data load, save, menu submission, image spec |
| S7 Notifications | BVT-070–072 | Application notifications, badge counts |

---

## Section 1 — File Existence

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-001 | app.html exists | File present at root | Critical |
| BVT-002 | admin.html exists | File present at root | Critical |
| BVT-003 | vercel.json exists | File present at root | Critical |
| BVT-004 | js/cc-data.js exists | File present | Critical |
| BVT-005 | js/cc-nav.js exists | File present | Critical |
| BVT-006 | js/cc-home.js exists | File present | Critical |
| BVT-007 | js/cc-detail.js exists | File present | Critical |
| BVT-008 | js/cc-subscribe.js exists | File present | Critical |
| BVT-009 | js/cc-how.js exists | File present | Critical |
| BVT-010 | js/cc-portal.js exists | File present | Critical |
| BVT-011 | js/cc-main.js exists | File present | Critical |
| BVT-012 | js/admin-data.js exists | File present | Critical |
| BVT-013 | js/admin-dashboard.js exists | File present | Critical |
| BVT-014 | js/admin-chefs.js exists | File present | Critical |
| BVT-015 | js/admin-subs.js exists | File present | Critical |
| BVT-016 | js/admin-content.js exists | File present | Critical |
| BVT-017 | js/admin-app.js exists | File present | Critical |

---

## Section 2 — Routing & Config

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-020 | Vercel redirect `/` → `/app.html` | vercel.json has exact redirect rule | Critical |
| BVT-021 | app.html loads all 8 JS modules | All `<script>` tags present | Critical |
| BVT-022 | admin.html loads cc-portal.js | Chef portal code available at admin login | Critical |
| BVT-023 | admin.html loads all 6 admin modules | All `<script>` tags present | Critical |
| BVT-024 | CelebChef yellow branding (#FACA50) | Colour token in app.html | High |

---

## Section 3 — Data Layer

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-030 | window.CC + mockChefs declared | Both strings in cc-data.js | Critical |
| BVT-031 | At least 4 chefs exist | `chef_id:` appears ≥4 times | Critical |
| BVT-032 | All 4 cuisine types present | Indian, Mediterranean, Thai, Italian | Critical |
| BVT-033 | POSTCODE_SUBURB_MAP has ≥10 postcodes | 4-digit postcode keys counted | High |
| BVT-034 | Chefs have currentWeek + nextWeek menus | Both keys + day names present | Critical |
| BVT-035 | All 5 subscriber status stages defined | Interested, Payment Made, Active Deliveries, Paused, Deactivated | Critical |
| BVT-036 | All localStorage helpers present | load/save for chefs, subscribers, applications, notifications | Critical |

---

## Section 4 — Public Site

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-040 | Chef Portal NOT in public nav | `portal` absent from `navItems` array | Critical |
| BVT-041 | HomePage + ChefCard components | Both function declarations in cc-home.js | Critical |
| BVT-042 | Dark hero background | `#111` in cc-home.js | High |
| BVT-043 | ChefDetailPage component | Function declared in cc-detail.js | Critical |
| BVT-044 | SubscribePage with AU mobile validation | `04` pattern in cc-subscribe.js | High |
| BVT-045 | BecomeAChef saves application to localStorage | `cc_chef_applications` + notification push in cc-how.js | Critical |

### Manual BVTs — Public Site (browser required)

| ID | Name | Steps | Expected Result |
|----|------|-------|-----------------|
| BVT-M01 | Homepage loads with chef cards | Open app.html | 4 chef cards visible with cuisine badges |
| BVT-M02 | Cuisine filter works | Click "Indian" pill | Only Chef Priya shown |
| BVT-M03 | Chef detail page | Click "View Full Menu" on any chef | Detail page with Mon–Fri day cards |
| BVT-M04 | Subscribe form validation | Submit empty subscribe form | Red validation errors shown |
| BVT-M05 | Subscribe success | Fill all fields + submit | Loading spinner → success screen with booking summary |
| BVT-M06 | BecomeAChef form | Fill form + submit | Application saved to localStorage `cc_chef_applications` |
| BVT-M07 | Postcode filter | Type "2042" in postcode box | Only chefs delivering to 2042 shown |

---

## Section 5 — Admin Portal

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-050 | LoginGate has Admin + Chef tabs | Both tab labels + `cc_chef_accounts` in admin-app.js | Critical |
| BVT-051 | Routes to all pages | All page component names in admin-app.js | Critical |
| BVT-052 | Menu Approvals page exists | `MenuApprovalsPage` + nav entry | High |
| BVT-053 | ApplicationsPage with approve/reject | All three functions declared | Critical |
| BVT-054 | ChefAccessModal for credentials | Function + `cc_chef_accounts` + username/password | Critical |
| BVT-055 | Subscriber workflow guide | WorkflowGuide + WORKFLOW_STEPS + statusBadgeFor | Critical |
| BVT-056 | Manual subscriber add | `handleAddSubscriber` + button | High |
| BVT-057 | Subscriber status filter | `filterStatus` + All Statuses option | High |
| BVT-058 | DashboardPage exists | Function declared in admin-dashboard.js | High |

### Manual BVTs — Admin Portal (browser required)

| ID | Name | Steps | Expected Result |
|----|------|-------|-----------------|
| BVT-M10 | Admin login | Open admin.html, enter admin123 | Full admin portal shown |
| BVT-M11 | Chef login | Switch to Chef tab, enter valid credentials | Chef portal shown (no admin menu) |
| BVT-M12 | Wrong password blocked | Enter wrong password | Error message, no access |
| BVT-M13 | Sidebar badges | With pending chef applications | Red count badge on Chef Applications |
| BVT-M14 | Chef Applications approval | Approve an application | Chef appears in Active Chefs list |
| BVT-M15 | Chef credentials | Click key icon → create username/password | Saved to `cc_chef_accounts` |
| BVT-M16 | Subscriber status change | Open subscriber → Change → set "Payment Made" → Save | Status badge updates in table |
| BVT-M17 | Workflow guide | Click "Workflow" button on Subscribers page | Step-by-step guide panel shown |
| BVT-M18 | Add subscriber manually | Click "Add Subscriber" → fill form → submit | New row in subscriber table |

---

## Section 6 — Chef Portal

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-060 | Data loads from store on login | `chefFromStore` + `buildMenusFromChef` in cc-portal.js | Critical |
| BVT-061 | Save Profile writes to localStorage | `localStorage.setItem('cc_chefs'` called | Critical |
| BVT-062 | Menu submission to pending queue | `cc_pending_menus` + `handleSubmitForApproval` | Critical |
| BVT-063 | Dish image size spec enforced | 800×500 dimensions referenced | High |
| BVT-064 | Session prop integration | `session`, `chef_id`, `chef_name` all used | Critical |

### Manual BVTs — Chef Portal (browser required)

| ID | Name | Steps | Expected Result |
|----|------|-------|-----------------|
| BVT-M20 | Profile pre-fills on login | Log in as Chef Priya | Name, cuisine, price, bio all pre-filled |
| BVT-M21 | Existing postcodes shown | Log in as Chef Priya | Delivery postcodes (2042, 2203, etc.) visible |
| BVT-M22 | Existing menus load | Switch to Menu Submission tab | Mon–Fri dishes pre-populated from store |
| BVT-M23 | Save Profile persists | Edit bio → Save Profile → reload | Bio change persists in public site |
| BVT-M24 | Menu submit for approval | Fill menu → Submit for Approval | Entry appears in admin Menu Approvals |

---

## Section 7 — Notifications & Chef Applications

| ID | Name | Pass Condition | Severity |
|----|------|----------------|----------|
| BVT-070 | Chef application pushes notification | `cc_notifications` + `chef_application` type in cc-how.js | High |
| BVT-071 | pushNotification helper exists | Function declared in admin-data.js | High |
| BVT-072 | Sidebar badge counts work | `badges.applications`, `badges.newSubscribers` in admin-app.js | High |

---

## Running Tests

### Automated (file-level)
```bash
node tests/bvt-runner.js
```

### View last report
```bash
ls -t tests/bvt-results/ | head -1 | xargs -I{} cat tests/bvt-results/{}
```

### System crontab (daily at 9:03am)
```
3 9 * * * cd /path/to/Chef && node tests/bvt-runner.js >> tests/bvt-results/daily.log 2>&1
```

---

## Failure Response

| Failure type | Action |
|---|---|
| File missing | Check git status; restore from last commit |
| Data structure broken | Reset `cc_chefs` in localStorage or restore from backup |
| Routing broken | Check vercel.json redirect + app.html script order |
| Admin login broken | Clear `cc_admin_pwd` from localStorage |
| Chef login broken | Check `cc_chef_accounts` localStorage key |
