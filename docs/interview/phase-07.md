# Interview Preparation (Phase 07: UI / Frontend Layer)

Here are the key technical questions likely to be asked about our frontend UI design, along with model answers:

---

### Q1: How did you implement the "real-time" pipeline animation on the progress screen, and how is it connected to the backend?
**Answer:**
We created a multi-stage loader component (`progress.tsx`) that lists the sequential nodes of our LangGraph pipeline. To provide a premium user experience, we animate each progress row sequentially with micro-delays using Framer Motion, while our API fetch call runs in the background. Once the backend response returns the completed `ResearchBundle`, the loader concludes its validation/synthesis stage and smoothly transition-fades into the main dashboard viewport.

---

### Q2: How did you solve the case-sensitivity issue for imports on Windows/Next.js?
**Answer:**
Windows has a case-insensitive file system, while the TypeScript compiler is case-sensitive. This can lead to compilation errors where imports written as `footer` mismatch the file system capital `Footer.tsx`. We resolved this by explicitly aligning all imports to use the correct capital letters (`@/components/layout/Footer`), ensuring clean builds across Unix-based deployment environments (like Vercel).

---

### Q3: How did you handle charts responsiveness and server-side rendering (SSR) issues with Recharts?
**Answer:**
Recharts relies heavily on browser DOM sizing calculations which fail during Next.js server-side rendering (SSR) passes. We resolved this by defining our charts within client-side components wrapped in `<ResponsiveContainer height="100%" width="100%">` and rendering them only after client mounting, preventing hydration mismatch warnings.

---

### Q4: How is the AI Chat Co-Pilot panel structured to run on the frontend without server-side chat handlers?
**Answer:**
To remain fully functional while respecting backend boundaries, the chat panel contains a rule-based query parser that reads the prompt context. It parses inputs for topics like "Why buy?", "PE ratio", and "SWOT", and uses the loaded report data to synthesize highly realistic, specific responses. A typing simulation state keeps the experience natural and fluid.
