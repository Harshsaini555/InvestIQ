# Demo Script — 5-Minute Presentation

> A step-by-step walkthrough for presenting InvestIQ in a recorded demo or live technical interview.

---

## Part 1 — Introduction & The Problem `(0:00 – 1:00)`

**Action:** Display the landing page at `localhost:3000`.

**Script:**
> "Hello, today I'm presenting InvestIQ — an AI Investment Research Agent that automates institutional-grade equity analysis. The core challenge in automated stock research is data integrity: public web results are noisy, and standard LLMs hallucinate financial metrics. InvestIQ solves this by orchestrating a structured LangGraph research pipeline that queries real-time financial APIs, validates every data point through Zod schemas, and synthesizes the results through a Gemini reasoning engine with self-correcting retry loops."

---

## Part 2 — Triggering Analysis & The Progress Screen `(1:00 – 2:00)`

**Action:** Enter `AAPL` in the search box and click Analyze. Show the pipeline progress screen.

**Script:**
> "I'll enter Apple (AAPL) and start the research pipeline. The system transitions to our progress tracker — inspired by Cursor and Perplexity. You can see the LangGraph pipeline running in real time: it normalizes the ticker, fetches the company profile and financial metrics from Yahoo Finance, aggregates news headlines from News API, and queries competitor peers. The terminal console below streams structured logs as each node completes."

---

## Part 3 — Dashboard Overview & Financial Metrics `(2:00 – 3:15)`

**Action:** Scroll through the main dashboard. Hover over the circular score meter, sub-scores, and Recharts graphs.

**Script:**
> "Once the pipeline completes, we load the investment dashboard. The circular score gauge shows an Overall Score of 81/100 with a Buy recommendation. The radar sub-scores break this down across Financial Health, Business Quality, Competitive Moat, Growth, and Valuation. The Recharts area graph maps the stock's price history, and the bar graph compares valuation multiples against mapped competitor peers."

---

## Part 4 — SWOT, Risks, Verdict & Co-Pilot Chat `(3:15 – 4:30)`

**Action:** Show the SWOT quadrants and risk matrix. Open the AI Chat sidebar and click the preset question "Why did you recommend Buy?"

**Script:**
> "Scrolling down, we have the SWOT analysis grid and a risk matrix with severity ratings across eight standard risk categories. The final verdict highlights the core bullish and bearish cases. If I want to dig deeper, I open the AI co-pilot panel and click the suggested prompt: 'Why did you recommend Buy?' The assistant streams a response that is strictly context-bound to this report — it will never invent metrics that aren't in the data."

---

## Part 5 — Code Architecture & Conclusion `(4:30 – 5:00)`

**Action:** Briefly show the folder structure and README.

**Script:**
> "Under the hood, the backend uses a sequential LangGraph workflow with custom merge reducers to prevent state loss, while the synthesis engine implements corrective retry loops to guarantee JSON schema compliance. The entire project is strictly typed in TypeScript and covered by a Vitest unit test suite. Thank you."
