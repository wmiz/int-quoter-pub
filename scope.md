### Goal

This is a public, production Shopify app intended for listing on the Shopify App Store.

Design a Shopify app that replaces the normal checkout button with a “Get a Quote” flow for shoppers from selected regions. The flow collects contact details, captures cart contents via AJAX, creates a Draft Order, notifies the customer that the merchant will be in touch, and notifies the merchant of the request.

### Assumptions

- Shopify Online Store 2.0 storefront theme, with Theme App Extensions allowed.
- App uses Shopify Admin API (2024-07+) for Draft Orders and Shop data.
- Regions configured by merchant (countries and/or continents, possibly by IP geolocation). Regions are stored as ISO country codes and selected via the Polaris country selector consistent with Shopify shipping settings.
- “Get a Quote” should appear anywhere the normal checkout entry point appears (PDP, cart page, mini-cart, sticky bars).
- Popup collects minimally: name, email, optional phone, company, notes; can be expanded later.
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
    - App installation records, shop settings, region rules, templates, logs.
    - Quote request logs (for support/troubleshooting).
- **Notifications**
  - Customer email confirming receipt and what to expect (optional, via app).
  - Merchant notification handled via downloadable Shopify Flow templates (triggered by tags/notes on Draft Orders).
- **Security/Compliance**
  - CSRF protection for storefront endpoint.
  - Rate limiting/abuse protection on quote endpoint.
  - PII minimized; GDPR compliance and DSR support.

## Detailed Plan

### 1) Merchant UX and Data Model

- **Settings**
  - Regions: support ISO country codes; optionally continents and custom lists. Admin UI uses the Polaris country selector (same component/behavior as Shopify shipping settings) for a consistent merchant experience.
  - Detection strategy: IP-based geo with fallback to shipping country selection (if present).
  - Placement options: PDP, cart page, mini-cart, dynamic checkout buttons toggle.
  - Popup: configurable fields (required/optional), branding (logo, accent color), copy, translations.
  - Notifications: provide Shopify Flow templates and documentation; optional Slack webhook URL for Flow actions.
  - Draft Order: tags (e.g., “International Quote”), note template including collected info and cart summary.
- **Data model (Prisma)**
  - Shop: `id`, `shopDomain`, `accessToken`, `scopes`, `installedAt`.
  - Settings: `shopId`, `regionMode` (allow/block), `regions` (array of ISO codes), `placements`, `popupFields`, `translations`, `draftOrderTags`, `createdAt/updatedAt`.
  - QuoteLog: `id`, `shopId`, `ip`, `country`, `cartSnapshot`, `customerEmail`, `status`, `draftOrderId`, `createdAt`.
  - EmailTemplate: `shopId`, `type` (merchant/customer), `subject`, `body`, `locale`.

### 2) Storefront Integration (Theme App Extension)

- **Assets**
  - `quote-modal.css` and `quote-modal.js` providing:
    - Geolocation: client uses a public IP geo service or Shopify `request_ip_country` via Liquid snippet if feasible.
    - Button replacement logic:
      - Observe target nodes (PDP add-to-cart/checkout buttons, cart page checkout, mini-cart buttons).
      - If user country ∈ configured regions (according to mode), hide/disable “Checkout” and inject “Get a Quote.”
      - Ensure accessibility and graceful fallback if script fails (do not block checkout where not applicable).
    - Popup modal UI:
      - Fields: name, email (required), phone/company/notes (optional), consent checkbox if needed.
      - Validation: client-side (HTML5 + light JS), server-side revalidation.
    - Submission flow:
      - Capture cart contents:
        - For cart-page/mini-cart: use Storefront AJAX API `/cart.js` to read `items`, attributes, note.
        - For PDP: ensure item is added first or capture selected variant/quantity and add-to-cart before quoting, then pull cart.
      - POST to app endpoint with CSRF token and shop domain.
      - Show success/failure states, and optionally keep the cart intact or clear per settings.

- **Liquid blocks**
  - Provide a simple block merchants can place where they want the behavior enabled (or auto-inject via app block).
  - Expose settings to toggle which templates to activate.

### 3) Region Detection Strategy

- **Primary: Client-side IP geolocation (fast, cached). Options:**
  - Use Shopify’s built-in `request.country` (via Liquid) to render a data attribute with guessed country to the DOM.
  - Or call a paid/free IP geolocation API from the browser (mind rate limits; cache in `localStorage` for TTL).
- **Fallbacks:**
  - If user explicitly selects a shipping country earlier (some themes do), prefer that.
- **Privacy:**
  - No persistent PII beyond country unless user submits form.
  - Document any third-party GEO provider and provide DPA if needed.

### 4) App Backend Endpoints

- **POST `/storefront/quote` (no session, shop-bound)**
  - Inputs: shop domain, country, form fields, cart JSON from `/cart.js`, CSRF token.
  - Steps:
    - Validate HMAC (signed with app secret) or anti-CSRF token tied to shop config.
    - Basic rate limiting per IP/shop (e.g., 5/min).
    - Validate fields; normalize phone and email.
    - Fetch shop access token from DB; instantiate Admin API client.
    - Construct Draft Order:
      - Map cart lines to `draftOrder.input` with variant IDs (if available) or SKU logic if needed.
      - Include customer (create/update customer if not found by email), add note attributes with collected fields.
      - Apply tags and source name (e.g., “International Quote”).
    - Create Draft Order via Admin API.
    - Notifications (merchant): rely on Shopify Flow templates triggered by Draft Order tags/notes; app does not send merchant emails.
    - Optional customer email: confirmation with summary and Draft Order reference.
    - Persist `QuoteLog`.
    - Response: success, message, draft order name/ID.
