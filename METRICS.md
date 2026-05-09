# Metrics & Instrumentation: Lumina

## 1. North Star Metric
**"Total Savings Uncovered" (Cumulative $)**
Why: This measures the aggregate value we've surfaced for the startup ecosystem. It directly correlates with the "Deal Pipeline" for Credex. If this number isn't growing, the tool isn't finding enough pain.

## 2. Input Metrics
1. **Viral Coefficient (K-Factor)**: Number of new audits generated per shareable URL click.
2. **High-Savings Lead Density**: % of audits that find >$500/mo in savings. This measures the "Quality" of the traffic we are attracting.
3. **AI Confidence Score**: % of users who "Accept" the AI summary as accurate vs. report it (measured via a subtle thumbs up/down).

## 3. Instrumentation Plan (Post-MVP)
1. **PostHog/Mixpanel**: Track the "Funnel Drop-off" between Step 1 and Step 3 of the form.
2. **UTM Attribution**: Identify which community (e.g., Reddit vs. X) produces the highest "High-Savings" leads.
3. **Session Replay**: Understand where users hesitate on the tool selection (likely the "Usage-based API" section).

## 4. The Pivot Trigger
If **Audit Completion → Lead Capture** falls below **15%**, we pivot the "Email Gate" timing. We might show even *more* value upfront or offer a "Benchmark against similar companies" carrot to drive the capture.
