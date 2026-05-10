# Lumina: AI Spend Audit for Startups

Lumina is a premium, lead-generating audit tool built for **Credex**. It helps startup founders and engineering managers uncover hidden savings in their AI tool stack by providing deterministic, defensible optimization roadmaps and AI-generated executive summaries.

**Live Deployed URL**: [https://ai-spend-audit-lumina.vercel.app](https://your-deployed-url.com)

## Quick Start

### 1. Prerequisites
- Node.js 18+
- Supabase Account (for Lead Storage)
- Anthropic API Key (for AI Summaries)
- Resend API Key (for Transactional Emails)

### 2. Installation
```bash
git clone https://github.com/your-username/ai-spend-audit.git
cd ai-spend-audit
npm install
```

### 3. Environment Setup
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ANTHROPIC_API_KEY=your_anthropic_key
RESEND_API_KEY=your_resend_key
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Running Tests
```bash
npm run test
```

## 5 Key Decisions & Trade-offs

1. **Deterministic vs. Generative Math**: I chose to use pure TypeScript functions for the audit logic rather than an LLM. **Trade-off**: Harder to maintain as prices change, but ensures 100% accuracy and defensibility—crucial for a finance tool.
2. **"Zero-Permission" Audit**: I decided not to require AWS/OpenAI API keys for the audit. **Trade-off**: Less automated, but significantly higher conversion rates as founders are hesitant to share production keys.
3. **Database Normalization (PII split)**: I split "Audits" and "Leads" into separate tables. **Trade-off**: More complex queries, but essential for secure public sharing without exposing personal data.
4. **Custom UI vs. Template**: I built the UI using `shadcn/ui` primitives rather than a pre-built admin dashboard. **Trade-off**: More development time, but resulted in a "Premium" feel that aligns with Credex's brand.
5. **Next.js App Router**: Used the App Router for its built-in Metadata API. **Trade-off**: Steeper learning curve, but allows for dynamic Open Graph tags which are vital for the viral sharing loop.

## Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design and data flow.
- [DEVLOG.md](DEVLOG.md) - Daily progress logs (Mandatory 7 entries).
- [REFLECTION.md](REFLECTION.md) - Detailed project reflections.
- [TESTS.md](TESTS.md) - Automated test documentation.
- [PRICING_DATA.md](PRICING_DATA.md) - Verified source of truth for engine logic.
- [GTM.md](GTM.md) & [ECONOMICS.md](ECONOMICS.md) - Business strategy.

## Tech Stack
Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase, Resend, Anthropic SDK.

---
Built with pride for the **Credex Web Development Intern Assignment**.
