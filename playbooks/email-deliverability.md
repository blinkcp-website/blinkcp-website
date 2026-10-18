# Email Deliverability Setup — blinkcp.com

## Current state (audited 2026-10-06)

| Record | Status |
| --- | --- |
| SPF | **Missing entirely** |
| DKIM | **Missing** — `google`, `selector1`, `selector2`, `s1`, `k1`, `default` all empty |
| DMARC | `v=DMARC1; p=none;` — a stub with no reporting address |

The only TXT record on the domain is a Google site-verification string. Nothing
authorises Google to send as blinkcp.com, and nothing signs the messages.

Two consequences:

1. **Deliverability.** Gmail-to-Gmail often still lands because Google trusts its
   own infrastructure. Outlook, Yahoo and corporate filters have nothing to
   verify against — and that is where realtors, GCs and title reps read mail.
2. **Spoofing.** Anyone can forge `@blinkcp.com` today. In real estate, wire
   fraud via spoofed closing emails is endemic. This is a fraud control, not
   just an inbox-placement tweak.

DNS is managed at Squarespace (`nsd1–4.squarespacedns.com`).
Squarespace → Settings → Domains → blinkcp.com → **DNS Settings** → Add record.

---

## 1. SPF

| Field | Value |
| --- | --- |
| Type | TXT |
| Host | `@` |
| Data | `v=spf1 include:_spf.google.com ~all` |

**Only ever one SPF record per domain.** If you later add a sending platform,
extend this record with another `include:` — do not add a second TXT starting
`v=spf1`. Two SPF records is a permanent-error condition and fails everything.

`~all` is a soft fail: unauthorised mail is accepted but marked. Move to `-all`
once you're confident every legitimate sender is listed.

---

## 2. DKIM — generate in Google, publish at Squarespace

Google does **not** enable DKIM by default. That's why there's none today.

1. Google Admin → **Apps → Google Workspace → Gmail → Authenticate email**
2. Select `blinkcp.com`
3. **Generate new record** — choose **2048-bit**, prefix `google`
4. Google shows a TXT record. Publish it at Squarespace:

| Field | Value |
| --- | --- |
| Type | TXT |
| Host | `google._domainkey` |
| Data | the long `v=DKIM1; k=rsa; p=...` string Google generated |

5. Wait for DNS to propagate, then return to that Admin page and click
   **Start authentication**. Skipping this last step is the most common reason
   DKIM silently never turns on.

**Gotcha:** a 2048-bit key exceeds the 255-character limit for a single TXT
string. Most providers split it automatically; some reject it. If Squarespace
refuses the value, regenerate at **1024-bit** — weaker, but working DKIM beats
absent DKIM.

---

## 3. DMARC

Replace the existing stub.

| Field | Value |
| --- | --- |
| Type | TXT |
| Host | `_dmarc` |
| Data | `v=DMARC1; p=none; rua=mailto:info@blinkcp.com; fo=1` |

`p=none` does not block anything — it tells receivers to report. The current
record is useless precisely because it has no `rua=`, so nobody has ever been
told what's happening with the domain.

Read the reports for a few weeks, confirm all legitimate mail passes, then
tighten to `p=quarantine`, and later `p=reject`. Do not jump straight to
`reject` — you will silently lose real mail.

---

## 4. Do not send cold outreach from blinkcp.com

Cold email generates complaints, and complaints attach to the sending domain —
the same domain that sends term sheets and closing instructions.

Use a separate domain for the Track B cadence in `lead-cadence.md`. A
purpose-bought domain is cleanest. Warm it up: a handful of sends a day for the
first fortnight, rising gradually. A new domain sending hundreds on day one is
the single most reliable way to get filtered.

Inbound follow-up (Track A) is fine from blinkcp.com — those people asked.

---

## 5. Bulk-sender requirements

Gmail and Yahoo require, for anyone sending volume:

- SPF **and** DKIM **and** DMARC — all three
- One-click unsubscribe (`List-Unsubscribe` header) on marketing mail
- Spam-complaint rate kept under **0.3%**

Any competent sending platform sets the unsubscribe header; confirm yours does.

---

## 6. Texting: A2P 10DLC registration

US carriers filter or block unregistered business texting regardless of consent.
Through your texting provider you register:

- a **Brand** (the legal entity), and
- a **Campaign** (what you send, and how consent is collected)

Lending is a scrutinised vertical, so campaign review will likely ask you to
show the consent flow — the exact checkbox and disclosure a user sees before
you text them.

That now exists on the Get Funded form: an unchecked, optional box carrying
"Reply STOP", "not a condition" of any loan, and the message-and-data-rates
disclosure. Screenshot that page for the application.

---

## Verification

Once the records are published, these should return values:

```
dig +short TXT blinkcp.com
dig +short TXT google._domainkey.blinkcp.com
dig +short TXT _dmarc.blinkcp.com
```

Then send a test message to a Gmail address, open it, and use **Show original**.
You want `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`. Anything less and one of the
three records is wrong.

## Checklist

- [ ] SPF TXT published at `@`
- [ ] DKIM generated in Google Admin and published at `google._domainkey`
- [ ] **Start authentication** clicked in Google Admin after propagation
- [ ] DMARC replaced with a record carrying `rua=`
- [ ] Separate domain chosen for cold outreach
- [ ] A2P 10DLC brand + campaign submitted
- [ ] `Show original` on a test Gmail shows three PASSes
