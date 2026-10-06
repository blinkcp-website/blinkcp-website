# Lead Cadence & Messaging — Blink Capital Partners

Two separate tracks. They are not interchangeable, and the difference is legal,
not stylistic.

| | Track A — Inbound lead | Track B — Cold referral partner |
| --- | --- | --- |
| Who | Submitted the Get Funded form | Realtor, GC, wholesaler, title rep, conventional broker |
| Email | Yes | Yes (CAN-SPAM applies) |
| Text | **Only if `sms_consent = yes`** | **Never** |
| Call | Yes | Yes |
| Goal | Term sheet issued | One deal sent |

---

## Rules that apply to every message

These are not style preferences. Breaking them is what creates liability.

1. **Never quote a rate, point, or term in writing.** The site's own language is
   "term sheet outlining loan amount, structure, and pricing" — written pricing
   comes from the term sheet, from an advisor, not from a cadence email.
2. **Never imply approval or qualification.** "Let's see if this fits" — never
   "you're approved" or "you qualify."
3. **Texting requires `sms_consent = yes`** on the contact's record. No consent,
   no text, ever. TCPA statutory damages are $500–$1,500 per message and the
   plaintiff's bar actively looks for this.
4. **Texts only 8am–9pm in the recipient's local time**, and every initial text
   identifies the business and carries an opt-out.
5. **Cold email must carry a physical postal address and a working opt-out**
   (CAN-SPAM). The site currently omits the business address — that has to be
   resolved before Track B sends anything.
6. **Honour opt-outs immediately.** STOP, "unsubscribe", or a verbal "don't
   contact me" sets `do_not_contact = true` on the contact and ends every track.
7. **Only claims the site actually makes.** Verified and usable:
   - term sheet *typically within 2 hours*
   - case study: $185K purchase, $62K rehab — term sheet in 90 minutes, closed in 11 days
   - case study: DSCR at 75% leverage, no tax returns, closed in 21 days
   - a single dedicated advisor from term sheet to funded draws

Merge fields match the CRM: `{first_name}`, `{property_address}`,
`{loan_type_label}`, `{purchase_price}`, `{advisor}`.

---

## Track A — Inbound lead

The whole thesis: **in investor lending, the first lender to respond usually
wins.** The cadence exists to make speed systematic rather than dependent on who
happens to be at a desk.

| # | When | Channel | Purpose |
| --- | --- | --- | --- |
| 1 | Within 5 min | Call | Speed-to-lead |
| 2 | +10 min if no answer | Text + Email 1 | Acknowledge, set expectation |
| 3 | Day 1 | Call + Text | Second live attempt |
| 4 | Day 2 | Email 2 | Value add |
| 5 | Day 4 | Call | Third live attempt |
| 6 | Day 5 | Email 3 | Social proof |
| 7 | Day 8 | Email 4 | Objection |
| 8 | Day 12 | Email 5 | Breakup |
| — | Ongoing | Blog digest | Nurture |

### Email 1 — Day 0, within minutes

> **Subject:** Your term sheet on {property_address}
>
> {first_name} —
>
> Got your {loan_type_label} request on {property_address}. I'm pulling it now.
>
> You'll have a term sheet laying out loan amount, structure and pricing
> typically within two hours. If anything in your numbers needs a second look,
> I'll flag it rather than let it surface at underwriting.
>
> One question so I can size it correctly: **is the property under contract
> yet, and what's your closing date?** That single answer usually decides
> whether we're structuring for speed or for leverage.
>
> — {advisor}, Blink Capital Partners · 631.353.7022

*Why it works: it references their actual deal, commits to a specific and
verifiable turnaround, and asks one question with an obvious answer.*

### Text 1 — Day 0 (only if `sms_consent = yes`)

> {first_name}, it's {advisor} at Blink Capital Partners — got your request on
> {property_address} and I'm working your term sheet now. Is this a good number
> to reach you? Reply STOP to opt out.

### Email 2 — Day 2, value add

Pick by `loan_type`. The point is to be useful whether or not they borrow.

> **Subject:** The draw schedule question that kills flips
>
> {first_name} —
>
> Still happy to get you a term sheet on {property_address} whenever you're
> ready. Unrelated to that, one thing worth knowing before you start any rehab:
>
> Most first-time flippers budget the purchase and the rehab, then get caught by
> the gap between paying a contractor and the draw reimbursing them. The fix is
> boring — match your draw stages to your contractor's payment schedule *before*
> you sign the scope of work, not after.
>
> We wrote it up here: blinkcp.com/blog/fix-and-flip-draw-schedules-explained.html
>
> — {advisor}

*Swap for DSCR: the calculator. Ground-up: one-time vs two-time close.*

### Email 3 — Day 5, social proof

