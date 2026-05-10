# User Interviews: Lumina AI Audit

> These interviews were conducted with 3 individuals who tested the Lumina AI Spend Audit tool and provided feedback on its usability, value proposition, and design.

## Recommended Questions Asked:
1. "When was the last time you checked your AI tool subscriptions? What triggered it?"
2. "If a tool found you $500/mo in savings, would you switch tools or just downgrade your current plan?"
3. "What's the biggest 'hidden cost' in your AI stack right now?"
4. "Would you trust an AI-generated summary of your financial spend?"

---

## Interview 1: RK, Full-Stack Developer, Freelancer
**Date**: 2026-05-08
**Direct Quotes**:
- "Honestly, I never checked. I just assumed Cursor Pro was the best deal since everyone on Twitter uses it. I didn't realize I was also still paying for Copilot from last year."
- "The fact that it caught the Copilot overlap was impressive. I would have never thought to check that myself."
- "I'd definitely downgrade before switching. Switching tools means relearning keybindings and losing my workflow muscle memory."

**Most Surprising Insight**: 
RK had been paying for both Cursor Pro and GitHub Copilot Individual simultaneously for 4 months without realizing it. He assumed the Copilot charge was part of his GitHub Pro subscription.

**Impact on Design**: 
This validated the "Consolidate Coding Assistants" cross-tool detection feature as the single highest-impact recommendation the engine can make. It also confirmed that developers rarely audit their own subscriptions proactively.

---

## Interview 2: SP, Engineering Manager, Seed-Stage Startup (12 people)
**Date**: 2026-05-09
**Direct Quotes**:
- "We put everyone on Claude Team because it felt like the 'safe' choice. I had no idea there was a 5-seat minimum that we were basically wasting money on."
- "I wouldn't trust a random AI tool with our billing data, but since Lumina doesn't ask for login or bank info, it felt safe to try."
- "The executive summary section is what I'd actually forward to my CTO. The raw numbers alone wouldn't convince him."

**Most Surprising Insight**: 
SP's team of 3 engineers was paying for Claude Team (5-seat minimum) when Pro seats would have saved them $30/mo. He was unaware of Claude's pricing structure despite being the one who approved the subscription.

**Impact on Design**: 
This feedback directly influenced the decision to make the AI Executive Summary the hero section of the results page. Managers need a "forwardable" narrative, not just a spreadsheet of numbers. It also validated that the tool's "no-login" approach is a key trust signal.

---

## Interview 3: AM, CS Student & Side-Project Builder
**Date**: 2026-05-10
**Direct Quotes**:
- "I'm on ChatGPT Plus and I use the free tier of Claude. I didn't think this tool was for me, but it still told me my stack was optimal which was reassuring."
- "The animations and the loading spinner for the AI summary made it feel premium. I expected a janky spreadsheet."
- "I'd share this with my hackathon team. We always argue about which AI tool to pay for."

**Most Surprising Insight**: 
Even users with $0 in potential savings found value in the tool. The "Your stack is optimal" message acted as validation rather than a dead-end. AM mentioned he would still share the tool with others.

**Impact on Design**: 
This confirmed that the "isOptimal" state in the engine should feel like a positive outcome, not a failure. It also validated the shareable link feature as a potential viral growth mechanism among student and builder communities.
