# AI Development Journal: Phase 6 - AI Investment Intelligence Engine

## Objective
Implement the AI Investment Intelligence Engine using LangChain.js, Gemini, structured Zod parsing, guardrail checkers, and error-correction retry loops.

## AI Suggestions & Engineering Decisions
- **Custom Output Parser**: The AI recommended subclassing `BaseOutputParser` from LangChain to strip markdown code fences and search for the outermost braces (`{` and `}`) before parsing JSON and running Zod. This makes the parsing logic highly resilient to conversational noise or markdown fences.
- **Completeness Confidence Penalties**: The AI proposed checking the input data completeness before the model runs. If the model claims 90% confidence on a company that lacks critical financial metrics or competitor profiles, a completeness checker dynamically penalizes the score. This creates an analytical guardrail against overconfidence.

## Human Alignment & Design Reviews
- **RETRY LOOP STRATEGY**: Discussed whether to retry the entire LangChain pipeline or run a local correction prompt. We aligned on using a correction loop: appending the validation error to the message history and invoking the model again. This maintains the message history and guides the model to fix specific schema issues.

## Lessons Learned
- Decoupling analytical check scripts (like `scoring.ts`, `risk.ts`, `swot.ts`) from the main engine script keeps the code clean, modular, and easy to unit test.
- Gemini is highly effective at structured outputs, but setting strict system instructions and running post-parse Zod checks is still necessary for production reliability.
