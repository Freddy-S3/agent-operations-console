# Agent Operations Console Discovery Interview

Status: Round 2 provisionally answered; Round 3 remains blocked on customer evidence.

This is a staged interview for deciding whether the Agent Operations Console should become a real product.

The interview is intentionally completed one round at a time.

Each round settles the decisions needed by the next round.

The assistant should ask the questions in the current round, give a recommendation for each, and update this document only when an answer becomes a real decision.

Do not build product code while the questions that determine the buyer, paid problem, and validation test remain open.

## How to answer

Reply in chat using the question numbers, or edit the answer fields and bring the document back to the next session.

Short answers are sufficient.

The recommendation is a starting point, not a default decision.

## Current project thesis

The working thesis is that a UI for safe, auditable, cross-provider agent work may be more valuable than another generic swarm framework.

The likely first product moment is supervising and recovering multi-agent work in software repositories, with governance and delivery evidence included.

The likely initial business model is productized consulting or concierge pilots followed by a narrow team console.

None of these statements is final.

## Round 1 - Founder constraints and success

Purpose: define the personal and financial constraints before discussing features.

### Q1. What does success mean?

Choose the target that should govern decisions.

Recommended answer: approximately $100,000 CAD/year of personal pre-tax income after business costs, supported by at least $150,000-$200,000 CAD/year of business revenue.

Answer: Approximately $100,000 CAD/year of personal pre-tax income.

### Q2. What is the target timeline?

When should the business plausibly replace the day-job income?

Recommended answer: 12-18 months after the first serious validation effort begins.

Answer: One year.

### Q3. How much founder time is available?

What weekly time can be spent on customer conversations, delivery, and product work while employed?

Recommended answer: state a sustainable minimum and maximum rather than an aspirational number.

Answer: A sustainable minimum of 20 hours per week and a maximum of 40 hours per week.

### Q4. What work are you willing to sell first?

Choose the acceptable starting posture: consulting, concierge pilot, software subscription, or another model.

Recommended answer: sell a narrow concierge pilot or implementation sprint, then convert repeated work into software.

Answer: A narrow paid concierge pilot.

### Round 1 decision

The project is authorized to continue discovery within a one-year income horizon, with 20-40 founder hours available per week and a narrow paid concierge pilot as the initial commercial posture.

The next decision is which buyer and painful, payable workflow should be tested before any product implementation.

## Round 2 - Customer and painful problem

Purpose: identify a buyer who can pay for a painful, repeated problem.

### Q5. Who is the first buyer?

Choose one narrow starting group: small software teams building agent products, AI consultancies, internal platform teams, or small businesses adopting AI.

Recommended answer: small software teams and AI consultancies with active agent workflows.

Answer: 5-20 person software product teams that already use coding agents in English-speaking Canada and the United States.
AI consultancies stay as a secondary interview segment and possible partner channel, not the first direct buyer.

### Q6. Who feels the pain and who pays?

Name the person who experiences the operational pain and the person who can approve the purchase.

Recommended answer: an engineering leader or consultancy owner who is accountable for delivery quality and team throughput.

Answer: The person feeling the pain is the engineering leader, technical founder, staff engineer, or delivery owner who has to make agent-assisted work reliable enough for real code review.
The person who pays is usually the technical founder, head of engineering, engineering manager, or consultancy owner accountable for delivery quality, team throughput, and client risk.

### Q7. Which problem is expensive enough to buy away?

Choose the strongest current hypothesis: starting agent work, coordinating parallel agents, recovering failures, proving work quality, or governing permissions and approvals.

Recommended answer: recovering and proving multi-agent work, because silent failure and unverifiable output create direct delivery risk.

Answer: Recovering and proving agent-assisted work is the first painful problem to test.
The expensive failure mode is not that agents cannot start work; it is that parallel or interrupted agent work becomes hard to trust, hard to review, hard to resume, or hard to explain to another engineer.

### Q8. What existing workaround will the product replace?

Name the current combination of chats, scripts, tickets, terminals, dashboards, or human coordination that the buyer uses today.

Recommended answer: identify the real workaround before designing a new navigation model.

Answer: The current workaround is a fragile mix of chat transcripts, terminal scrollback, pull-request comments, local scripts, ad hoc checklists, manual git worktree hygiene, and human memory.
The first customer interviews should confirm whether teams already maintain similar informal runbooks, status docs, approval rituals, or recovery habits around coding agents.

### Round 2 decision

The first buyer hypothesis is a small software product team already using coding agents, with the engineering leader or technical founder as the economic buyer.

