# Pricing Analysis

Research checked: 2026-08-27.

Status: working pricing recommendation for discovery and paid-pilot testing, not a validated rate card.

## Short answer

Price the current offer as a productized service, not as a generic SaaS seat.

The recommended launch price is **CAD 2,500 for a founding Agent Workflow Reliability Pilot**.

Limit that price to the existing narrow scope: one repository, one operator workflow, one agreed class of task, two to four weeks, setup and teaching, a controlled recovery demonstration, a runbook, and fourteen days of limited post-handoff support.

The current paid-pilot document already proposes CAD 2,500 for this scope (`docs/PAID-PILOT.md`, lines 69-77), so this analysis confirms and sharpens that hypothesis rather than replacing it.

After two or three paid pilots produce usable proof, move the standard setup price to **CAD 4,000-5,000** and offer **CAD 1,500/month** for ongoing operator support.

Only introduce a recurring software plan after the product provides hosted or self-managed persistent evidence, real integrations, and a supportable customer workflow.

The future software hypothesis is **CAD 750/month for a small team** and **CAD 1,500/month for a multi-workflow team**, with setup, unusual integrations, managed support, and provider usage priced separately.

These numbers are deliberately reversible hypotheses.

## What is being priced

The repository currently describes an agent operations console for submitting a task, assigning or supervising work, approving risky actions, inspecting diffs and verification evidence, and recovering interrupted work (`README.md`, lines 8-20 and 31-55).

The current prototype is local-first, dry-run, side-effect free, and explicit that it is not yet a hosted SaaS product or a live Atlassian integration (`README.md`, lines 119-127).

The existing paid offer is therefore a founder-led reliability setup around a customer's workflow, not a license to an already mature hosted platform.

That distinction matters because the public market prices coding agents at tens of U.S. dollars per user per month, while it prices senior implementation, governance, and managed support in the thousands of dollars per month or per project.

The buyer should be paying for a safer and more repeatable delivery outcome, with the software surface acting as leverage.

## Recommended offer ladder

### 1. Founding Reliability Pilot - CAD 2,500 fixed

Use this price for the first two or three qualified customers.

Include one repository, one operator workflow, one bounded task class, one explicit approval gate, evidence capture, one controlled recovery exercise, two teaching sessions, a runbook, and fourteen days of limited post-handoff support.

Use a short written scope and a 50% kickoff payment with the balance at handoff.

Do not include broad repository audits, custom architecture, production deployment, regulated data, unlimited tickets, or an open-ended integration project.

The customer should continue to own its code, source-control account, model-provider account, and production approvals.

### 2. Standard Reliability Setup - CAD 4,000-5,000 fixed

Move to this band after the founding pilots demonstrate a repeatable workflow and produce proof that can be shown without exposing private customer material.

Include one real repository, one or two approved integrations, team policy configuration, durable evidence and recovery documentation, operator enablement, and thirty days of bounded support.

Keep the scope fixed and quote additional repositories, task classes, or security requirements separately.

This price sits near the public CAD 4,000 custom harness offer from GTA Labs and below the public CAD 5,000-7,500 implementation offers from Entuit, while remaining materially above a lightweight coding-agent subscription.

### 3. Operator Support - CAD 1,500/month

Offer this only after setup has created a customer-specific workflow worth maintaining.

Include up to four support or improvement hours per month, one monthly workflow review, one active workflow, and reasonable email support.

Bill additional advisory or implementation time at **CAD 250/hour** until customer demand proves that a larger package is easier to sell.

Do not promise a response-time SLA, 24/7 operations, or production incident response at this price.

### 4. Future team software - CAD 750-1,500/month

Treat this as a later product hypothesis rather than a current offer.

The Core hypothesis is CAD 750/month for up to three operators, one repository, one workflow, persistent evidence, and recovery history.

The Scale hypothesis is CAD 1,500/month for up to ten operators, three repositories, three workflows, team policy controls, and audit export.

Charge setup separately at CAD 1,500-3,000 when integrations or policy configuration are required.

Keep self-hosted deployment, SSO, custom retention, contractual security work, and formal support commitments as custom enterprise scope.

Pass through model-provider and infrastructure costs transparently until actual usage data supports a safer bundled allowance.

## If the target is CAD 20,000

CAD 20,000 should not be presented as a richer version of the current local dry-run prototype.

