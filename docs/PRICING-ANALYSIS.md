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

## Revisit trigger

Revisit this document after the first five to ten buyer conversations, after each paid pilot, and whenever the product adds a new integration or ongoing operational responsibility.

At each review, update the checked date, price table, evidence ledger, and the recommendation at the top.

The next material pricing decision is whether the first customer will buy the CAD 2,500 founding pilot and whether the delivery can stay within the ten-hour internal effort target.
