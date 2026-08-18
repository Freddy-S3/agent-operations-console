# Discovery and Outreach Kit

Status: validation draft.

This kit prepares the first learning conversations for the Agent Workflow Reliability paid-pilot hypothesis.

It is not authorization to contact anyone, send messages, represent Faruk externally, or claim validated customer results.

## Buyer profile

The initial buyer is an engineering leader, technical founder, or senior staff engineer at a 5-20 person software product team in English-speaking Canada or the United States.

They can approve a pilot because they own delivery quality, developer workflow, engineering process, or technical risk for one repository workflow.

The strongest buyer already has engineers using coding agents such as Codex, Claude Code, Cursor, Copilot Agent Mode, Devin, Cline, or similar tools for real repository changes.

The buyer is feeling one or more of these pains:

- Agent work is hard to resume after interruption or failure.
- Reviewers cannot quickly tell what changed, what was checked, and what still needs judgment.
- Approval decisions are scattered across chat, pull requests, local terminals, and memory.
- The team has no repeatable recovery path when an agent edits the wrong files, loses context, or leaves a branch half-finished.
- Senior engineers spend time rebuilding context instead of making the actual approval call.

The buyer can approve a small fixed-scope pilot when the work is framed as one repository workflow, one operator, one approval gate, one evidence bundle, and one recovery demonstration.

## Fit criteria

A team is a plausible fit when most of these are true:

- It ships production software from GitHub, GitLab, Bitbucket, or a similar repository host.
- It already uses coding agents or is actively trialing them.
- It has enough engineering activity that bad agent runs, missing evidence, or slow reviews have a visible cost.
- It can give a narrow pilot access boundary without exposing regulated or highly sensitive data.
- It has a buyer who can approve approximately CAD 2,500 for a short setup and enablement engagement.
- It values safer approval and recoverability more than a generic prompt canvas.

A team is a poor first fit when it wants a full SaaS platform, has no current agent use, cannot name one repository workflow, or needs legal, security, procurement, and data-processing review before any discovery call.

## Research list

These are plausible research targets, not qualified leads.

Do not treat inclusion here as evidence that a company wants the offer or that Faruk has permission to contact them.

| Team | Region | Why it may fit | Source signal | Suggested buyer |
| --- | --- | --- | --- | --- |
| Tailscale | Remote, Canada and U.S. | Remote infrastructure company with public roles focused on coding-agent enablement and internal AI workflow practice. | Public job pages mention heavy coding-agent use and AI enablement for engineering workflows. | Engineering manager, staff engineer, or AI enablement lead. |
| Mattermost | Remote, Canada and U.S. | Open-source collaboration platform with a role describing Claude Code, Cursor, agentic workflows, and accountability for correctness. | Public job page mentions AI coding agents as a core daily workflow. | Engineering lead for platform, internal tooling, or developer productivity. |
| Babylist | Remote Canada/U.S. | Product engineering org with public staff role mentioning knowledge systems that coding agents reliably load. | Public job page references agent-loaded engineering knowledge systems. | Staff engineer or engineering manager owning developer experience. |
| HubSpot | Canada/U.S. engineering presence | Larger than the first target profile, but useful as a pattern reference for design-system teams using coding-agent-assisted development. | Public job page references product engineering teams assisted by coding agents. | Design systems engineering leader. |
| Toast | Canada/U.S. engineering presence | Larger than the first target profile, but public hiring signal mentions adopting agentic development practices. | Public job page references coding agents and agentic development practices. | Engineering leader for team-agent or developer productivity work. |
| Dialpad | Canada/U.S. engineering presence | Communications SaaS with public quality role mentioning AI coding agents for test generation and optimization. | Public job page references extensive use of AI coding agents. | QA, SDET, or engineering productivity leader. |
| Cloudflare | Canada/U.S. engineering presence | Larger than target, but a useful reference account because its public engineering writing names AGENTS.md and coding-agent failure modes. | Public engineering blog discusses plausible-but-wrong agent changes and repo context failures. | Developer productivity or AI engineering platform leader. |
| Replit | U.S. | Developer-tool company whose users and internal teams are close to coding-agent workflow problems. | Market/category fit; needs direct current qualification before outreach. | Engineering leader or developer experience lead. |
| Sourcegraph | U.S./remote | Code intelligence company adjacent to repository-scale AI assistance and review workflows. | Market/category fit; needs current direct qualification before outreach. | Engineering leader for Cody, code intelligence, or developer experience. |
| Continue | U.S./remote | Open-source AI code assistant company likely to understand agent workflow reliability problems. | Market/category fit; needs current direct qualification before outreach. | Founder or engineering lead. |
| Codeium/Windsurf | U.S./Canada-facing | AI coding-tool company with teams and customers near the workflow reliability problem. | Market/category fit; needs current direct qualification before outreach. | Engineering or product lead for agent workflows. |
| Superhuman | U.S./remote | Small product-focused software team, likely uses AI internally, but needs confirmation of coding-agent usage. | Hypothesis lead only. | Technical founder, engineering manager, or staff engineer. |
| Linear | Canada/U.S. product market | High-craft software team whose product touches engineering workflows; may be too mature or selective for a first pilot. | Hypothesis lead only. | Engineering leader or developer-product lead. |
| Warp | U.S./remote | Developer-tool company where terminal-native AI workflows may create recovery and evidence problems. | Hypothesis lead only. | Engineering leader for AI or product infrastructure. |
| Supabase | U.S./remote | Developer infrastructure company with active open-source workflows; likely familiar with agent-assisted contribution paths. | Hypothesis lead only. | Developer experience or platform engineering leader. |

