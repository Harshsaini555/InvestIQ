# Interview Notes: Phase 5 - Backend API Layer

## Likely Interview Questions & Answers

### 1. Why do you wrap your controllers in a custom middleware function instead of using Next.js global middleware?
- **Answer**: Next.js global `middleware.ts` runs on the edge runtime before routing takes place. It does not have access to the parsed request body without consuming the stream, which blocks the controller from reading it. By wrapping the route controller in a functional decorator (`withApiMiddleware`), we gain full access to the request lifecycle within the Node.js runtime. This allows us to safely parse payloads, intercept specific errors, measure endpoint latency, and inject tracking headers directly.

### 2. How did you handle input validation to prevent malicious payloads or crashes?
- **Answer**: We combine two layers of defense. First, we read the request raw text stream in `parseJsonBody` and attempt to parse it inside a try-catch block to prevent runtime crashes on empty or malformed JSON payloads. Second, we validate the parsed object against a Zod schema (`researchRequestSchema`) to enforce constraints on string lengths and sanitize characters (e.g. blocking script tags `<` and `>`). Any failure instantly throws an error that resolves to a `400 Bad Request` with structured validation feedback.

### 3. Why is it important to hide the internal `GraphState` from the API response?
- **Answer**: The internal `GraphState` contains execution details (like node statuses, duration metrics, active nodes, and internal errors) that represent implementation details. Exposing this information creates security risks (information disclosure) and increases payload size. It also tightly couples the frontend code to the internal state structure of the backend graph. Returning a clean, isolated `ResearchBundle` ensures a clean separation of concerns.

### 4. What is the value of centralizing HTTP Status Codes and Messages?
- **Answer**: Centralization makes the API clean, audit-friendly, and maintainable. Instead of hardcoding magic status numbers (like 200, 400, 500) and message strings across different routes, we define them in `config/status-codes.ts` and `config/messages.ts`. This ensures consistency in API responses and makes it easy to update status codes or messages in one place.
