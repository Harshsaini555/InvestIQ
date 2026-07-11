# Interview Notes: Phase 4 - LangGraph Research Pipeline

## Likely Interview Questions & Answers

### 1. Why did you choose LangGraph instead of a simple Promise.all or linear script?
- **Answer**: LangGraph provides a structured state machine with built-in checkpointing, cycle detection, and execution tracking. It isolates the execution logic of individual tasks (nodes) and automatically manages the flow state. While a simple Promise chain works for trivial scripts, it becomes difficult to debug, track execution timing, retry specific failing steps, or manage complex conditional branching. LangGraph makes the execution graph explainable, trace-ready (via LangSmith), and highly maintainable.

### 2. How does the GraphState avoid data race issues or state loss?
- **Answer**: In LangGraph, when multiple nodes execute or update the state, returning partial updates can overwrite fields if no reducer is defined. To prevent this, we declare channels using custom merge reducers (`mergeRecord` and `mergeMetadata`). The reducer intercepts updates and merges new dictionary keys or list entries with the existing state instead of replacing the entire object.

### 3. How did you structure error handling so that a single API failure doesn't crash the entire pipeline?
- **Answer**: We wrapped all node logic in a higher-order helper function `createGraphNode`. This helper runs the node's function inside a try-catch block. If an error occurs (such as a timeout or rate limit on an external API), the wrapper catches it, sets `nodeStatus[currentNode] = 'failed'`, and logs the error details in `state.errors[currentNode]` rather than rethrowing. This allows the graph to complete its run and return a partial state, which can be evaluated at the end or processed gracefully by subsequent synthesis steps.

### 4. What are the key trade-offs of using a linear graph path?
- **Answer**: The main trade-off is latency. Running nodes sequentially means the total execution time is the sum of all node durations. In a production system with API calls, we would optimize this by running independent research steps (like `company_profile`, `financials`, and `news`) in parallel using LangGraph branching (channels), and then joining them in a synchronization step before aggregation. The linear flow was chosen for the initial version to guarantee simplicity and strict deterministic execution trails.