## Discovery interview guide

Use the interview to learn whether the pain is real and payable.

Do not pitch a finished product.

### Opening

- Thanks for taking the time.
- I am exploring whether small software teams using coding agents need a more reliable operating workflow around approval, evidence, and recovery.
- I am not trying to sell a finished SaaS product today.
- I am looking for concrete examples from your current workflow.

### Current agent use

- Which coding or workflow agents are engineers currently using?
- What kinds of repository tasks are agents allowed to touch?
- Who decides whether an agent run can proceed, needs intervention, or is complete?
- What do engineers still refuse to delegate to agents?

### Recent failure or rework

- Tell me about the last agent-assisted change that created rework, confusion, or review friction.
- What exactly went wrong?
- How did the team notice?
- Who had to clean it up?
- How much time did recovery take?

### Current workaround

- Where is task intent recorded today?
- Where are approval decisions recorded?
- Where do reviewers look for evidence that tests, builds, reviews, or recovery steps happened?
- What happens when a run is interrupted by a tool crash, rate limit, context loss, or branch confusion?

### Cost and frequency

- How often does this kind of failure, review delay, or context rebuild happen?
- What is the cost in senior-engineer time, delayed merge time, or lost confidence?
- Which part is annoying but acceptable, and which part would justify paying to fix?

### Approval process

- Who would need to approve a small fixed-scope pilot?
- What access, security, procurement, or contracting steps would block a pilot?
- What would make a two-to-four-week pilot easy to say yes to?
- What would make it an immediate no?

### Recovery behavior

- If an agent run fails halfway through, what is the expected recovery path?
- Can a different engineer resume it without asking the original operator?
- What evidence would make you comfortable approving the next step?
- What kind of recovery demonstration would feel credible rather than staged?

### Pilot test

- If one repository workflow could be made more recoverable and reviewable, which workflow would you pick?
- What would count as a successful pilot?
- What would you want measured before and after?
- Would a CAD 2,500 fixed-scope setup and enablement pilot be in the range of a reasonable experiment for that problem?

## Outreach draft

Subject: Learning from teams using coding agents in real repos

Hi <name>,

I am researching a narrow problem: how small software teams keep coding-agent work reviewable, recoverable, and safe to approve once it moves beyond toy tasks.

I am not selling a finished product.

I am trying to learn from teams already using tools like Codex, Claude Code, Cursor, Copilot Agent Mode, Devin, or similar agents in real repositories.

Would you be open to a 25-minute conversation about what currently breaks, how your team approves agent work, and what recovery looks like when a run fails or loses context?

If useful, I can also share the validation notes afterwards.

Thanks,
Faruk

## Follow-up drafts

### First follow-up

Subject: Re: Learning from teams using coding agents in real repos

Hi <name>,

Quick follow-up in case this got buried.

The conversation I am looking for is practical: what your team lets agents touch, where review or recovery gets messy, and whether a small fixed-scope reliability setup would solve a real problem.

No pitch deck and no request for repository access.

Would a short call next week be useful?

### After a conversation

Subject: Thank you for the agent workflow notes

Hi <name>,

Thanks again for walking through your workflow.

My notes from the conversation are:

- Current agent use: <summary>.
- Main friction: <summary>.
- Current workaround: <summary>.
- Possible pilot workflow: <summary>.
- Open concern: <summary>.

Please correct anything I got wrong.

If you are open to it, the next useful step would be a short fit call to decide whether one repository workflow is narrow enough for a fixed-scope pilot.

### Not a fit

Subject: Thanks again

Hi <name>,

Thanks again for the conversation.

Based on what you described, I do not think the current fixed-scope pilot is the right fit.

I am going to keep your constraints in the research notes as a disconfirming signal rather than trying to force the offer around them.

I appreciate the candor.

## Conversation tracker

Copy this table into a working tracker before outreach.

Keep assumptions and observed facts separate.

| Date | Team | Contact | Role | Source | Status | Observed facts | Faruk assumptions | Pain score 1-5 | Budget signal | Pilot workflow candidate | Next step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | Not contacted |  |  |  |  |  |  |

Recommended statuses:

- Not contacted.
- Drafted.
- Sent by Faruk.
- Replied.
- Conversation booked.
- Interview complete.
- Not a fit.
- Pilot fit call requested.
- Pilot proposal sent.
- Parked.

## Evidence summary template

Create one summary per completed conversation.

### Team

Name:

Date:

Contact role:

### Observed customer facts

- Current agent tools:
- Current allowed tasks:
- Recent failure or rework:
- Current approval path:
- Current recovery path:
- Buyer and approval process:
- Security or access constraints:

### Faruk assumptions

- Assumption:
- Why it matters:
- How to test it:

### Pain and willingness to pay

- Pain frequency:
- Cost evidence:
- Urgency:
- Budget authority:
- Price reaction:

### Pilot fit

- Candidate repository workflow:
- Safe access boundary:
- One approval gate:
- Evidence bundle expectation:
- Recovery demonstration:
- Reason to proceed or not proceed:

### Decision

Choose one:

- Continue to fit call.
- Ask one clarifying question.
- Park as not a fit.
- Revise the offer hypothesis.

## Guardrails

Do not send outbound messages without Faruk approving the specific outreach operating rule.

Do not imply the console exists as a product.

Do not claim customer outcomes before a paid pilot produces them.

Do not request repository access during initial learning outreach.

Do not collect client code, prompts, run logs, credentials, contracts, uploads, or private business records for product research.

Do not include Japan-targeted outreach until business-language readiness and local support improve.