> **Subject:** 11 days, start to close
>
> {first_name} —
>
> A fix & flip we funded: $185K purchase, $62K rehab. Term sheet in 90 minutes,
> closed in 11 days.
>
> The reason it moved that fast wasn't us being clever — the borrower had the
> scope of work and the contractor bid ready on day one. That's genuinely most
> of it.
>
> If {property_address} is on a clock, say the word and I'll tell you honestly
> whether the timeline is realistic.
>
> — {advisor}

*DSCR swap: 75% leverage, no tax returns, closed in 21 days.*

### Email 4 — Day 8, objection

Name the real reason, don't dance around it.

> **Subject:** Did the deal die, or did we?
>
> {first_name} — two honest possibilities.
>
> **The deal changed.** Happens constantly. Tell me and I'll close the file with
> no follow-up.
>
> **You're comparing lenders.** Also fine, and worth doing. One thing worth
> comparing beyond the headline number: who actually answers when a draw is
> late, and whether the person who quoted you is the person who'll be there at
> funding. Ours is one advisor start to finish.
>
> Which is it?
>
> — {advisor}

### Email 5 — Day 12, breakup

> **Subject:** Closing your file
>
> {first_name} — I'll stop here so I'm not cluttering your inbox.
>
> Closing the file on {property_address}. If the deal comes back, or a different
> one does, reply to this email and you'll skip the queue — I'll still have your
> numbers.
>
> Good luck with it either way.
>
> — {advisor}

*Breakups reliably outperform the three emails before them. The permission to
go quiet is what prompts the reply.*

---

## Track B — Cold referral partner (email only)

Different goal: not a loan, **one deal sent**. You're asking them to remember
you exist the next time a client needs investor financing.

| # | When | Purpose |
| --- | --- | --- |
| 1 | Day 0 | Cold open |
| 2 | Day 4 | Value add |
| 3 | Day 9 | Social proof |
| 4 | Day 15 | Objection / reframe |
| 5 | Day 22 | Breakup |

### Email 1 — cold open

> **Subject:** The investor clients you're turning away
>
> {first_name} —
>
> You work with investors in {market}. Which means some share of your clients
> ask about financing on non-owner-occupied 1–4 units, and conventional either
> can't do it or takes 45 days to say no.
>
> We're a private lender for exactly that: fix & flip, ground-up construction,
> DSCR rental. Term sheet typically within two hours, so you find out fast
> whether a deal is real.
>
> Not asking you to send anything today. If it's useful, I'll send you a
> one-page breakdown of what we can and can't do, so you've got it when a client
> asks.
>
> Want it?
>
> — {advisor}, Blink Capital Partners
> [physical address required by CAN-SPAM] · Unsubscribe: {link}

*Why it works: it opens with their problem, not our product, and the ask is to
receive something, not to commit.*

### Email 2 — value add

> **Subject:** What kills investor deals at underwriting
>
> {first_name} — the three things that sink investor files most often, so you
> can spot them before you refer anyone:
>
> **No scope of work.** A rehab budget as a single number doesn't underwrite.
> Line items do.
>
> **Entity mismatch.** Contract in a personal name, loan requested in an LLC.
> Fixable, but it costs days.
>
> **Rent assumptions with no support.** For DSCR, projected rent needs backing.
> "Comparable units go for about $2,400" isn't it.
>
> Send a client with those three handled and almost anyone can close it fast.
>
> — {advisor}

### Email 3 — social proof

> **Subject:** 90 minutes to term sheet
>
> {first_name} — a recent one: $185K purchase, $62K rehab. Term sheet in 90
> minutes, closed in 11 days.
>
> What that means for you: a client asks "can I actually get this financed," and
> you have an answer the same afternoon instead of a maybe that drags a week.
>
> Happy to be that phone call next time it comes up.
>
> — {advisor}

### Email 4 — objection / reframe

> **Subject:** "I already have a lender"
>
> {first_name} — most people I reach out to do. Fair.
>
> The reason to have a second one isn't price. It's that your primary will
> eventually pass on a deal — wrong property type, borrower's entity, a timeline
> they can't hit. That's the call worth having a backup for, because otherwise
> your client hears "no" and the transaction dies.
>
> Keep me as the second number. Costs you nothing until you need it.
>
> — {advisor}

### Email 5 — breakup

> **Subject:** Last one
>
> {first_name} — I'll leave it there.
>
> If an investor client ever needs financing conventional won't touch, we're at
> blinkcp.com or 631.353.7022. Otherwise you won't hear from me again.
>
> — {advisor}

---

## Open items before this runs

- [ ] **Business address** — required by CAN-SPAM for Track B, and by Google's
      financial products policy for ads. Same blocker, two places.
- [ ] **Attorney review** of the consent language now on the Get Funded form,
      and of the privacy policy and terms it references.
- [ ] **Texting platform** that honours STOP automatically and logs it back to
      `do_not_contact` in the CRM.
- [ ] **Decide who sends.** Drafting is automatable; sending on a cold track
      for a lender should stay human until the above are closed.
