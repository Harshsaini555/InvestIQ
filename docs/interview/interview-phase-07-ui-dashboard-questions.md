# Interview Notes — Phase 07: UI Layer & Interactive Dashboard

---

## Q1: How does the pipeline progress animation connect to the backend?

The `progress.tsx` component lists the sequential LangGraph nodes and animates each row with Framer Motion micro-delays. The API fetch runs in the background. Once the backend returns the completed `ResearchBundle`, the loader concludes its final synthesis stage and transition-fades into the main dashboard. The animation is cosmetic — it does not receive real-time node events from the backend.

---

## Q2: How was the Windows case-sensitivity issue resolved?

Windows has a case-insensitive file system, but the TypeScript compiler and Vercel/Linux builds are case-sensitive. `Footer.tsx` imported as `footer` caused type-check errors on deployment. All imports were explicitly aligned to use exact file system casing (`@/components/layout/Footer`), ensuring clean builds across all environments.

---

## Q3: How were Recharts SSR issues handled?

Recharts relies on browser DOM sizing calculations that fail during Next.js server-side rendering. Charts are defined inside client components wrapped in `<ResponsiveContainer height="100%" width="100%">` and rendered only after client mounting. This prevents hydration mismatch warnings.

---

## Q4: How is the circular score meter animated?

An SVG `<circle>` element uses `strokeDasharray` set to the circle's circumference and `strokeDashoffset` bound to a Framer Motion animated value. On viewport entry, the offset animates from the full circumference (empty) to the target value (filled), creating a smooth fill animation proportional to the score.

---

## Q5: How does the streaming chat panel work?

The chat panel sends a POST request to `/api/chat` with the full report context and the user's question. The endpoint returns a `ReadableStream`. The client uses a `TextDecoder` to read chunks from the stream and appends them to the message state as they arrive, creating the streaming text effect.