At that price, the buyer is purchasing a first-year operating system for agent-assisted delivery, a controlled rollout, and scarce access to the founder.

The product must do enough of the work asynchronously that the customer can operate it without you being available during the day.

### Recommended CAD 20,000 structure

| Component | Price | What it buys |
| --- | ---: | --- |
| Hands-off product and implementation | CAD 15,000 | A deployable product, live integrations, policy configuration, documentation, launch acceptance, and bounded async stabilization. |
| Founder-led private enablement | CAD 5,000 | Three 90-minute private or small-group sessions, preparation against the customer's workflow, recorded walkthroughs, personalized runbook review, and fourteen days of async follow-up. |
| First-year package total | **CAD 20,000** | A fixed, documented rollout with founder time separated as a scarce premium rather than hidden inside the software price. |

The CAD 5,000 teaching component is a pricing hypothesis for scarce evening or weekend calendar time, not a claim that every buyer will value personal access equally.

Additional private sessions should be separately scheduled and quoted, with a working hypothesis of CAD 1,500 per 90-minute session including preparation and follow-up.

Renewal should not automatically include founder teaching.

A later renewal hypothesis is CAD 8,000-12,000 per year for the software, supported integrations, documentation updates, and bounded async support, with new implementation or teaching quoted separately.

### What the CAD 15,000 hands-off system must add

The buyer should be able to reach a supported first run from documentation and an intake checklist, without needing a live founder walkthrough to understand the basic product.

The system should include the following before this price is credible:

- A hosted or self-managed deployment that can run real customer workflows rather than only a synthetic dry run.
- Live Jira intake plus at least one supported repository and pull-request provider, with authentication, retries, failure states, and clear configuration boundaries.
- Support for multiple repositories or workflows, such as up to three repositories and three approved task classes in the first-year package.
- Operator and administrator roles, least-privilege credentials, secret handling, audit history, exportable evidence, retention controls, deletion controls, backups, and basic monitoring.
- A self-serve onboarding path with an admin guide, operator guide, quickstart, workflow templates, troubleshooting guide, release notes, and short recorded walkthroughs.
- A durable run record containing intent, branch or worktree decision, approvals, changes, checks, review, recovery, and handoff evidence.
- A 30-60 day rollout with baseline measures, an acceptance review, and a written recommendation for the next workflow.
- A bounded asynchronous support channel with a response window that fits a nights-and-weekends business, rather than an implied daytime or incident-response commitment.

These are not a feature shopping list.

They are the minimum trust, autonomy, and operating boundary needed for a buyer to hand the workflow to its own team.

### What the CAD 5,000 personal premium must protect

Personal teaching should be deliberately scarce and calendar-limited.

The package should schedule the sessions in fixed evening or weekend windows, require a customer pre-read, and use the customer's real workflow as the teaching material.

The package should include recordings and written answers so the buyer is not paying repeatedly for the same explanation.

The package should not include unlimited ad hoc calls, daytime availability, custom feature development, production incident response, or open-ended Slack access.

This makes the premium legible: the customer is paying for judgment, context, and a direct transfer of operating knowledge, while the base product is designed to stand on its own.

### Day-job-friendly operating model

The delivery should be designed around asynchronous work from the beginning.

1. Use a structured intake form to collect repositories, task classes, operators, permissions, success measures, and data boundaries.
2. Use a fixed implementation checklist and customer-owned accounts so setup does not depend on repeated live coordination.
3. Provide the documentation and recorded walkthrough before the first teaching session.
4. Batch async support into one or two predictable weekly windows.
5. Reserve live time for decisions, workflow rehearsal, and teaching rather than status updates.
6. Put any customer-specific code or integration outside the package behind a separate fixed-scope quote.

The operating constraint should be explicit in the contract.

If a buyer requires daytime coverage, rapid production response, or frequent bespoke calls, the offer has become a managed service and needs a different price, staffing model, or partner.

### Who can justify CAD 20,000

The current 5-20 person software-team hypothesis can support CAD 20,000 only when the buyer has a repeated and expensive delivery-control problem, multiple repositories or workflows, and a budget owner who can approve an implementation rather than a small tool subscription.