- **GET/POST `/admin/settings` (embedded)**
  - CRUD for settings, templates, and toggles.
- **Webhooks**
  - `app/uninstalled`: cleanup tokens and disable front-end injection gracefully.
  - Optional: `shop/update` to stay in sync.

### 5) Draft Order Creation Details

- **Map cart lines:**
  - Use variant ID (preferred): the AJAX cart response includes `variant_id`; convert to GraphQL ID or REST as needed.
  - Preserve discounts and notes by copying into Draft Order note/line item properties (Shopify draft order discounts can be applied; if not replicable exactly, include a note).
- **Customer handling:**
  - Lookup by email; if not exists, create with provided name, phone, tags (e.g., “International Quote Lead”).
- **Draft order metadata:**
  - Tags: `International Quote`, `Region:<country>`, and optional campaign tags.
  - Note: embed structured summary (JSON string) for quick admin scan.
- **Communication:**
  - Do NOT send invoice automatically; this is a quote request. Merchant will follow up and send invoice later if needed.

### 6) Notifications

- **Customer email**
  - Sent via app transactional provider (e.g., SendGrid/SES) or Shopify notifications API if allowed; include branding from settings.
  - Content: thank you, what to expect, timeframe, reference number.
- **Merchant email**
  - Provided via Shopify Flow templates (download/import). Templates use Draft Order tags/notes to send email/Slack.

### 7) Admin App (Embedded)

- **Pages**
  - Overview dashboard: recent quote requests with filters.
  - Regions & routing: select countries/continents; allow/block mode.
  - Placement & UX: toggle locations, popup fields, copy, languages.
  - Notifications: Shopify Flow templates (download links), guidance.
  - Developer options: debug mode (log GEO results), clear cache, test mode.
- **Permissions**
  - `write_draft_orders`, `read_products`, `read_customers`, `write_customers`, `read_orders`, `read_themes` (if needed for extension).
- **Validation**
  - Prevent enabling feature without recipients set.
  - Provide “Simulate from Country” tool to preview behavior.

### 8) Security, Reliability, and Privacy

- CSRF protection for storefront POST (token baked into injected Liquid; double-submit cookie pattern).
- HMAC signing on storefront requests (sign with app secret + shop domain).
- Rate limiting with in-memory + durable store (e.g., Redis if needed).
- Input validation with server-side schema (e.g., Zod/Yup).
- Logs without sensitive PII beyond what’s necessary; redact where possible.
- GDPR
  - Privacy policy and data retention window.
  - Data subject request handling: delete quotes on request.

### 9) Performance and UX

- **Non-blocking button replacement:**
  - Render normal checkout button; replace/enhance after GEO result returns.
  - Cache GEO in `localStorage` for 24h to avoid repeated lookups.
- **Resilience**
  - If GEO fails, do not block checkout; show normal checkout.
  - If quote endpoint fails, show friendly error and keep checkout available.
- **Accessibility**
  - Modal is focus-trapped, keyboard navigable, high-contrast.

### 10) Testing

- **Unit tests**
  - Region matching, settings validation, Draft Order payload mapping.
- **Integration tests**
  - End-to-end quote submission with mocked cart JSON.
- **Storefront manual tests**
  - Simulate different countries; verify button replacement on PDP, cart, mini-cart.
- **Webhook tests**
  - Uninstall cleanup works.

### 11) Rollout

- **Alpha:** one partner store, log heavily.
- **Beta:** add retry/backoff for geolocation and notifications; refine Draft Order mapping.
- **Public listing:** prepare app listing content, screenshots, demo video, pricing, privacy policy, and support contact; pass Shopify app review requirements.
  - Include reference to Shopify Flow templates for merchant notifications in listing docs.

## Key Implementation Milestones

- Settings model and Admin UI for regions and notifications
- Theme App Extension with modal + button replacement
- Storefront quote submission endpoint with validation and CSRF/HMAC
- Draft Order creation + customer linking
- Notifications to merchant and customer
- Logs and dashboard
- Hardening: rate limits, retries, privacy controls, translations
  - Provide Shopify Flow templates for notifications and document required tags/notes

## Clarifying Questions

- Do you want regions defined strictly by ISO country codes, or also continents/regions (e.g., “Europe”)?
- Should the “Get a Quote” replace checkout on PDP, cart page, mini-cart, or all of the above?
- Is IP-based geolocation sufficient, or do you prefer server-side country hints via Liquid or a specific provider?
- Which fields must be required in the popup (name, email mandatory; phone/company optional)?
- Do you want the cart cleared after submitting a quote, or preserved?
- Preferred email provider (Shopify notifications vs SendGrid/SES)? Any constraints?
- Any specific languages/locales to support initially?
- Any requirements to also prevent checkout (hard block) for these regions, or only divert via UI?
