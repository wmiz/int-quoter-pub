### Goal

This is a public, production Shopify app intended for listing on the Shopify App Store.

Design a Shopify app that replaces the normal checkout button with a “Get a Quote” flow for shoppers from selected regions. The flow collects contact details, captures cart contents via AJAX, creates a Draft Order, notifies the customer that the merchant will be in touch, and notifies the merchant of the request.

### Assumptions

- Shopify Online Store 2.0 storefront theme, with Theme App Extensions allowed.
- App uses Shopify Admin API (2024-07+) for Draft Orders and Shop data.
- Regions configured by merchant (countries and/or continents, possibly by IP geolocation). Regions are stored as ISO country codes and selected via the Polaris country selector consistent with Shopify shipping settings.
- “Get a Quote” should appear anywhere the normal checkout entry point appears (PDP, cart page, mini-cart, sticky bars).
- Popup collects: name (split into first_name/last_name), email (required), optional phone, company, notes, and full shipping address (address1, address2, city, province/state, zip/postal code, country). Can be expanded later.
- Multi-language support via app translations.
- No custom checkout modifications required; button replacement happens pre-checkout.

If any of these differ from your needs, I’ll adjust the plan.

## High-Level Architecture

- **Admin (merchant) UI**
  - Embedded app in Shopify Admin (Remix + Shopify App Bridge) to configure:
    - Regions to divert (allow list / block list).
    - Where to replace the button (PDP, cart, mini-cart).
    - Popup fields and validation rules.
    - Optional auto-tagging for Draft Orders and customers.
- **Storefront integration**
  - Theme App Extension injecting:
    - A lightweight client script to detect visitor region and conditionally replace checkout buttons.
    - A modal/popup UI component and form.
    - AJAX cart capture and submission endpoint call.
- **Backend**
  - App server (Remix) with secure Shopify session handling.
  - Endpoints:
    - Geolocation helper (optional; primary detection on client via IP geo API).
    - Quote submission: validates payload, fetches cart token/lines, creates Draft Order, returns confirmation.
    - Configuration APIs for Admin UI.
- **Data storage**
  - Prisma + SQLite/Postgres (prod) to store:
    - App installation records, shop settings, region rules (whitelist/blacklist), popup field configurations, draft order tags.
    - Quote tracking via Draft Orders with configurable tags (default: `gq-quote`).
- **Notifications**
  - Customer email: Not currently implemented (future enhancement).
  - Merchant notification handled via downloadable Shopify Flow templates (triggered by tags on Draft Orders, default tag: `gq-quote`).
- **Security/Compliance**
  - HMAC signature verification for storefront endpoints (via Shopify app proxy).
  - Rate limiting/abuse protection on quote endpoint (planned).
  - PII minimized; GDPR compliance and DSR support.

## Detailed Plan

### 1) Merchant UX and Data Model

- **Settings**
  - Regions: support ISO country codes via whitelist/blacklist. Whitelist countries always show checkout (even without shipping profiles). Blacklist countries always show quote button (even with shipping profiles). Automatic shipping profile detection planned for future.
  - Detection strategy: IP-based geo via Shopify `/browsing_context_suggestions.json` endpoint with fallback to `ipapi.co`, cached in localStorage for 24h.
  - Placement options: PDP, cart page, mini-cart (via CSS selectors: `[data-checkout]`, `.cart-checkout`, `button[data-checkout-button]`, `button[name='checkout']`).
  - Popup: configurable fields (phone, company, notes - name/email always required), hide prices option for quote countries.
  - Notifications: provide Shopify Flow templates and documentation via Notifications page.
  - Draft Order: tags default to `gq-quote` (configurable as comma-separated list), note includes collected info and cart summary.
- **Data model (Prisma)**
  - Shop: `id`, `shopDomain`, `installedAt`, `createdAt`, `updatedAt`.
  - Settings: `shopId`, `regionMode` (deprecated, kept for backwards compatibility), `regions` (deprecated), `whitelistCountries` (JSON array of ISO codes), `blacklistCountries` (JSON array of ISO codes), `popupFields` (JSON config), `draftOrderTags` (comma-separated string), `hidePrices` (boolean), `onboardingComplete` (boolean), `setupSuccessBannerDismissed` (boolean), `createdAt`, `updatedAt`.
  - Quote tracking: Uses Draft Orders with tag `gq-quote` (configurable) for tracking quote requests. Analytics are derived from Draft Orders and Orders with this tag.

### 2) Storefront Integration (Theme App Extension)

