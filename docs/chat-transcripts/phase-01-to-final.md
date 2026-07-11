# Chat Transcripts Log (Phases 1 - Final)

This document aggregates key prompts, AI recommendations, design iterations, and coding decisions made during pair-programming sessions.

---

## 1. Initial Phase: Project Bootstrap & Tools setup
- **Prompt**: Set up the Next.js App Router and configure the base styling variables.
- **AI Recommendation**: Establish HSL CSS variables inside `globals.css` that map directly to standard Tailwind classes, and implement a singleton React Query client provider to handle query caching cleanly.
- **Decision**: Installed Radix UI primitives and created `providers.tsx` wrappers.

---

## 2. Phase 4: LangGraph Orchestration
- **Prompt**: Implement a multi-agent collection pipeline.
- **AI Recommendation**: Refactored the architecture to use a clean, predictable sequential graph workflow. Custom merge reducers were added to avoid state loss in the `nodeStatus` and `executionMetadata` keys.
- **Decision**: Grouped collection nodes under `src/agent/graph/nodes/` and created `node-wrapper.ts`.

---

## 3. Phase 5 & 6: API Layer & AI Synthesis
- **Prompt**: Create the POST endpoints and build prompt templates for Gemini report generation.
- **AI Recommendation**: Implemented a custom LangChain output parser to clean markdown code blocks. Integrated a corrective feedback retry loop that runs up to 2 times, feeding parsing errors back to Gemini for self-correction.
- **Decision**: Added validation guardrail modules for scores, risks, SWOT, and summary lengths.

---

## 4. Phase 7 & 8: UI Dashboard & Streaming Chat
- **Prompt**: Create a premium dark theme dashboard and a streaming follow-up co-pilot.
- **AI Recommendation**: Used Framer Motion to create smooth entrance animations and circular ratings SVGs. Formatted chat markdown blocks (including tables and lists) in the client, and routed prompts through a streaming Gemini chat API endpoint `/api/chat`.
- **Decision**: Formatted market cap outputs into compact notations ($1.2B) for clean layout fits.
