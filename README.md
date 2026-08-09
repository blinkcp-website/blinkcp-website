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

## Deploy workflow (staging → production)

Netlify's free plan runs on a monthly credit budget (300 credits), and **every push to `main` costs 15 credits as a flat "production deploy" fee** — regardless of how small the change is. Actual visitor traffic (bandwidth, requests) costs almost nothing by comparison. So the credit-efficient workflow is:

1. Work on the `staging` branch, not `main`, for anything you want to test first: `git checkout staging` (or `git checkout -b staging` if it doesn't exist locally).
2. Push to `staging` as often as you like — **branch deploys are free**, no credit cost, no limit. Netlify auto-builds it at `https://staging--spiffy-sunflower-1c2428.netlify.app`.
3. That URL is a real, fully-functional Netlify deploy (unlike `python -m http.server` locally), so it's the only place to actually test Netlify Forms end-to-end before going live.
4. When the batch of changes looks right, merge `staging` into `main` and push — that single merge is the one 15-credit production deploy that actually updates blinkcp.com.

```
git checkout staging
# ...make and commit changes...
git push origin staging          # free branch deploy, test at the staging URL above

git checkout main
git merge staging
git push origin main             # the one production deploy (15 credits) that goes live
git checkout staging && git merge main   # keep staging in sync for next time
```

Check remaining credits any time at Netlify → your team → Usage & billing.

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
