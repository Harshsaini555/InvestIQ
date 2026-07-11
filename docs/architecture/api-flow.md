# API Request Flow Architecture

## Request Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant Router as App Router (route.ts)
    participant MW as withApiMiddleware
    participant Req as Request Validator
    participant Graph as LangGraph Engine
    participant Res as Response Formatter

    Client->>MW: POST /api/research { companyName: "AAPL" }
    activate MW
    MW->>MW: Generate Request ID & Start Timer
    MW->>Router: Forward Request
    activate Router
    Router->>Req: Parse Body & Validate Schema (Zod)
    activate Req
    alt Invalid Input or Malformed JSON
        Req-->>MW: Throw ValidationError
        MW->>Res: formatApiError()
        Res-->>Client: 400 Bad Request { success: false, error: ... }
    else Valid Input
        Req-->>Router: Parsed Payload
        deactivate Req
        Router->>Graph: invoke(initialState)
        activate Graph
        Graph->>Graph: Execute nodes sequentially
        alt Pipeline Failure
            Graph-->>Router: State with null researchBundle
            Router-->>MW: Throw ApiError (500)
            MW->>Res: formatApiError()
            Res-->>Client: 500 Server Error { success: false, error: ... }
        else Pipeline Success
            Graph-->>Router: State with populated researchBundle
            deactivate Graph
            Router->>Res: sendSuccess(researchBundle)
            activate Res
            Res-->>MW: Formatted Response Envelope
            deactivate Res
            Router-->>MW: Return Response
            deactivate Router
            MW->>MW: Calculate Duration & Log
            MW-->>Client: 200 OK { success: true, data: researchBundle }
            deactivate MW
        end
    end
```

## Request-Response Lifecycle Stages
1. **Routing**: Next.js App Router routes the incoming request to the API controller, wrapped by `withApiMiddleware`.
2. **Timing & ID Attachment**: The wrapper captures the start time and attaches a unique Request ID (`X-Request-ID`) to the logging context and final response headers.
3. **Parsing & Validation**: The controller parses JSON safely and validates parameters against the Zod schema. Invalid parameters immediately trigger a `400 Bad Request` response.
4. **Execution**: The controller triggers the compiled LangGraph pipeline. If the pipeline completes successfully, it extracts the aggregated `ResearchBundle`.
5. **Enveloping**: The raw data is mapped to the success JSON envelope, calculating total execution duration.
6. **Logging**: Writes structured details (method, path, HTTP status, request duration, request ID) to the server logger.
