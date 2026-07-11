# 5-Minute Video Presentation Script

This script guides you through demonstrating the AI Investment Research Agent in a recorded presentation or live technical interview.

---

## Part 1: Introduction & The Problem (0:00 - 1:00)
- **Action**: Display the Landing Page (`localhost:3000`).
- **Script**:
  > "Hello, today I am presenting the AI Investment Research Agent, a platform designed to automate institutional-grade equity research. The challenge in automated stock analysis is data veracity: public web search results are often noisy, and standard LLMs struggle with calculations and hallucinations. My platform solves this by orchestrating a structured research graph in LangGraph that queries real-time financial APIs and processes the data through a validation and synthesis engine."

---

## Part 2: Triggering Analysis & The Progress Screen (1:00 - 2:00)
- **Action**: Enter `AAPL` in the search box and click "Analyze". Show the loading stages terminal log screen.
- **Script**:
  > "I will enter Apple (AAPL) and initiate the research pipeline. The system transitions to our progress tracker screen, inspired by Cursor and Perplexity. Here, you can see our backend LangGraph pipeline running: it normalizes the input ticker, retrieves the profile summary and metrics via Yahoo Finance, aggregates news headlines, and queries competitor peers. Below is our pipeline console window, displaying logs as steps complete."

---

## Part 3: Dashboard Overview & Financial Metrics (2:00 - 3:15)
- **Action**: Scroll through the loaded main dashboard. Hover over the overall circular score meter, sub-scores, and Recharts graphs.
- **Script**:
  > "Once compilation succeeds, we load our investment dashboard. Here, we see company details like sector, current price, and market cap. Our circular score gauge displays an Overall Score of 81/100, recommending a 'Buy'. The radar-like sub-scores show detailed dimensions like financial health and competitive moat. Our Recharts area graph maps the stock's price history, while our bar graph compares valuation multiples against mapped competitor peers."

---

## Part 4: SWOT, Risks, Verdict, and Co-Pilot Chat (3:15 - 4:30)
- **Action**: Show the SWOT quadrants and risk ratings, then open the AI Chat sidebar co-pilot panel. Click the preset question: "Why did you recommend Buy?" and show the streamed answer.
- **Script**:
  > "Scrolling down, we have our SWOT analysis grid and risk matrix mapping severity ratings. Our final verdict highlights the core bullish and bearish cases. If I want to query the details, I can open our AI co-pilot panel. I will click the suggested prompt: 'Why did you recommend Buy?'. The assistant streams a response that is strictly context-bound to the report. It will never invent outside metrics."

---

## Part 5: Code Architecture & Conclusion (4:30 - 5:00)
- **Action**: Briefly show the folder structure and README.
- **Script**:
  > "Under the hood, the backend uses a sequential LangGraph workflow with custom merge reducers to prevent state loss, while our synthesis engine implements corrective retry loops to ensure JSON schema compliance. The entire project is strictly typed and fully covered by our test suite. Thank you for your time."
