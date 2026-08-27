# Blink Capital Partners — Website

Static site (no build step). Pages: Home, About, Loan Programs (+ Fix & Flip, Ground-Up Construction, DSCR Rental Loans), DSCR Calculator, How It Works, FAQ, Contact, Partner With Us, Privacy Policy, Terms.

## Hosting

The site runs as a static nginx container on **Google Cloud Run**, not Netlify. Two services exist in the `blinkcp-crm` GCP project (region `us-east1`):

- **`blinkcp-website`** — production. `blinkcp.com` and `www.blinkcp.com` are mapped to this service via Cloud Run domain mappings.
- **`blinkcp-website-staging`** — staging. No custom domain; reachable only at its own `*.run.app` URL. Safe to deploy to freely — it never touches the live site.

`Dockerfile` + `nginx.conf.template` build the image (nginx listens on Cloud Run's `$PORT`). `.dockerignore` excludes `.git` and stray `* - Copy.*` files from the build context.

## Deploy workflow (staging → production)

Unlike Netlify, Cloud Run has no per-deploy credit cost, so deploy to staging as often as you like.

1. Work on the `staging` git branch for anything you want to test first: `git checkout staging`.
2. Commit your changes, then deploy **only** to the staging Cloud Run service:
   ```
   gcloud run deploy blinkcp-website-staging --source . --region us-east1 --allow-unauthenticated --min-instances=0 --max-instances=2
   ```
   Run this from a machine/shell authenticated to the `blinkcp-crm` GCP project (Google Cloud Shell works well for this — no local gcloud setup needed).
3. Review the change at the staging service's `*.run.app` URL (find it via `gcloud run services describe blinkcp-website-staging --region us-east1` or the Cloud Console).
4. When it looks right, merge `staging` into `main`, then deploy the same source to **production** — same command, without the `-staging` suffix:
   ```
   gcloud run deploy blinkcp-website --source . --region us-east1 --allow-unauthenticated --min-instances=0 --max-instances=2
   ```
   This is the step that actually updates `blinkcp.com`.
5. Keep `staging` in sync: `git checkout staging && git merge main`.

If a fresh Cloud Run service is ever recreated, it may need a one-time manual step in the Console (Cloud Run → service → Security tab → "Allow unauthenticated invocations") since public-access IAM bindings can't always be set from the CLI.

## Local preview

From this folder, run a local server (opening `index.html` directly won't resolve the site's absolute paths):

```
python -m http.server 8000
```

Then visit `http://localhost:8000`. Note: the lead-capture forms POST to `https://crm.blinkcp.com/api/public/*`, which only accepts requests from the `blinkcp.com`/`www.blinkcp.com` origins (CORS) — so form submissions won't succeed from `localhost` or from the Cloud Run staging URL, only from the production domain. Static content (pages, styling, links) previews fine locally either way.

## Forms

Both `contact.html` and `partner-with-us.html` submit to the **blinkcp-crm** backend instead of Netlify Forms (which only worked on Netlify hosting):
- `assets/js/main.js` POSTs to `https://crm.blinkcp.com/api/public/contact` or `.../api/public/partner`, keyed off each form's hidden `form-name` field (`loan-inquiry` / `partner-application`), and shows an inline success/error message.
- The CRM backend (`src/app/api/public/*` in the `blinkcp-crm` repo) dedupes the submitter against existing contacts by phone/email, creates or updates the contact, and logs an activity — visible directly in the CRM.
- A visually-hidden honeypot field (`bot-field`) blocks basic bots; the backend silently accepts (200 OK) but discards submissions where it's filled in.
- `action="/thank-you.html"` remains as a non-JS fallback if a visitor has JavaScript disabled, though this no longer submits anywhere functional without JS.

## Outstanding items

- **Legal pages** — `privacy-policy.html` and `terms.html` are templates only. Have an attorney review before relying on them, especially TCPA (phone/SMS) consent language.
- **Social links** — add real profile URLs in the JSON-LD `sameAs` array in `index.html` once social accounts exist.
- **Business address / licensing** — currently omitted from the footer and contact page by request. Add a mailing address and NMLS/state license disclosures if/when you want them public — some states require licensing disclosure in lending advertisements, so worth a compliance check before high-volume ad spend.
- **Spam filtering** — the honeypot field blocks basic bots; there's no additional filtering (e.g. Akismet) since the form pipeline moved off Netlify Forms.
- Submit `sitemap.xml` in Google Search Console; consider setting up a Google Business Profile, if not already done.

## SEO / AI-visibility infrastructure included

- `sitemap.xml`, `robots.txt` — standard search engine crawling.
- `llms.txt` — plain-language site summary for AI answer engines.
- JSON-LD structured data (`FinancialService`, `FinancialProduct`, `FAQPage`, `BreadcrumbList`, `HowTo`) on relevant pages.
- Unique title/meta description and Open Graph tags per page.