The first paid problem hypothesis is making agent-assisted repository work recoverable, reviewable, and safe to approve.

The next decision is the product boundary for a concierge-supported workflow, but that boundary should be informed by customer conversations before implementation.

## Round 3 - Product boundary

Purpose: define the smallest product that can demonstrate value.

### Q9. What is the first job-to-be-done?

Complete: “When an agent team is working on a repository, the operator needs to ___ so that ___.”

Recommended answer: see what is happening, intervene safely, and verify the result so that parallel agent work can be trusted.

Answer:

### Q10. What must the first screen enable?

Choose the primary moment: author work, start a run, supervise a run, recover a run, review evidence, or configure policy.

Recommended answer: supervise and recover a run.

Answer:

### Q11. What must remain outside the product?

List the responsibilities that should stay in existing providers, repositories, CI systems, or local developer tools.

Recommended answer: do not rebuild model inference, source control, CI, or every provider-specific agent runtime.

Answer:

### Q12. What is the proof of value?

Choose measurable outcomes such as reduced rework, shorter time to merge, fewer abandoned runs, faster recovery, or stronger review evidence.

Recommended answer: measure recovery time, abandoned-run rate, and verified task completion rather than agent activity volume.

Answer:

## Round 4 - Business model and trust

Purpose: determine whether customers can buy the product and trust it with real work.

### Q13. What will the customer pay for?

Choose setup services, per-team software, per-run usage, managed operations, or a combination.

Recommended answer: paid setup or concierge delivery first, then a per-team subscription for the operator console.

Answer:

### Q14. What deployment model is acceptable?

Choose hosted SaaS, self-hosted, local-first, or a hybrid.

Recommended answer: local-first or self-hosted for early trust, with hosted deployment considered after the workflow is proven.

Answer:

### Q15. What is the minimum price worth supporting?

Name the price below which the customer is not worth serving.

Recommended answer: price around a meaningful team outcome, not around cheap individual seats; validate the number through paid pilots.

Answer:

### Q16. What trust boundary is non-negotiable?

Decide how credentials, code, prompts, artifacts, logs, and model-provider data may be handled.

Recommended answer: the product must make permissions, approvals, and data location explicit before production use.

Answer:

## Round 5 - Validation before building

Purpose: create evidence that justifies implementation.

### Q17. How many customer conversations are enough for a first decision?

Choose a minimum number and the roles to interview.

Recommended answer: five to ten conversations across the chosen buyer segment, including at least two people who can purchase.

Answer:

### Q18. What is the paid pilot?

Describe the smallest concierge engagement that produces a customer outcome and tests the proposed wedge.

Recommended answer: operate one real repository workflow, capture recovery and evidence data, and charge for the delivery.

Answer:

### Q19. What evidence earns a prototype?

Define the threshold for writing product code.

Recommended answer: at least three customers describe the same painful workflow, and at least one pays for a repeatable version.

Answer:

### Q20. What would make us stop?

List disconfirming evidence that should end or redirect the idea.

Recommended answer: buyers do not experience the problem often, existing tools solve it adequately, or nobody will pay for the proposed outcome.

Answer:

## Round 6 - Build or redirect

Purpose: make the first implementation decision only after the evidence exists.

### Q21. What is the smallest prototype?

Define one end-to-end workflow, one user role, one integration boundary, and one proof metric.

Recommended answer: submit a repository task, supervise two or more isolated workers, approve a gate, inspect evidence, and recover one failed run.

Answer:

### Q22. What is the first release boundary?

Choose the capabilities that must exist and the capabilities explicitly deferred.

Recommended answer: run supervision, recovery, approvals, and evidence first; defer visual workflow authoring and broad provider coverage.

Answer:

### Q23. What decision ends discovery?

Choose whether the outcome is build, pivot, continue concierge-only, or stop.

Recommended answer: build only when the paid pilot demonstrates repeated value and the economics support the income goal.

Answer:

## Recommended next-step process

1. Complete Round 1 in conversation.
2. Complete Round 2 after selecting the founder constraints.
3. Conduct the buyer interviews before choosing a permanent product name or architecture.
4. Run one paid concierge pilot using the existing harness.
5. Record the observed workflow, failure modes, and evidence requirements.
6. Use Round 3 and Round 4 to define the smallest product boundary and commercial model.
7. Use Round 5 to decide whether a prototype is justified.
8. If justified, create an implementation specification and tickets before building.

## Decision-record policy

This document is intentionally not an ADR.

An ADR should be added only when a consequential choice has actually crystallized, such as the first buyer, the paid problem, the deployment boundary, or a deliberately rejected product scope.
