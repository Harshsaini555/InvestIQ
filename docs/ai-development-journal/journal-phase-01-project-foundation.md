# Phase 01 — Project Foundation

**Project:** AI Investment Research Agent
**Phase:** 01 — Project Foundation
**Status:** Complete
**Date:** 2025

---

## Table of Contents

1. [Objective of This Phase](#1-objective-of-this-phase)
2. [Why These Technologies Were Selected](#2-why-these-technologies-were-selected)
3. [Alternative Approaches Considered](#3-alternative-approaches-considered)
4. [Decisions Made](#4-decisions-made)
5. [Trade-offs](#5-trade-offs)
6. [Challenges Encountered](#6-challenges-encountered)
7. [AI Assistance Summary](#7-ai-assistance-summary)
8. [Human Decisions Taken](#8-human-decisions-taken)
9. [Lessons Learned](#9-lessons-learned)

---

## 1. Objective of This Phase

The objective of Phase 01 was to establish a production-grade project foundation before writing a single line of application logic. This phase had no user-facing output. Its sole purpose was to ensure that every subsequent phase of development would be built on a consistent, scalable, and maintainable base.

Specifically, this phase aimed to:

- Define and scaffold the complete folder hierarchy under `src/`
- Install and configure all core dependencies and development tooling
- Establish TypeScript strict mode with full path alias support
- Configure code quality enforcement through ESLint, Prettier, Husky, lint-staged, and commitlint
- Define the global type system covering the entire application domain
- Create reusable utility functions that every future module would depend on
- Implement environment variable validation that fails loudly at startup rather than silently at runtime
- Lay down the constants, error handling, and logging infrastructure that all future layers would consume

The phase was deliberately scoped to exclude all UI components, AI agent logic, API routes, and external service integrations. Those belong to later phases. The foundation phase exists to make those phases faster, safer, and more consistent.

---

## 2. Why These Technologies Were Selected

### Next.js 15 with App Router
Next.js 15 was selected as the application framework because it provides React Server Components, native streaming support via the App Router, and built-in API route handling — all of which are directly required by this application. The App Router's support for Server-Sent Events (SSE) streaming is essential for delivering real-time LangGraph node progress to the client without a separate WebSocket server. The framework also eliminates the need for a standalone Express or Fastify backend, reducing infrastructure complexity.

### React 19
React 19 was selected to align with Next.js 15's peer dependency requirements and to take advantage of improved concurrent rendering behaviour. No React 19-specific APIs were used in this phase, but the dependency was locked to avoid version conflicts in later phases when hooks and server components are implemented.

### TypeScript 5 with Strict Mode
TypeScript was non-negotiable for a project of this complexity. The application involves multiple data boundaries — user input, external API responses, LLM outputs, and internal state — each of which carries a risk of shape mismatch at runtime. Strict mode, combined with `noUncheckedIndexedAccess` and `noImplicitReturns`, was enabled to catch the class of bugs that typically surface only in production. `allowJs` was explicitly disabled to prevent gradual type erosion as the codebase grows.

### Zod
Zod was selected as the schema validation library because it serves a dual purpose: runtime validation and TypeScript type inference from a single schema definition. This eliminates the common pattern of maintaining a TypeScript type and a separate validation schema that can drift out of sync. In this project, Zod is used at every external boundary — environment variables, API request bodies, and LLM output parsing.

### TailwindCSS with Shadcn UI
TailwindCSS was selected for styling because it produces consistent, predictable output and eliminates the specificity conflicts that arise with traditional CSS or CSS Modules at scale. Shadcn UI was selected over a fully managed component library (such as MUI or Chakra) because it generates unstyled, accessible Radix UI primitives directly into the codebase. This means components are owned by the project, not locked behind a library version, and can be modified without fighting against library internals.

### Framer Motion
Framer Motion was selected for animations because it integrates naturally with React's component model and supports layout animations, gesture-based interactions, and exit animations — all of which are relevant for a streaming report UI where content appears progressively.

### TanStack Query v5
TanStack Query was selected for server state management because it provides caching, deduplication, background refetching, and loading/error state management out of the box. For this application, it handles the caching of completed investment reports so that navigating back to a report does not trigger a new AI research run.

### Zustand
Zustand was selected for client state management because it is minimal, does not require a provider wrapper, and avoids the boilerplate of Redux. It is used to hold the current report in memory for the follow-up chat feature, where the report context must be accessible across components without prop drilling.

### LangChain.js and LangGraph.js
LangChain.js was selected because it provides the tool abstraction layer needed to wrap external APIs (Yahoo Finance, News API) in a format that the LLM can invoke. LangGraph.js was selected specifically for its StateGraph model, which allows the agent's research workflow to be expressed as a directed graph of nodes with typed shared state. This is more maintainable than a chain of sequential LLM calls and supports parallel node execution and conditional routing.

### Axios
Axios was selected for raw HTTP client calls within the `services/` layer because it provides consistent error handling, request/response interceptors, and timeout configuration across all external API calls. The Fetch API was considered but rejected at the service layer due to its more verbose error handling for non-2xx responses.

---

## 3. Alternative Approaches Considered

### Monorepo vs Single Repository
A monorepo structure (using Turborepo or Nx) was considered to separate the AI agent logic into its own package. This was rejected for Phase 01 because the application is a single deployable unit. Introducing a monorepo at this stage would add tooling complexity without providing any benefit until the codebase grows to a size that justifies it. The folder structure was designed so that `src/agent/` could be extracted into a separate package in the future without restructuring the rest of the application.

### Separate Backend vs Next.js API Routes
Running a separate Node.js backend (Express or Fastify) alongside the Next.js frontend was considered. This was rejected because Next.js Route Handlers support streaming responses natively, which is the primary requirement for delivering LangGraph progress events to the client. A separate backend would introduce a second deployment target, CORS configuration, and additional infrastructure overhead with no architectural benefit at this scale.

### Redux Toolkit vs Zustand
Redux Toolkit was considered for client state management due to its maturity and DevTools support. It was rejected because the client state requirements for this application are narrow — primarily holding the current report and chat history. Redux's boilerplate and provider requirements are disproportionate to this use case. Zustand achieves the same result with significantly less code.

### Prisma + PostgreSQL vs No Database
Adding a database in Phase 01 was considered to support report persistence from the start. This was deferred deliberately. The application's core value is the AI research workflow, not report storage. Introducing a database in the foundation phase would add migration tooling, connection management, and schema design to a phase that should remain focused on project structure. Report persistence is scoped to a later phase.

### Jest vs Vitest
Jest was considered as the test runner due to its ecosystem maturity. Vitest was selected instead because it shares the same configuration as Vite, supports ESM natively without transformation overhead, and is significantly faster for a TypeScript-first codebase. The API is compatible with Jest, so migration cost is low if Jest becomes necessary.

### Pino vs Custom Logger
The `pino` structured logging library was considered as an immediate dependency. It was deferred in favour of a custom logger utility that wraps `console.*` methods with level filtering and structured output. The custom logger was designed with a comment explicitly marking the replacement point for `pino` in production. This avoids adding a dependency in the foundation phase for functionality that is not yet exercised.

---

## 4. Decisions Made

### Decision 1 — `src/` as the root for all application code
All application code lives under `src/`. This separates source files from configuration files at the project root, keeps the root directory clean, and is the standard convention for Next.js projects using the App Router.

### Decision 2 — Thirteen path aliases, all prefixed with `@/`
Thirteen path aliases were defined in `tsconfig.json` and mirrored in `next.config.ts`. Every major directory has its own alias (`@/agent`, `@/features`, `@/services`, etc.) rather than relying solely on the catch-all `@/*`. This makes import statements self-documenting — an import from `@/agent/tools` is immediately identifiable as agent logic, not a utility or component.

### Decision 3 — Types derived from constants, not duplicated
`NodeName` and `NodeStatusValue` in `agent.types.ts` are derived from the `NODE_NAMES` and `NODE_STATUS` constant objects using `typeof` and `keyof`. This means the constants are the single source of truth. Adding a new node name to `NODE_NAMES` automatically expands the `NodeName` type without any additional change.

### Decision 4 — `ApiResponse<T>` as a discriminated union
The API response envelope was defined as a discriminated union on the `success` boolean field. This means TypeScript narrows the type automatically inside an `if (response.success)` check, making it impossible to access `response.data` without first confirming the request succeeded.

### Decision 5 — Environment variables validated at startup via Zod
Rather than accessing `process.env` directly throughout the codebase, a single `env.ts` module validates all environment variables against a Zod schema at module load time. If any required variable is missing or malformed, the application throws immediately with a formatted list of every failing variable. This prevents the class of production incidents where a missing environment variable causes a silent failure deep in a request handler.

### Decision 6 — `no-console` as an ESLint error
The `no-console` rule was set to `error` rather than `warn`. All logging is routed through the `logger` utility, which is the only file in the codebase with `eslint-disable-next-line no-console` comments. This enforces the logging strategy at the tooling level rather than relying on developer discipline.

### Decision 7 — `import/no-cycle` as an ESLint error
Circular imports are one of the most common causes of subtle runtime bugs in large TypeScript projects. Enabling `import/no-cycle` as an error ensures that circular dependencies are caught at lint time, before they cause issues in the module graph.

### Decision 8 — Husky hooks at three stages
Three Git hooks were configured: `pre-commit` runs lint-staged on staged files only, `commit-msg` enforces conventional commit format via commitlint, and `pre-push` runs the full TypeScript type check. This creates a three-layer quality gate that catches formatting issues before commit, message format issues at commit, and type errors before push.

### Decision 9 — `commitlint` scopes locked to project directories
The commitlint configuration enumerates all valid scopes explicitly (`agent`, `research`, `chat`, `api`, `ui`, `lib`, `types`, `config`, `deps`, `hooks`, `store`, `utils`, `constants`). This means every commit is traceable to a specific area of the codebase, making `git log` and changelogs meaningful.

### Decision 10 — Investment-specific semantic tokens in Tailwind
Three custom colour tokens — `invest`, `hold`, and `pass` — were added to the Tailwind theme alongside the standard Shadcn tokens. These map to CSS variables, meaning the actual colour values can be changed in one place without touching any component. This decision was made in the foundation phase because these tokens will be used across multiple components in later phases.

---

## 5. Trade-offs

### Strict TypeScript vs Development Speed
Enabling `noUncheckedIndexedAccess` and `noUnusedParameters` in addition to the standard `strict` flag increases the number of TypeScript errors a developer encounters during initial implementation. Array accesses return `T | undefined` rather than `T`, requiring explicit null checks. This slows down initial development but eliminates an entire category of runtime errors that are otherwise invisible until production.

### Thirteen Path Aliases vs Simplicity
Defining thirteen path aliases adds configuration surface area in both `tsconfig.json` and `next.config.ts`. A simpler approach would be a single `@/*` alias. The trade-off accepted here is that the additional aliases make the import graph self-documenting and make it easier to enforce architectural boundaries (e.g., `agent/` should never be imported from `components/`).

### Custom Logger vs Pino
The custom logger is simpler to understand and has zero additional dependencies, but it lacks structured JSON output, log rotation, and the performance characteristics of `pino`. The trade-off is acceptable for Phase 01 because the logger is designed as a thin wrapper with a clear replacement path. The interface is identical to what `pino` would expose, so swapping the implementation requires changing only the internals of `logger.ts`.

### `lint-staged` on Staged Files Only vs Full Codebase Lint
Running ESLint and Prettier only on staged files keeps the pre-commit hook fast (under 5 seconds for typical changes). The trade-off is that unstaged files with lint errors are not caught at commit time. This is mitigated by the CI pipeline, which runs the full lint pass on every push.

### No Database in Phase 01
Deferring database integration keeps the foundation phase focused and fast to implement. The trade-off is that reports generated in early development phases are not persisted between sessions. This is acceptable because the primary goal of early phases is to validate the AI research workflow, not report storage.

---

## 6. Challenges Encountered

### Path Alias Duplication Between tsconfig and next.config
Next.js requires path aliases to be defined in both `tsconfig.json` (for TypeScript resolution) and `next.config.ts` (for Webpack resolution). These two configurations must be kept in sync manually. Any alias added to one file must be added to the other. This is a known limitation of the Next.js + TypeScript toolchain and was documented in the `next.config.ts` file with an inline comment.

### ESLint `recommended-type-checked` Requires parserOptions.project
The `@typescript-eslint/recommended-type-checked` ruleset requires the ESLint parser to have access to the TypeScript project configuration via `parserOptions.project`. This enables type-aware linting rules such as `no-floating-promises` and `await-thenable`, but it also significantly increases ESLint's startup time because it must load the TypeScript compiler. This is a known trade-off with type-aware ESLint rules and is the reason `lint-staged` runs ESLint only on staged files rather than the full codebase.

### Security Findings from Code Review
An automated code review of the foundation identified two categories of security findings:

- A false positive hardcoded credentials warning in `site.constants.ts` on the `RECOMMENDATION_LABELS` object. The values `'Invest'`, `'Hold'`, and `'Pass'` were flagged as potential credentials. These are display labels, not secrets. The finding was reviewed and dismissed.
- Log injection warnings in `logger.ts` because user-provided context objects are serialised directly into log output via `JSON.stringify`. This is a legitimate concern. The logger does not currently sanitise context values before serialisation. This is noted as a known gap to be addressed when the logger is replaced with `pino` in a later phase.

### `noUncheckedIndexedAccess` Compatibility
Enabling `noUncheckedIndexedAccess` in `tsconfig.json` caused TypeScript to treat all array index accesses as returning `T | undefined`. Several utility functions in `format.ts` required explicit null checks that would not have been necessary without this flag. This was expected and accepted as the correct behaviour.

---

## 7. AI Assistance Summary

AI assistance was used throughout this phase in the following capacities:

### Architecture Design
The overall project architecture was designed with AI assistance across three sessions. The first session produced the initial architecture specification covering folder structure, data flow, LangGraph workflow, state management strategy, and error handling philosophy. The second session revised the folder structure to match a specific layout requested by the developer. The third session produced a full Project Foundation Specification in markdown, which served as the implementation blueprint.

### Code Generation
All configuration files and source files in this phase were generated by AI based on the approved specification. This included `package.json`, `tsconfig.json`, `next.config.ts`, `.eslintrc.json`, `.prettierrc`, `.gitignore`, `.env.example`, all constants files, all utility files, all type files, both global hooks, the TanStack Query client, the Zod env validator, the Zod helpers, and the Tailwind and PostCSS configurations.

### Code Review
An automated code review was run against the generated foundation using the Amazon Q code review tool. The review identified two security findings (one false positive, one legitimate) which are documented in the Challenges section above.

### Documentation
This document was produced with AI assistance based on a review of all files generated during the phase. The AI was provided with the actual file contents and instructed to document only what was built, without inventing implementation details.

### What AI Did Not Do
AI did not make any architectural decisions autonomously. Every structural decision — the folder layout, the technology choices, the scope of the phase, the decision to defer the database — was either specified by the developer or presented as options for the developer to choose between. AI generated implementations of decisions that had already been made.

---

## 8. Human Decisions Taken

The following decisions were made by the developer, not by AI:

**Technology stack selection.** The complete technology stack — Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI, Framer Motion, TanStack Query, LangChain.js, LangGraph.js, Gemini 2.5 Flash, Yahoo Finance API, News API, and Zod — was specified by the developer before any AI assistance was engaged. AI was not asked to recommend a stack.

**Folder structure layout.** The developer specified the exact top-level folder structure (`src/app`, `src/components`, `src/features`, `src/agent`, `src/services`, `src/lib`, `src/hooks`, `src/types`, `src/utils`, `src/constants`, `src/styles`) and requested that the AI scaffold it accordingly.

**Phase scope definition.** The developer explicitly defined what this phase would and would not include. The decision to exclude UI, AI agent logic, API routes, and database integration from Phase 01 was made by the developer.

**Review and approval of the specification.** Before any code was generated, the developer reviewed the Project Foundation Specification and requested a critical review from the perspective of a Principal Software Engineer. The specification was revised based on that review before implementation began.

**Acceptance of generated code.** All generated files were reviewed by the developer before being accepted. The developer had the opportunity to reject or modify any file.

**Decision to proceed to documentation.** The decision to produce this journal entry as a formal record of Phase 01 before beginning Phase 02 was made by the developer.

---

## 9. Lessons Learned

### Specification before implementation pays dividends immediately
The decision to produce a full written specification — covering folder structure, naming conventions, import aliases, environment variable strategy, error handling philosophy, and coding standards — before generating any code meant that every generated file was consistent with every other generated file. There were no contradictions between the ESLint configuration and the TypeScript configuration, no naming inconsistencies between files, and no structural decisions that had to be revisited mid-implementation.

### Deriving types from constants eliminates an entire class of maintenance bugs
The pattern of deriving TypeScript types from `as const` objects using `typeof` and `keyof` — used for `NodeName`, `NodeStatusValue`, and `ErrorCode` — is more maintainable than defining types and constants separately. When a new node is added to the agent graph, updating `NODE_NAMES` in `agent.constants.ts` is the only change required. The type expands automatically. This pattern should be applied consistently in all future phases.

### Security review should happen at the foundation, not after features are built
Running an automated code review on the foundation files — before any application logic exists — identified a log injection vulnerability in the logger utility. Catching this at the foundation phase is significantly cheaper than catching it after the logger has been used across dozens of files. The practice of reviewing infrastructure code before it becomes load-bearing should be repeated at the start of every phase.

### False positives in automated security tools require human judgement
The automated review flagged `RECOMMENDATION_LABELS` values (`'Invest'`, `'Hold'`, `'Pass'`) as potential hardcoded credentials. This is a false positive. Automated tools cannot distinguish between a display label and a secret. Every security finding requires a human to assess whether it represents a genuine risk. The process of reviewing findings — even false positives — is valuable because it forces a deliberate examination of the code.

### Deferring decisions is a valid architectural choice
The decision to defer database integration, Redis caching, and Sentry error tracking to later phases was not a shortcut. It was a deliberate choice to keep the foundation phase focused. The `.env.example` file and the Zod env schema include placeholders for all of these integrations, meaning they can be added in later phases without restructuring the foundation. Knowing what to defer is as important as knowing what to build.

### AI-assisted development requires a clear division of responsibility
The most effective use of AI in this phase was as an implementation engine for decisions that had already been made. When the developer provided a clear specification, the AI produced consistent, production-quality output. When the AI was asked to make architectural decisions (such as whether to use a monorepo), it presented options with trade-offs rather than making the choice unilaterally. This division — human decides, AI implements — produced better outcomes than either approach alone.

---

*End of Phase 01 — Project Foundation*

---

**Next Phase:** Phase 02 — Services Layer (Yahoo Finance API client, News API client, Axios configuration, response type mapping)
