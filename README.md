# Blink Capital Partners — Website

Static site (no build step). Pages: Home, About, Loan Programs (+ Fix & Flip, Ground-Up Construction, DSCR Rental Loans), DSCR Calculator, How It Works, FAQ, Contact, Partner With Us, Privacy Policy, Terms.

## Launch checklist (Netlify)

1. **Deploy** — go to [app.netlify.com](https://app.netlify.com), sign up free, and drag-and-drop this whole folder onto the dashboard ("Deploy manually" / Sites). Netlify auto-detects the two forms in `contact.html` and `partner-with-us.html` (they use `data-netlify="true"`) — no extra signup or form ID needed, unlike the earlier Formspree setup.
2. **Point the domain** — in the new site's **Domain settings**, add `blinkcp.com` as a custom domain. Netlify will show you DNS records to add at your domain registrar (either delegate to Netlify DNS, or add the A/CNAME records it gives you). HTTPS/SSL is issued automatically once DNS resolves — no separate action needed.
3. **Turn on form notifications** — in the site's **Forms** tab, set an email address (or Slack/webhook) to get notified on each submission. Do this for both the `loan-inquiry` and `partner-application` forms.
4. **Spam filtering** — a honeypot field is already built into both forms. For stronger filtering, Netlify's **Forms → Spam filters** offers a one-click Akismet-based filter.
5. **Legal pages** — `privacy-policy.html` and `terms.html` are templates only. Have an attorney review before publishing, especially TCPA (phone/SMS) consent language.
6. **Social links** — add real profile URLs in the JSON-LD `sameAs` array in `index.html` once social accounts exist.
7. **Business address / licensing** — currently omitted from the footer and contact page by request. Add a mailing address and NMLS/state license disclosures if/when you want them public — some states require licensing disclosure in lending advertisements, so worth a compliance check before high-volume ad spend.
8. **After launch** — submit `sitemap.xml` in Google Search Console; consider setting up a Google Business Profile.

## Local preview

From this folder, run a local server (opening `index.html` directly won't resolve the site's absolute paths):

```
python -m http.server 8000
```

Then visit `http://localhost:8000`. Note: Netlify Forms only actually deliver submissions once deployed on Netlify — locally, the form will submit but nothing will receive it.

## Forms

Both `contact.html` and `partner-with-us.html` use Netlify's native form handling — no external service required:
- Static `data-netlify="true"` attribute + hidden `form-name` field, detected by Netlify at deploy time.
- `assets/js/main.js` submits via fetch (Netlify's documented AJAX pattern) so the page shows an inline success/error message instead of a full-page redirect.
- `action="/thank-you.html"` is the non-JS fallback if a visitor has JavaScript disabled.
- A visually-hidden honeypot field (`bot-field`) blocks basic bots.

## SEO / AI-visibility infrastructure included

- `sitemap.xml`, `robots.txt` — standard search engine crawling.
- `llms.txt` — plain-language site summary for AI answer engines.
- JSON-LD structured data (`FinancialService`, `FinancialProduct`, `FAQPage`, `BreadcrumbList`, `HowTo`) on relevant pages.
- Unique title/meta description and Open Graph tags per page.