- **Assets**
  - `frontier-quote.css` and `frontier-quote.js` providing:
    - Geolocation: Uses Shopify `/browsing_context_suggestions.json` endpoint, falls back to `ipapi.co`, caches in `localStorage` for 24h. Supports URL parameter `?fq_country=XX` for testing.
    - Button replacement logic:
      - Observes target nodes via MutationObserver for dynamic content.
      - Selectors: `[data-checkout]`, `.cart-checkout`, `button[data-checkout-button]`, `button[name='checkout']`.
      - If user country matches configured regions (whitelist/blacklist), hide/disable "Checkout" and inject "Get a Quote."
      - Ensures accessibility and graceful fallback if script fails (does not block checkout where not applicable).
    - Popup modal UI (two-column layout):
      - Left column: Form with contact info (email, name split into first/last), shipping address fields (country, name, company, address1, address2, city, province, zip, phone), optional notes.
      - Right column: Cart summary with items (images, quantities, prices) and totals.
      - Fields: name (first/last), email (required), phone/company/notes (optional, configurable), full shipping address (required).
      - Validation: client-side (HTML5 + light JS), server-side revalidation.
    - Submission flow:
      - Capture cart contents via Storefront AJAX API `/cart.js`.
      - POST to app proxy endpoint `/apps/frontier-quote/quote` with HMAC signature.
      - Show success/failure states, modal auto-closes after 3 seconds on success.

- **Liquid blocks**
  - Provide a simple block merchants can place where they want the behavior enabled (or auto-inject via app block).
  - Expose settings to toggle which templates to activate.

### 3) Region Detection Strategy

- **Current Implementation: Whitelist/Blacklist**
  - Countries in whitelist always show checkout button (even without shipping profiles).
  - Countries in blacklist always show quote button (even with shipping profiles).
  - Uses ISO country codes (e.g., US, CA, GB).
- **Future Enhancement (Planned):**
  - Automatic detection based on Shopify shipping profiles.
  - Countries without shipping profiles will automatically show quote button.
  - This will work in conjunction with whitelist/blacklist (whitelist takes precedence).
- **Primary: Client-side IP geolocation (fast, cached). Options:**
  - Uses Shopify's `/browsing_context_suggestions.json` endpoint (preferred).
  - Falls back to `ipapi.co` free IP geolocation API.
  - Caches result in `localStorage` for 24h TTL.
  - Supports URL parameter `?fq_country=XX` for testing.
- **Fallbacks:**
  - If user explicitly selects a shipping country earlier (some themes do), prefer that.
- **Privacy:**
  - No persistent PII beyond country unless user submits form.
  - Document any third-party GEO provider and provide DPA if needed.

### 4) App Backend Endpoints

- **POST `/apps/frontier-quote/quote` (no session, shop-bound via app proxy)**
  - Inputs: shop domain, form fields (including shipping address), cart JSON from `/cart.js`, HMAC signature.
  - Steps:
    - Validate HMAC signature (signed with app secret) via Shopify app proxy verification.
    - Basic validation of required fields (email, cart items).
    - Fetch shop access token from DB; instantiate Admin API client.
    - Construct Draft Order:
      - Map cart lines to `draftOrder.input` with variant IDs (GraphQL GID format: `gid://shopify/ProductVariant/{id}`).
      - Include customer email, shipping address from form.
      - Apply tags from settings (default: `gq-quote`).
      - Include note with collected fields and cart summary.
    - Create Draft Order via Admin GraphQL API.
    - Notifications (merchant): rely on Shopify Flow templates triggered by Draft Order tags/notes; app does not send merchant emails.
    - Customer email: Not currently implemented (future enhancement).
    - Response: success, message, draft order name/ID, invoiceUrl.
- **GET `/apps/frontier-quote/settings` (storefront, via app proxy)**
  - Returns: `shouldShowQuote` (boolean), `popupFields` (JSON config).
  - Validates HMAC signature from app proxy.
  - Checks whitelist/blacklist against provided country code.
- **GET/POST `/app/settings` (embedded admin)**
  - CRUD for settings: whitelist/blacklist countries, popup fields, draft order tags, hide prices toggle.
- **Webhooks**
  - `app/uninstalled`: cleanup tokens and disable front-end injection gracefully.
  - Optional: `shop/update` to stay in sync.

### 5) Draft Order Creation Details

- **Map cart lines:**
  - Use variant ID (preferred): the AJAX cart response includes `variant_id`; convert to GraphQL GID format (`gid://shopify/ProductVariant/{id}`).
  - Preserve discounts and notes by copying into Draft Order note/line item properties (Shopify draft order discounts can be applied; if not replicable exactly, include a note).
- **Customer handling:**
  - Include customer email and full shipping address from form submission.
  - Shipping address includes: address1, address2, city, province, country, zip.
- **Draft order metadata:**
  - Tags: Default `gq-quote` (configurable in settings as comma-separated list).
  - Note: includes collected form fields and cart summary.
- **Communication:**
  - Do NOT send invoice automatically; this is a quote request. Merchant will follow up and send invoice later if needed.

### 6) Notifications

- **Customer email**
  - Not currently implemented (future enhancement).
  - Planned: Sent via app transactional provider (e.g., SendGrid/SES) or Shopify notifications API if allowed; include branding from settings.
  - Content: thank you, what to expect, timeframe, reference number.
