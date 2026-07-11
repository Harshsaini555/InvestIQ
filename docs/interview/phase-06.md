# Interview Notes: Phase 6 - AI Investment Intelligence Engine

## Likely Interview Questions & Answers

### 1. Why did you use LangChain.js instead of calling the raw Google Gen AI API?
- **Answer**: LangChain.js provides a unified interface for prompt templates, messages, output parsers, and runnables (LCEL). It simplifies managing prompt variables and model options, and integrates with monitoring tools like LangSmith. If we decide to swap Gemini for another model (like GPT-4o) in the future, we can do so with minimal changes to our core engine logic because LangChain abstracts the underlying model differences.

### 2. How does the structured output parser prevent malformed JSON outputs from the LLM?
- **Answer**: The parser operates in three stages:
  1. **Extraction**: It uses regular expressions to find the outermost braces `{ ... }` and strip out markdown fences (`\`\`\`json`).
  2. **Parsing**: It parses the text to a JavaScript object using `JSON.parse`.
  3. **Validation**: It validates the object structure, data types, and values against a strict Zod schema. If any validation fails, the parser throws a detailed error that triggers the engine's retry loop.

### 3. Explain your retry strategy. Why 2 retries, and how does the model know what to correct?
- **Answer**: The retry loop catches any Zod validation or guardrail check errors (e.g. scoring inconsistency or summary word limit violations). On failure, it appends a correction message to the prompt history containing the specific validation error details and invokes the model again. This allows the model to see its previous output, understand what went wrong, and correct the JSON structure. We limit retries to 2 (3 total attempts) to balance latency and success rates; most models correct their mistakes on the first retry.

### 4. How do you prevent hallucinations in the investment report?
- **Answer**: We use several layers of defense:
  1. **Prompt Constraints**: The system prompt explicitly instructs the model to base all analysis, scores, and risks strictly on the provided `ResearchBundle`.
  2. **Fact Integrity Rules**: The prompt forbids the model from fabricating numbers, news titles, or competitor profiles.
  3. **Insufficient Data Fallback**: If critical metrics are missing, the model is instructed to write `"Insufficient Data"` in that field rather than guessing.
  4. **Data Completeness Penalty**: If the model claims high confidence but the input bundle is incomplete, a completeness validator dynamically penalizes the confidence score on the server side.

### 5. Why are the guardrail validators (like word counts, score consistency) written in separate files instead of inside the prompt or the parser?
- **Answer**: This follows the Single Responsibility Principle. Placing each check in its own file makes the code highly modular, easy to maintain, and simple to unit test. It also separates the generative parsing stage from the business rule validation stage. If we need to adjust scoring weights or word limits in the future, we can do so in a dedicated file without touching the core prompt or parsing code.