If those conditions are absent, CAD 20,000 will feel like a large consulting bill compared with the USD 19-40 per-user monthly agent tools already available ([GitHub Copilot organization billing](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises), [Atlassian Rovo Dev pricing](https://www.atlassian.com/software/rovo-dev/pricing), and [Cursor pricing](https://prod.cursor.com/en-US/pricing)).

The higher-ticket buyer is more likely to be a team with several delivery groups, a software consultancy standardizing agent work across clients, or a company with a material security, audit, or recovery requirement.

That is an upmarket qualification change, not merely a pricing change.

### Proof gates before quoting CAD 20,000

Do not lead with the CAD 20,000 package until the following are true:

- At least three paid pilots have exercised the workflow.
- At least two customers have requested or used the same repeatable workflow capability.
- One customer can complete the documented setup and first run without founder intervention.
- A 30-60 day baseline and outcome report exists for at least one customer, with permission to use an anonymized version in sales.
- Founder delivery time is bounded to a predictable number of hours per customer per month after launch.
- The support, data, retention, ownership, liability, and cancellation boundaries are written before the quote is sent.

Until these gates are met, sell the CAD 2,500-5,000 service and learn which parts of the CAD 20,000 system buyers actually value.

## Why CAD 2,500 is the right first price

### It is inside the local productized-service band

GTA Labs publishes a CAD 1,500 fixed-price starter harness with one week of setup, a dashboard, documentation, and no recurring fee, and a CAD 4,000 custom harness with codebase analysis, a custom agent roster, evaluation criteria, and deployment tuning ([GTA Labs Multi-Agent Harness](https://gtalabs.com/offers/multi-agent-harness)).

Entuit publishes a CAD 2,500 one-week technical review, a CAD 5,000 one-to-two-week launch and update setup, a CAD 7,500 two-week build sprint, and CAD 3,000/month for fifteen hours of senior engineering support ([Entuit pricing](https://www.entuit.com/)).

The current pilot is narrower than Entuit's build work and more outcome-oriented than a review, so CAD 2,500 is a credible entry point while proof is still thin.

### It is above the cost of the underlying agent seats

Atlassian lists Rovo Dev Standard at USD 20 per developer per month with 2,000 credits and USD 0.01 per extra credit ([Rovo Dev pricing](https://www.atlassian.com/software/rovo-dev/pricing), checked 2026-08-27).

GitHub lists Copilot Business at USD 19 per user per month and Copilot Enterprise at USD 39 per user per month, with included AI credits ([GitHub Copilot organization billing](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises), checked 2026-08-27).

Cursor lists Teams Standard at USD 40 per user per month and includes cloud agents, automations, agentic code reviews, usage analytics, and SSO ([Cursor pricing](https://prod.cursor.com/en-US/pricing), checked 2026-08-27).

Greptile describes a USD 30/developer/month code-review plan in its first-party pricing update ([Greptile pricing update](https://www.greptile.com/blog/greptile-update), checked 2026-08-27).

A five-person team can therefore spend roughly USD 95-200 per month on several common agent or review seats before paying for a reliability setup.

That is not a direct price comparison because those tools provide execution or review, while this offer provides workflow configuration, human gates, recovery practice, evidence, and handoff.

It does establish a ceiling on how much the buyer will attribute to software access alone.

### It is low enough to buy as a bounded experiment

The initial customer hypothesis is a 5-20 person software team in Canada or the United States that already uses coding agents (`README.md`, lines 23-29; `docs/PAID-PILOT.md`, lines 9-17).

CAD 2,500 is a meaningful purchase for that team, but it is still a contained experiment rather than an annual platform commitment.

The current offer promises a narrow workflow and a short delivery window, which makes the price easier to approve than an unbounded transformation engagement.

### It protects founder economics if scope is enforced

At CAD 2,500, the pilot should consume no more than ten hours of founder delivery time before direct costs.

That produces a CAD 250/hour gross time target, matching the public CAD 250/hour consultation price published by Toronto-based RedactLabs ([RedactLabs pricing](https://redactlabs.ca/pricing/), checked 2026-08-27).

If a pilot repeatedly consumes twelve to sixteen hours, either raise the price to CAD 3,500-4,000 or remove scope before accepting another one.

The price is not safe if it quietly includes custom integration engineering, unlimited support, or production incident ownership.

## Competitive and adjacent pricing signals

The following table separates direct product substitutes from services that help calibrate buyer expectations.

| Provider or category | Public price checked | What the buyer receives | Pricing implication |
| --- | --- | --- | --- |
| Atlassian Rovo Dev | USD 20/developer/month, 2,000 credits, plus paid overage | Jira-aware coding, terminal work, and code review | Do not compete on code generation alone; sell the operating layer around agents. |
| GitHub Copilot | USD 19/user/month Business; USD 39/user/month Enterprise | Coding assistance, model catalog, organizational controls, and credits | Agent access is an inexpensive input cost relative to a hands-on reliability setup. |
| Cursor Teams | USD 40/user/month Standard | Team billing, cloud agents, automations, code review, analytics, privacy controls, and SSO | A customer may already have agent execution and basic team controls; differentiation must be workflow reliability and evidence. |
| Greptile | USD 30/developer/month in its first-party pricing update | AI code review with memory and scoped rules | Specialist review is a low-cost adjacent tool, not the same as run supervision and recovery. |
| Coder | Community is free; Premium is annual per user with no public amount on the reviewed page | Governed self-hosted environments, agent infrastructure, RBAC, audit logging, quotas, and support | Governance and infrastructure can support enterprise pricing, but transparent small-team packaging remains an opening. |
| GTA Labs Multi-Agent Harness | CAD 1,500 starter; CAD 4,000 custom | Configured agent pipeline, dashboard, setup, documentation, custom criteria, and ownership | CAD 2,500 is plausible for a narrower reliability setup, but custom integration should move toward CAD 4,000 or more. |
| Entuit productized services | CAD 2,500 technical review; CAD 5,000 setup; CAD 7,500 build; CAD 3,000/month for 15 hours | Fixed-scope engineering, launch safety, build work, and senior support | Local buyers already see CAD 2,500-7,500 fixed offers and CAD 3,000/month support as understandable. |
| RedactLabs | CAD 250/hour consulting; CAD 500/month service desk; CAD 750/month managed security; CAD 3,000/month vCISO | Senior-led IT, security, and advisory services | CAD 250/hour is a useful floor for custom founder work; recurring prices depend on operational responsibility. |
| CodeLantern Spark | Four-week engagement; price not published on the reviewed page | Senior engineers, real repository work, workflow establishment, reusable knowledge, baseline metrics, and handoff | The package shape validates a multi-week service entry point; do not infer a price from the absence of public pricing. |
| Outsource IT Canada | CAD 150-250/user/month all-inclusive managed IT | Monitoring, help desk, patching, cybersecurity, Microsoft 365 management, vendor management, and quarterly reviews | This is a broader managed-IT spend anchor, not a direct substitute; a 20-person firm is quoted at CAD 3,000-5,000/month. |

The strongest direct competitive pressure comes from Rovo Dev, Copilot, Cursor, and other agent products that already provide execution, code generation, cloud sessions, or code review.

The strongest service pressure comes from firms that package setup, senior judgment, working artifacts, and handoff at fixed prices.

The console should therefore be positioned as the smallest reliable operating layer around a customer's existing agents, not as another agent subscription.

## Packaging boundary

### Included in the founding pilot

- One repository.
- One task class with clear acceptance criteria.
- One operator workflow.
- One approval gate.
- Branch or worktree planning.
- Evidence capture for intent, changes, checks, review, and approval.
- One deliberately interrupted or failed run followed through recovery.
- Two enablement sessions.
- A concise runbook.
- Fourteen days of limited post-handoff support.

These elements match the current paid-pilot scope in `docs/PAID-PILOT.md`, lines 29-43.

### Explicitly priced as add-ons

| Feature or scope expansion | One-time setup add-on | Recurring add-on after software exists | Pricing rule |
| --- | ---: | ---: | --- |
| Second repository | CAD 750-1,000 | CAD 250/month | Charge for new context, permissions, and evidence boundaries. |
| Second task workflow | CAD 750-1,000 | CAD 250/month | Charge per repeatable workflow, not per screen. |
| Live Jira integration | CAD 750-1,500 | Included only in a supported tier | Treat webhook, authentication, mapping, and failure handling as integration work. |
| Live GitHub, Bitbucket, or GitLab integration | CAD 750-1,500 per provider | CAD 250/month if it adds ongoing maintenance | Keep repository providers behind adapters and price their operational burden. |
| Asynchronous ticket-to-draft-PR path | CAD 1,500-2,500 | CAD 500/month supported | This adds credentials, queueing, retries, policy, and review-boundary risk. |
| Persistent hosted evidence and recovery history | CAD 1,000-2,000 | CAD 500/month | Charge for storage, retention, backup, access, and support rather than calling it a free dashboard feature. |
| Team RBAC, audit export, or policy administration | CAD 1,000-2,500 | CAD 500/month | These are governance features that support higher-value team packaging. |
| Founder-led managed support | CAD 250/hour | CAD 1,000-1,500/month package | Use the published CAD 250/hour local consultation signal until usage data supports a better bundle. |
| Self-hosted deployment, SSO, custom retention, or formal SLA | Custom quote | Custom quote | Do not add a token surcharge; re-scope around security, liability, support, and deployment cost. |

The add-on values are internal pricing hypotheses, not competitor quotations.

They should be revised when a buyer accepts or rejects a specific scope rather than merely when a feature is technically implemented.

## Feature-to-price update method

Keep a small pricing register beside customer discovery notes with one row per feature or service capability.

Record the feature, customer problem solved, buyer role, requested-by count, implementation hours, monthly support hours, infrastructure cost, security or liability impact, and observed willingness to pay.

Use this decision rule for each new capability:

1. If it expands the number of repositories, workflows, operators, or providers, add a setup fee and consider a recurring tier increase.
2. If it reduces recurring support work or makes the product more self-serve, keep the current price until buyer evidence shows that the saved effort is valuable to them.
3. If it adds data retention, credentials, hosting, SSO, audit, or a response commitment, price the operating burden before pricing the interface.
4. If it is customer-specific and requested by only one buyer, quote it as custom work rather than baking it into the base plan.
5. If at least two paying customers request the same capability and it is used in at least one repeatable workflow, promote it into a package and test a higher price.
6. If a feature increases founder delivery time enough to push the pilot above ten hours, raise the fixed price or remove scope immediately.

The practical formula is:

`Quoted price = base outcome + integration complexity + governance or risk scope + recurring operating load + optional support + transparent provider usage.`

Do not use a feature-count formula.

Buyers are paying for a safer delivery workflow, not for the number of buttons in the console.

## Consultancy economics and whether you can charge a similar rate

An IT consultancy is usually selling a combination of scarce expertise, a defined outcome, implementation capacity, ongoing responsibility, and reduced buyer risk.

The word "consultancy" covers several different commercial shapes:

| Shape | How it is normally sold | Fit for this product |
| --- | --- | --- |
| Advisory or hourly work | The buyer purchases access to judgement for a defined number of hours or days. | Use for custom architecture, exceptional troubleshooting, or scarce founder teaching. |
| Fixed-fee project | The seller defines scope, deliverables, acceptance, exclusions, and a handoff date. | This is the best default for the pilot and the hands-off implementation. |
| Retainer or fractional leadership | The buyer pays monthly for a defined cadence, capacity, and access boundary. | Use only for bounded async support; do not imply daytime availability while keeping the day job. |
| Managed service or MSP | The provider operates the system continuously for a recurring fee, often per user or covered service, with monitoring and escalation. | Treat this as a separate business model that requires coverage, tooling, incident boundaries, and possibly partners. |

Some solutions firms also combine a software or infrastructure licence with implementation, training, and support.

That bundle is why a buyer may approve thousands per month even when the underlying software seat costs tens of dollars.

The high consultancy price is not pure salary converted into an hourly number.

It also pays for sales and proposal time, non-billable research, project management, tooling, insurance, taxes, rework, delivery risk, support, and profit.

Published Canadian examples show that these price shapes are real, but they are provider-specific signals rather than a market average.

RedactLabs publishes CAD 250/hour for IT consultation, CAD 3,000/month for a fractional CISO retainer, and security audits from CAD 5,000 ([RedactLabs pricing](https://redactlabs.ca/pricing/)).

Entuit publishes CAD 3,000/month for fifteen hours of senior support, an implied CAD 200/hour before considering the value of continuity and context ([Entuit pricing](https://www.entuit.com/)).

SRS IT Consulting explicitly describes advisory, fixed-scope project, and fractional CTO engagements as its three common shapes, without publishing a rate ([SRS IT Consulting FAQ](https://srsit.ca/faq.html)).

Outsource IT Canada publishes CAD 150-250 per user per month for a much broader managed IT service with monitoring, help desk, patching, security, and strategic reviews ([Outsource IT Canada managed IT pricing](https://outsourceitcanada.com/services/managed-it-services)).

### Can this product charge a similar rate?

Yes, but the comparable unit is the effective rate of a fixed outcome, not an unsupported claim that the founder is worth CAD 1,000/hour.

Use CAD 250/hour as an internal target and custom-work anchor for now, based on the local consultation signal above.

Do not make hourly billing the main offer because it invites a comparison with a commodity contractor and makes the buyer count your time instead of valuing the operating result.

For the CAD 20,000 package, the effective gross rate changes sharply with total founder and delivery time:

| Total founder and delivery time | Effective gross rate on CAD 20,000 | Interpretation |
| ---: | ---: | --- |
| 80 hours | CAD 250/hour | Plausible for a specialist fixed-fee implementation if the scope and outcome are credible. |
| 60 hours | CAD 333/hour | Possible when the reusable product carries substantial value and the buyer has expensive workflow risk. |
| 40 hours | CAD 500/hour | Too high to justify as ordinary consulting; present it as a productized system with scarce enablement. |
| 20 hours | CAD 1,000/hour | Not credible as a normal service rate; only defensible if most value is an already-proven product and the buyer's avoided cost is very large. |

The day-job constraint makes the 80-hour version unattractive if those hours must be delivered to one customer.

The better design is to build reusable onboarding, integrations, templates, evidence handling, and documentation once, then keep customer-specific delivery and founder teaching bounded.

That is how the CAD 20,000 package can have a high price without requiring a consulting schedule that your day job cannot support.

The commercial language should be "first-year agent workflow reliability system" or similar, with a fixed scope and acceptance criteria.

It should not be "twenty hours of my time" or "an hourly consulting engagement."

## Client acquisition with a day job

The first customer is more likely to come from trust and adjacency than from broad advertising or search-engine traffic.

The initial sales goal is not to find everyone who might use agents.

It is to find one buyer with an expensive, repeated workflow problem who already understands the value of a fixed-fee technical engagement.

### Best initial buyer and channel order

1. **Warm introductions.** Start with former colleagues, engineering leaders, founders, and people in local software communities who can describe a team already using coding agents.
2. **Partner channel.** Approach small MSPs, IT consultancies, AI implementation firms, and software consultancies that can provide daytime coverage or introduce customers while you provide the repeatable product and specialist implementation.
3. **Narrow proof-led content.** Publish a short demonstration of a recoverable, reviewable agent workflow, a redacted runbook, or a measured pilot result rather than generic AI commentary.
4. **Targeted outbound.** Contact a small number of qualified CTOs, engineering managers, and consultancy owners only after the message and pilot scope have been tested through warm conversations.

The partner channel is particularly compatible with a day job because a partner can own customer acquisition, daytime communication, and broader managed-service obligations.

Any partner arrangement should define customer ownership, data access, support boundaries, incident escalation, implementation responsibility, and who is allowed to promise custom work.

### Day-job-compatible sales motion

Use one repeatable funnel:

1. A free 30-minute fit call to confirm the buyer, workflow, permissions, and pain.
2. A CAD 1,500-2,500 paid readiness assessment when the buyer needs analysis before approving a pilot.
3. A CAD 2,500 founding pilot or CAD 4,000-5,000 standard setup with written exclusions and a fixed handoff.
4. A supported annual system or higher-ticket implementation only after the workflow has produced proof and can be operated from documentation.

The free call should qualify rather than become unpaid architecture consulting.

Do not offer a free custom audit, a free integration plan, or unlimited pre-sales access.

The qualification filter should be explicit:

- The team already uses or is committed to using agent-assisted development.
- The problem recurs across tasks, repositories, operators, or clients.
- A budget owner can approve a fixed-fee implementation.
- The buyer can provide customer-owned accounts and a named operator.
- The buyer accepts documentation-first onboarding and bounded async support.

Reject or re-scope buyers who require daytime coverage, rapid production incident response, unlimited bespoke calls, or a large amount of custom integration before they will pay.

### What to sell in the first conversation

Lead with a costly failure mode rather than the console's feature list.

Examples include abandoned agent runs that cannot be reconstructed, review bottlenecks caused by unclear evidence, or teams that cannot safely extend agent use beyond one developer.

The message should be close to:

> We help a small engineering team turn one risky agent-assisted workflow into a documented, reviewable, recoverable process that the team can run without relying on one expert being available all day.

Ask for the buyer's current workflow, failure cost, number of repositories, approval boundary, and tolerance for asynchronous rollout.

Do not lead with the CAD 20,000 price until the buyer has confirmed the problem is repeated, expensive, and broad enough to justify a system rather than a pilot.

### Acquisition proof gates

Before relying on referrals or partners as a repeatable channel, collect:

- Ten to twenty targeted buyer conversations, with the objection and language recorded.
- Three paid pilots or assessments, even if the initial prices are discounted for learning.
- One anonymized before-and-after workflow story with measured recovery, evidence, review, or operator-understanding improvement.
- One customer or partner who can describe the offer accurately without founder translation.
- One documented onboarding path that a customer can complete without a live daytime session.

These gates do not mean waiting for perfect marketing.

They prevent the higher-ticket offer from being based only on technical confidence or a single enthusiastic conversation.

## Validation experiments

Run the following price tests during the first five to ten buyer conversations and paid-pilot calls.

### Test A: price acceptance

Present CAD 2,500 as a fixed founding pilot with the exact one-repository scope.

Record whether the buyer asks what outcome it creates, what is excluded, or why it costs that much.

Treat a request for a smaller scope as useful packaging evidence, not as an automatic discount request.

### Test B: price ladder

Offer the same narrow scope at CAD 2,500 to the first founding customer and CAD 3,500 to the next qualified customer when the delivery evidence is stronger.

Compare approval speed, objections, and scope pressure rather than optimizing for the first close alone.

### Test C: recurring value

At handoff, ask whether the buyer would pay CAD 1,500/month for four support hours, a monthly workflow review, and bounded operator support.

Do not sell the recurring plan if the buyer only wants the one-time setup or if the ongoing work is not yet repeatable.

### Test D: outcome anchor

Ask the buyer to price one abandoned agent run, one delayed review, or one hour of senior engineer intervention.

Use the answer to test whether the offer should stay anchored to delivery risk, review capacity, or recovery time.

The existing pilot document already recommends measuring time to recover, evidence completeness, approval decisions, abandoned runs, review rework, and operator understanding (`docs/PAID-PILOT.md`, lines 83-100).

Those measurements should be collected before claiming that the service saves money or accelerates delivery.

## What not to promise yet

Do not promise autonomous production deployment.

Do not promise that every ticket can be completed without engineering implementation work.

Do not promise a hosted SaaS experience while the prototype remains local-first and dry-run.

Do not bundle customer code, credentials, prompts, or run logs into product research without a separately agreed data boundary.

Do not publish customer-specific success percentages until the measurement method and customer permission are settled.

These limits are consistent with the current paid-pilot exclusions and trust boundary in `docs/PAID-PILOT.md`, lines 112-138.

## Evidence ledger

| Claim used in this analysis | Source | Confidence |
| --- | --- | --- |
| The product is currently a local, dry-run workflow rehearsal rather than hosted SaaS. | `README.md`, lines 5 and 119-127. | Confirmed from repository. |
| The initial buyer is a 5-20 person software team already using coding agents. | `README.md`, lines 23-29; `docs/PAID-PILOT.md`, lines 9-17. | Confirmed as the current product hypothesis. |
| The existing paid-pilot scope is one repository, one workflow, one task class, two to four weeks, teaching, recovery, evidence, runbook, and limited support. | `docs/PAID-PILOT.md`, lines 29-43. | Confirmed from repository. |
| The existing paid-pilot price hypothesis is CAD 2,500. | `docs/PAID-PILOT.md`, lines 69-77. | Confirmed from repository. |
| Rovo Dev Standard is USD 20 per developer per month with 2,000 credits and paid overage. | [Atlassian Rovo Dev pricing](https://www.atlassian.com/software/rovo-dev/pricing); [Atlassian billing documentation](https://support.atlassian.com/subscriptions-and-billing/docs/how-billing-works-for-rovo-dev-standard/). | Confirmed, checked 2026-08-27. |
| GitHub Copilot Business is USD 19/user/month and Enterprise is USD 39/user/month. | [GitHub organization and enterprise billing](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises). | Confirmed, checked 2026-08-27. |
| Cursor Teams Standard is USD 40/user/month and includes team and agent controls. | [Cursor pricing](https://prod.cursor.com/en-US/pricing). | Confirmed, checked 2026-08-27. |
| Greptile published a USD 30/developer/month pricing model in its first-party update. | [Greptile pricing update](https://www.greptile.com/blog/greptile-update). | Confirmed as a first-party published price, checked 2026-08-27. |
| Coder offers a free Community edition and a Premium edition with governance features but no public Premium amount on the reviewed pricing page. | [Coder pricing](https://coder.com/pricing). | Confirmed as displayed, checked 2026-08-27. |
| GTA Labs publishes CAD 1,500 starter and CAD 4,000 custom harness offers. | [GTA Labs Multi-Agent Harness](https://gtalabs.com/offers/multi-agent-harness). | Confirmed as a first-party published offer, checked 2026-08-27. |
| Entuit publishes CAD 2,500 review, CAD 5,000 setup, CAD 7,500 build, and CAD 3,000/month support offers. | [Entuit pricing](https://www.entuit.com/). | Confirmed as a first-party published offer, checked 2026-08-27. |
| RedactLabs publishes CAD 250/hour consultation, CAD 500/month managed service desk, CAD 750/month managed security, and CAD 3,000/month vCISO offers. | [RedactLabs pricing](https://redactlabs.ca/pricing/). | Confirmed as a first-party published offer, checked 2026-08-27. |
| Outsource IT Canada publishes CAD 150-250/user/month for a broad all-inclusive managed IT service. | [Outsource IT Canada managed IT pricing](https://outsourceitcanada.com/services/managed-it-services). | Confirmed as a provider's own published range, checked 2026-08-27; not an independent market average. |
| CodeLantern sells a four-week Spark engagement with real repository work, metrics, knowledge, and handoff but does not publish a price on the reviewed page. | [CodeLantern Spark](https://codelantern.ai/spark). | Confirmed as displayed, checked 2026-08-27; price absence is not evidence of a specific market rate. |
| CAD 2,500 is the correct launch price. | Inference from product maturity, existing pilot scope, local service price signals, and founder time economics. | Inferred and must be validated through buyer behavior. |
| CAD 20,000 is best framed as a first-year hands-off system plus a separately priced founder enablement premium. | Inference from the current prototype maturity, the adjacent fixed-scope service benchmarks, and Faruk's day-job availability constraint. | Inferred and must be validated with a buyer who has a repeated, expensive workflow problem. |
| Canadian IT consultancies commonly use advisory, fixed-scope project, and fractional-retainer models. | [SRS IT Consulting FAQ](https://srsit.ca/faq.html). | Confirmed as one provider's published engagement model, checked 2026-08-27. |
| Canadian providers publish CAD 250/hour consultation, CAD 200/hour implied senior support, CAD 3,000/month fractional leadership, and CAD 150-250/user/month broad managed IT signals. | [RedactLabs pricing](https://redactlabs.ca/pricing/); [Entuit pricing](https://www.entuit.com/); [RedactLabs SMB practice](https://redactlabs.ca/practices/smb/); [Outsource IT Canada managed IT pricing](https://outsourceitcanada.com/services/managed-it-services). | Confirmed as provider-published prices, checked 2026-08-27; not an independent market average. |
| This product can charge a consultancy-like effective rate when sold as a fixed outcome with reusable product value, but should not lead with a CAD 1,000/hour claim. | Inference from the published local service signals, the CAD 20,000 package arithmetic, and the day-job delivery constraint. | Inferred and must be validated through buyer conversations and paid work. |
| Warm introductions and specialist partners are the most day-job-compatible initial acquisition channels. | Inference from the need for trust, the current narrow buyer hypothesis, and the partner's ability to cover daytime managed-service obligations. | Inferred and must be validated through ten to twenty targeted conversations. |

## Revisit trigger

Revisit this document after the first ten to twenty targeted buyer conversations, after each paid pilot, and whenever the product adds a new integration or ongoing operational responsibility.

At each review, update the checked date, price table, evidence ledger, and the recommendation at the top.

For the day-job-friendly path, also track whether customers can complete setup and first use from the documentation, and whether founder teaching remains scarce enough to command its own premium.

Track which acquisition channel produced each qualified conversation, the buyer's exact objection, the number of founder hours required, and whether a partner could have handled daytime support.

The next material pricing decision is whether the first customer will buy the CAD 2,500 founding pilot, whether the delivery can stay within the ten-hour internal effort target, and whether a later CAD 20,000 system package has enough repeatable product value to avoid bespoke consulting.