- **Merchant email**
  - Provided via Shopify Flow templates (download/import from Notifications page). Templates use Draft Order tags (`gq-quote` by default) to trigger email/Slack notifications.
  - Flow template checks for draft order tag and sends internal email with quote request details.

### 7) Admin App (Embedded)

- **Pages**
  - Dashboard: Analytics showing recent quote requests, total revenue, average quote value, conversion rate, time to first response, quotes by country breakdown, top products requested. Filters by time period (today, 7 days, 30 days). Shows onboarding flow on first load.
  - Settings: Configure whitelist/blacklist countries, popup fields (phone, company, notes - name/email always required), draft order tags, hide prices option.
  - Notifications: Shopify Flow template download and setup instructions.
  - Testing: Country simulation tool to preview behavior with `?fq_country=XX` parameter.
  - Onboarding: Guided setup flow that checks for theme app extension activation.
- **Permissions**
  - `write_draft_orders`, `read_products`, `read_customers`, `write_customers`, `read_orders`, `read_themes` (for checking app embed status).
- **Validation**
  - Name and email fields are always enabled and required (enforced in UI and backend).
  - Provides "Simulate from Country" tool to preview behavior.

### 8) Onboarding and Setup

- **Onboarding Flow**
  - Guided setup process shown on first app load (controlled by `onboardingComplete` setting).
  - Steps: Configure settings, add theme app extension, set up notifications, test storefront.
  - Checks if theme app extension is active by inspecting `settings_data.json` for app embed blocks.
  - Shows setup status banner until extension is activated.
  - Can be reset to show onboarding again.

### 9) Security, Reliability, and Privacy

- HMAC signature verification for storefront POST (via Shopify app proxy).
- Rate limiting with in-memory + durable store (e.g., Redis if needed) - planned.
- Input validation with server-side validation (email, required fields).
- Logs without sensitive PII beyond what's necessary; redact where possible.
- GDPR
  - Privacy policy and data retention window.
  - Data subject request handling: delete quotes on request.

### 10) Performance and UX

- **Non-blocking button replacement:**
  - Render normal checkout button; replace/enhance after GEO result returns.
  - Cache GEO in `localStorage` for 24h to avoid repeated lookups.
- **Resilience**
  - If GEO fails, do not block checkout; show normal checkout.
  - If quote endpoint fails, show friendly error and keep checkout available.
- **Accessibility**
  - Modal is focus-trapped, keyboard navigable, high-contrast.

### 11) Testing

- **Unit tests**
  - Region matching, settings validation, Draft Order payload mapping.
- **Integration tests**
  - End-to-end quote submission with mocked cart JSON.
- **Storefront manual tests**
  - Simulate different countries; verify button replacement on PDP, cart, mini-cart.
- **Webhook tests**
  - Uninstall cleanup works.

### 12) Rollout

- **Alpha:** one partner store, log heavily.
- **Beta:** add retry/backoff for geolocation and notifications; refine Draft Order mapping.
- **Public listing:** prepare app listing content, screenshots, demo video, pricing, privacy policy, and support contact; pass Shopify app review requirements.
  - Include reference to Shopify Flow templates for merchant notifications in listing docs.

## Key Implementation Milestones

- ✅ Settings model and Admin UI for regions (whitelist/blacklist) and notifications
- ✅ Theme App Extension with modal + button replacement
- ✅ Storefront quote submission endpoint with validation and HMAC verification
- ✅ Draft Order creation + customer linking with shipping address
- ✅ Notifications to merchant via Shopify Flow templates
- ✅ Dashboard with analytics (requests, revenue, conversion, country/product breakdown)
- ✅ Onboarding flow with theme extension detection
- ✅ Testing tools for country simulation
- ⏳ Hardening: rate limits (not yet implemented), retries, privacy controls, translations
- ⏳ Automatic shipping profile detection (planned, currently uses whitelist/blacklist only)
- ⏳ Customer email notifications (planned)
- ⏳ QuoteLog persistence (not implemented, using Draft Orders directly)
  - Provide Shopify Flow templates for notifications and document required tags/notes

## Clarifying Questions (Answered)

- ✅ Regions defined by ISO country codes via whitelist/blacklist (continents/regions not supported)
- ✅ "Get a Quote" replaces checkout on PDP, cart page, mini-cart (via selectors)
- ✅ IP-based geolocation via Shopify endpoint with fallback to ipapi.co
- ✅ Fields: name and email mandatory; phone/company/notes optional (configurable)
- ✅ Cart preserved after submitting quote (not cleared)
- ⏳ Customer email provider: Not yet implemented (planned)
- ⏳ Languages/locales: English only currently (multi-language support planned)
- ✅ Only diverts via UI (does not hard block checkout)
- ✅ Full shipping address collection (not just minimal contact details)
